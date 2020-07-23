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
        void *NextDescPtr;
        void *StartAddr;
        unsigned short Config;
        unsigned short XCount;
        unsigned short XModify;
        unsigned short YCount;
        unsigned short YModify;
        int r0;
        int r1;
        void *CurrDescPtr;
        void *PrevDescPtr;
        void *CurrAddr;
        unsigned short Status;
        unsigned short CurrXCount;
        unsigned short CurrYCount;
    };

    template <int i>
    struct MdamPortSelect;

    template <>
    struct MdamPortSelect<0>
    {
        enum
        {
            SrcAddress,
        };
    };

    class MemDmaPort
    {
        template <int i>
        inline MemDmaPort(Int2Type<i>);

#pragma always_inline
        inline volatile DmaRegsList *const Src()
        {
            return source_;
        };

#pragma always_inline
        inline volatile DmaRegsList *const Dst()
        {
            return destination_;
        }

    private:
        volatile DmaRegsList *const source_;
        volatile DmaRegsList *const destination_;
    };

    template <int i>
    MemDmaPort::MemDmaPort(Int2Type<i>) : source_(reinterpret_cast<DmaRegsList *>(MdamPortSelect<i>::SrcAddress)),
                                          destination_(reinterpret_cast<DmaRegsList *>(MdamPortSelect<i>::SrcAddress)){

                                          };

} // namespace HAL
