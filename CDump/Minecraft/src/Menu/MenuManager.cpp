#include "MenuManager.h"

void MenuManager::Init(const std::string& path, LuaScript& luaConfig) {
	cMenu.Init(luaConfig);
	cMenu.Load(path);
	cMenu.InitStates(mMenuState); 

	luaAnimated.Init("src/lua/Animated.lua");
	luaAnimated.CallMethod("Animated", "Init", { luaConfig.GetTableValue<const char*>(nullptr, "sMenuAnimated") });
}

void MenuManager::Update(olc::PixelGameEngine& GameEngine) {
	for (auto& group : mMenuState) {
		for (auto& grItem : group.second) {
			grItem.second.bRealeased = false;
			grItem.second.bPressed = false;
		}
	}

	luaAnimated.ClearStack();
	OnMove(GameEngine);
}

void MenuManager::OnConfirm() {
	Menu* next = stMenu.back()->OnConfirm();

	if (next != nullptr) {
		stMenu.push_back(next);
		return;
	}

	nId = stMenu.back()->SelectItem()->GetId();

	if (STATE_CHANGE_ALL(nId)) {
		for (auto& grItem : mMenuState[STATE_GROUP(nId)]) {
			grItem.second.bRealeased = true;
			grItem.second.bHeld = false;
		}
	}

	mMenuState[STATE_GROUP(nId)][STATE_INDEX(nId)].bPressed = true;
	mMenuState[STATE_GROUP(nId)][STATE_INDEX(nId)].bHeld = true;

	if (nId != -1) stMenu.pop_back();
}


void MenuManager::OnMove(olc::PixelGameEngine& GameEngine) {
	// Functions: Go back and Open Menu
	if (GameEngine.GetKey(olc::X).bPressed) {
		if (stMenu.empty()) Open(&cMenu);
		else stMenu.pop_back();
	}

	if (stMenu.empty()) { isInUse = false; return; }

	// Move though menu
	if (GameEngine.GetKey(olc::W).bPressed) stMenu.back()->OnMove({  0, -1  });
	if (GameEngine.GetKey(olc::S).bPressed) stMenu.back()->OnMove({  0,  1  });
	if (GameEngine.GetKey(olc::A).bPressed) stMenu.back()->OnMove({ -1,  0  });
	if (GameEngine.GetKey(olc::D).bPressed) stMenu.back()->OnMove({  1,  0  });
	if (GameEngine.GetKey(olc::Z).bPressed) OnConfirm();
}

void MenuManager::Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, float& fTime) {
	if (stMenu.empty()) return;
	olc::vi2d vOffset = this->vOffset;

	AnyType<float>::GetValue() = fTime;
	AnyType<int32_t>::GetValue() = 1;
	for (auto& item : stMenu) {
		item->Draw(GameEngine, decMenu, vOffset, luaAnimated);
		vOffset += { 20 * (int32_t)item->GetScale() , 20 * (int32_t)item->GetScale() };

		// Such approach is fine as long as
		// Im not using more then 15 element for one
		// iteration
		AnyType<int32_t>::GetValue() += 0x10;
	}
}
