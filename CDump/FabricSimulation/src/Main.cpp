#include "Fabric.h"

class Project : public olc::PixelGameEngine {
public:
  Project() {
    sAppName = "Fabric Simulation";
  }

  bool OnUserCreate() override {
    cFabric.Init(ScreenWidth(), ScreenHeight(), 35, 10);
    return true;
  }

  bool OnUserUpdate(float fElapsedTime) override {
    cFabric.Update(fElapsedTime);

    Clear(olc::BLACK);
    cFabric.Draw(*this);
    return true;
  }

private:
  Fabric cFabric;

};

int main() {
  Project demo;
  if (demo.Construct(255, 255, 4, 4)) demo.Start();

  return 0;
}

