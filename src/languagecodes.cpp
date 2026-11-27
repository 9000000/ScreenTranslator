#include "languagecodes.h"

#include <QObject>

#define S(XXX) QStringLiteral(XXX)
#define I(XXX) LanguageId(QStringLiteral(XXX))
const std::unordered_map<LanguageId, LanguageCodes::Bundle>
    LanguageCodes::codes_{
        // clang-format off
  {I("afr"), {I("afr"), S("af"), S("afr"), QT_TRANSLATE_NOOP("QObject", "Afrikaans")}},
  {I("sqi"), {I("sqi"), S("sq"), S("sqi"), QT_TRANSLATE_NOOP("QObject", "Albanian")}},
  {I("amh"), {I("amh"), S("am"), S("amh"), QT_TRANSLATE_NOOP("QObject", "Amharic")}},
  {I("ara"), {I("ara"), S("ar"), S("ara"), QT_TRANSLATE_NOOP("QObject", "Arabic")}},
  {I("hye"), {I("hye"), S("hy"), S("hye"), QT_TRANSLATE_NOOP("QObject", "Armenian")}},
  {I("asm"), {I("asm"), S("as"), S("asm"), QT_TRANSLATE_NOOP("QObject", "Assamese")}},
  {I("aze"), {I("aze"), S("az"), S("aze"), QT_TRANSLATE_NOOP("QObject", "Azerbaijani")}},
  {I("aze_cyrl"), {I("aze_cyrl"), S("az"), S("aze_cyrl"), QT_TRANSLATE_NOOP("QObject", "Azerbaijani (Cyrillic)")}},
  {I("eus"), {I("eus"), S("eu"), S("eus"), QT_TRANSLATE_NOOP("QObject", "Basque")}},
  {I("bel"), {I("bel"), S("be"), S("bel"), QT_TRANSLATE_NOOP("QObject", "Belarusian")}},
  {I("ben"), {I("ben"), S("bn"), S("ben"), QT_TRANSLATE_NOOP("QObject", "Bengali")}},
  {I("bos"), {I("bos"), S("bs"), S("bos"), QT_TRANSLATE_NOOP("QObject", "Bosnian")}},
  {I("bre"), {I("bre"), S("br"), S("bre"), QT_TRANSLATE_NOOP("QObject", "Breton")}},
  {I("bul"), {I("bul"), S("bg"), S("bul"), QT_TRANSLATE_NOOP("QObject", "Bulgarian")}},
  {I("mya"), {I("mya"), S("my"), S("mya"), QT_TRANSLATE_NOOP("QObject", "Burmese")}},
  {I("cat"), {I("cat"), S("ca"), S("cat"), QT_TRANSLATE_NOOP("QObject", "Catalan")}},
  {I("ceb"), {I("ceb"), S("ceb"), S("ceb"), QT_TRANSLATE_NOOP("QObject", "Cebuano")}},
  {I("chr"), {I("chr"), S("chr"), S("chr"), QT_TRANSLATE_NOOP("QObject", "Cherokee")}},
  {I("cos"), {I("cos"), S("co"), S("cos"), QT_TRANSLATE_NOOP("QObject", "Corsican")}},
  {I("hrv"), {I("hrv"), S("hr"), S("hrv"), QT_TRANSLATE_NOOP("QObject", "Croatian")}},
  {I("ces"), {I("ces"), S("cs"), S("ces"), QT_TRANSLATE_NOOP("QObject", "Czech")}},
  {I("dan"), {I("dan"), S("da"), S("dan"), QT_TRANSLATE_NOOP("QObject", "Danish")}},
  {I("div"), {I("div"), S("dv"), S("div"), QT_TRANSLATE_NOOP("QObject", "Divehi, Dhivehi, Maldivian")}},
  {I("nld"), {I("nld"), S("nl"), S("nld"), QT_TRANSLATE_NOOP("QObject", "Dutch")}},
  {I("dzo"), {I("dzo"), S("dz"), S("dzo"), QT_TRANSLATE_NOOP("QObject", "Dzongkha")}},
  {I("eng"), {I("eng"), S("en"), S("eng"), QT_TRANSLATE_NOOP("QObject", "English")}},
  {I("enm"), {I("enm"), S("en"), S("enm"), QT_TRANSLATE_NOOP("QObject", "English, Middle (1100-1500)")}},
  {I("epo"), {I("epo"), S("eo"), S("epo"), QT_TRANSLATE_NOOP("QObject", "Esperanto")}},
  {I("est"), {I("est"), S("et"), S("est"), QT_TRANSLATE_NOOP("QObject", "Estonian")}},
  {I("fao"), {I("fao"), S("fo"), S("fao"), QT_TRANSLATE_NOOP("QObject", "Faroese")}},
  {I("fil"), {I("fil"), S("tl"), S("fil"), QT_TRANSLATE_NOOP("QObject", "Filipino")}},
  {I("fin"), {I("fin"), S("fi"), S("fin"), QT_TRANSLATE_NOOP("QObject", "Finnish")}},
  {I("frk"), {I("frk"), S("de"), S("frk"), QT_TRANSLATE_NOOP("QObject", "Frankish (Fraktur)")}},
  {I("fra"), {I("fra"), S("fr"), S("fra"), QT_TRANSLATE_NOOP("QObject", "French")}},
  {I("frm"), {I("frm"), S("fr"), S("frm"), QT_TRANSLATE_NOOP("QObject", "French, Middle (ca.1400-1600)")}},
  {I("fry"), {I("fry"), S("fy"), S("fry"), QT_TRANSLATE_NOOP("QObject", "Western Frisian")}},
  {I("gla"), {I("gla"), S("gd"), S("gla"), QT_TRANSLATE_NOOP("QObject", "Gaelic")}},
  {I("gle"), {I("gle"), S("ga"), S("gle"), QT_TRANSLATE_NOOP("QObject", "Irish")}},
  {I("glg"), {I("glg"), S("gl"), S("glg"), QT_TRANSLATE_NOOP("QObject", "Galician")}},
  {I("kat"), {I("kat"), S("ka"), S("kat"), QT_TRANSLATE_NOOP("QObject", "Georgian")}},
  {I("kat_old"), {I("kat_old"), S("ka"), S("kat_old"), QT_TRANSLATE_NOOP("QObject", "Georgian (Old)")}},
  {I("deu"), {I("deu"), S("de"), S("deu"), QT_TRANSLATE_NOOP("QObject", "German")}},
  {I("ell"), {I("ell"), S("el"), S("ell"), QT_TRANSLATE_NOOP("QObject", "Greek")}},
  {I("grc"), {I("grc"), S("el"), S("grc"), QT_TRANSLATE_NOOP("QObject", "Greek, Ancient (to 1453)")}},
  {I("guj"), {I("guj"), S("gu"), S("guj"), QT_TRANSLATE_NOOP("QObject", "Gujarati")}},
  {I("hat"), {I("hat"), S("ht"), S("hat"), QT_TRANSLATE_NOOP("QObject", "Haitian")}},
  {I("hau"), {I("hau"), S("ha"), S(""), QT_TRANSLATE_NOOP("QObject", "Hausa")}},
  {I("heb"), {I("heb"), S("he"), S("heb"), QT_TRANSLATE_NOOP("QObject", "Hebrew")}},
  {I("hin"), {I("hin"), S("hi"), S("hin"), QT_TRANSLATE_NOOP("QObject", "Hindi")}},
  {I("hun"), {I("hun"), S("hu"), S("hun"), QT_TRANSLATE_NOOP("QObject", "Hungarian")}},
  {I("hye"), {I("hye"), S("hy"), S("hye"), QT_TRANSLATE_NOOP("QObject", "Armenian")}},
  {I("ibo"), {I("ibo"), S("ig"), S(""), QT_TRANSLATE_NOOP("QObject", "Igbo")}},
  {I("iku"), {I("iku"), S("iu"), S("iku"), QT_TRANSLATE_NOOP("QObject", "Inuktitut")}},
  {I("ind"), {I("ind"), S("id"), S("ind"), QT_TRANSLATE_NOOP("QObject", "Indonesian")}},
  {I("isl"), {I("isl"), S("is"), S("isl"), QT_TRANSLATE_NOOP("QObject", "Icelandic")}},
  {I("ita"), {I("ita"), S("it"), S("ita"), QT_TRANSLATE_NOOP("QObject", "Italian")}},
  {I("ita_old"), {I("ita_old"), S("it"), S("ita_old"), QT_TRANSLATE_NOOP("QObject", "Italian (Old)")}},
  {I("jav"), {I("jav"), S("jv"), S("jav"), QT_TRANSLATE_NOOP("QObject", "Javanese")}},
  {I("jpn"), {I("jpn"), S("ja"), S("jpn"), QT_TRANSLATE_NOOP("QObject", "Japanese")}},
  {I("jpn_vert"), {I("jpn_vert"), S("ja"), S("jpn_vert"), QT_TRANSLATE_NOOP("QObject", "Japanese vertical")}},
  {I("kan"), {I("kan"), S("kn"), S("kan"), QT_TRANSLATE_NOOP("QObject", "Kannada")}},
  {I("kaz"), {I("kaz"), S("kk"), S("kaz"), QT_TRANSLATE_NOOP("QObject", "Kazakh")}},
  {I("khm"), {I("khm"), S("km"), S("khm"), QT_TRANSLATE_NOOP("QObject", "Central Khmer")}},
  {I("kir"), {I("kir"), S("ky"), S("kir"), QT_TRANSLATE_NOOP("QObject", "Kyrgyz")}},
  {I("kmr"), {I("kmr"), S("ku"), S("kmr"), QT_TRANSLATE_NOOP("QObject", "Kurdish (Kurmanji)")}},
  {I("kor"), {I("kor"), S("ko"), S("kor"), QT_TRANSLATE_NOOP("QObject", "Korean")}},
  {I("kor_vert"), {I("kor_vert"), S("ko"), S("kor_vert"), QT_TRANSLATE_NOOP("QObject", "Korean vertical")}},
  {I("kur"), {I("kur"), S("ku"), S(""), QT_TRANSLATE_NOOP("QObject", "Kurdish")}},
  {I("lao"), {I("lao"), S("lo"), S("lao"), QT_TRANSLATE_NOOP("QObject", "Lao")}},
  {I("lat"), {I("lat"), S("la"), S("lat"), QT_TRANSLATE_NOOP("QObject", "Latin")}},
  {I("lav"), {I("lav"), S("lv"), S("lav"), QT_TRANSLATE_NOOP("QObject", "Latvian")}},
  {I("lit"), {I("lit"), S("lt"), S("lit"), QT_TRANSLATE_NOOP("QObject", "Lithuanian")}},
  {I("ltz"), {I("ltz"), S("lb"), S("ltz"), QT_TRANSLATE_NOOP("QObject", "Luxembourgish")}},
  {I("mal"), {I("mal"), S("ml"), S("mal"), QT_TRANSLATE_NOOP("QObject", "Malayalam")}},
  {I("mar"), {I("mar"), S("mr"), S("mar"), QT_TRANSLATE_NOOP("QObject", "Marathi")}},
  {I("mkd"), {I("mkd"), S("mk"), S("mkd"), QT_TRANSLATE_NOOP("QObject", "Macedonian")}},
  {I("mlg"), {I("mlg"), S("mg"), S(""), QT_TRANSLATE_NOOP("QObject", "Malagasy")}},
  {I("mlt"), {I("mlt"), S("mt"), S("mlt"), QT_TRANSLATE_NOOP("QObject", "Maltese")}},
  {I("mon"), {I("mon"), S("mn"), S("mon"), QT_TRANSLATE_NOOP("QObject", "Mongolian")}},
  {I("mri"), {I("mri"), S("mi"), S("mri"), QT_TRANSLATE_NOOP("QObject", "Maori")}},
  {I("msa"), {I("msa"), S("ms"), S("msa"), QT_TRANSLATE_NOOP("QObject", "Malay")}},
  {I("mya"), {I("mya"), S("my"), S("mya"), QT_TRANSLATE_NOOP("QObject", "Burmese")}},
  {I("nep"), {I("nep"), S("ne"), S("nep"), QT_TRANSLATE_NOOP("QObject", "Nepali")}},
  {I("nld"), {I("nld"), S("nl"), S("nld"), QT_TRANSLATE_NOOP("QObject", "Dutch")}},
  {I("nor"), {I("nor"), S("no"), S("nor"), QT_TRANSLATE_NOOP("QObject", "Norwegian")}},
  {I("oci"), {I("oci"), S("oc"), S("oci"), QT_TRANSLATE_NOOP("QObject", "Occitan")}},
  {I("ori"), {I("ori"), S("or"), S("ori"), QT_TRANSLATE_NOOP("QObject", "Oriya")}},
  {I("osd"), {I("osd"), S("osd"), S("osd"), QT_TRANSLATE_NOOP("QObject", "Orientation & Script")}},
  {I("pan"), {I("pan"), S("pa"), S("pan"), QT_TRANSLATE_NOOP("QObject", "Punjabi")}},
  {I("fas"), {I("fas"), S("fa"), S("fas"), QT_TRANSLATE_NOOP("QObject", "Persian")}},
  {I("pol"), {I("pol"), S("pl"), S("pol"), QT_TRANSLATE_NOOP("QObject", "Polish")}},
  {I("por"), {I("por"), S("pt"), S("por"), QT_TRANSLATE_NOOP("QObject", "Portuguese")}},
  {I("pus"), {I("pus"), S("ps"), S("pus"), QT_TRANSLATE_NOOP("QObject", "Pashto")}},
  {I("que"), {I("que"), S("qu"), S("que"), QT_TRANSLATE_NOOP("QObject", "Quechua")}},
  {I("ron"), {I("ron"), S("ro"), S("ron"), QT_TRANSLATE_NOOP("QObject", "Romanian")}},
  {I("rus"), {I("rus"), S("ru"), S("rus"), QT_TRANSLATE_NOOP("QObject", "Russian")}},
  {I("san"), {I("san"), S("sa"), S("san"), QT_TRANSLATE_NOOP("QObject", "Sanskrit")}},
  {I("sin"), {I("sin"), S("si"), S("sin"), QT_TRANSLATE_NOOP("QObject", "Sinhala, Sinhalese")}},
  {I("slk"), {I("slk"), S("sk"), S("slk"), QT_TRANSLATE_NOOP("QObject", "Slovak")}},
  {I("slv"), {I("slv"), S("sl"), S("slv"), QT_TRANSLATE_NOOP("QObject", "Slovenian")}},
  {I("smo"), {I("smo"), S("sm"), S(""), QT_TRANSLATE_NOOP("QObject", "Samoan")}},
  {I("sna"), {I("sna"), S("sn"), S(""), QT_TRANSLATE_NOOP("QObject", "Shona")}},
  {I("snd"), {I("snd"), S("sd"), S("snd"), QT_TRANSLATE_NOOP("QObject", "Sindhi")}},
  {I("som"), {I("som"), S("so"), S(""), QT_TRANSLATE_NOOP("QObject", "Somali")}},
  {I("spa"), {I("spa"), S("es"), S("spa"), QT_TRANSLATE_NOOP("QObject", "Spanish")}},
  {I("spa_old"), {I("spa_old"), S("es"), S("spa_old"), QT_TRANSLATE_NOOP("QObject", "Spanish (Old)")}},
  {I("srp"), {I("srp"), S("sr"), S("srp"), QT_TRANSLATE_NOOP("QObject", "Serbian")}},
  {I("srp_latn"), {I("srp_latn"), S("sr"), S("srp_latn"), QT_TRANSLATE_NOOP("QObject", "Serbian (Latin)")}},
  {I("sun"), {I("sun"), S("su"), S("sun"), QT_TRANSLATE_NOOP("QObject", "Sundanese")}},
  {I("swa"), {I("swa"), S("sw"), S("swa"), QT_TRANSLATE_NOOP("QObject", "Swahili")}},
  {I("swe"), {I("swe"), S("sv"), S("swe"), QT_TRANSLATE_NOOP("QObject", "Swedish")}},
  {I("syr"), {I("syr"), S("syr"), S("syr"), QT_TRANSLATE_NOOP("QObject", "Syriac")}},
  {I("tam"), {I("tam"), S("ta"), S("tam"), QT_TRANSLATE_NOOP("QObject", "Tamil")}},
  {I("tat"), {I("tat"), S("tt"), S("tat"), QT_TRANSLATE_NOOP("QObject", "Tatar")}},
  {I("tel"), {I("tel"), S("te"), S("tel"), QT_TRANSLATE_NOOP("QObject", "Telugu")}},
  {I("tgk"), {I("tgk"), S("tg"), S("tgk"), QT_TRANSLATE_NOOP("QObject", "Tajik")}},
  {I("tha"), {I("tha"), S("th"), S("tha"), QT_TRANSLATE_NOOP("QObject", "Thai")}},
  {I("tir"), {I("tir"), S("ti"), S("tir"), QT_TRANSLATE_NOOP("QObject", "Tigrinya")}},
  {I("bod"), {I("bod"), S("bo"), S("bod"), QT_TRANSLATE_NOOP("QObject", "Tibetan")}},
  {I("tgl"), {I("tgl"), S("tl"), S(""), QT_TRANSLATE_NOOP("QObject", "Tagalog")}},
  {I("ton"), {I("ton"), S("to"), S("ton"), QT_TRANSLATE_NOOP("QObject", "Tonga (Tonga Islands)")}},
  {I("tur"), {I("tur"), S("tr"), S("tur"), QT_TRANSLATE_NOOP("QObject", "Turkish")}},
  {I("uig"), {I("uig"), S("ug"), S("uig"), QT_TRANSLATE_NOOP("QObject", "Uighur, Uyghur")}},
  {I("ukr"), {I("ukr"), S("uk"), S("ukr"), QT_TRANSLATE_NOOP("QObject", "Ukrainian")}},
  {I("urd"), {I("urd"), S("ur"), S("urd"), QT_TRANSLATE_NOOP("QObject", "Urdu")}},
  {I("uzb"), {I("uzb"), S("uz"), S("uzb"), QT_TRANSLATE_NOOP("QObject", "Uzbek")}},
  {I("uzb_cyrl"), {I("uzb_cyrl"), S("uz"), S("uzb_cyrl"), QT_TRANSLATE_NOOP("QObject", "Uzbek (Cyrillic)")}},
  {I("vie"), {I("vie"), S("vi"), S("vie"), QT_TRANSLATE_NOOP("QObject", "Vietnamese")}},
  {I("cym"), {I("cym"), S("cy"), S("cym"), QT_TRANSLATE_NOOP("QObject", "Welsh")}},
  {I("yid"), {I("yid"), S("yi"), S("yid"), QT_TRANSLATE_NOOP("QObject", "Yiddish")}},
  {I("yor"), {I("yor"), S("yo"), S("yor"), QT_TRANSLATE_NOOP("QObject", "Yoruba")}},
  {I("zul"), {I("zul"), S("zu"), S(""), QT_TRANSLATE_NOOP("QObject", "Zulu")}},
  // custom
  {I("chi_sim"), {I("chi_sim"), S("zh-CN"), S("chi_sim"), QT_TRANSLATE_NOOP("QObject", "Chinese (Simplified)")}},
  {I("chi_sim_vert"), {I("chi_sim_vert"), S("zh-CN"), S("chi_sim_vert"), QT_TRANSLATE_NOOP("QObject", "Chinese (Simplified) vertical")}},
  {I("chi_tra"), {I("chi_tra"), S("zh-TW"), S("chi_tra"), QT_TRANSLATE_NOOP("QObject", "Chinese (Traditional)")}},
  {I("chi_tra_vert"), {I("chi_tra_vert"), S("zh-TW"), S("chi_tra_vert"), QT_TRANSLATE_NOOP("QObject", "Chinese (Traditional) vertical")}},
  {I("any"), {I("any"), S("auto"), S(""), QT_TRANSLATE_NOOP("QObject", "Any")}},
  {I("auto"), {I("auto"), S("auto"), S(""), QT_TRANSLATE_NOOP("QObject", "Auto")}},
        // clang-format on
    };
