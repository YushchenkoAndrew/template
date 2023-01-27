#include "MenuManager.h"

void MenuManager::Init(const std::string& path, LuaScript& luaConfig) {
  AnyType<OP_DRAW_EDGE, std::string>::GetValue() = "OP_DRAW_EDGE";
  AnyType<OP_DRAW_SHADOW, std::string>::GetValue() = "OP_DRAW_SHADOW";
  AnyType<OP_DRAW_COLOR, std::string>::GetValue() = "OP_DRAW_COLOR";
  AnyType<OP_DRAW_DISTRIBUTION, std::string>::GetValue() = "OP_DRAW_DISTRIBUTION";
  AnyType<OP_DRAW_NOISE, std::string>::GetValue() = "OP_DRAW_NOISE";
  AnyType<OP_DRAW_COLLISION, std::string>::GetValue() = "OP_DRAW_COLLISION";
  AnyType<OP_DRAW_OUTLINE, std::string>::GetValue() = "OP_DRAW_OUTLINE";
  AnyType<OP_FOLLOW_CAMERA, std::string>::GetValue() = "OP_FOLLOW_CAMERA";
  AnyType<OP_EXIT, std::string>::GetValue() = "OP_EXIT";

  AnyType<SUB_OP_YES, std::string>::GetValue() = "SUB_OP_YES";
  AnyType<SUB_OP_NO, std::string>::GetValue() = "SUB_OP_NO";
  AnyType<SUB_OP_TRUE_NOISE, std::string>::GetValue() = "SUB_OP_TRUE_NOISE";
  AnyType<SUB_OP_PERLIN_NOISE, std::string>::GetValue() = "SUB_OP_PERLIN_NOISE";
  AnyType<SUB_OP_FRACTAL_NOISE, std::string>::GetValue() = "SUB_OP_FRACTAL_NOISE";

	printf("YES\n");
	cMenu.Init(luaConfig);
	printf("P\n");
	cMenu.Load(path);
	// cMenu.InitStates(mMenuState); 


	luaAnimated.Init("src/lua/Animated.lua");
	luaAnimated.CallMethod("Animated", "Init", { luaConfig.GetTableValue<const char*>(nullptr, "sMenuAnimated") });
}

void MenuManager::Update(olc::PixelGameEngine& GameEngine) {
	// for (auto& group : mMenuState) {
	// 	for (auto& grItem : group.second) {
	// 		grItem.second.bRealeased = false;
	// 		grItem.second.bPressed = false;
	// 	}
	// }

	// luaAnimated.ClearStack();
	// OnMove(GameEngine);
}

void MenuManager::OnConfirm() {
	// Menu* next = stMenu.back()->OnConfirm();

	// if (next != nullptr) {
	// 	stMenu.push_back(next);
	// 	return;
	// }

	// nId = stMenu.back()->SelectItem()->GetId();

	// if (STATE_CHANGE_ALL(nId)) {
	// 	for (auto& grItem : mMenuState[STATE_GROUP(nId)]) {
	// 		grItem.second.bRealeased = true;
	// 		grItem.second.bHeld = false;
	// 	}
	// }

	// mMenuState[STATE_GROUP(nId)][STATE_INDEX(nId)].bPressed = true;
	// mMenuState[STATE_GROUP(nId)][STATE_INDEX(nId)].bHeld = true;

	// if (nId != -1) stMenu.pop_back();
}


void MenuManager::OnMove(olc::PixelGameEngine& GameEngine) {
	// Functions: Go back and Open Menu
	if (GameEngine.GetKey(olc::X).bPressed || GameEngine.GetKey(olc::ESCAPE).bPressed) {
		if (stMenu.empty()) Open(&cMenu);
		else stMenu.pop_back();
	}

	if (stMenu.empty()) { isInUse = false; return; }

	// Move though menu
	if (GameEngine.GetKey(olc::K).bPressed) stMenu.back()->OnMove({  0, -1  });
	if (GameEngine.GetKey(olc::J).bPressed) stMenu.back()->OnMove({  0,  1  });
	if (GameEngine.GetKey(olc::H).bPressed) stMenu.back()->OnMove({ -1,  0  });
	if (GameEngine.GetKey(olc::L).bPressed) stMenu.back()->OnMove({  1,  0  });
	if (GameEngine.GetKey(olc::ENTER).bPressed) OnConfirm();
}

void MenuManager::Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, const float& fTime) {
	// if (stMenu.empty()) return;
	// olc::vi2d vOffset = this->vOffset;

	// AnyType<float>::GetValue() = fTime;
	// AnyType<int32_t>::GetValue() = 1;
	// for (auto& item : stMenu) {
	// 	item->Draw(GameEngine, decMenu, vOffset, luaAnimated);
	// 	vOffset += { 20 * (int32_t)item->GetScale() , 20 * (int32_t)item->GetScale() };

	// 	// Such approach is fine as long as
	// 	// Im not using more then 15 element for one
	// 	// iteration
	// 	AnyType<int32_t>::GetValue() += 0x10;
	// }
}
