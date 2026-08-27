CONFIG += c++17
CONFIG -= app_bundle

QT += widgets network testlib
greaterThan(QT_MAJOR_VERSION, 5) {
    QT += core5compat
}

DEFINES += _SILENCE_STDEXT_ARR_ITERS_DEPRECATION_WARNING _SILENCE_ALL_CXX17_DEPRECATION_WARNINGS

win32 {
    QMAKE_CXXFLAGS += /FI\"$$PWD/../src/msvc_compat.h\"
}

INCLUDEPATH += $$PWD/../external $$PWD/../src $$PWD/../src/service

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
