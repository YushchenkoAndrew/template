// #include "HAL\uart.h"
// #include "HAL\PLL.h"
#include "HAL/uart.h"
#include "HAL/PLL.h"

namespace HAL
{
#define TEMPLATE template <class Handler, typename Tag>
#define CLASS Uart<Handler, Tag>

  TEMPLATE void CLASS::InterruptHandler(XmtInterruptTag)
  {
    volatile DmaRegsList<> *dma = port_.XmtDma();
    volatile UartRegList *reg = port_.Reg();

    ResetTimeout(); // Set xmtTime to the current Time

    // 0x01(IRQDONE) - Check if DMA has detected the completion of a work and has issued an interrupt request
    if (dma->Status & 0x01)
    {
      reg->IntMaskClear = 0x02; // 0x02(ETBEI) - Transmit Buffer Empty Interrupt
      dma->Status = 0x01;       // 0x01(IRQDONE) - Check if DMA has detected the completion of a work and has issued an interrupt request
      reg->Status = 0x07;       // 0x07(PE, OE, DR)

      // FIXME: ?
      // dma->Config = 0;

      while (!IsXmtEmpty())
      {
      }
      if (handler_ != NULL)
        handler_->OnXmt(Tag());
      return;
    }

    if (handler_ != NULL)
      handler_->OnXmtSingle(Tag());
  }

  TEMPLATE void CLASS::InterruptHandler(RcvInterruptTag)
  {
    volatile DmaRegsList<> *dma = port_.RcvDma();
    volatile UartRegList *reg = port_.Reg();

    ResetTimeout(); // Set xmtTime to the current Time

    // 0x01(IRQDONE) - Check if DMA has detected the completion of a work and has issued an interrupt request
    if (dma->Status & 0x01)
    {
      reg->Status = 0x01; // 0x01(IRQDONE) - Check if DMA has detected the completion of a work and has issued an interrupt request

      // FIXME: ?
      // dma->Config = 0;

      if (hander_ != NULL)
        handler_->OnRcv(Tag());
      return;
    }

    if (handler_ != NULL)
      handler_->OnRcvSingle(Tag());
  }

  TEMPLATE void CLASS::InterruptHandler(StatusInterruptTag)
  {
    volatile DmaRegsList<> *dma = port_.RcvDma();
    volatile UartRegList *reg = port_.Reg();

    // 0x1E(BI, FE, PE, OE)
    if (reg->Status & 0x1E)
    {
      // 0x02 - OE
      if (reg->Status & 0x02 && handler_ != NULL)
      {
        reg->Status = 0x1E; // 0x1E(BI, FE, PE, OE)
        sync();

        // 0x200 - RFCS = Receive FIFO Count Status
        while (!IsXmtRun() && !IsRcvRun() && (reg->Status & 0x20000))
        {
          for (int i = 0; (i < 2) && !IsXmtRun() && !IsRcvRun(); i++)
            handler_->OnRcvSingle(Tag());
        }

        return;
      }

      reg->Status = 0x1E; // 0x1E(BI, FE, PE, OE)
      sync();
    }

    // 0x0700 - Select all status (1 - Descriptor Fetch, 2 - Data Transfer, 3 - Waiting for Trigger, 4 - Waiting for Write)
    if (!(dma->Status & 0x0700)) // Check if not running then -> end, else ...
      return;

    unsigned int time = clock() / TimeScale;
    if (time - rcvTime_ > 500) // 0.5 sec
    {
      // FIXME: ?  Cancel data receive
      // dma->Config = 0;

      rcvTime_ = time;
    }
  }

  TEMPLATE void CLASS::InitialRcv()
  {
    // Flush FIFO if OverRun Error
    // 0x02(OE) - Overrun Error
    // FIXME: ?
    // if (port_.Reg()->Status & 0x02) {}

    // 0xx1(ERBFI) - Enable Receive Buffer Full Interrupt
    port_.Reg()->IntMaskSet = 0x0001;
    sync();

    RcvInterrupt_.Enable();
  }

  TEMPLATE void CLASS::Rcv(void *ptr, int size)
  {
    volatile DmaRegsList<> *dma = port_.RcvDma();
    volatile UartRegList reg = port_.Reg();
  }

