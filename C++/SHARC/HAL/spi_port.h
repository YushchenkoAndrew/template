#pragma once
// #include "utils.h"
// #include "HAL\dma.h"
#include "HAL/dma.h"

namespace HAL
{

#pragma pad(4)
    template <int i>
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
        int r0;
        unsigned short IntMask;
        unsigned short IntMaskClear;
        unsigned short IntMaskSet;
        int r1;
        unsigned short Status;
        unsigned short IntCondition;
        unsigned short IntClear;
        unsigned short RcvFIFO; // RX
        int r3;
        unsigned short XmtFIFO; // TX
    };

    template <>
    struct SpiRegList<2>
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
        int r0;
        unsigned short IntMask;
        unsigned short IntMaskClear;
        unsigned short IntMaskSet;
        int r1;
        unsigned short Status;
        unsigned short IntCondition;
        unsigned short IntClear;
        unsigned short RcvFIFO; // RX
        int r3;
        unsigned short XmtFIFO; // TX
        int r4;
        unsigned short MemoryReadHeader;
        unsigned short SpiMemoryAddress;
    };

#pragma pad()
    namespace Detail
    {
        template <int i>
        struct SpiPortSelect;

        template <>
        struct SpiPortSelect<0>
        {
            enum
            {
                Address = SPI0_CTL,
                RcvInterruptID = InterruptID::Spi0Rcv,
                XmtInterruptID = InterruptID::Spi0Xmt,
                StatusInterruptId = InterruptID::Spi0Status,
                RcvDmaAddress = DMA23_DSCPTR_NXT,
                XmtDmaAddress = DMA22_DSCPTR_NXT,
            };
        };

        template <>
        struct SpiPortSelect<1>
        {
            enum
            {
                Address = SPI1_CTL,
                RcvInterruptID = InterruptID::Spi1Rcv,
                XmtInterruptID = InterruptID::Spi1Xmt,
                StatusInterruptId = InterruptID::Spi1Status,
                RcvDmaAddress = DMA25_DSCPTR_NXT,
                XmtDmaAddress = DMA24_DSCPTR_NXT,
            };
        };

        template <>
        struct SpiPortSelect<2>
        {
            enum
            {
                Address = SPI2_CTL,
                RcvInterruptID = InterruptID::Spi2Rcv,
                XmtInterruptID = InterruptID::Spi2Xmt,
                StatusInterruptId = InterruptID::Spi2Status,
                RcvDmaAddress = DMA27_DSCPTR_NXT,
                XmtDmaAddress = DMA26_DSCPTR_NXT,
            };
        };

        template <int Port>
        class SpiPort
        {

            SpiPort(Int2Type<Port>) : regs_(reinterpret_cast<SpiRegList<Port> *>(SpiPortSelect<Port>::Address)),
                                      rcvDma_(reinterpret_cast<DmaRegsList *>(SpiPortSelect<Port>::RcvDmaAddress)),
                                      xmtDma_(reinterpret_cast<DmaRegsList *>(SpiPortSelect<Port>::XmtDmaAddress)){};

#pragma always_inline
            inline volatile SpiRegList<Port> *const Reg()
            {
                return regs_;
            };

#pragma always_inline
            inline volatile DmaRegsList *const RcvDma()
            {
                return rcvDma_;
            };

#pragma always_inline
            inline volatile DmaRegsList *const XmtDma()
            {
                return xmtDma_;
            };

        private:
            volatile SpiRegList<Port> *regs_;
            volatile DmaRegsList *const rcvDma_;
            volatile DmaRegsList *const xmtDma_;
        };
    } // namespace Detail

} // namespace HAL
