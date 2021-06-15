#include "Engine/GraphicsEngine.h"
#include "Menu/MenuManager.h"
#include "Minecraft.h"

// Check Memory Leaking
//#define MEM_TRACK
//#include "include/MemTrack.h"


class Game : public olc::PixelGameEngine {
public:
    Game() {
        sAppName = "Minecraft";
    }

    bool OnUserCreate() override {
        mManager.Init("./assets/Menu.json");
        mMinecraft.Init(ScreenHeight(), ScreenWidth());


        sprMenu = std::make_unique<olc::Sprite>("./assets/Sprite-0001.png");
        decMenu = std::make_unique<olc::Decal>(sprMenu.get());
        return true;
    }

    bool OnUserUpdate(float fElapsedTime) override {
        mManager.Update(*this);
        mMinecraft.Update(*this, mManager, fElapsedTime);


	    Clear(olc::BLACK);
        mManager.Draw(*this, decMenu, { 10, 10 }, fElapsedTime);
        mMinecraft.Draw(*this, mManager);
        return !mManager.GetState(101).bPressed;
    }

private:
    Minecraft mMinecraft;
    MenuManager mManager;

    std::unique_ptr<olc::Sprite> sprMenu;
    std::unique_ptr<olc::Decal> decMenu;
};

int main()
{
    Game demo;
    if (demo.Construct(250, 250, 4, 4))
        demo.Start();
    
    return 0;
}