  TEMPLATE void CLASS::Xmt(void *ptr, int size)
  {
    volatile DmaRegsList<> *dma = port_.XmtDma();
    volatile UartRegList reg = port_.Reg();

    dma->StartAddr = ptr;
    // FIXME: DI_EN ?
    dma->Config = 0x0304; // 0x00(SYNC, MSIZE)

    // TODO:
    // port_.XmtDma()->XCount	= size;
    // port_.XmtDma()->XModify	= 1;

    sync();
    dma->Config = 0x01; // 0x01 - Enable DMA
    sync();
    reg->IntMaskSet = 0x02; // 0x02(ETBEI) - Transmit Buffer Empty Interrupt
    // TODO: Interrupt
  }

  TEMPLATE int CLASS::GetCharTimeout(int millisec)
  {
    clock_t start = clock();

    clock_t end = clock();
    // TODO: FIXME: PLL
    // clock_t DeadTime = PLL::GetCoreFrequency() / 1000;

    while (!IsRcvDataReady() && clock() - start < end)
    {
    }

    return IsRcvDataReady() ? GetChar() : -1;
  }

  TEMPLATE void CLASS::Init(int baud)
  {
    // TODO: FIXME: PLL
    unsigned long div = 0;
    // unsigned long div = PLL::GetSystemFrequency() / baud;
    // div += GetSystemFrequency() % baud > baud / 2 ? 1 : 0;

    // Flags:  EDBO   - Enable Divide By One (Bit clock prescaler = 1)
    port_.Reg()->Clock = div | 0x80000000;

    // Flags:  ERBFI  - Enable Receive Buffer Full Interrupt
    //         ETBEI  - Enable Transmit Buffer Empty Interrupt
    //         ELSI   - Enable Line Status Interrupt Mask
    //         EDSSI  - Disable Modem Status Interrupt
    //         EDTPTI - Disable DMA TX Peripheral Triggered Interrupt
    //         ETFI   - Disable Transmission Finished Interrupt
    //         ERFCI  - Disable Receive FIFO Count Interrupt
    //         EAWI   - Disable Address Word Interrupt
    //         ERXS   - Disable RX to Status Interrupt
    //         ETXS   - Disable TX to Status Interrupt
    port_.Reg()->IntMaskSet = 0x0007;
    port_.Reg()->IntMaskClear = 0x03F8;

    // Flags:  EN      - Enable UART module
    //         LOOP_EN - Disable UART loopback mode
    //         MOD     - UART mode
    //         WLS     - Word Length = 8-bit word
    //         STB     - 1 Stop bit
    //         STBH    - 0 half-bit-time stop bit
    //         PEN     - Disables parity transmission and parity check
    //         EPS     - Set Odd parity
    //         STP     - No forced parity
    //         FPE     - Normal operation
    //         FFE     - Normal operation
    //         SB      - No force
    //         FCPOL   - Set the polarities of the UART_CTS and UART_RTS pins = Active low
    //         RPOLC   - Set IrDA RX Polarity = Active-low
    //         TPOLC   - IrDA TX Polarity = Active-Low
    //         MRTS    - Deassert RTS pin
    //         XOFF    - Transmission ON, if ACTS=0
    //         ARTS    - Disable RX handshaking protocol
    //         ACTS    - Disable TX handshaking protocol
    //         RFIT    - Set RFCS=1 if RX FIFO count >= 4
    //         RFRT    - Deassert RTS if RX FIFO word count > 4; assert if <= 4
    port_.Reg()->Contol = 0x00000301;
    // LCR Reg(Blackfin) confurged in Control Reg(Sharc)

    sync();

    // TODO: Interrupt
  }

  TEMPLATE void CLASS::SetBaudrate(int baud)
  {
    // TODO: FIXME: PLL
    unsigned long div = 0;
    // unsigned long div = PLL : GetSystemFrequency() / baud;
    // div += GetSystemFrequency() % baud > baud / 2 ? 1 : 0;

    // Flags:  EDBO   - Enable Divide By One (Bit clock prescaler = 1)
    port_.Reg()->Clock = div | 0x80000000;
  }

#undef TEMPLATE
#undef CLASS

} // namespace HAL