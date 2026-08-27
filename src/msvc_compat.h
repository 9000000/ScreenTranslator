#pragma once
#if defined(_MSC_VER)
#ifndef _SILENCE_STDEXT_ARR_ITERS_DEPRECATION_WARNING
#define _SILENCE_STDEXT_ARR_ITERS_DEPRECATION_WARNING
#endif
#ifndef _SILENCE_ALL_CXX17_DEPRECATION_WARNINGS
#define _SILENCE_ALL_CXX17_DEPRECATION_WARNINGS
#endif
#include <iterator>
#include <cstddef>
namespace stdext {
    template <typename _Ptr>
    constexpr _Ptr make_checked_array_iterator(_Ptr _Array, size_t) noexcept {
        return _Array;
    }
}
#endif
