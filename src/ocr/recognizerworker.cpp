#include "recognizerworker.h"
#include "debug.h"
#include "languagecodes.h"
#include "task.h"
#include "tesseract.h"

#include <algorithm>

RecognizeWorker::~RecognizeWorker() = default;

Tesseract *RecognizeWorker::ensureEngine(const LanguageId &language,
                                         QString *initError)
{
  auto it = engines_.find(language);
  if (it != engines_.end())
    return it->second.get();

  LTRACE() << "Create OCR engine" << language;
  auto engine = std::make_unique<Tesseract>(language, tessdataPath_);
  if (!engine->isValid()) {
    if (initError)
      *initError = tr("Failed to init OCR engine: %1").arg(engine->error());
    return nullptr;
  }

  auto *ptr = engine.get();
  engines_.emplace(language, std::move(engine));
  LTRACE() << "Added OCR engine" << language;
  return ptr;
}

void RecognizeWorker::handle(const TaskPtr &task)
{
  SOFT_ASSERT(task, return );
  SOFT_ASSERT(task->isValid(), return );
  SOFT_ASSERT(!tessdataPath_.isEmpty(), return );

  LTRACE() << "Start recognize" << task->captured << task->sourceLanguage;
  auto result = task;
  result->detectedLanguage.clear();

  if (LanguageCodes::isAuto(task->sourceLanguage)) {
    auto candidates = Tesseract::availableLanguageIds(tessdataPath_);
    if (candidates.isEmpty()) {
      result->error = tr("No recognition languages installed");
      emit finished(result);
      return;
    }

    if (!lastDetectedLanguage_.isEmpty()) {
      const int idx = candidates.indexOf(lastDetectedLanguage_);
      if (idx > 0)
        candidates.move(idx, 0);
    }

    const auto prepared = Tesseract::prepare(task->captured);
    if (!prepared) {
      result->error = tr("Failed to preprocess captured image");
      emit finished(result);
      return;
    }

    QString bestText;
    LanguageId bestLang;
    double bestScore = -1.0;
    QString lastInitError;

    for (const auto &langId : candidates) {
      auto *engine = ensureEngine(langId, &lastInitError);
      if (!engine)
        continue;

      int confidence = 0;
      const auto text = engine->recognize(prepared, &confidence);
      lastGenerations_[langId] = task->generation;

      if (text.isEmpty())
        continue;

      const double score = LanguageCodes::scoreRecognizedText(
          text, langId, confidence, task->captured.size());
      LTRACE() << "Auto OCR candidate" << langId << "conf=" << confidence
               << "score=" << score;

      if (score > bestScore) {
        bestScore = score;
        bestText = text;
        bestLang = langId;
      }
    }

    if (bestText.isEmpty()) {
      result->error =
          lastInitError.isEmpty()
              ? QObject::tr("Failed to recognize text or no text selected")
              : lastInitError;
    } else {
      result->recognized = bestText;
      result->detectedLanguage = bestLang;
      lastDetectedLanguage_ = bestLang;
      LTRACE() << "Auto OCR selected language" << bestLang;
    }

    removeUnused(task->generation);
    emit finished(result);
    return;
  }

  QString initError;
  auto *engine = ensureEngine(task->sourceLanguage, &initError);
  if (!engine) {
    result->error = initError;
    emit finished(result);
    return;
  }

  result->recognized = engine->recognize(task->captured);
  if (result->recognized.isEmpty()) {
    result->error = engine->error();
  } else if (!task->sourceLanguage.contains(QLatin1Char('+'))) {
    result->detectedLanguage = task->sourceLanguage;
  }

  lastGenerations_[task->sourceLanguage] = task->generation;
  removeUnused(task->generation);

  emit finished(result);
}

void RecognizeWorker::reset(const QString &tessdataPath)
{
  if (tessdataPath_ == tessdataPath)
    return;

  tessdataPath_ = tessdataPath;
  engines_.clear();
  lastGenerations_.clear();
  lastDetectedLanguage_.clear();
  LTRACE() << "Cleared OCR engines";
}

void RecognizeWorker::removeUnused(Generation current)
{
  const auto keepGenerations = 10u;
  for (auto it = lastGenerations_.begin(), end = lastGenerations_.end();
       it != end;) {
    if (current <= it->second || current - it->second < keepGenerations) {
      ++it;
      continue;
    }
    engines_.erase(it->first);
    LTRACE() << "Removed unused OCR engine" << it->first;
    it = lastGenerations_.erase(it);
  }

  const size_t maxCachedEngines = 8;
  while (engines_.size() > maxCachedEngines && !lastGenerations_.empty()) {
    auto oldest = std::min_element(
        lastGenerations_.begin(), lastGenerations_.end(),
        [](const auto &a, const auto &b) { return a.second < b.second; });
    engines_.erase(oldest->first);
    LTRACE() << "Evicted OCR engine over cache limit" << oldest->first;
    lastGenerations_.erase(oldest);
  }
}
