#include <gtest/gtest.h>

#include "languagecodes.h"

TEST(LanguageCodes, AutoIdentifiers)
{
  const auto autoId = LanguageCodes::autoLanguageId();
  EXPECT_EQ("auto", autoId);
  EXPECT_TRUE(LanguageCodes::isAuto(autoId));
  EXPECT_TRUE(LanguageCodes::isAuto(LanguageCodes::anyLanguageId()));
  EXPECT_FALSE(LanguageCodes::isAuto("eng"));
  EXPECT_EQ("auto", LanguageCodes::iso639_1(autoId));
  EXPECT_EQ("auto", LanguageCodes::iso639_1("eng+vie"));
  EXPECT_EQ(autoId, LanguageCodes::idForName(LanguageCodes::name(autoId)));
}

TEST(LanguageCodes, IsSameLanguageSkipCheck)
{
  const auto viText = QString::fromUtf8("Không thể kết nối tới máy chủ");
  EXPECT_TRUE(LanguageCodes::isSameLanguage(viText, "vie", "vie"));
  EXPECT_TRUE(LanguageCodes::isSameLanguage(viText, "auto", "vie"));
  EXPECT_FALSE(LanguageCodes::isSameLanguage(viText, "vie", "eng"));

  const auto enText = QStringLiteral("Cannot connect to server");
  EXPECT_FALSE(LanguageCodes::isSameLanguage(enText, "eng", "vie"));
  EXPECT_FALSE(LanguageCodes::isSameLanguage(enText, "vie", "vie"));
  EXPECT_TRUE(LanguageCodes::isSameLanguage(enText, "eng", "eng"));

  const auto accentedFr = QString::fromUtf8("Café déjà");
  EXPECT_FALSE(LanguageCodes::isSameLanguage(accentedFr, "eng", "eng"));

  const auto jaKana = QString::fromUtf8("設定を開く");
  EXPECT_TRUE(LanguageCodes::isSameLanguage(jaKana, "jpn", "jpn"));
  EXPECT_FALSE(LanguageCodes::isSameLanguage(jaKana, "jpn", "chi_sim"));
  EXPECT_FALSE(LanguageCodes::isSameLanguage(jaKana, "jpn", "vie"));

  const auto jaKanjiOnly = QString::fromUtf8("設定");
  EXPECT_TRUE(LanguageCodes::isSameLanguage(jaKanjiOnly, "jpn", "jpn"));
  EXPECT_FALSE(LanguageCodes::isSameLanguage(jaKanjiOnly, "chi_sim", "jpn"));

  const auto koText = QString::fromUtf8("안녕하세요");
  EXPECT_TRUE(LanguageCodes::isSameLanguage(koText, "kor", "kor"));
  EXPECT_FALSE(LanguageCodes::isSameLanguage(koText, "kor", "eng"));
}

TEST(LanguageCodes, ScoreRecognizedText)
{
  // Vietnamese accented word beats unaccented English lookalike
  const double vieScore =
      LanguageCodes::scoreRecognizedText(QString::fromUtf8("Bạn"), "vie", 90);
  const double engLookalike =
      LanguageCodes::scoreRecognizedText(QStringLiteral("Ban"), "eng", 92);
  EXPECT_GT(vieScore, engLookalike);

  // Pure English prefers eng over vie/jpn at similar confidence
  const double engClean = LanguageCodes::scoreRecognizedText(
      QStringLiteral("Settings"), "eng", 92);
  const double vieOnEng = LanguageCodes::scoreRecognizedText(
      QStringLiteral("Settings"), "vie", 92);
  const double jpnOnEng = LanguageCodes::scoreRecognizedText(
      QStringLiteral("Settings"), "jpn", 93);
  EXPECT_GT(engClean, vieOnEng);
  EXPECT_GT(engClean, jpnOnEng);

  // Garbage symbols score zero, Japanese kana beats Chinese on Japanese text
  EXPECT_DOUBLE_EQ(
      0.0, LanguageCodes::scoreRecognizedText(QStringLiteral("=~|^%"), "eng", 50));

  const auto jaText = QString::fromUtf8("設定を開く");
  EXPECT_GT(LanguageCodes::scoreRecognizedText(jaText, "jpn", 88),
            LanguageCodes::scoreRecognizedText(jaText, "chi_sim", 88));

  // Vertical model penalized on wide horizontal captures
  EXPECT_GT(LanguageCodes::scoreRecognizedText(jaText, "jpn", 85, QSize(400, 60)),
            LanguageCodes::scoreRecognizedText(jaText, "jpn_vert", 85, QSize(400, 60)));
}
