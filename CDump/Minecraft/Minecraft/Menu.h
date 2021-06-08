#pragma once
#include "olcPixelGameEngine.h"
#include "Json.h"

#define PATCH_SIZE 8


class Menu {

public:
	Menu() { 
		sName = "root";
	}

	Menu(const std::string& name) { 
		sName = name;
	}

	void Load(const std::string& path);
	void Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, olc::vi2d& vOffset, float& fElapsedTime);

protected:
	void Build(const list_t& list);

public:

	// Setters
	Menu& SetTable(int32_t row, int32_t col) { vTable = { row, col }; return *this; }
	Menu& SetId(int32_t id) { nId = id; return *this; }
	Menu& SetEnable(bool flag) { bEnable = flag; return *this; }

	// Getters
	std::string& GetName() { return sName; }
	int32_t GetId() { return nId; }
	olc::vi2d GetSize() { return { int32_t(sName.size()), 1 }; }
	olc::vi2d& GetCursor() { return vCursor; }
	bool IsEnabled() { return bEnable; }

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
	olc::vi2d vItemPadding = { 1, 0 };
	olc::vi2d vSizeInPatch = { 0, 0 };
	olc::vi2d vPatch = { PATCH_SIZE, PATCH_SIZE };

	int32_t nCursorItem = 0;
	olc::vi2d vCursorPos = { 0, 0 };
	olc::vi2d vCursor = { 0, 0 };

	std::map<std::string, size_t> itemIndex;
	std::vector<Menu> items;
};
