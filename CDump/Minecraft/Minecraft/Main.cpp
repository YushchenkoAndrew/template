#define OLC_PGE_APPLICATION
#include "GraphicsEngine.h"

class Minecraft : public olc::PixelGameEngine {
public:
    Minecraft() {
        sAppName = "Minecraft";
    }

    bool OnUserCreate() override {
        cEngine3D.Construct(ScreenHeight(), ScreenWidth());

        return true;
    }

    bool OnUserUpdate(float fElapsedTime) override {

        cEngine3D.Draw(*this, fElapsedTime);

        return true;
    }

private:
    GraphicsEngine cEngine3D;

};

int main()
{
    Minecraft demo;
    if (demo.Construct(250, 250, 4, 4))
        demo.Start();
    return 0;
}