#undef I
#undef S

LanguageId LanguageCodes::idForName(const QString &name)
{
  if (name.contains(QLatin1Char('+'))) {
    const auto parts = name.split(QLatin1Char('+'), Qt::SkipEmptyParts);
    QStringList ids;
    ids.reserve(parts.size());
    for (const auto &part : parts) {
      ids.append(idForName(part.trimmed()));
    }
    return ids.join(QLatin1Char('+'));
  }

  auto it = std::find_if(codes_.cbegin(), codes_.cend(),
                         [name](const std::pair<LanguageId, Bundle> &i) {
                           return name == QObject::tr(i.second.name);
                         });
  if (it != codes_.cend())
    return it->first;
  return name;
}

LanguageId LanguageCodes::idForTesseract(const QString &tesseract)
{
  if (tesseract.contains(QLatin1Char('+'))) {
    const auto parts = tesseract.split(QLatin1Char('+'), Qt::SkipEmptyParts);
    QStringList ids;
    ids.reserve(parts.size());
    for (const auto &part : parts) {
      ids.append(idForTesseract(part.trimmed()));
    }
    return ids.join(QLatin1Char('+'));
  }

  auto it = std::find_if(codes_.cbegin(), codes_.cend(),
                         [tesseract](const std::pair<LanguageId, Bundle> &i) {
                           return tesseract == i.second.tesseract;
                         });
  if (it != codes_.cend())
    return it->first;
  return tesseract;
}

