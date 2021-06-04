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
	void Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, float fElapsedTime, olc::vi2d& vOffset);

protected:
	void Build(const list_t& list);

public:

	//// Setters
	Menu& SetTable(int32_t row, int32_t col) { vTable = { row, col }; return *this; }
	Menu& SetId(int32_t id) { nId = id; return *this; }
	Menu& SetEnable(bool flag) { bEnable = flag; return *this; }

	// Getters
	std::string& GetName() { return sName; }
	int32_t& GetId() { return nId; }
	olc::vi2d GetSize() { return { int32_t(sName.size()), 1 }; }

	// Additional func
	bool HasItems() { return !items.empty(); }

	Menu& operator[] (const std::string& key) { return items[key]; }

protected:
	std::string sName;
	bool bEnable = true;

	int32_t nId = -1;
	int32_t nRows = 0;
	int32_t nVisibleRow = 0;

	olc::vi2d vTable = { 1, 0 };
	olc::vi2d vCellSize = { 0, 0 };
	olc::vi2d vCellPadding = { 2, 0 };
	olc::vi2d vSizeInPatch = { 0, 0 };
	olc::vi2d vPatch = { PATCH_SIZE, PATCH_SIZE };

	std::map<std::string, Menu> items;
};
