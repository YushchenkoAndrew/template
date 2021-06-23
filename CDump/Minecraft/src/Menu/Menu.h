#pragma once
#include "lib/olcPixelGameEngine.h"
#include "include/LuaScript.h"
#include "include/Json.h"

#define PATCH_SIZE 8
#define STATE_GROUP(id)	(int32_t)((id) & ~(int32_t)0x0F)
#define STATE_INDEX(id)	(int32_t)((id) & (int32_t)0x0E)
#define STATE_CHANGE_ALL(id) (int32_t)((id) & (int32_t)0x01)

struct sMenuState {
	bool bPressed;
	bool bRealeased;
	bool bHeld;
};

typedef std::map<int32_t, std::map<int32_t, sMenuState>> menustate_t;


class Menu {

public:
	Menu() { sName = "root"; }
	Menu(const std::string& name) { sName = name; }

	void Load(const std::string& path);
	void Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, olc::vi2d& vOffset, float& fElapsedTime);

	void InitStates(menustate_t& mMenuState);

protected:
	void Build(const list_t& list);

public:

	// Setters
	Menu& SetTable(int32_t row, int32_t col) { vTable = { row, col }; return *this; }
	Menu& SetId(int32_t id) { nId = id; return *this; }
	Menu& SetEnable(bool flag) { bEnable = flag; return *this; }
	void SetScale(float scale) { nSpriteScale = scale; }

	// Getters
	std::string& GetName() { return sName; }
	int32_t GetId() { return nId; }
	olc::vi2d GetSize() { return { int32_t(sName.size()), 1 }; }
	olc::vi2d& GetCursor() { return vCursor; }
	float GetScale() { return nSpriteScale; }

	// Additional func
	bool HasItems() { return !items.empty(); }

	void OnMove(olc::vi2d vMove);
	Menu* SelectItem() { return &items[nCursorItem]; }

	Menu* OnConfirm() {
	    if (items[nCursorItem].HasItems()) return &items[nCursorItem];
		return nullptr;
	}


	Menu& operator[] (const std::string& key) {
		if (itemIndex.count(key) == 0) {
			itemIndex[key] = items.size();
			items.push_back(Menu(key));
		}
		return items[itemIndex[key]];
	}

protected:
	std::string sName;
	bool bEnable = true;

	int32_t nId = -1;
	int32_t nRows = 0;
	int32_t nVisibleRow = 0;

	olc::vi2d vTable = { 1, 0 };
	olc::vi2d vItemSize = { 0, 0 };
	olc::vi2d vItemPadding = { 2, 0 };
	olc::vi2d vSizeInPatch = { 0, 0 };
	olc::vi2d vPatch = { PATCH_SIZE, PATCH_SIZE };
	float nSpriteScale = 1.0f;

	int32_t nCursorItem = 0;
	olc::vi2d vCursorPos = { 0, 0 };
	olc::vi2d vCursor = { 0, 0 };

	std::map<std::string, size_t> itemIndex;
	std::vector<Menu> items;
};