QString LanguageCodes::iso639_1(const LanguageId &id)
{
  if (id.contains(QLatin1Char('+'))) {
    return QStringLiteral("auto");
  }

  auto it = codes_.find(id);
  if (it != codes_.cend() && !it->second.iso639_1.isEmpty()) {
    return it->second.iso639_1;
  }
  return id;
}

QString LanguageCodes::tesseract(const LanguageId &id)
{
  if (id.contains(QLatin1Char('+'))) {
    const auto parts = id.split(QLatin1Char('+'), Qt::SkipEmptyParts);
    QStringList tessCodes;
    tessCodes.reserve(parts.size());
    for (const auto &part : parts) {
      tessCodes.append(tesseract(part.trimmed()));
    }
    return tessCodes.join(QLatin1Char('+'));
  }

  auto it = codes_.find(id);
  if (it != codes_.cend() && !it->second.tesseract.isEmpty()) {
    return it->second.tesseract;
  }
  return id;
}

QString LanguageCodes::name(const LanguageId &id)
{
  if (id.contains(QLatin1Char('+'))) {
    const auto parts = id.split(QLatin1Char('+'), Qt::SkipEmptyParts);
    QStringList names;
    names.reserve(parts.size());
    for (const auto &part : parts) {
      names.append(name(part.trimmed()));
    }
    return names.join(QStringLiteral(" + "));
  }

  auto it = codes_.find(id);
  return it != codes_.cend() ? QObject::tr(it->second.name) : id;
}

