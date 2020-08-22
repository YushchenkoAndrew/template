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

} // namespace HAL