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

    // class SpiTask : public boost::intrusive::slist_base_hook<boost::hook_check::link_mode>
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

        // Firstly Func -- ReadOnly/ReadWrite should be called, in which size is setted
#pragma always_inline
        template <typename T>
        inline void Rcv(T value)
        {
            task_[rcvTask_].Rcv<T>(value, rcvOffset_); // Set data dipends on type size
            rcvOffset_ += sizeof(T);
            if (rcvOffset_ >= task_[rcvTask_].Size())
            {
                rcvOffset_ = 0;
                rcvTask_++;
            }
        }

#pragma always_inline
        template <typename T>
        inline T Xmt()
        {
            T value = task_[xmtTask_].Xmt<T>(xmtOffset_); // Get data dipends on type size
            xmtOffset_ += sizeof(T);
            if (xmtOffset_ >= task_[xmtTask_].Size())
            {
                xmtOffset_ = 0;
                xmtTask_++;
            }
        }

        inline void Reset()
        {
            isDone_ = false;
            rcvTask_ = 0;
            xmtTask_ = 0;
            rcvOffset_ = 0;
            xmtOffset_ = 0;
        }

        inline void ForceRcvDone()
        {
            rcvTask_ = taskCount_; // Ignore type size
        }

        inline bool IsPendding()
        {
            return xmtTask_ < taskCount_; // Check if command complitted
        }

        inline void Done()
        {
            isDone_ = true;
            if (callBack_ != NULL)
                callBack_->operator()(); // Overload
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

    template <int Port>
    class SpiMater
    {
    public:
        typedef boost::intrusive::slist<SpiTask, boost::intrusive::constant_time_size<false>,
                                        boost::intrusive::cache_last<true>, boost::intrusive::linear<true>>
            TaskList;

        typedef SpiTask TaskType;
        typedef TaskType::CallBackType CallBackType;
        typedef Int2Type<0> XmtInterruptTag;
        typedef Int2Type<1> RcvInterruptTag;
        typedef Int2Type<2> StatusInterruptTag;
        typedef SpiMater<Port> ThisType;

        template <class Pins>
        SpiMater(Type2Type<Pins>) : rcvInterrupt_(Detail::SpiPortSelect<Port>::RcvInterruptID),
                                    xmtInterrupt_(Detail::SpiPortSelect<Port>::XmtInterruptID),
                                    statusInterrupt_(Detail::SpiPortSelect<Port>::StatusInterruptId)
        {
            // MPL::foreach<Pins, Detail::PortInitPins>::Process();                // Detail::PortInitPins  -- ?

            InterruptSource<Detail::SpiPortSelect<Port>::XmtInterruptID,
                            XmtInterruptTag, ThisType>::SetHandler(this);
            InterruptSource<Detail::SpiPortSelect<Port>::RcvInterruptID,
                            RcvInterruptTag, ThisType>::SetHandler(this);
            InterruptSource<Detail::SpiPortSelect<Port>::StatusInterruptId,
                            StatusInterruptTag, ThisType>::SetHandler(this);
        }

        ~SpiMater() {}

        void Init(int freq, int bits = 8);

        void EnableSlave(int slv);
        void DisableSlave(int slv);

        void InterruptHandler(XmtInterruptTag);
        void InterruptHandler(RcvInterruptTag);
        void InterruptHandler(StatusInterruptTag);

        void PushTask(TaskType &task);
        void PushTaskList();

        void Kill();
        bool IsInProgress()
        {
            return !taskList.empty();
        }
        void Wait()
        {
            while (IsInProgress())
            {
            }
        }

        void Stop();
        void RunNext(TaskType &task);
        void SelectSlave(int slv);
        void DeselectSlave(int slv);

    private:
        const Detail::SpiPort<Port> port_;
        const InterruptControl rcvInterrupt_;
        const InterruptControl xmtInterrupt_;
        const InterruptControl statusInterrupt_;
        TaskList taskList_;
        int bits_;
    };
} // namespace HAL
