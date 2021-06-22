#include "MenuManager.h"

void MenuManager::Update(olc::PixelGameEngine& GameEngine) {
	for (auto& group : mMenuState) {
		for (auto& grItem : group.second) {
			grItem.second.bRealeased = false;
			grItem.second.bPressed = false;
		}
	}

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

	for (auto& item : stMenu) {
		item->Draw(GameEngine, decMenu, vOffset, fTime);
		vOffset += { 20 * (int32_t)item->GetScale() , 20 * (int32_t)item->GetScale() };
	}

    olc::Pixel::Mode currMode = GameEngine.GetPixelMode();
    GameEngine.SetPixelMode(olc::Pixel::MASK);
	GameEngine.DrawPartialDecal(stMenu.back()->GetCursor(), decMenu.get(), olc::vi2d(2, 3) * PATCH_SIZE, { PATCH_SIZE, PATCH_SIZE }, { stMenu.back()->GetScale(), stMenu.back()->GetScale() });
    GameEngine.SetPixelMode(currMode);
}
