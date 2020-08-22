#pragma once

namespace HAL
{
#define sti() __asm("CPSIE i") // enable interrupts
#define cli() __asm("CPSID i") // disable interrupts

    class CriticalSection
    {
    public:
#pragma always_inline
        inline CriticalSection()
        {
            Lock();
        }

#pragma always_inline
        inline ~CriticalSection()
        {
            UnLock();
        }

#pragma always_inline
        inline void Lock()
        {
            cli();
        }

#pragma always_inline
        inline void UnLock()
        {
            sti();
        }
    };
} // namespace HAL
