#include "EdgeDetection.h"
#include "Menu/MenuManager.h"

// TODO: Add new element to Menu which will represent a value
// TODO: which can be changed manualy (with keys 'h', 'l') or ('A', 'D')

class Project : public olc::PixelGameEngine {
public:
  Project(LuaScript& config): luaConfig(config) {
    sAppName = "EdgeDetection";
  }

  bool OnUserCreate() override {
    sprImage = std::make_unique<olc::Sprite>(luaConfig.GetTableValue<std::string>(nullptr, "sImage"));
    decImage = std::make_unique<olc::Decal>(sprImage.get());

    sprMenu = std::make_unique<olc::Sprite>(luaConfig.GetTableValue<std::string>(nullptr, "sMenuSprite"));
    decMenu = std::make_unique<olc::Decal>(sprMenu.get());

    mManager.Init(luaConfig.GetTableValue<std::string>(nullptr, "sMenuConfig"), luaConfig);

    cEdgeDetection.Init(sprImage);
    cEdgeDetection.Grayscale();
    cEdgeDetection.GaussFilter(5, 1.5f);
    cEdgeDetection.IntensityGradient();
    cEdgeDetection.NonMaximumSuppression();
    cEdgeDetection.DoubleThreshold(0.09f, 0.01f);
    cEdgeDetection.EdgeTrack(3);

    return true;
  } 

  bool OnUserUpdate(float fElapsedTime) override {
	  mManager.Update(*this);

    Clear(olc::BLACK);
    cEdgeDetection.Draw(*this);
    DrawDecal(olc::vf2d(0.0f, 0.0f), decImage.get());
    mManager.Draw(*this, decMenu, fElapsedTime);

    return !mManager.GetState(eMenuStates::EXIT).bPressed; 
  }

private:
  LuaScript& luaConfig;

  MenuManager mManager;
  EdgeDetection cEdgeDetection;

  std::unique_ptr<olc::Sprite> sprMenu;
  std::unique_ptr<olc::Decal> decMenu;

  std::unique_ptr<olc::Sprite> sprImage;
  std::unique_ptr<olc::Decal> decImage;
};

int main() {
  LuaScript luaConfig;
  if (!luaConfig.Init("src/lua/Json.lua")) return 0;
  luaConfig.CallMethod("JSON", "Parse", { "assets/Config.json" }, 1);

  int32_t nPixel = luaConfig.GetTableValue<int32_t>(nullptr, "nPixel");

  Project demo(luaConfig);
  if (demo.Construct(luaConfig.GetTableValue<int32_t>(nullptr, "nScreenWidth"), luaConfig.GetTableValue<int32_t>(nullptr, "nScreenHeight"), nPixel, nPixel))
    demo.Start();

  return 0;
}

