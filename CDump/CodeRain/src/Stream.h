#pragma once
#include "../lib/olcPixelGameEngine.h"

class Char {
public:

private:

};


class Stream {
public:
    void Init() {
        vChars.assign(rand() % 20 + 5, {});
    }

    void Update(float fElapseTime);
    void Draw(olc::PixelGameEngine& GameEngine);
    
private:
    std::vector<Char> vChars;
};
