#include <stdio.h>
#include <iostream>
using namespace std;

template <int ArrayLength, typename SomeTypeName>
class SomeClass
{
    SomeTypeName someValue;
    SomeTypeName array[ArrayLength];

public:
    SomeClass();
    void setValue(SomeTypeName value);
    // show();
};

template <typename T>
struct SomeStruct
{
    T value;
    int num;
};

int main()
{
    SomeClass<10, int> test;
    test.setValue(15);

    SomeStruct<double> testStruct = {1.5, 10};

    printf("Done!\n");

    cout << testStruct.num << " " << testStruct.value << "\n";

    return 0;
}

// Constructor
template <int ArrayLength, typename SomeTypeName>
SomeClass<ArrayLength, SomeTypeName>::SomeClass()
{
    printf("Create Class\n");
}

template <int ArrayLength, typename SomeTypeName>
void SomeClass<ArrayLength, SomeTypeName>::setValue(SomeTypeName value)
{
    someValue = value;

    cout << "someValue = " << someValue << "\n";
}