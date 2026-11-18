#include "correctorworker.h"
#include "debug.h"
#include "hunspellcorrector.h"
#include "languagecodes.h"
#include "task.h"

CorrectorWorker::CorrectorWorker() = default;

CorrectorWorker::~CorrectorWorker() = default;

void CorrectorWorker::handle(const TaskPtr &task)
{
  SOFT_ASSERT(task, return );
  SOFT_ASSERT(task->isValid(), return );
  SOFT_ASSERT(!hunspellDir_.isEmpty(), return );

  const auto effectiveLang = task->detectedLanguage.isEmpty()
                                 ? task->sourceLanguage
                                 : task->detectedLanguage;
  if (LanguageCodes::isAuto(effectiveLang) ||
      effectiveLang.contains(QLatin1Char('+'))) {
    emit finished(task);
    return;
  }

  LTRACE() << "Start hunspell correction" << effectiveLang;
  auto result = task;

  if (!bundles_.count(effectiveLang)) {
    LTRACE() << "Create hunspell engine" << effectiveLang;
    auto engine =
        std::make_unique<HunspellCorrector>(effectiveLang, hunspellDir_);

    if (!engine->isValid()) {
      LWARNING()
          << tr("Failed to init hunspell engine: %1").arg(engine->error());
      emit finished(result);
      return;
    }

    bundles_.emplace(effectiveLang, Bundle{std::move(engine), 0});
    LTRACE() << "Added hunspell engine" << effectiveLang;
  }

  auto &bundle = bundles_[effectiveLang];
  SOFT_ASSERT(bundle.hunspell->isValid(), return );

  result->corrected = bundle.hunspell->correct(task->corrected);

  const auto keepGenerations = 10;
  bundle.usesLeft = keepGenerations;
  removeUnused(task->generation);
  lastGeneration_ = task->generation;

  emit finished(result);
}

void CorrectorWorker::reset(const QString &hunspellDir)
{
  if (hunspellDir_ == hunspellDir)
    return;

  hunspellDir_ = hunspellDir;
  bundles_.clear();
  LTRACE() << "Cleared hunspell engines";
}

void CorrectorWorker::removeUnused(Generation current)
{
  if (lastGeneration_ == current)
    return;

  for (auto it = bundles_.begin(), end = bundles_.end(); it != end;) {
    if (it->second.usesLeft >= 0) {
      ++it;
    } else {
      const auto name = it->first;
      it = bundles_.erase(it);
      LTRACE() << "Removed unused hunspell engine" << name;
    }
  }
}
