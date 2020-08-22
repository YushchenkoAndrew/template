#pragma once
// #include "utils.h"
// #include "HAL\dma.h"
// #include "Generic\foreach.h"
#include "HAL/dma.h"

namespace HAL
{
#pragma pad(4)

  struct UartRegList
  {
  };

  namespace Detail
  {

    template <int Port>
    struct UartPortSelect;

    template <>
    struct UartPortSelect<0>
    {
      enum
      {
        Address = 0,
        RcvInterruptID = InterruptID::Uart0Rcv,
        XmtInterruptID = InterruptID::Uart0Xmt,
        StatusInterruptID = InterruptID::Uart0Status,
        RcvDmaAddress = DMA21_DSCPTR_NXT,
        XmtDmaAddress = DMA20_DSCPTR_NXT,
      };
    };

    template <>
    struct UartPortSelect<1>
    {
      enum
      {
        Address = 0,
        RcvInterruptID = InterruptID::Uart1Rcv,
        XmtInterruptID = InterruptID::Uart1Xmt,
        StatusInterruptID = InterruptID::Uart1Status,
        RcvDmaAddress = DMA35_DSCPTR_NXT,
        XmtDmaAddress = DMA34_DSCPTR_NXT,
      };
    };

    template <>
    struct UartPortSelect<2>
    {
      enum
      {
        Address = 0,
        RcvInterruptID = InterruptID::Uart2Rcv,
        XmtInterruptID = InterruptID::Uart2Xmt,
        StatusInterruptID = InterruptID::Uart2Status,
        RcvDmaAddress = DMA38_DSCPTR_NXT,
        XmtDmaAddress = DMA37_DSCPTR_NXT,
      };
    };

    class UartPort
    {
    public:
      template <int Port>
      UartPort(Int2Type<Port>);

#pragma always_inline
      volatile UartRegList *Reg()
      {
        return regs_;
      }

#pragma always_inline
      volatile DmaRegsList<> *RcvDma()
      {
        return rcvDma_;
      }

#pragma always_inline
      volatile DmaRegsList<> *XmtDma()
      {
        return xmtDma_;
      }

    private:
      volatile UartRegList *const regs_;
      volatile DmaRegsList<> *const rcvDma_;
      volatile DmaRegsList<> *const xmtDma_;
    };
  } // namespace Detail

} // namespace HAL
