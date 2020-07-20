#include <iostream>

int main()
{

    // Check this one: http://c-faq.com/decl/spiral.anderson.html
    char *const a = "Test";

    std::cout << "a = " << a << std::endl;

    // *a = 'T';

    std::cout << "a = " << a << "\n";

    std::cout << "\n";

    long b = 7;
    std::cout << "Value: \t\t\tb = " << b << "\n";
    std::cout << "Address: \t\tb = " << &b << "\n";
    std::cout << "Value from Address: \tb = " << *&b << "\n";

    std::cout << "\n";

    // reinterpret_cast a pointer to and from void* preserves the address.
    //  That is, in the following, a, b and c all point to the same address:

    std::cout << "'reinterpret_cast' - return Address pointing on variable \n";
    std::cout << "\n";

    int *a_ = new int(5);
    void *b_ = reinterpret_cast<void *>(a_);
    int *c_ = reinterpret_cast<int *>(b_);

    // Store in different place in memory
    std::cout << "Address a_ = " << &a_ << "\n";
    std::cout << "Address b_ = " << &b_ << "\n";
    std::cout << "Address c_ = " << &c_ << "\n";

    std::cout << "\n";

    // Pointing on the same variable, return address
    std::cout << "Data a_ = " << a_ << "\n";
    std::cout << "Data b_ = " << b_ << "\n";
    std::cout << "Data c_ = " << c_ << "\n";

    std::cout << "\n";

    std::cout << "Data from Address: a_ = " << *a_ << "\n";
    // std::cout << "Data from Address: b_ = " << *b_ << "\n";     // Variable b_ is void
    std::cout << "Data from Address: c_ = " << *c_ << "\n";

    return 0;
}
