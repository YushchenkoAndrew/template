#include "Menu.h"

void cMenu::Load(const std::string& path) {
    std::shared_ptr<json_t> json;
    if (!JSON::parse("Test.json", json)) return;

    Build(json);
}

void cMenu::Build(const std::shared_ptr<json_t>& json) {

}


void cMenu::Draw(olc::PixelGameEngine& GameEngine, float fElapsedTime) {

}
