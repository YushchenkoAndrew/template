#define OLC_PGE_APPLICATION
#include "GraphicsEngine.h"
#include "MenuManager.h"

// Check Memory Leaking
//#define MEM_TRACK
//#include "MemTrack.h"


class Minecraft : public olc::PixelGameEngine {
public:
    Minecraft() {
        sAppName = "Minecraft";
    }

    bool OnUserCreate() override {
        cEngine3D.Construct(ScreenHeight(), ScreenWidth());
        mManger.Init("./assets/Menu.json");

        sprMenu = std::make_unique<olc::Sprite>("./assets/Sprite-0001.png");
        decMenu = std::make_unique<olc::Decal>(sprMenu.get());

        return true;
    }

    bool OnUserUpdate(float fElapsedTime) override {
        mManger.Update(*this);
        cEngine3D.Update(*this, mManger, fElapsedTime);


	    Clear(olc::BLACK);
        mManger.Draw(*this, decMenu, { 10, 10 }, fElapsedTime);
        cEngine3D.Draw(*this, mManger);
        return true;
    }

private:
    GraphicsEngine cEngine3D;
    MenuManager mManger;
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
