#pragma once
// #include "utils.h"
// #include "Generic\command.h"
// #include "HAL\interrupt.h"
// #include "HAL\i2c_port.h"
#include "HAL/interrupt.h"
#include "HAL/i2c_port.h"

namespace HAL
{

  class I2cTask
  {
  public:
    // FIXME:
    I2cTask();

#pragma always_inline
    inline short GetCount()
    {
      return dataCount_;
    }

#pragma always_inline
    inline bool IsEmptry()
    {
      return dataOffset_ >= dataCount_;
    }

#pragma always_inline
    inline bool IsXmt()
    {
      return isXmt_;
    }

#pragma always_inline
    inline bool IsDone()
    {
      return isDone_;
    }

#pragma always_inline
    inline void Reset()
    {
      dataOffset_ = 0;
      isDone_ = false;
    }

#pragma always_inline
    inline void Wait()
    {
      while (!isDone_)
      {
      }
    }

#pragma always_inline
    inline unsigned char GetAddress()
    {
      return deviceAddress_;
    }

// FIXME:
#pragma always_inline
    inline void Done();

// FIXME:
#pragma always_inline
    inline void Read();

// FIXME:
#pragma always_inline
    inline void Write(unsigned char c);

  private:
    // TODO:
    // CallBackType
    unsigned char *dataPtr_;
    short dataCount_;
    short dataOffset_;
    unsigned char deviceAddress_;
    bool isXmt_;
    volatile bool isDone_;
  };

  // TODO:
  class I2cMaster
  {
  };

} // namespace HAL