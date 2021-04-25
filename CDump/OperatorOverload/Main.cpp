#include <iostream>

#define test() "Testing...";

struct A
{
    virtual void operator()() { std::cout << "A" << std::endl; }
};
struct B : A
{
    virtual void operator()() { std::cout << "B" << std::endl; }
};

int main()
{
    B b;

    //using pointer
    A *ptr = &b;
    (*ptr)(); //clumsy!  - prints B

    //using reference
    A &ref = b;
    ref(); //better    - prints B

    //also correct
    b(); //prints B

    std::cout << test();
    std::cout << std::endl;

    return 0;
}
