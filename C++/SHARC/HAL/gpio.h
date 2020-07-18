#pragma once
// #include "utils.h"
// #include "generic/typelist.h"
namespace HAL
{
    // REGS
#pragma pad(4)
    struct PinRegList
    {
        unsigned short Value;
        unsigned short Clear;
        unsigned short Set;
        unsigned short Toggle;
        unsigned short Dir;
        unsigned short DirClear;
        unsigned short DirSet;
        unsigned short Fer;
        unsigned short FerClear;
        unsigned short FerSet;
        unsigned short Inen;
        unsigned short InenClear;
        unsigned short InenSet;
        unsigned long Lock;
        unsigned long Mux;
        unsigned short Pol;
        unsigned short PolClear;
        unsigned short PolSet;
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
            RegAddress = 0
        };
    };

    template <>
    struct GpioPort<'B'>
    {
        enum
        {
            RegAddress = 0
        };
    };

    template <>
    struct GpioPort<'C'>
    {
        enum
        {
            RegAddress = 0
        };
    };

    template <>
    struct GpioPort<'D'>
    {
        enum
        {
            RegAddress = 0
        };
    };

    template <>
    struct GpioPort<'E'>
    {
        enum
        {
            RegAddress = 0
        };
    };

    template <>
    struct GpioPort<'F'>
    {
        enum
        {
            RegAddress = 0
        };
    };

    template <>
    struct GpioPort<'G'>
    {
        enum
        {
            RegAddress = 0
        };
    };

    // GPIO
    class GpioPin
    {
    public:
        template <int Port>
        // GpioPin(Int2Type<Port>, int mask) : reg_(reinterpret_cast<PinRegList *>(GpioPort<Port>::RegAddres)),
        GpioPin(int Port, int mask) : reg_(reinterpret_cast<PinRegList *>(GpioPort<Port>::RegAddres)),
                                      mask_(mask)
        {
        }

        GpioPin(const GpioPin &pin) : reg_(pin.reg_), mask_(pin.mask_)
        {
        }

        void InitOutput()
        {
            reg_->FerClear |= mask_;
            reg_->DirSet = mask_;
        }

        void InitInput()
        {
            reg_->PolClear |= mask_;
            reg_->DirClear = mask_;
            reg_->InenSet |= mask_;
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
