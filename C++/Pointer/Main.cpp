#include <iostream>

int main()
{

    // Check this one: http://c-faq.com/decl/spiral.anderson.html
    char *const a = "Test";

    std::cout << "a = " << a << std::endl;

    *a = 'T';

    std::cout << "a = " << a << "\n";

    return 0;
}
