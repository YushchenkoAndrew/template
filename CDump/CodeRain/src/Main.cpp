#include "CodeRain.h"

class Project : public olc::PixelGameEngine {
public:
    Project() {
        sAppName = "CodeRain";
    }

    bool OnUserCreate() override {
        return true;
    }

    bool OnUserUpdate(float fElapseTime) override {
	    Clear(olc::BLACK);
        cCodeRain.Draw(*this, fElapseTime);
        return true; 
    }

private:
    CodeRain cCodeRain;
};

int main() {
    Project demo;
    if (demo.Construct(255, 255, 4, 4)) demo.Start();

    return 0;
}

