#include <gtest/gtest.h>

#include "updates.h"

#include <QCoreApplication>
#include <QDebug>
#include <QDir>
#include <QFileInfo>
#include <QSignalSpy>

#include <cstring>

using namespace update;

namespace
{
// Minimal uncompressed (STORED) ZIP builder for testing extractArchive
QByteArray buildStoredZip(const QVector<QPair<QString, QByteArray>>& entries)
{
  auto appendU16 = [](QByteArray& out, quint16 v) {
    out.append(char(v & 0xFF));
    out.append(char((v >> 8) & 0xFF));
  };
  auto appendU32 = [](QByteArray& out, quint32 v) {
    out.append(char(v & 0xFF));
    out.append(char((v >> 8) & 0xFF));
    out.append(char((v >> 16) & 0xFF));
    out.append(char((v >> 24) & 0xFF));
  };
  auto crc32 = [](const QByteArray& data) -> quint32 {
    quint32 crc = 0xFFFFFFFFu;
    for (unsigned char b : data) {
      crc ^= b;
      for (int i = 0; i < 8; ++i)
        crc = (crc >> 1) ^ (0xEDB88320u & (0u - (crc & 1u)));
    }
    return ~crc;
  };

  QByteArray body;
  QByteArray centralDir;
  for (const auto& entry : entries) {
    const auto nameBytes = entry.first.toUtf8();
    const auto& content = entry.second;
    const quint32 offset = quint32(body.size());
    const quint32 crc = crc32(content);
    const quint32 sz = quint32(content.size());

    // Local file header
    appendU32(body, 0x04034b50u);
    appendU16(body, 20);
    appendU16(body, 0);
    appendU16(body, 0);  // stored
    appendU16(body, 0);
    appendU16(body, 0);
    appendU32(body, crc);
    appendU32(body, sz);
    appendU32(body, sz);
    appendU16(body, quint16(nameBytes.size()));
    appendU16(body, 0);
    body.append(nameBytes);
    body.append(content);

    // Central directory header
    appendU32(centralDir, 0x02014b50u);
    appendU16(centralDir, 20);
    appendU16(centralDir, 20);
    appendU16(centralDir, 0);
    appendU16(centralDir, 0);
    appendU16(centralDir, 0);
    appendU16(centralDir, 0);
    appendU32(centralDir, crc);
    appendU32(centralDir, sz);
    appendU32(centralDir, sz);
    appendU16(centralDir, quint16(nameBytes.size()));
    appendU16(centralDir, 0);
    appendU16(centralDir, 0);
    appendU16(centralDir, 0);
    appendU16(centralDir, 0);
    appendU32(centralDir, 0);
    appendU32(centralDir, offset);
    centralDir.append(nameBytes);
  }

  const quint32 cdOffset = quint32(body.size());
  const quint32 cdSize = quint32(centralDir.size());
  body.append(centralDir);

  // End of central directory record
  appendU32(body, 0x06054b50u);
  appendU16(body, 0);
  appendU16(body, 0);
  appendU16(body, quint16(entries.size()));
  appendU16(body, quint16(entries.size()));
  appendU32(body, cdSize);
  appendU32(body, cdOffset);
  appendU16(body, 0);
  return body;
}
const auto f1 = "from1.txt";
const auto t1 = "test/to1.txt";
const auto data = "sample";

File toFile(const QString& to)
{
  File result;
  result.expandedPath = to;
  return result;
}

bool writeFile(const QString& name, const QByteArray& data)
{
  QFile f(name);
  if (!f.open(QFile::WriteOnly))
    return false;
  f.write(data);
  return true;
}

QByteArray readFile(const QString& name)
{
  QFile f(name);
  if (!f.open(QFile::ReadOnly))
    return {};
  return f.readAll();
}

bool removeFile(const QString& name)
{
  if (!QFile::exists(name))
    return true;
  return QFile::remove(name);
}
}  // namespace

TEST(UpdateInstaller, SuccessInstall)
{
  ASSERT_TRUE(removeFile(t1));

  Installer testee({"test"});
  testee.install(toFile(t1), data);
  ASSERT_EQ(data, readFile(t1));
  ASSERT_TRUE(testee.error().isEmpty());
}

TEST(UpdateInstaller, SuccessRemove)
{
  ASSERT_TRUE(writeFile(f1, data));

  Installer testee({QFileInfo(f1).absolutePath()});
  testee.remove(toFile(f1));
  ASSERT_FALSE(QFile::exists(f1));
  ASSERT_TRUE(testee.error().isEmpty());
}

#ifdef Q_OS_LINUX
TEST(UpdateInstaller, FailInstallNoWritable)
{
  const auto t1 = "/foo.txt";
  QFile f(t1);
  ASSERT_FALSE(f.isWritable());

  Installer testee({QDir::currentPath(), "/"});
  testee.install(toFile(t1), data);
  ASSERT_FALSE(testee.error().isEmpty());
}
#endif

TEST(UpdateInstaller, PathValidation)
{
  Installer testee({"allowed_dir"});

  // Path inside allowed_dir
  testee.install(toFile("allowed_dir/to1.txt"), data);
  ASSERT_TRUE(testee.error().isEmpty());

  // Path outside allowed_dir
  testee.install(toFile("unallowed_dir/to2.txt"), data);
  ASSERT_FALSE(testee.error().isEmpty());

  // Directory traversal
  Installer testee2({"allowed_dir"});
  testee2.install(toFile("allowed_dir/../unallowed_dir/to3.txt"), data);
  ASSERT_FALSE(testee2.error().isEmpty());

  // Partial path match vulnerability (e.g. "allowed_dir_malicious")
  Installer testee3({"allowed_dir"});
  testee3.install(toFile("allowed_dir_malicious/to4.txt"), data);
  ASSERT_FALSE(testee3.error().isEmpty());

  // Case sensitivity test (if applicable)
#if defined(Q_OS_WIN) || defined(Q_OS_MACOS)
  Installer testee4({"allowed_dir"});
  testee4.install(toFile("ALLOWED_DIR/to5.txt"), data);
  ASSERT_TRUE(testee4.error().isEmpty());
#else
  Installer testee4({"allowed_dir"});
  testee4.install(toFile("ALLOWED_DIR/to5.txt"), data);
  ASSERT_FALSE(testee4.error().isEmpty());
#endif
}

