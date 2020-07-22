#include <iostream>

template <unsigned short mask, int _mux, int bit>
struct MuxPeriferial
{
    enum
    {
        Result = (((mask & (1 << bit)) ? (_mux << (bit * 2)) : 0) |
                  MuxPeriferial<mask, _mux, (bit + 1)>::Result)
    };
};

// This struct end recursion
template <unsigned short mask, int _mux>
struct MuxPeriferial<mask, _mux, 16>
{
    enum
    {
        Result = 0
    };
};

int main()
{
    int test = MuxPeriferial<0x0002, 3, 0>::Result;

    int a = MuxPeriferial<0x001, 1, 16>::Result;

    std::cout << "Test = " << test << "\n";
    std::cout << "a  = " << a << "\n";

    return 0;
}