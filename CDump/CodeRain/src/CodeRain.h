#pragma once
#include "Stream.h"

class CodeRain {
public:
    void Init(int32_t nWidth, int32_t nHeight, uint8_t nFontSize = 16) {
        vStrems.assign(nWidth / (int32_t)nFontSize, {});
        for (int32_t i = 0; i < int32_t(vStrems.size()); i++) {
            vStrems[i].Init(i, nHeight, nFontSize);
        }
    }

    void Draw(olc::PixelGameEngine& GameEngine, float fElapseTime, std::unique_ptr<olc::Decal>& decFont) {
        for (auto& stream : vStrems) {
            stream.Draw(GameEngine, fElapseTime, decFont);
        }
    }

private:
    std::vector<Stream> vStrems;
};
