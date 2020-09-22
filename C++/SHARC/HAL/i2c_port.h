#pragma once
// #include "utils.h"
// #include "HAL\interrupt.h"
// #include "Generic\typelist.h"
#include "HAL/interrupt.h"

namespace HAL
{

#pragma pad(4)
  struct I2cRegList
  {
    unsigned short ClkDiv;
    unsigned short Control;
    unsigned short SlaveCtl;
    unsigned short SlaveStat;
    unsigned short SlaveAddr;
    unsigned short MasterCtl;
    unsigned short MasterStat;
    unsigned short MaterAddr;
    unsigned short IntStat;
    unsigned short IntMask;
    unsigned short FifoCtl;
    unsigned short FifoStat;
    int r[20];
    unsigned short XmtData8;
    unsigned short XmtData16;
    unsigned short RcvData8;
    unsigned short RcvData16;
  };

#pragma pad()

  namespace Detail
  {
    template <int i>
    struct I2cPortSelect;

    template <>
    struct I2cPortSelect<0>
    {
      enum
      {
        Address = TWI0_CLKDIV,
        InterruptID = InterruptID::TWI0,
      };
    };

    template <>
    struct I2cPortSelect<1>
    {
      enum
      {
        Address = TWI1_CLKDIV,
        InterruptID = InterruptID::TWI1,
      };
    };

    template <>
    struct I2cPortSelect<2>
    {
      enum
      {
        Address = TWI2_CLKDIV,
        InterruptID = InterruptID::TWI2,
      };
    };

    class I2cPort
    {
    public:
      template <int port>
      I2cPort(Int2Type<port>) : regs_(reinterpret_cast<I2cRegList *>(I2cPortSelect<port>::Address));

#pragma always_inline
      inline volatile I2cRegList *const Reg()
      {
        return regs_;
      }

    private:
      volatile I2cRegList *const regs_;
    };
  } // namespace Detail

} // namespace HAL