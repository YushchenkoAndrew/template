#include <iostream>

namespace test
{
    class Tester
    {
    public:
        Tester(int a, double b) : a_(a), b_(b)
        {
            printf("a = %d\nb = %.3f\n", a_, b_);
        }

    private:
        int a_;
        double b_;
    };
} // namespace test

int main()
{

    test::Tester test(10, 0.5);

    return 0;
}