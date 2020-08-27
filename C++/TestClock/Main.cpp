#include "iostream"

int tmp = 10;

void change(int *p)
{
  std::cout << "p = " << p << " p = " << *p << std::endl;
  p = &tmp;
  std::cout << "p = " << p << " p =" << *p << std::endl;
}

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

  int var = 100000;

  int *p = &var;
  std::cout << "p = " << *p << std::endl;
  change(p);
  std::cout << "p = " << *p << std::endl;

  for (int i = 0; i < 2; ++i)
    std::cout << "i = " << i << std::endl;

  int a = 5;
  int b = 10;

  if (a & 0x01 && b & 0x08)
    std::cout << "Yep" << std::endl;

  return 0;
}
