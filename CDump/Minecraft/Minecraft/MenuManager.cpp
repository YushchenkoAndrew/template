#include "MenuManager.h"

void MenuManager::OnMove(olc::PixelGameEngine& GameEngine) {
	// Move though menu
	if (GameEngine.GetKey(olc::W).bPressed) stMenu.back()->OnMove({ 0, 1 });
	if (GameEngine.GetKey(olc::S).bPressed) stMenu.back()->OnMove({ 0,-1 });
	if (GameEngine.GetKey(olc::A).bPressed) stMenu.back()->OnMove({ 1, 0 });
	if (GameEngine.GetKey(olc::D).bPressed) stMenu.back()->OnMove({-1, 0 });

	// Functions: Go back and Confirm
	if (GameEngine.GetKey(olc::X).bPressed) stMenu.pop_back();
	if (GameEngine.GetKey(olc::Z).bPressed) {
		// TODO:
		stMenu.back()->OnConfirm();
	}
}

void MenuManager::Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decMenu, olc::vi2d vOffset, float& fTime) {
	if (stMenu.empty()) return;
	OnMove(GameEngine);

	for (auto& item : stMenu) {
		item->Draw(GameEngine, decMenu, vOffset, fTime);
		vOffset += { 10, 10 };
	}
}
