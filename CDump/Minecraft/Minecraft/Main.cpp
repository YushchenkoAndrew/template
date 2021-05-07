#define OLC_PGE_APPLICATION
#include "olcPixelGameEngine.h";
#include "GraphicsEngine.h"

class Minecraft : public olc::PixelGameEngine {
public:
    Minecraft() {
        sAppName = "Minecraft";

        cEngine3D.Construct(ScreenHeight(), ScreenWidth());
    }

    bool OnUserCreate() override {
        return true;
    }

    bool OnUserUpdate(float fElapsedTime) override {

        cEngine3D.Draw(*this);

        return true;
    }

private:
    GraphicsEngine cEngine3D;

};

int main()
{
    Minecraft demo;
    if (demo.Construct(200, 200, 4, 4))
        demo.Start();
    return 0;
}
