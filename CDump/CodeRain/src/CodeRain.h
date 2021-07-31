#pragma once
#include "Stream.h"

class CodeRain {
public:
    CodeRain() : fontSize(16) {}

    void Init(int32_t nWidth, int32_t nHeight, int32_t nFontSize = NULL) {
        fontSize = nFontSize ? nFontSize : fontSize;

        for (int32_t i = 0; i < nWidth / fontSize; i++) {
            Stream cStream;
            cStream.Init();

            vStrems.push_back(cStream);
        }
    }

    void Draw(olc::PixelGameEngine& GameEngine, float fElapseTime) {
        for (auto& stream : vStrems) {
            stream.Update(fElapseTime);
            stream.Draw(GameEngine);
        }
    }

private:
    int32_t fontSize;
    std::vector<Stream> vStrems;

    int32_t nScreenWidth;
    int32_t nScreenHeight;
};
