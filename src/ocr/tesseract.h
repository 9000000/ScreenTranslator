#pragma once

#include "stfwd.h"

#include <QString>

#include <memory>

class QPixmap;
class Task;
namespace tesseract
{
class TessBaseAPI;
}

class Tesseract
{
public:
  using PreparedImage = std::shared_ptr<void>;

  Tesseract(const LanguageId& language, const QString& tessdataPath);
  ~Tesseract();

  static PreparedImage prepare(const QPixmap& source);
  QString recognize(const PreparedImage& image, int* confidence = nullptr);
  QString recognize(const QPixmap& source, int* confidence = nullptr);
  bool isValid() const;
  const QString& error() const;

  static LanguageIds availableLanguageIds(const QString& path);
  static QStringList availableLanguageNames(const QString& path);

private:
  void init(const LanguageId& language, const QString& tessdataPath);

  std::unique_ptr<tesseract::TessBaseAPI> api_;
  QString error_;
};
