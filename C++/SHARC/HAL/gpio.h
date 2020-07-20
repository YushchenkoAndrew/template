#pragma once
#include "utils.h"
#include "generic/typelist.h"
namespace HAL
{
    // REGS
#pragma pad(4)
    struct PinRegList
    {
        unsigned short Fer;
        unsigned short FerSet;
        unsigned short FerClear;
        unsigned short Value;
        unsigned short Set;
        unsigned short Clear;
        unsigned short Dir;
        unsigned short DirSet;
        unsigned short DirClear;
        unsigned short Inen;
        unsigned short InenSet;
        unsigned short InenClear;
        unsigned long Mux;
        unsigned short Toggle;
        unsigned short Pol;
        unsigned short PolSet;
        unsigned short PolClear;
        unsigned long Lock;
    };

#pragma pad()

    // PORTS
    template <int PORT>
    struct GpioPort;

    template <>
    struct GpioPort<'A'>
    {
        enum
        {
            RegAddress = PORTA_FER
        };
    };

    template <>
    struct GpioPort<'B'>
    {
        enum
        {
            RegAddress = PORTB_FER
        };
    };

    template <>
    struct GpioPort<'C'>
    {
        enum
        {
            RegAddress = PORTC_FER
        };
    };

    template <>
    struct GpioPort<'D'>
    {
        enum
        {
            RegAddress = PORTD_FER
        };
    };

    template <>
    struct GpioPort<'E'>
    {
        enum
        {
            RegAddress = PORTE_FER
        };
    };

    template <>
    struct GpioPort<'F'>
    {
        enum
        {
            RegAddress = PORTF_FER
        };
    };

    template <>
    struct GpioPort<'G'>
    {
        enum
        {
            RegAddress = PORTG_FER
        };
    };

    // Periferal Pin Init
    template <char Port, int PinMask, int Mux = 0>
    struct PeriferalPin
    {
        static inline void InitPeripheral()
        {
            volatile PinRegList *reg = reinterpret_cast<PinRegList *>(GpioPin<Port>::RegAddress);
            reg->FerSet = PinMask;
        }
    };

    // GPIO
    class GpioPin
    {
    public:
        template <int Port>
        GpioPin(Int2Type<Port>, int mask) : reg_(reinterpret_cast<PinRegList *>(GpioPort<Port>::RegAddres)),
                                            mask_(mask)
        {
        }

        GpioPin(const GpioPin &pin) : reg_(pin.reg_), mask_(pin.mask_)
        {
        }

        void InitOutput()
        {
            reg_->FerClear = mask_;
            reg_->DirSet = mask_;
        }

        void InitInput()
        {
            reg_->PolClear = mask_;
            reg_->DirClear = mask_;
            reg_->InenSet = mask_;
        }

        void Set() { reg_->Set = mask_; }
        void Clear() { reg_->Clear = mask_; }
        void Toggle() { reg_->Toggle = mask_; }

        int Get() { return reg_->Value & mask_; }
        int GetRaw() { return reg_->Value; }
        int GetMask() { return mask_; }
        volatile PinRegList *Reg() { return reg_; }

    private:
        volatile PinRegList *const reg_;
        const int mask_;
    };

} // namespace HAL
