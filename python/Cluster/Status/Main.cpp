#include <iostream>
#include <wiringPi.h>

struct RGB
{
  int R;
  int G;
  int B;
};

void outputValue(unsigned short pin, int value)
{
  // value = value * 10 / 255;
  if (value != 0)
  {
    digitalWrite(pin, 0);
    delayMicroseconds(value);
    digitalWrite(pin, 1);
    delayMicroseconds(50);
  }
}

const int FREQ = 1000 / 255;

int main()
{
  std::cout << "Start Program" << std::endl;

  const RGB led{5, 4, 1};
  RGB color{0xFF, 0xFF, 0x00};
  std::cout << color.R << " " << color.G << " " << color.B << std::endl;

  wiringPiSetup();
  pinMode(led.R, OUTPUT);
  pinMode(led.G, OUTPUT);
  pinMode(led.B, OUTPUT);

  while (true)
  {
    RGB value{color.R * FREQ, color.G * FREQ, color.B * FREQ};
    // std::cout << value.R << " " << value.G << " " << value.B << std::endl;

    for (int i = 0; i < 1000; i++)
    {
      outputValue(led.R, value.R);
      outputValue(led.G, value.G);
      outputValue(led.B, value.B);
    }
    digitalWrite(led.R, 0);
  }

  return 0;
}
