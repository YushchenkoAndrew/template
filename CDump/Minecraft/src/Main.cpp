#include "Engine/GraphicsEngine.h"
#include "Menu/MenuManager.h"
#include "Minecraft.h"
#include "include/LuaScript.h"

// Check Memory Leaking
//#define MEM_TRACK
//#include "include/MemTrack.h"


class Game : public olc::PixelGameEngine {
public:
    Game(LuaScript& config): luaConfig(config) {
        sAppName = "Minecraft";
    }

    bool OnUserCreate() override {
        mManager.Init(luaConfig.GetValue<std::string>("sMenuConfig"), luaConfig.GetValue<float>("sMenuSpriteScale"));
        mMinecraft.Init(ScreenHeight(), ScreenWidth(), luaConfig);


        sprMenu = std::make_unique<olc::Sprite>(luaConfig.GetValue<std::string>("sMenuSprite"));
        decMenu = std::make_unique<olc::Decal>(sprMenu.get());
        return true;
    }

    bool OnUserUpdate(float fElapsedTime) override {
        mManager.Update(*this);
        mMinecraft.Update(*this, mManager, fElapsedTime);


	    Clear(olc::BLACK);
        mManager.Draw(*this, decMenu, fElapsedTime);
        mMinecraft.Draw(*this, mManager);
        return !mManager.GetState(eMenuStates::EXIT).bPressed;
    }

private:
    Minecraft mMinecraft;
    MenuManager mManager;
    LuaScript& luaConfig;

    std::unique_ptr<olc::Sprite> sprMenu;
    std::unique_ptr<olc::Decal> decMenu;
};

int main()
{
    LuaScript luaConfig;
    if (!luaConfig.Init("src/lua/Config.lua")) return 0;

    int32_t nPixel = luaConfig.GetValue<int32_t>("nPixel");

    Game demo(luaConfig);
    if (demo.Construct(luaConfig.GetValue<int32_t>("nScreenWidth"), luaConfig.GetValue<int32_t>("nScreenHeight"), nPixel, nPixel)) 
        demo.Start();
    
    return 0;
}
