#include "CodeRain.h"

class Project : public olc::PixelGameEngine {
public:
    Project() {
        sAppName = "CodeRain";
    }

    bool OnUserCreate() override {
        cCodeRain.Init(ScreenWidth(), ScreenHeight(), 6);

        sprFont = std::make_unique<olc::Sprite>("assets/Hitachi-HD44780U.png");
        decFont = std::make_unique<olc::Decal>(sprFont.get());

        return true;
    }

    bool OnUserUpdate(float fElapseTime) override {
	    Clear(olc::BLACK);
        cCodeRain.Draw(*this, fElapseTime, decFont);
        return true; 
    }

private:
    CodeRain cCodeRain;

    std::unique_ptr<olc::Sprite> sprFont;
    std::unique_ptr<olc::Decal> decFont;
};

int main() {
    Project demo;
    if (demo.Construct(200, 200, 2, 2)) demo.Start();

    return 0;
}

