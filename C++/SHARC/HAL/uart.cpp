// #include "HAL\uart.h"
// #include "HAL\PLL.h"
#include "HAL/uart.h"
#include "HAL/PLL.h"

namespace HAL
{
#define TEMPLATE template <class Handler, typename Tag>
#define CLASS Uart<Handler, Tag>

  // TODO:
  TEMPLATE void CLASS::InterruptHandler(XmtInterruptTag)
  {
  }

  TEMPLATE void CLASS::InterruptHandler(RcvInterruptTag)
  {
  }

  TEMPLATE void CLASS::InterruptHandler(StatusInterruptTag)
  {
  }

  TEMPLATE void CLASS::Init(int baud)
  {
    // TODO: FIXME: PLL
    unsigned long div = 0;
    // unsigned long div = PLL : GetSystemFrequency() / baud;
    // div += GetSystemFrequency() % baud > baud / 2 ? 1 : 0;

    // Flags:  EDBO   - Enable Divide By One (Bit clock prescaler = 1)
    port_.Reg()->Clock = div | 0x80000000;
    // FIXME: LCR ?

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
    sync();

    // TODO: Interrupt
  }

} // namespace HAL