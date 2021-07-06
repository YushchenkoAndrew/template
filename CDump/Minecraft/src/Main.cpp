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
        mManager.Init(luaConfig.GetTableValue<std::string>(nullptr, "sMenuConfig"), luaConfig);
        mMinecraft.Init(ScreenHeight(), ScreenWidth(), luaConfig);


        sprMenu = std::make_unique<olc::Sprite>(luaConfig.GetTableValue<std::string>(nullptr, "sMenuSprite"));
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
    if (!luaConfig.Init("src/lua/Json.lua")) return 0;
    luaConfig.CallMethod("JSON", "Parse", { "assets/Config.json" }, 1);

    int32_t nPixel = luaConfig.GetTableValue<int32_t>(nullptr, "nPixel");

    Game demo(luaConfig);
    if (demo.Construct(luaConfig.GetTableValue<int32_t>(nullptr, "nScreenWidth"), luaConfig.GetTableValue<int32_t>(nullptr, "nScreenHeight"), nPixel, nPixel)) 
        demo.Start();
    
    return 0;
}
