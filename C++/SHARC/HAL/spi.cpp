#include "HAL/spi.h"

namespace HAL
{
#define MTMPLT template <int Port>
#define MCLASS SpiMaster<Port>

    MTMPLT void MCLASS::PushTask(TaskType &task)
    {
        CriticalSection cs;

        bool inProgress = IsInProgress();
        taskList_.push_back(task);
        cs.Unclock();

        if (!inProgress)
            RunNext(task);
    }

    // ?????
    MTMPLT void MCLASS::InterruptHandler(XmtInterruptTag)
    {
        TaskType &task = taskList_.front();
        volatile SpiRegList *reg = port_.Reg();
        bool run = task.IsPending();

        if (run)
            reg->XmtFIFO = task.Xmt<unsigned char>();
        sync();

        if (!run)
        {
            Stop();
            taskList_.pop_front();
            task.Done();
            if (!taskList_.empty())
                RunNext(taskList_.front());
        }
    }

    // ?????
    MTMPLT void MCLASS::InterruptHandler(RcvInterruptTag)
    {
        TaskType &task = taskList_.front();
        volatile SpiRegList *reg = port_.Reg();
        bool run = task.IsPending();

        if (!run)
            Stop();

        unsigned char word = reg->RcvFIFO;
        task.Rcv<unsigned char>(word);

        if (!run)
        {
            taskList_.pop_front();
            task.Done();
            if (!taskList_.empty())
                RunNext(taskList_.front());
        }
    }

    MTMPLT void MCLASS::RunNext(TaskType &task)
    {
        volatile SpiRegList<Port> *reg = port_.Reg();

        reg->SlaveSelect |= 0xFF00; // Set default value

        task.Reset();
        // TODO: Interrupt

        sync();
        reg->Control |= 1;

        sync();
        SelectSlave(task.GetSlave());
        reg->XmtFIFO = task.Xmt<unsigned char>();
        sync();
    }

    MTMPLT void MCLASS::Stop()
    {
        volatile SpiRegList<Port> *reg = port_.Reg();
        reg->Control &= ~1; // Disable SPI
        sync();

        reg->SlaveSelect |= 0xFF00; // Set default value
        sync();

        // Set Flags into Error state:
        //   ROR (Receive Overrun Indication), TUR (Transmit Underrun Indication)
        //   TC (Transmit Collision Indication), MF (Mode Fault Indication)
        reg->Status = 0x000000F0;
        sync();
        // TODO: interrupt
    }

    MTMPLT void MCLASS::EnableSlave(int slv)
    {
        port_.Reg()->SlaveSelect |= (1 << slv);
    }

    MTMPLT void MCLASS::DisableSlave(int slv)
    {
        port_.Reg()->SlaveSelect &= ~(1 << slv);
    }

    MTMPLT void MCLASS::SelectSlave(int slv)
    {
        port_.Reg()->SlaveSelect |= (1 << (slv + 8));
    }

    MTMPLT void MCLASS::DeselectSlave(int slv)
    {
        port_.Reg()->SlaveSelect &= ~(1 << (slv + 8));
    }

    MTMPLT void MCLASS::Kill()
    {
        taskList_.clear();

        // Set Flags into Error state:
        //   ROR (Receive Overrun Indication), TUR (Transmit Underrun Indication)
        //   TC (Transmit Collision Indication), MF (Mode Fault Indication)
        reg->Status = 0x000000F0;
    }

    MTMPLT void MCLASS::Init(int freq, int bits = 8)
    {
        bits_ = bits;

        volatile SpiRegList<Port> *reg = port_.Reg();

        // Flags:  REN  - SPI receive channel operation
        //         RTI  - Receive Transfer Initiate Enable
        //         RWCEN- Receive Word Counter Enable Disable
        //         RDR  - Receive Data Request Disable
        //         RDO  - Discard incoming data if SPI_RFIFO is full
        //         RRWM - Receive FIFO Regular Watermark Empty RFIFO
        //         RUWM - Receive FIFO Urgent Watermark Disable
        reg->RcvControl = 0x00005;

        // Flags:  TEN  - Transmit Enable
        //         TTI  - Transmit Transfer Initiate Enable
        //         TWCEN- Transmit Word Counter Disable
        //         TDR  - Transmit Data Request Disable
        //         TDU  - Send zeros when SPI_TFIFO is empty
        //         TRWM - FIFO Regular Watermark Full TFIFO
        //         TUWM - FIFO Urgent Watermark Disable
        reg->XmtControl = 0x00105;

        // Flags:  EN - Disable SPI module
        //         MSTR - Mater
        //         PSSE - Disable
        //         ODM  - push-pull output
        //         CPHA - SPI CLK toggles from start
        //         CPOL - Active-low SPI CLK
        //         ASSEL- Software slave select control
        //         SELST- Assert slave select (low)
        //         EMISO- enable MISO
        //         SIZE - word size dipends on bits
        //         LSBF - MSB first
        //         FCEN - Flow Control Disable
        //         FCCH - Flow control on RX buffer
        //         FCPL - Active-low RDY
        //         FCWM - TFIFO empty or RFIFO full
        //         FMODE- Fast-Mode Disable
        reg->Control = 0x000001B2 | ((bits > 8 ? 1 : 0) << (bits == 16 ? 9 : 10));

        unsigned short baud = 0;
        // TODO: PLL
        // int baud = Pll::GetSystemFrequency() / (2 * freq) + 1;
        baud = clamp(baud, 2, 65535);
        reg->Clock = baud;

        // Flags:
        //   ROR (Receive Overrun Indication), TUR (Transmit Underrun Indication)
        //   TC (Transmit Collision Indication), MF (Mode Fault Indication)
        reg->Status = 0x000000F0;
        // TODO: interrupt
    };

} // namespace HAL