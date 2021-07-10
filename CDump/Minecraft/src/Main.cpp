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
        mMinecraft.Init(ScreenHeight(), ScreenWidth(), luaConfig);


        return true;
    }

    bool OnUserUpdate(float fElapsedTime) override {
        mMinecraft.Update(*this, fElapsedTime);


	    Clear(olc::BLACK);
        mMinecraft.Draw(*this, fElapsedTime);
        return mMinecraft.IsFinished();
    }

private:
    Minecraft mMinecraft;
    LuaScript& luaConfig;
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
