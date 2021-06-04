#include "Menu.h"

void Menu::Load(const std::string& path) {
    std::shared_ptr<json_t> json;
    if (!JSON::parse(path, json)) return;

    auto size = json.get()->at("size").GetValue<list_t>();
    SetTable(*size->at(0).GetValue<int32_t>(), *size->at(1).GetValue<int32_t>());
    SetEnable(*json.get()->at("enable").GetValue<bool>());
    Build(*json.get()->at("items").GetValue<list_t>());
}

void Menu::Build(const list_t& list) {
    for (auto& obj : list) {
        auto json = obj.GetValue<json_t>();
        std::string key = *json->at("name").GetValue<std::string>();
        items[key].sName = key;

        items[key].SetEnable(*json->at("enable").GetValue<bool>());
        items[key].SetId(*json->at("id").GetValue<int32_t>());

        if (json->find("items") != json->end()) {
            auto size = json->at("size").GetValue<list_t>();
            items[key].SetTable(*size->at(0).GetValue<int32_t>(), *size->at(1).GetValue<int32_t>());
            items[key].Build(*json->at("items").GetValue<list_t>());
        }

        vCellSize.x = items[key].GetSize().x > vCellSize.x ? items[key].GetSize().x : vCellSize.x;
        vCellSize.y = items[key].GetSize().y > vCellSize.y ? items[key].GetSize().y : vCellSize.y;
    }

    vSizeInPatch.x = vTable.x * vCellSize.x + (vTable.x - 1) * vCellPadding.x + 2;
    vSizeInPatch.y = vTable.y * vCellSize.y + (vTable.y - 1) * vCellPadding.y + 2;

    nRows = (items.size() / vTable.x) + (items.size() % vTable.x > 0 ? 1 : 0);
}


void Menu::Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, float fElapsedTime, olc::vi2d& vOffset) {
    olc::vi2d vPatchPos = { 0, 0 };

    GameEngine.SetPixelMode(olc::Pixel::MASK);

    for (vPatchPos.x = 0; vPatchPos.x < vSizeInPatch.x; vPatchPos.x++) {
        for (vPatchPos.y = 0; vPatchPos.y < vSizeInPatch.y; vPatchPos.y++) {
            olc::vi2d vPos = vPatchPos * PATCH_SIZE + vOffset;

            olc::vi2d vSource = { 5, 1 };
            if (vPatchPos.x == 0) vSource.x--;
            if (vPatchPos.y == 0) vSource.y--;
            if (vPatchPos.x == vSizeInPatch.x - 1) vSource.x++;
            if (vPatchPos.y == vSizeInPatch.y - 1) vSource.y++;

            GameEngine.DrawPartialDecal(vPos, decMenu.get(), vSource * PATCH_SIZE, vPatch);
        }
    }


    olc::vi2d vCell = { 0, 0 };
    int32_t nTopLeftItem = nVisibleRow * vTable.x;
    int32_t nBottomRigh = nTopLeftItem + vTable.y * vTable.x;
    int32_t nVisiable = (nBottomRigh < items.size() ? nBottomRigh : items.size()) - nTopLeftItem;

    for (auto& item : items) {
  //for (int32_t i = 0; i < nVisiable; i++) {
        //vCell.x = i % vTable.x;
        //vCell.y = i / vTable.y;
        vPatchPos.x = vCell.x * (vCellSize.x + vCellPadding.x) + 1;
        vPatchPos.y = vCell.y * (vCellSize.y + vCellPadding.y) + 1;
        vCell.y++;

        olc::vi2d vPos = vPatchPos * PATCH_SIZE + vOffset;
        
        GameEngine.DrawStringDecal(vPos, item.first);
    }
    GameEngine.SetPixelMode(olc::Pixel::NORMAL);
}
