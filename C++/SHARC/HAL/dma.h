#pragma once
// #include "utils.h"
// #include "Generic\typelist.h"
// #include "HAL\interrupt.h"
#include "HAL/interrupt.h"

namespace HAL
{
#pragma pad(4)

    template <bool extended = false>
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

    template <>
    struct DmaRegsList<true>
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
        int r3;
        unsigned short bwlCnt;
        unsigned short bwlCnt_curr;
        unsigned long bwmCnt;
        unsigned long bwmCnt_curr;
    };

    template <int i>
    struct MdamPortSelect;

    template <>
    struct MdamPortSelect<0>
    {
        enum
        {
            SrcInterruptID = InterruptID::Mdma0Src,
            DstInterruptID = InterruptID::Mdma0Dst,
            SrcAddress = DMA8_DSCPTR_NXT,
            DstAddress = DMA9_DSCPTR_NXT,
        };
    };

    template <>
    struct MdamPortSelect<1>
    {
        enum
        {
            SrcInterruptID = InterruptID::Mdma1Src,
            DstInterruptID = InterruptID::Mdma1Dst,
            SrcAddress = DMA18_DSCPTR_NXT,
            DstAddress = DMA19_DSCPTR_NXT,
        };
    };

    template <>
    struct MdamPortSelect<2>
    {
        enum
        {
            SrcInterruptID = InterruptID::Mdma1Src,
            DstInterruptID = InterruptID::Mdma1Dst,
            SrcAddress = DMA39_DSCPTR_NXT,
            DstAddress = DMA40_DSCPTR_NXT,
        };
    };

    template <>
    struct MdamPortSelect<3>
    {
        enum
        {
            SrcInterruptID = InterruptID::Mdma1Src,
            DstInterruptID = InterruptID::Mdma1Dst,
            SrcAddress = DMA43_DSCPTR_NXT,
            DstAddress = DMA44_DSCPTR_NXT,
        };
    };

    class MemDmaPort
    {
        template <int i>
        inline MemDmaPort(Int2Type<i>);

#pragma always_inline
        inline volatile DmaRegsList<> *const Src()
        {
            return source_;
        };

#pragma always_inline
        inline volatile DmaRegsList<> *const Dst()
        {
            return destination_;
        }

    private:
        volatile DmaRegsList<> *const source_;
        volatile DmaRegsList<> *const destination_;
    };

    template <int i>
    MemDmaPort::MemDmaPort(Int2Type<i>) : source_(reinterpret_cast<DmaRegsList *>(MdamPortSelect<i>::SrcAddress)),
                                          destination_(reinterpret_cast<DmaRegsList *>(MdamPortSelect<i>::SrcAddress)){

                                          };

} // namespace HAL
