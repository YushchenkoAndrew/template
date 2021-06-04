#pragma once
#include "olcPixelGameEngine.h"
#include "Json.h"

class cMenu {

public:
	cMenu() { 
		sName = "root";
	}

	void Load(const std::string& path);
	void Draw(olc::PixelGameEngine& GameEngine, float fElapsedTime);

protected:
	void Build(const std::shared_ptr<json_t>& json);

public:

	//// Setters
	cMenu& SetTable(int32_t row, int32_t col) { vCellTable = { row, col }; return *this; }
	cMenu& SetId(int32_t id) { nId = id; return *this; }
	cMenu& SetEnable(bool flag) { bEnable = flag; return *this; }

	// Getters
	//std::string& GetName() { return sName; }
	int32_t& GetId() { return nId; }
	//olc::vi2d GetSize() { return { (int32_t)sName.size(), 1 }; }

	// Additional func
	bool HasItems() { return !items.empty(); }

	cMenu& operator[] (const std::string& key) { return items[key]; }

protected:
	std::string sName;
	bool bEnable = true;

	int32_t nId = -1;
	int32_t nRows = 0;
	int32_t nVisibleRows = 0;

	olc::vi2d vCellTable = { 1, 0 };
	olc::vi2d vCellSize = { 0, 0 };
	olc::vi2d vCellPadding = { 2, 0 };

	std::map<std::string, cMenu> items;
};