TEST(UpdateInstaller, FailRemove)
{
  const auto f1 = QString("/var/log/faillog");
  QFile f(f1);
  if (!f.exists())
    return;
  ASSERT_FALSE(QFile::copy(f1, f1 + "1"));  // non writable

  Installer testee({QDir::currentPath(), "/var/log"});
  testee.remove(toFile(f1));
  ASSERT_FALSE(testee.error().isEmpty());
}

TEST(UpdateInstaller, PathValidationSecurity)
{
  Installer testee({"test"});

  testee.remove(toFile("../malicious.txt"));
  ASSERT_FALSE(testee.error().isEmpty());

  Installer testee2({"test"});
  testee2.install(toFile("../malicious.txt"), data);
  ASSERT_FALSE(testee2.error().isEmpty());

  Installer testee3({"test"});
  testee3.install(toFile("test-malicious/test.txt"), data);
  ASSERT_FALSE(testee3.error().isEmpty());
}

TEST(UpdateModel, ParseFail)
{
  const auto updates = R"({
})";

  Updater updater({});
  Model testee(updater);
  const auto error = testee.parse(updates);

  ASSERT_FALSE(error.isEmpty());
  ASSERT_EQ(0, testee.rowCount({}));
}

TEST(UpdateModel, Parse)
{
  const auto updates = R"({
"version":1
,"app":{
"comp1":{"version":"3.0.0", "files":[{"path":"$appdir$/screen-translator.exe", "md5":""}]}
}
,"recognizers": {
"Afrikaans":{"files":[
{"url":"https://example.com/test1", "path":"$tessdata$/afr.traineddata", "date":"2020-03-09T08:28:45+01:00", "size":12800552}
]}
}
})";

  Updater updater({});
  Model testee(updater);
  const auto error = testee.parse(updates);

  ASSERT_TRUE(error.isEmpty());
  ASSERT_EQ(2, testee.rowCount({}));

  const auto app = testee.index(0, 0, {});
  const auto comp1 = testee.index(0, 0, app);
  const auto comp1Name =
      comp1.sibling(comp1.row(), int(Model::Column::Name)).data().toString();
  ASSERT_EQ("comp1", comp1Name);
}

TEST(UpdateInstaller, ExtractArchiveStripsCommonPrefix)
{
  const QString destDir = QDir::currentPath() + "/test_extract_ok";
  QDir(destDir).removeRecursively();

  const auto zip = buildStoredZip({
      {"ScreenTranslator/screen-translator.exe", "EXE_DATA"},
      {"ScreenTranslator/plugins/tls.dll", "DLL_DATA"},
  });

  Installer testee;
  ASSERT_TRUE(testee.extractArchive(zip, destDir));
  ASSERT_TRUE(testee.error().isEmpty());
  ASSERT_EQ("EXE_DATA", readFile(destDir + "/screen-translator.exe"));
  ASSERT_EQ("DLL_DATA", readFile(destDir + "/plugins/tls.dll"));

  QDir(destDir).removeRecursively();
}

TEST(UpdateInstaller, ExtractArchiveRejectsZipSlip)
{
  const QString destDir = QDir::currentPath() + "/test_extract_slip";
  QDir(destDir).removeRecursively();

  const auto zip = buildStoredZip({
      {"../escaped.txt", "MALICIOUS"},
  });

  Installer testee;
  ASSERT_FALSE(testee.extractArchive(zip, destDir));
  ASSERT_FALSE(testee.error().isEmpty());
  ASSERT_FALSE(QFile::exists(QDir::currentPath() + "/escaped.txt"));

  QDir(destDir).removeRecursively();
}

TEST(UpdateModel, AppZipVersionComparison)
{
  const auto prevVer = QCoreApplication::applicationVersion();
  QCoreApplication::setApplicationVersion("4.2.0");

  const QString fakeDir = QDir::currentPath() + "/test_appdir";
  QDir(fakeDir).mkpath(".");
  const QString fakeExe = fakeDir + "/screen-translator.exe";
  ASSERT_TRUE(writeFile(fakeExe, "dummy"));

  const auto updates = R"({
    "version": 1,
    "app": {
      "current": {
        "version": "4.3.0",
        "files": [{
          "url": "https://example.com/ScreenTranslator-4.3.0-win64.zip",
          "path": "$appdir$/screen-translator.exe",
          "md5": "deadbeef"
        }]
      }
    }
  })";

  Updater updater({});
  Model testee(updater);
  testee.setExpansions({{"$appdir$", fakeDir}});
  ASSERT_TRUE(testee.parse(updates).isEmpty());
  ASSERT_TRUE(testee.hasUpdates());

  const auto app = testee.index(0, 0, {});
  const auto comp = testee.index(0, 0, app);
  ASSERT_TRUE(testee.flags(comp) & Qt::ItemIsEnabled);

  QCoreApplication::setApplicationVersion(prevVer);
  QDir(fakeDir).removeRecursively();
}
