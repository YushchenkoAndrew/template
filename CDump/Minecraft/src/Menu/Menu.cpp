#include "Menu.h"

void Menu::Init(LuaScript& luaConfig) {
	nSpriteScale = luaConfig.GetTableValue<float>(nullptr, "sMenuSpriteScale");

	luaConfig.GetTableValue<bool>(nullptr, "MenuSprites");
	luaConfig.GetTableValue<bool>(nullptr, "MENU");
	SetSprites(SPRITES::MENU, luaConfig.GetArray<int32_t>());
	luaConfig.Pop();
	luaConfig.Pop();

	//luaConfig.GetTableValue<bool>("MenuSprites", "RIGHT_CURSOR");
	//SetSprites(SPRITES::MENU, luaConfig.GetArray<int32_t>());
	//luaConfig.Pop();

}

void Menu::Load(const std::string& path) {
	LuaScript luaConfig;
	if (!luaConfig.Init("src/lua/Json.lua")) return;
	printf("%s\n", path.c_str());

	luaConfig.CallMethod("JSON", "Parse", { path }, 1);

	// SetEnable(luaJson.GetTableValue<bool>(nullptr, "enable"));
	// SetId(luaJson.GetTableValue<int32_t>(nullptr, "id"));

	printf("%d\n", luaConfig.Length());

	// printf("%s", luaConfig.GetTableValue<const char *>(nullptr, "name"));
	// luaConfig.GetTableValue<bool>(nullptr, "menu");

	// for (int32_t i = 0u; i < luaConfig.Length(); i++) {
	//	 luaConfig.GetTableValue<bool>(nullptr, i + 1);
	// printf("%s\n", luaConfig.GetTableValue<const char*>(nullptr, "name"));

	// AnyType<-2, std::string>::GetValue() = luaConfig.GetTableValue<const char*>(nullptr, "state");
	// printf("state = %s\n", AnyType<-2, std::string>::GetValue().c_str());
	// printf("state_index = %d\n", foreach<OperationsList, AnyType<-2, std::string>>::Operation());

	// luaConfig.Pop();
	// }

	// luaConfig.Pop();

	SetTable({ 1, 2 });
	// luaJson.GetTableValue<int32_t>(nullptr, "size");
	// SetTable(luaJson.GetArray<int32_t>());
	// luaJson.Pop();

	// luaJson.GetTableValue<bool>(nullptr, "items");
	Build(luaConfig, -1);
	// luaJson.Pop();
}


void Menu::Build(LuaScript& luaConfig, int32_t stat) {
	for (int32_t i = 0u; i < luaConfig.Length(); i++) {
		luaConfig.GetTableValue<bool>(nullptr, i + 1);

		std::string key = luaConfig.GetTableValue<const char*>(nullptr, "name");
		(*this)[key].SetScale(nSpriteScale);
		(*this)[key].SetSprites(vSprites);

		if (luaConfig.IsKeyExist(nullptr, "state")) {
		    AnyType<-2, std::string>::GetValue() = luaConfig.GetTableValue<const char*>(nullptr, "state");
			foreach<OperationsList, AnyType<-2, std::string>>::Operation();

            // [edge] -> [sub_task]
		}


		// if (luaConfig.IsKeyExist(nullptr, "items")) {
		//	 luaConfig.GetTableValue<int32_t>(nullptr, "size");
		//	 (*this)[key].SetTable(luaConfig.GetArray<int32_t>());
		//	 luaConfig.Pop();

		// 	luaConfig.GetTableValue<bool>(nullptr, "items");
		// 	(*this)[key].Build(luaConfig);
		// 	luaConfig.Pop();
		// }
		// else {
		//	 (*this)[key].SetId(luaConfig.GetTableValue<int32_t>(nullptr, "id"));
		//	 (*this)[key].SetEnable(luaConfig.GetTableValue<bool>(nullptr, "enable"));
		// }

		vItemSize.x = (*this)[key].GetSize().x > vItemSize.x ? (*this)[key].GetSize().x : vItemSize.x;
		vItemSize.y = (*this)[key].GetSize().y > vItemSize.y ? (*this)[key].GetSize().y : vItemSize.y;

		luaConfig.Pop();
	}

	vSizeInPatch.x = vTable.x * vItemSize.x + (vTable.x - 1) * vItemPadding.x + 2;
	vSizeInPatch.y = vTable.y * vItemSize.y + (vTable.y - 1) * vItemPadding.y + 2;

	nRows = (items.size() / vTable.x) + (items.size() % vTable.x > 0 ? 1 : 0);
}

