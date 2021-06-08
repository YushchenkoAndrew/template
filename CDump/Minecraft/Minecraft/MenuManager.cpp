#include "MenuManager.h"

void MenuManager::OnMove(olc::PixelGameEngine& GameEngine) {
	// Update id
	prevId = currId;

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

	if (GameEngine.GetKey(olc::Z).bPressed) {
		// FIXME: 
		Menu* next = stMenu.back()->OnConfirm();
		if (next != nullptr) {
			if (next->IsEnabled()) stMenu.push_back(next);
		}
		else currId = stMenu.back()->SelectItem()->GetId();
	}
}

void MenuManager::Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, olc::vi2d vOffset, float& fTime) {
	OnMove(GameEngine);
	if (stMenu.empty()) return;

	for (auto& item : stMenu) {
		item->Draw(GameEngine, decMenu, vOffset, fTime);
		vOffset += { 10, 10 };
	}

    olc::Pixel::Mode currMode = GameEngine.GetPixelMode();
    GameEngine.SetPixelMode(olc::Pixel::MASK);
	GameEngine.DrawPartialDecal(stMenu.back()->GetCursor(), decMenu.get(), olc::vi2d(2, 3) * PATCH_SIZE, {PATCH_SIZE, PATCH_SIZE});
    GameEngine.SetPixelMode(currMode);
}