std::vector<LanguageId> LanguageCodes::allIds()
{
  std::vector<LanguageId> result;
  result.reserve(codes_.size());
  for (const auto &code : codes_) result.push_back(code.first);
  return result;
}

LanguageId LanguageCodes::anyLanguageId()
{
  return QStringLiteral("any");
}

LanguageId LanguageCodes::autoLanguageId()
{
  return QStringLiteral("auto");
}

bool LanguageCodes::isAuto(const LanguageId &id)
{
  return id == QLatin1String("auto") || id == QLatin1String("any");
}

namespace
{
struct TextStats {
  int nonSpace{0};
  int lettersOrDigits{0};
  int letters{0};
  int latin{0};
  int nonAsciiLetters{0};
  int cyrillic{0};
  int han{0};
  int kana{0};
  int hangul{0};
  int arabic{0};
  int thai{0};
  int greek{0};
  int hebrew{0};
  int devanagari{0};
  int otherScript{0};
  int vietnamese{0};
  int vietnameseUnique{0};
};

TextStats analyzeText(const QString &text)
{
  static const QString vietnameseChars = QString::fromUtf8(
      "àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ"
      "ÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ"
      "đĐ");
  // Characters unique to Vietnamese (not shared with French/Spanish/Portuguese/Italian)
  static const QString vietnameseUniqueChars = QString::fromUtf8(
      "ảạăắằẳẵặấầẩẫậẻẽẹếềểễệỉĩịỏọốồổỗộơớờởỡợủũụưứừửữựỳỷỹỵ"
      "ẢẠĂẮẰẲẴẶẤẦẨẪẬẺẼẸẾỀỂỄỆỈĨỊỎỌỐỒỔỖỘƠỚỜỞỠỢỦŨỤƯỨỪỬỮỰỲỶỸỴ"
      "đĐ");

  TextStats s;
  for (const auto &ch : text) {
    if (ch.isSpace())
      continue;
    ++s.nonSpace;
    if (ch.isLetterOrNumber())
      ++s.lettersOrDigits;
    if (!ch.isLetter())
      continue;

    ++s.letters;
    if (ch.unicode() > 127) {
      ++s.nonAsciiLetters;
      if (vietnameseChars.contains(ch)) {
        ++s.vietnamese;
        if (vietnameseUniqueChars.contains(ch))
          ++s.vietnameseUnique;
      }
    }

    switch (ch.script()) {
      case QChar::Script_Latin: ++s.latin; break;
      case QChar::Script_Cyrillic: ++s.cyrillic; break;
      case QChar::Script_Han: ++s.han; break;
      case QChar::Script_Hiragana:
      case QChar::Script_Katakana: ++s.kana; break;
      case QChar::Script_Hangul: ++s.hangul; break;
      case QChar::Script_Arabic: ++s.arabic; break;
      case QChar::Script_Thai: ++s.thai; break;
      case QChar::Script_Greek: ++s.greek; break;
      case QChar::Script_Hebrew: ++s.hebrew; break;
      case QChar::Script_Devanagari: ++s.devanagari; break;
      default: ++s.otherScript; break;
    }
  }
  return s;
}

bool isCyrillicLanguage(const LanguageId &langId, const QString &iso)
{
  if (langId == QLatin1String("srp_latn"))
    return false;
  if (langId.endsWith(QLatin1String("_cyrl")))
    return true;
  return iso == QLatin1String("ru") || iso == QLatin1String("uk") ||
         iso == QLatin1String("be") || iso == QLatin1String("bg") ||
         iso == QLatin1String("sr") || iso == QLatin1String("mk") ||
         iso == QLatin1String("kk") || iso == QLatin1String("ky") ||
         iso == QLatin1String("mn") || iso == QLatin1String("tg") ||
         iso == QLatin1String("tt");
}

bool isArabicScriptLanguage(const QString &iso)
{
  return iso == QLatin1String("ar") || iso == QLatin1String("fa") ||
         iso == QLatin1String("ur") || iso == QLatin1String("ps") ||
         iso == QLatin1String("ug") || iso == QLatin1String("sd");
}

bool isDevanagariLanguage(const QString &iso)
{
  return iso == QLatin1String("hi") || iso == QLatin1String("mr") ||
         iso == QLatin1String("ne") || iso == QLatin1String("sa");
}
}  // namespace

