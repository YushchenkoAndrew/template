#include <iostream>
#include <bitset>

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

template <int T>
struct Int2Type
{
#pragma always_inline
    inline Int2Type()
    {
        std::cout << "Done"
                  << "\n";
    }
#pragma always_inline
    inline Int2Type(int)
    {
        std::cout << "Yep - Int2Type"
                  << "\n";
    } //solve some compiler bug
};

template <int i>
void TypeTesting(Int2Type<i>)
{
    std::cout << "Int2Type  --  " << i << "\n";
}

void WithoutType(int i)
{
    std::cout << "Without Type  -- " << i << "\n";
}

int main()
{
    int test = MuxPeriferial<0x0002, 1, 0>::Result;

    int a = MuxPeriferial<0x001, 1, 16>::Result;

    std::cout << "Test = " << test << "\n";
    std::cout << "a  = " << a << "\n";

    int null = NULL;

    std::cout << "Test NULL = " << null << "\n";

    std::cout << "Size of int = " << sizeof(int) << "\n";

    std::cout << "~1 = " << std::bitset<32>(~1) << "\n";

    // int b = 5;

    TypeTesting<5>(0);
    WithoutType(5);

    unsigned char aa = 'a';
    char bb = aa;

    std::cout << "a = " << aa << std::endl
              << "b = " << bb << std::endl;

    return 0;
}