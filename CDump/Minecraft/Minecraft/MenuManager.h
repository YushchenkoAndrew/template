#pragma once
#include "Menu.h"


class MenuManager {
public:
	void Open(Menu* pMenu) { Close(); stMenu.push_back(pMenu); }
	void Close() { stMenu.clear(); }
	void Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, olc::vi2d vOffset, float& fTime);

private:
	void OnMove(olc::PixelGameEngine& GameEngine);

private:
	std::list<Menu*> stMenu;
};