bool LanguageCodes::isSameLanguage(const QString &text,
                                   const LanguageId &detectedSourceLang,
                                   const LanguageId &targetLang)
{
  if (text.trimmed().isEmpty() || targetLang.isEmpty())
    return false;

  const auto s = analyzeText(text);
  if (s.letters == 0)
    return false;

  const auto targetIso = iso639_1(targetLang);
  const auto sourceIso = detectedSourceLang.isEmpty()
                             ? QStringLiteral("auto")
                             : iso639_1(detectedSourceLang);
  const bool sameOrAutoSource =
      (sourceIso == targetIso || sourceIso == QLatin1String("auto"));

  if (targetIso == QLatin1String("vi")) {
    if (s.latin <= (s.letters * 2) / 3)
      return false;
    if (s.vietnameseUnique > 0 && sameOrAutoSource)
      return true;
    return sourceIso == QLatin1String("vi") && s.vietnamese > 0;
  }

  if (targetIso == QLatin1String("ja")) {
    if (s.kana > 0)
      return true;
    return s.han > s.letters / 2 && sourceIso == QLatin1String("ja");
  }

  if (targetIso == QLatin1String("ko"))
    return s.hangul > s.letters / 3;

  if (targetIso.startsWith(QLatin1String("zh"))) {
    if (s.kana > 0 || s.hangul > 0)
      return false;
    if (s.han > s.letters / 3)
      return !sourceIso.startsWith(QLatin1String("zh")) ||
             sourceIso == targetIso;
    return false;
  }

  if (isCyrillicLanguage(targetLang, targetIso))
    return s.cyrillic > s.letters / 3 && sameOrAutoSource;

  if (isArabicScriptLanguage(targetIso))
    return s.arabic > s.letters / 3 && sameOrAutoSource;

  if (targetIso == QLatin1String("th"))
    return s.thai > s.letters / 3;

  if (targetIso == QLatin1String("el"))
    return s.greek > s.letters / 3;

  if (targetIso == QLatin1String("he") || targetIso == QLatin1String("yi"))
    return s.hebrew > s.letters / 3 && sameOrAutoSource;

  if (isDevanagariLanguage(targetIso))
    return s.devanagari > s.letters / 3 && sameOrAutoSource;

  if (targetIso == QLatin1String("en")) {
    return sourceIso == QLatin1String("en") && s.latin == s.letters &&
           s.nonAsciiLetters == 0;
  }

  // ponytail: heuristic Latin match using OCR winning language; full NLP langid unnecessary here
  return sourceIso == targetIso && s.latin > (s.letters * 2) / 3 &&
         s.vietnameseUnique == 0;
}

