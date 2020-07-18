#include <stdio.h>
#include <iostream>
using namespace std;

enum Test
{
    Test0,
    Test1,
    Test2,
    Test3,
    Test4
};

template <int Port>
struct SomeStruct;

const int a = -1;

template <>
struct SomeStruct<'A'>
{
    enum
    {
        value = a
    };
};

template <>
struct SomeStruct<'B'>
{
    enum
    {
        value = -5
    };
};

int main()
{
    SomeStruct<'A'> test;

    cout << "Test - " << Test3 << "\n";

    cout << test.value << "\n";

    cout << SomeStruct<'B'>::value << "\n";

    return 0;
}