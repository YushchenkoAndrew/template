#pragma once
#include "Menu.h"

enum class eMenuStates {
	EDGE_EN = 17,
	EDGE_DIS = 19,
	SHADOW_EN = 33,
	SHADOW_DIS = 35,
	COLOR_EN = 49,
	COLOR_DIS = 51,
};

class MenuManager {
public:
	void Init(const std::string& path) { cMenu.Load(path); cMenu.InitStates(mMenuState); }
	void Open(Menu* pMenu) { Close(); stMenu.push_back(pMenu); isInUse = true; }
	void Close() { stMenu.clear(); }
	void Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, olc::vi2d vOffset, float& fTime);

	sMenuState& GetState(int32_t nId) { return mMenuState[STATE_GROUP(nId)][STATE_INDEX(nId)]; }
	bool InUse() { return isInUse; }

private:
	void OnMove(olc::PixelGameEngine& GameEngine);
	void UpdateState();
	void OnConfirm();

private:
	Menu cMenu;
	std::list<Menu*> stMenu;
	menustate_t mMenuState;

	int32_t nId = -1;
	bool isInUse = false;
};
