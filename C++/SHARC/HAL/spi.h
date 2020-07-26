#pragma once
// #include "utils.h"
// #include "Generic\command.h"
// #include "HAL\spi_port.h"
#include "HAL/spi_port.h"

namespace HAL
{
    class SpiCommand
    {
    public:
        SpiCommand() : rcvBuffer_(NULL), xmtBuffer_(NULL), dataCount_(0)
        {
        }

        inline void WriteOnly(char *xmt, int size)
        {
            rcvBuffer_ = NULL;
            xmtBuffer_ = xmt;
            dataCount_ = size;
        }

        inline void ReadOnly(char *rcv, int size)
        {
            rcvBuffer_ = rcv;
            xmtBuffer_ = NULL;
            dataCount_ = size;
        }

        inline void ReadWrite(char *xmt, char *rcv, int size)
        {
            rcvBuffer_ = rcv;
            xmtBuffer_ = xmt;
            dataCount_ = size;
        }

        template <typename T>
        inline void Rcv(T value, int offset)
        {
            if (rcvBuffer_ != NULL)
            {
                *reinterpret_cast<T *>(rcvBuffer_ + offset) = value;
            }
        }

        template <typename T>
        inline void Xmt(int offset)
        {
            T value = 0;
            if (xmtBuffer_ != NULL)
            {
                value = *reinterpret_cast<T *>(xmtBuffer_ + offset);
            }
            return value;
        }

        inline int Size()
        {
            return dataCount_;
        }

    private:
        char *rcvBuffer_;
        char *xmtBuffer_;
        int dataCount_;
    };

    class SpiTask
    {
    public:
        typedef MPL::Command<void, NullType> CallBackType;

        enum
        {
            MaxTask = 2
        };

        SpiTask(int Slave, CallBackType *c = NULL) : slaveSelect_(Slave),
                                                     callBack_(c),
                                                     taskCount_(0),
                                                     rcvTask_(0),
                                                     xmtTask_(0),
                                                     rcvOffset_(0),
                                                     xmtOffset_(0),
                                                     isDone_(true)
        {
        }

        inline void Clear()
        {
            taskCount_ = 0;
        }

        inline void WriteOnly(char *xmt, int size)
        {
            task_[taskCount_++].WriteOnly(xmt, size);
        }

        inline void ReadOnly(char *rcv, int size)
        {
            task_[taskCount_++].ReadOnly(rcv, size);
        }

        inline void ReadWrite(char *xmt, char *rcv, int size)
        {
            task_[taskCount_++].ReadWrite(xmt, rcv, size);
        }

#pragma always_inline
        template <typename T>
        inline void Rcv(T value)
        {
        }

#pragma always_inline
        template <typename T>
        inline T Xmt()
        {
        }

        inline void Reset()
        {
            isDone_ = false;
            rcvTask_ = 0;
            xmtTask_ = 0;
            rcvOffset_ = 0;
            xmtOffset_ = 0;
        }

        inline void Wait()
        {
            while (!isDone_)
            {
            }
        }

        inline char GetSlave()
        {
            return slaveSelect_;
        }

    private:
        SpiCommand task_[MaxTask];
        CallBackType callBack_;
        int rcvOffset_;
        int xmtOffset_;
        char slaveSelect_;
        char taskCount_;
        char rcvTask_;
        char xmtTask_;
        volatile bool isDone_;
    };

    class SpiMater
    {
    };

} // namespace HAL
