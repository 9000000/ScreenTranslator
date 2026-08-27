CONFIG += c++17
CONFIG -= app_bundle

QT += widgets network testlib
greaterThan(QT_MAJOR_VERSION, 5) {
    QT += core5compat
}

win32 {
    QMAKE_CXXFLAGS += /FIiterator
}

INCLUDEPATH += $$PWD/../external $$PWD/../src/service

HEADERS += \
  ../src/service/updates.h

SOURCES += \
  ../external/gtest/gtest-all.cc \
  ../src/service/geometryutils.cpp \
  ../src/service/updates.cpp \
  ../src/service/debug.cpp \
  ../external/miniz/miniz.c \
  geometryutils_test.cpp \
  main.cpp \
  updates_test.cpp
