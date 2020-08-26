#include "iostream"

int main()
{

  std::cout << "clock = " << clock() << std::endl;

  clock_t t_ = clock();

  long i = 100000000;
  while (i > 0)
  {
    i--;
  }

  std::cout << "clock = " << clock() - t_ << std::endl;

  return 0;
}
