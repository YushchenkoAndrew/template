#include "Menu.h"

void Menu::Load(const std::string& path) {
    LuaScript luaJson;
    if (!luaJson.Init("src/lua/Json.lua")) return;

    luaJson.CallFunction("ParseJSON", { path }, 1);

    SetEnable(luaJson.GetTableValue<bool>(nullptr, "enable"));
    SetId(luaJson.GetTableValue<int32_t>(nullptr, "id"));

    luaJson.GetTableValue<int32_t>(nullptr, "size");
    SetTable(luaJson.GetArray<int32_t>());
    luaJson.Pop();

    luaJson.GetTableValue<bool>(nullptr, "items");
    Build(luaJson);
    luaJson.Pop();
}

void Menu::Build(LuaScript& luaJson) {
    for (int32_t i = 0u; i < luaJson.Length(); i++) {
        luaJson.GetTableValue<bool>(nullptr, i + 1);

        std::string key = luaJson.GetTableValue<const char*>(nullptr, "name");

        (*this)[key].SetId(luaJson.GetTableValue<int32_t>(nullptr, "id"));
        (*this)[key].SetEnable(luaJson.GetTableValue<bool>(nullptr, "enable"));
        (*this)[key].SetScale(nSpriteScale);

        if (luaJson.IsKeyExist(nullptr, "items")) {
            luaJson.GetTableValue<int32_t>(nullptr, "size");
            (*this)[key].SetTable(luaJson.GetArray<int32_t>());
            luaJson.Pop();

			luaJson.GetTableValue<bool>(nullptr, "items");
			(*this)[key].Build(luaJson);
			luaJson.Pop();
        }

        luaJson.Pop();

        vItemSize.x = (*this)[key].GetSize().x > vItemSize.x ? (*this)[key].GetSize().x : vItemSize.x;
        vItemSize.y = (*this)[key].GetSize().y > vItemSize.y ? (*this)[key].GetSize().y : vItemSize.y;
    }

    vSizeInPatch.x = vTable.x * vItemSize.x + (vTable.x - 1) * vItemPadding.x + 2;
    vSizeInPatch.y = vTable.y * vItemSize.y + (vTable.y - 1) * vItemPadding.y + 2;

    nRows = (items.size() / vTable.x) + (items.size() % vTable.x > 0 ? 1 : 0);
}

void Menu::InitStates(menustate_t& mMenuState) {
    if (nId > 0)
        mMenuState[STATE_GROUP(nId)][STATE_INDEX(nId)] = { false, false, bEnable };

    for (auto& item : items) {
        item.InitStates(mMenuState);
    }
}

void Menu::OnMove(olc::vi2d vMove) {
    vCursorPos += vMove;

    // Correct Cursor Position
    if (vCursorPos.x == vTable.x) vCursorPos.x = vTable.x - 1;
    if (vCursorPos.y == nRows) vCursorPos.y = nRows - 1;
    if (vCursorPos.x < 0) vCursorPos.x = 0;
    if (vCursorPos.y < 0) vCursorPos.y = 0;

    // Move "pages"
    if (vCursorPos.y < nVisibleRow) nVisibleRow -= (nVisibleRow - 1 < 0) ? 0 : 1;
    if (vCursorPos.y > (nVisibleRow + vTable.y - 1)) nVisibleRow += (nVisibleRow + 1 > nRows - vTable.y) ? 0 : 1;

    nCursorItem = vCursorPos.y * vTable.x + vCursorPos.x;

    if (nCursorItem >= int32_t(items.size())) {
        vCursorPos.y = int32_t(items.size() / vTable.x);
        vCursorPos.x = int32_t(items.size() % vTable.x) - 1;
        nCursorItem = int32_t(items.size()) - 1;
    }
}

