#define OLC_PGE_APPLICATION
#include "GraphicsEngine.h"
#include "Menu.h"

class Minecraft : public olc::PixelGameEngine {
public:
    Minecraft() {
        sAppName = "Minecraft";
    }

    bool OnUserCreate() override {
        cEngine3D.Construct(ScreenHeight(), ScreenWidth());


        sprMenu = std::make_unique<olc::Sprite>("./assets/Sprite-0001.png");
        decMenu = std::make_unique<olc::Decal>(sprMenu.get());

        return true;
    }

    bool OnUserUpdate(float fElapsedTime) override {
        cEngine3D.Draw(*this, fElapsedTime);

        SetPixelMode(olc::Pixel::MASK);
        olc::vi2d mouse = GetMousePos();
        DrawDecal(mouse, decMenu.get());
        SetPixelMode(olc::Pixel::NORMAL);

        return true;
    }

private:
    GraphicsEngine cEngine3D;
    std::unique_ptr<olc::Sprite> sprMenu;
    std::unique_ptr<olc::Decal> decMenu;

};

int main()
{
    Minecraft demo;
    if (demo.Construct(250, 250, 4, 4))
        demo.Start();
    
    return 0;
}
