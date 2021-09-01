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
	  if (GetKey(olc::R).bPressed) cFabric.Reset(35, 10);
	  if (GetKey(olc::SPACE).bPressed) bFreeze ^= true;

    olc::vi2d vMouse = { -1, -1 };
    if (GetMouse(0).bHeld) vMouse = GetMousePos();
    // if (GetMouse(1).bHeld)  /

    if (!bFreeze) cFabric.Update(fElapsedTime, vMouse);

    Clear(olc::BLACK);
    cFabric.Draw(*this);
    return true;
  }

private:
  Fabric cFabric;

  bool bFreeze = false;
};

int main() {
  Project demo;
  if (demo.Construct(255, 255, 4, 4)) demo.Start();

  return 0;
}