// void Menu::Build(LuaScript& luaJson) {
	// for (int32_t i = 0u; i < luaJson.Length(); i++) {
	//	 luaJson.GetTableValue<bool>(nullptr, i + 1);

	//	 std::string key = luaJson.GetTableValue<const char*>(nullptr, "name");
	//	 (*this)[key].SetScale(nSpriteScale);
	//	 (*this)[key].SetSprites(vSprites);

	//	 if (luaJson.IsKeyExist(nullptr, "items")) {
	//		 luaJson.GetTableValue<int32_t>(nullptr, "size");
	//		 (*this)[key].SetTable(luaJson.GetArray<int32_t>());
	//		 luaJson.Pop();

	// 		luaJson.GetTableValue<bool>(nullptr, "items");
	// 		(*this)[key].Build(luaJson);
	// 		luaJson.Pop();
	//	 }
	//	 else {
	//		 (*this)[key].SetId(luaJson.GetTableValue<int32_t>(nullptr, "id"));
	//		 (*this)[key].SetEnable(luaJson.GetTableValue<bool>(nullptr, "enable"));
	//	 }

	//	 luaJson.Pop();

	//	 vItemSize.x = (*this)[key].GetSize().x > vItemSize.x ? (*this)[key].GetSize().x : vItemSize.x;
	//	 vItemSize.y = (*this)[key].GetSize().y > vItemSize.y ? (*this)[key].GetSize().y : vItemSize.y;
	// }

	// vSizeInPatch.x = vTable.x * vItemSize.x + (vTable.x - 1) * vItemPadding.x + 2;
	// vSizeInPatch.y = vTable.y * vItemSize.y + (vTable.y - 1) * vItemPadding.y + 2;

	// nRows = (items.size() / vTable.x) + (items.size() % vTable.x > 0 ? 1 : 0);
// }