double LanguageCodes::scoreRecognizedText(const QString &text,
                                          const LanguageId &langId,
                                          int confidence,
                                          const QSize &imageSize)
{
  if (text.trimmed().isEmpty() || confidence <= 0)
    return -1.0;

  const auto s = analyzeText(text);
  if (s.nonSpace == 0 || s.lettersOrDigits == 0)
    return 0.0;

  const double validRatio = double(s.lettersOrDigits) / double(s.nonSpace);
  double score = double(confidence) * (0.5 + 0.5 * validRatio);

  const auto iso = iso639_1(langId);
  if (iso == QLatin1String("vi")) {
    if (s.vietnameseUnique > 0 && confidence >= 70)
      score += 5.0;
    else if (s.vietnamese == 0)
      score -= 1.5;
  } else if (iso == QLatin1String("ja")) {
    if (s.kana > 0 && confidence >= 65)
      score += 5.0;
    else if (s.kana == 0 && s.han == 0 && s.letters > 0)
      score -= 4.0;
  } else if (iso.startsWith(QLatin1String("zh"))) {
    if (s.han == 0 && s.letters > 0)
      score -= 4.0;
  } else if (iso == QLatin1String("ko")) {
    if (s.hangul == 0 && s.letters > 0)
      score -= 4.0;
  } else if (isCyrillicLanguage(langId, iso)) {
    if (s.cyrillic == 0 && s.letters > 0)
      score -= 4.0;
  } else if (isArabicScriptLanguage(iso)) {
    if (s.arabic == 0 && s.letters > 0)
      score -= 4.0;
  } else if (iso == QLatin1String("th")) {
    if (s.thai == 0 && s.letters > 0)
      score -= 4.0;
  } else if (iso == QLatin1String("el")) {
    if (s.greek == 0 && s.letters > 0)
      score -= 4.0;
  } else if (iso == QLatin1String("he") || iso == QLatin1String("yi")) {
    if (s.hebrew == 0 && s.letters > 0)
      score -= 4.0;
  } else if (isDevanagariLanguage(iso)) {
    if (s.devanagari == 0 && s.letters > 0)
      score -= 4.0;
  }

  if (langId.endsWith(QLatin1String("_vert")) && imageSize.isValid()) {
    if (imageSize.width() > imageSize.height() * 1.2)
      score -= 10.0;
    else if (imageSize.height() > imageSize.width() * 1.5)
      score += 3.0;
  }

  return score;
}



