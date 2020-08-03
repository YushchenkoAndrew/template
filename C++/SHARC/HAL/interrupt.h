#pragma once
// #include "utils.h"
// #include "Generic\TypeList.h"
// #include "Generic\foreach.h"
#include "CriticalSection.h"

namespace HAL
{
    namespace InterruptID
    {
        enum IntIDEnum
        {
            Spi0Status = 140,
            Spi1Status = 144,
            Spi2Status = 102,
            Spi0Error = 141,
            Spi2Error = 103,
            Spi1Error = 145,
            Spi0Xmt = 138, // TX
            Spi0Rcv = 139, // RX
            Spi1Xmt = 142, // TX
            Spi1Rcv = 143, // RX
            Spi2Xmt = 100, // TX
            Spi2Rcv = 101, // RX

            Uart0Status = 148,
            Uart0Xmt = 146,      // TX
            Uart0Rcv = 147,      // RX
            Uart0XmtError = 234, // TX
            Uart0RcvError = 235, // RX
            Uart1Status = 151,
            Uart1Xmt = 149,      // TX
            Uart1Rcv = 150,      // RX
            Uart1XmtError = 236, // TX
            Uart1RcvError = 237, // RX
            Uart2Status = 154,
            Uart2Xmt = 152,      // TX
            Uart2Rcv = 153,      // RX
            Uart2XmtError = 238, // TX
            Uart2RcvError = 239, // RX
        };
    }

    class InterruptControl
    {
    public:
#pragma always_inline
        inline InterruptControl(int id) : id_(id)
        {
        }

#pragma always_inline
        inline InterruptControl(const InterruptControl &ic) : id_(ic.id_)
        {
        }

        void Enable() const
        {
            if (id_ != -1)
            {
                CriticalSection cs;
                // *(PCIE0_MSI_IMSK0_[n] + ((id_ & ~31U) >> 4)) |= (0x00000001U << (id_ & 31));
            }
        }

        void Disable() const
        {
            if (id_ != 1)
            {
                CriticalSection cs;
            }
        }

    private:
        const int id_;
    };

    template <int Id, typename Tag, class HandlerType>
    class InterruptSource
    {
    };
} // namespace HAL
