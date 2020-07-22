#pragma once
// #include "utils.h"
// #include "HAL\dma.h"
#include "HAL/dma.h"

namespace HAL
{

#pragma pad(4)
    struct SpiRegList
    {
        unsigned short Control;
        unsigned short RcvControl; // RX
        unsigned short XmtControl; // TX
        unsigned short Clock;
        unsigned short Delay;
        unsigned short SlaveSelect;
        unsigned short RcvWordCount;
        unsigned short RcvWordCountReload;
        unsigned short XmtWordCount;       // TX
        unsigned short XmtWordCountReload; // TX
        unsigned short IntMask;
        unsigned short IntMaskClear;
        unsigned short IntMaskSet;
        unsigned short Status;
        unsigned short IntCondition;
        unsigned short IntClear;
        unsigned short XmtFIFO; // TX
    };

    template <int i>
    struct SpiPortSelect;

    template <>
    struct SpiPortSelect<0>
    {
        enum
        {
            Address = SPI0_CTL,
            DmaAddress,
            RcvInterruptID = InterruptID::Spi0Rcv,
            XmtInterruptID = InterruptID::Spi0Xmt,
            StatusInterruptId = InterruptID::Spi0Status,
            RcvDmaAddress,
            XmtDmaAddress,
        };
    };

    template <>
    struct SpiPortSelect<1>
    {
        enum
        {
            Address = SPI1_CTL,
            DmaAddress,
            RcvInterruptID = InterruptID::Spi1Rcv,
            XmtInterruptID = InterruptID::Spi1Xmt,
            StatusInterruptId = InterruptID::Spi1Status,
            RcvDmaAddress,
            XmtDmaAddress,
        }
    };

    template <>
    struct SpiPortSelect<2>
    {
        enum
        {
            Address = SPI2_CTL,
            DmaAddress,
            RcvInterruptID = InterruptID::Spi2Rcv,
            XmtInterruptID = InterruptID::Spi2Xmt,
            StatusInterruptId = InterruptID::Spi2Status,
            RcvDmaAddress,
            XmtDmaAddress,
        }
    };

    class SpiPort
    {
        template <int Port>
        SpiPort(Int2Type<port>);

#pragma always_inline
        inline volatile SpiRegList *Reg() const
        {
            return regs_;
        };

#pragma always_inline
        inline volatile DmaRegsList *Dma() const
        {
            return dma_;
        };

    private:
        volatile SpiRegList *const regs_;
        volatile DmaRegsList *const dma_;
    };

    template <int Port>
    SpiPort::SpiPort(Int2Type<Port>) : reg_(reinterpret_cast<SpiRegList *>(SpiPortSelect<Port>::Address)),
                                       dma_(reinterpret_cast<DmaRegsList *>(SpiRegList<Port>::DmaAddress))
    {
    }

} // namespace HAL