void Menu::InitStates(menustate_t& mMenuState) {
	if (nId > 0) mMenuState[STATE_GROUP(nId)][STATE_INDEX(nId)] = { false, false, bEnable };

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

void Menu::Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, olc::vi2d& vOffset, LuaScript& luaAnimated) {
	// olc::vi2d vPatchPos = { 0, 0 };

	// vCursor.x = (int32_t)((vCursorPos.x * (vItemSize.x + vItemPadding.x)) * PATCH_SIZE * nSpriteScale) + vOffset.x;
	// vCursor.y = (int32_t)(((vCursorPos.y - nVisibleRow) * (vItemSize.y + vItemPadding.y) + 1) * PATCH_SIZE * nSpriteScale) + vOffset.y;

	// olc::Pixel::Mode currMode = GameEngine.GetPixelMode();
	// GameEngine.SetPixelMode(olc::Pixel::MASK);

	// for (vPatchPos.x = 0; vPatchPos.x < vSizeInPatch.x; vPatchPos.x++) {
	//	 for (vPatchPos.y = 0; vPatchPos.y < vSizeInPatch.y; vPatchPos.y++) {
	//		 olc::vi2d vPos = vPatchPos * PATCH_SIZE * (int32_t)nSpriteScale + vOffset;

	//		 olc::vi2d vSource = vSprites[SPRITES::MENU];
	//		 if (vPatchPos.x == 0) vSource.x--;
	//		 if (vPatchPos.y == 0) vSource.y--;
	//		 if (vPatchPos.x == vSizeInPatch.x - 1) vSource.x++;
	//		 if (vPatchPos.y == vSizeInPatch.y - 1) vSource.y++;

	//		 GameEngine.DrawPartialDecal(vPos, decMenu.get(), vSource * PATCH_SIZE, vPatch, { nSpriteScale, nSpriteScale });
	//	 }
	// }


	// olc::vi2d vItem = { 0, 0 };
	// int32_t nTopLeftItem = nVisibleRow * vTable.x;
	// int32_t nBottomRigh = nTopLeftItem + vTable.y * vTable.x;
	// int32_t nVisiable = ((size_t)nBottomRigh < items.size() ? nBottomRigh : items.size()) - nTopLeftItem;

	// if (nTopLeftItem > 0) {
	//	 AnyType<const char*>::GetValue() = "UpCursor";
	//	 luaAnimated.CallMethod("Animated", "GetFrame", TypeList<AnyType<float>, TypeList<AnyType<const char*>, TypeList<AnyType<int32_t>, NullType>>>(), 1);

	//	 luaAnimated.GetTableValue<bool>(nullptr, "offset");
	//	 vSource = luaAnimated.GetArray<float>();
	//	 luaAnimated.Pop();

	//	 luaAnimated.GetTableValue<bool>(nullptr, "size");
	//	 vSize = luaAnimated.GetArray<float>();
	//	 luaAnimated.Pop();

	//	 luaAnimated.GetTableValue<bool>(nullptr, "scale");
	//	 vScale = luaAnimated.GetArray<float>();
	//	 luaAnimated.Pop();



	//	 vPatchPos = { vSizeInPatch.x - 2, 0 };
	//	 olc::vi2d vPos = vPatchPos * PATCH_SIZE * (int32_t)nSpriteScale + vOffset;
	//	 GameEngine.DrawPartialDecal(vPos, decMenu.get(), { vSource[0], vSource[1] }, { vSize[0], vSize[1] }, { vScale[0] * nSpriteScale, vScale[1] * nSpriteScale });
	// }
	
	// if ((nRows - nTopLeftItem) > vTable.y) {
	//	 AnyType<const char*>::GetValue() = "DownCursor";
	//	 luaAnimated.CallMethod("Animated", "GetFrame", TypeList<AnyType<float>, TypeList<AnyType<const char*>, TypeList<AnyType<int32_t>, NullType>>>(), 1);

	//	 luaAnimated.GetTableValue<bool>(nullptr, "offset");
	//	 vSource = luaAnimated.GetArray<float>();
	//	 luaAnimated.Pop();

	//	 luaAnimated.GetTableValue<bool>(nullptr, "size");
	//	 vSize = luaAnimated.GetArray<float>();
	//	 luaAnimated.Pop();

	//	 luaAnimated.GetTableValue<bool>(nullptr, "scale");
	//	 vScale = luaAnimated.GetArray<float>();
	//	 luaAnimated.Pop();


	//	 vPatchPos = { vSizeInPatch.x - 2, vSizeInPatch.y - 1 };
	//	 olc::vi2d vPos = vPatchPos * PATCH_SIZE + vOffset;
	//	 GameEngine.DrawPartialDecal(vPos, decMenu.get(), { vSource[0], vSource[1] }, { vSize[0], vSize[1] }, { vScale[0] * nSpriteScale, vScale[1] * nSpriteScale });
	// }


	// AnyType<const char*>::GetValue() = "Cursor";
	// luaAnimated.CallMethod("Animated", "GetFrame", TypeList<AnyType<float>, TypeList<AnyType<const char*>, TypeList<AnyType<int32_t>, NullType>>>(), 1);

	// luaAnimated.GetTableValue<bool>(nullptr, "offset");
	// vSource = luaAnimated.GetArray<float>();
	// luaAnimated.Pop();

	// luaAnimated.GetTableValue<bool>(nullptr, "size");
	// vSize = luaAnimated.GetArray<float>();
	// luaAnimated.Pop();

	// luaAnimated.GetTableValue<bool>(nullptr, "scale");
	// vScale = luaAnimated.GetArray<float>();
	// luaAnimated.Pop();

	// GameEngine.DrawPartialDecal(vCursor, decMenu.get(), { vSource[0], vSource[1] }, { vSize[0], vSize[1] }, { vScale[0] * nSpriteScale, vScale[1] * nSpriteScale });



	// for (int32_t i = 0; i < nVisiable; i++) {
	//	 vItem.x = i % vTable.x;
	//	 vItem.y = i / vTable.x;

	//	 vPatchPos.x = vItem.x * (vItemSize.x + vItemPadding.x) + 1;
	//	 vPatchPos.y = vItem.y * (vItemSize.y + vItemPadding.y) + 1;

	//	 olc::vi2d vPos = vPatchPos * PATCH_SIZE * (int32_t)nSpriteScale + vOffset;
		
	//	 GameEngine.DrawStringDecal(vPos, items[nTopLeftItem + i].sName, olc::Pixel(251, 245, 239), { nSpriteScale, nSpriteScale });

	//	 if (!items[nTopLeftItem + i].HasItems()) continue;

	//	 AnyType<const char*>::GetValue() = "RightCursor";
	//	 luaAnimated.CallMethod("Animated", "GetFrame", TypeList<AnyType<float>, TypeList<AnyType<const char*>, TypeList<AnyType<int32_t>, NullType>>>(), 1);

	//	 luaAnimated.GetTableValue<bool>(nullptr, "offset");
	//	 vSource = luaAnimated.GetArray<float>();
	//	 luaAnimated.Pop();

	//	 luaAnimated.GetTableValue<bool>(nullptr, "size");
	//	 vSize = luaAnimated.GetArray<float>();
	//	 luaAnimated.Pop();

	//	 luaAnimated.GetTableValue<bool>(nullptr, "scale");
	//	 vScale = luaAnimated.GetArray<float>();
	//	 luaAnimated.Pop();

	//	 vPatchPos.x += vItemSize.x;
	//	 vPos = vPatchPos * PATCH_SIZE * (int32_t)nSpriteScale + vOffset;
	//	 GameEngine.DrawPartialDecal(vPos, decMenu.get(), { vSource[0], vSource[1] }, { vSize[0], vSize[1] }, { vScale[0] * nSpriteScale, vScale[1] * nSpriteScale });

	// 	AnyType<int32_t>::GetValue()++;
	// }

	// GameEngine.SetPixelMode(currMode);
}
