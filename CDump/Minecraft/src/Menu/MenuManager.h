#pragma once
#include "Menu.h"

namespace eMenuStates {
	enum {
		EDGE_EN = 17,
		EDGE_DIS = 19,
		SHADOW_EN = 33,
		SHADOW_DIS = 35,
		COLOR_EN = 49,
		COLOR_DIS = 51,
		DISTRIBUTE_EN = 65,
		DISTRIBUTE_DIS = 67,
		DRAW_NOISE_YES = 97,
		DRAW_NOISE_NO = 99,
		TRUE_NOISE = 113,
		PERLIN_NOISE = 115,
		FRACTAL_NOISE = 117,
		EXIT = 80
	};
}

class MenuManager {
public:
	MenuManager(): vOffset({ 10, 10 }) {}

	void Init(const std::string& path, LuaScript& luaConfig);
	void Open(Menu* pMenu) { Close(); stMenu.push_back(pMenu); isInUse = true; }
	void Close() { stMenu.clear(); }

	void Update(olc::PixelGameEngine& GameEngine);
	void Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, float& fTime);

	sMenuState& GetState(int32_t nId) { return mMenuState[STATE_GROUP(nId)][STATE_INDEX(nId)]; }
	bool InUse() { return isInUse; }

private:
	void OnMove(olc::PixelGameEngine& GameEngine);
	void OnConfirm();

private:
	Menu cMenu;
	std::list<Menu*> stMenu;
	menustate_t mMenuState;
	const olc::vi2d vOffset;

	int32_t nId = -1;
	bool isInUse = false;
};
