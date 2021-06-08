#pragma once
#include "Menu.h"


class MenuManager {
public:
	void Init(const std::string& path) { cMenu.Load(path); }
	void Open(Menu* pMenu) { Close(); stMenu.push_back(pMenu); isInUse = true; }
	void Close() { stMenu.clear(); }
	void Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, olc::vi2d vOffset, float& fTime);

	bool bChanged(int32_t id) { return prevId != currId && currId == id; }
	bool bHappening(int32_t id) { return currId == id && (currId == prevId || bChanged(id)); }
	bool InUse() { return isInUse; }

	int32_t GetId() { return currId; }

private:
	void OnMove(olc::PixelGameEngine& GameEngine);

private:
	Menu cMenu;
	std::list<Menu*> stMenu;

	int32_t prevId = -1;
	int32_t currId = -1;

	bool isInUse = false;
};
