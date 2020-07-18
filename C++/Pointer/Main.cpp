#include <iostream>

int main()
{

    // Check this one: http://c-faq.com/decl/spiral.anderson.html
    char *const a = "Test";

    std::cout << "a = " << a << std::endl;

    // *a = 'T';

    std::cout << "a = " << a << "\n";

    std::cout << "\n";

    int b = 7;
    std::cout << "Value: \t\t\tb = " << b << "\n";
    std::cout << "Address: \t\tb = " << &b << "\n";
    std::cout << "Value from Address: \tb = " << *&b << "\n";

    std::cout << "\n";

    std::cout << "Convert Type from Int to Double\nc = " << reinterpret_cast<double *>(b) << "\n";

    return 0;
}
