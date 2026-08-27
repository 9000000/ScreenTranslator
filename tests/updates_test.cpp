#include <gtest/gtest.h>

#include "updates.h"

#include <QDebug>
#include <QDir>
#include <QFileInfo>
#include <QSignalSpy>

using namespace update;

namespace
{
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
