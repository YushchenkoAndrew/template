#pragma once
#include "utils.h"
#include "generic/typelist.h"
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
        unsigned short Lock;
        unsigned short Mux;
        unsigned short Polarity;
        unsigned short PolarityClear;
        unsigned short PolaritySet;
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
        GpioPin(Int2Type<Port>, int mask) : reg_(reinterpret_cast<PinRegList *>(GpioPort<Port>::RegAddres)),
                                            mask_(mask)
        {
        }

    private:
        volatile PinRegList *const reg_;
        const int mask_;
    };

} // namespace HAL
