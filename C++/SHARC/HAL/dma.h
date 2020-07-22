#pragma once
// #include "utils.h"
// #include "Generic\typelist.h"
// #include "HAL\interrupt.h"
#include "HAL/interrupt.h"

namespace HAL
{
#pragma pad(4)

    struct DmaRegsList
    {
    };

    template <int i>
    struct MdamPortSelect;

    template <>
    struct MdamPortSelect<0>
    {
        /* data */
    };

} // namespace HAL
