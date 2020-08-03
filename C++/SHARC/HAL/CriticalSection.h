#pragma once

namespace HAL
{
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
        }

#pragma always_inline
        inline void UnLock()
        {
        }

    private:
        unsigned int mask_;
    };
} // namespace HAL
