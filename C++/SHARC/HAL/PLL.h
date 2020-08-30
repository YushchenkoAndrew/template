#pragma once

struct PLLConfig
{
  /* data */
};

class Pll
{
public:
  static void Init(PLLConfig &cfg);
  static unsigned GetVcoFrequency();
  static unsigned GetCoreFrequency();
  static unsigned GetSystemFrequency();

private:
  static void CalculateVcoSettings(const PLLConfig &cfg, unsigned &msel, unsigned &fvco, bool &df);
  static void CalculateSystemDivider(const PLLConfig &cfg, unsigned fvco, unsigned &ssel);
  static void CalculateVlevValue(const PLLConfig &cfg, unsigned fvco, unsigned &vlev);
  static void Program();

  static unsigned clkIn;
}