#pragma once
#include "Menu.h"

class MenuManager {
public:
	MenuManager(): vOffset({ 10, 10 }) {}

	void Init(const std::string& path, LuaScript& luaConfig);
	void Open(Menu* pMenu) { Close(); stMenu.push_back(pMenu); isInUse = true; }
	void Close() { stMenu.clear(); }

	void Update(olc::PixelGameEngine& GameEngine);
	void Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, const float& fTime);

	// sMenuState& GetState() { return mMenuState[STATE_GROUP(nId)][STATE_INDEX(nId)]; }

 	template<class T>
	sMenuState& GetState() { return AnyListType<T, sMenuState>::GetValue(); }
	bool InUse() { return isInUse; }

private:
	void OnMove(olc::PixelGameEngine& GameEngine);
	void OnConfirm();

private:
	Menu cMenu;
	LuaScript luaAnimated;
	std::list<Menu*> stMenu;
	// menustate_t mMenuState;
	const olc::vi2d vOffset;

	int32_t nId = -1;
	bool isInUse = false;
};