void Menu::Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, olc::vi2d& vOffset, float& fTime) {
    olc::vi2d vPatchPos = { 0, 0 };

    olc::Pixel::Mode currMode = GameEngine.GetPixelMode();
    GameEngine.SetPixelMode(olc::Pixel::MASK);

    for (vPatchPos.x = 0; vPatchPos.x < vSizeInPatch.x; vPatchPos.x++) {
        for (vPatchPos.y = 0; vPatchPos.y < vSizeInPatch.y; vPatchPos.y++) {
            olc::vi2d vPos = vPatchPos * PATCH_SIZE * (int32_t)nSpriteScale + vOffset;

            olc::vi2d vSource = { 5, 1 };
            if (vPatchPos.x == 0) vSource.x--;
            if (vPatchPos.y == 0) vSource.y--;
            if (vPatchPos.x == vSizeInPatch.x - 1) vSource.x++;
            if (vPatchPos.y == vSizeInPatch.y - 1) vSource.y++;

            GameEngine.DrawPartialDecal(vPos, decMenu.get(), vSource * PATCH_SIZE, vPatch, { nSpriteScale, nSpriteScale });
        }
    }


    olc::vi2d vItem = { 0, 0 };
    int32_t nTopLeftItem = nVisibleRow * vTable.x;
    int32_t nBottomRigh = nTopLeftItem + vTable.y * vTable.x;
    int32_t nVisiable = ((size_t)nBottomRigh < items.size() ? nBottomRigh : items.size()) - nTopLeftItem;

    if (nTopLeftItem > 0) {
        olc::vi2d vSource = { 1, 3 };
        // FIXME: Not the best solution, the easier way just to create asssets and Animated class / script
        //olc::vi2d vAnimated = { 0, (int32_t)((sinf(fTime) - 1.0f) * 1.5f) };
        vPatchPos = { vSizeInPatch.x - 2, 0 };
        olc::vi2d vPos = vPatchPos * PATCH_SIZE * (int32_t)nSpriteScale + vOffset;
        GameEngine.DrawPartialDecal(vPos, decMenu.get(), vSource * PATCH_SIZE, vPatch, { nSpriteScale, nSpriteScale });
    }
    
    if ((nRows - nTopLeftItem) > vTable.y) {
        olc::vi2d vSource = { 0, 3 };
        vPatchPos = { vSizeInPatch.x - 2, vSizeInPatch.y - 1 };
        olc::vi2d vPos = vPatchPos * PATCH_SIZE + vOffset;
        GameEngine.DrawPartialDecal(vPos, decMenu.get(), vSource * PATCH_SIZE, vPatch, { nSpriteScale, nSpriteScale });
    }

    for (int32_t i = 0; i < nVisiable; i++) {
        vItem.x = i % vTable.x;
        vItem.y = i / vTable.x;

        vPatchPos.x = vItem.x * (vItemSize.x + vItemPadding.x) + 1;
        vPatchPos.y = vItem.y * (vItemSize.y + vItemPadding.y) + 1;

        olc::vi2d vPos = vPatchPos * PATCH_SIZE * (int32_t)nSpriteScale + vOffset;
        
        GameEngine.DrawStringDecal(vPos, items[nTopLeftItem + i].sName, olc::WHITE, { nSpriteScale, nSpriteScale });

        if (!items[nTopLeftItem + i].HasItems()) continue;

        olc::vi2d vSource = { 3, 0 };
        vPatchPos.x += vItemSize.x;
        vPos = vPatchPos * PATCH_SIZE * (int32_t)nSpriteScale + vOffset;
        GameEngine.DrawPartialDecal(vPos, decMenu.get(), vSource * PATCH_SIZE, vPatch, { nSpriteScale, nSpriteScale });
    }

    vCursor.x = (vCursorPos.x * (vItemSize.x + vItemPadding.x)) * PATCH_SIZE * (int32_t)nSpriteScale + vOffset.x;
    vCursor.y = ((vCursorPos.y - nVisibleRow) * (vItemSize.y + vItemPadding.y) + 1) * PATCH_SIZE * (int32_t)nSpriteScale + vOffset.y;

    GameEngine.SetPixelMode(currMode);
}
