#pragma once
#include "../lib/olcPixelGameEngine.h"

#define GREEN olc::Pixel(100, 255, 20)
// #define DARK_GREEN olc::Pixel(64, 158, 13)
#define WHITE olc::Pixel(250, 255, 220)
class Char {
public:
    void Init(const olc::vf2d& vPos, uint8_t nStep, int32_t nHeight, uint8_t nFontSize) {
        fScale = (float)nFontSize / 8.0f;
        this->vPos = vPos;
        this->nStep = nStep;
        this->nHeight = nHeight;

        chCurr = '0';
        pColor = GREEN;
    }

    inline void SetColor(const olc::Pixel& col) { pColor = col; }

    void Update(float fElapseTime) {
        vPrevPos = vPos;
        vPos.y = vPos.y > nHeight ? 0.0f : vPos.y + (float)nStep * fElapseTime;

        if ((int32_t)vPrevPos.y != (int32_t)vPos.y && rand() % 20 > 17) chCurr = (char)('0' + rand() % 9);
    }

    void Draw(olc::PixelGameEngine& GameEngine) {
        GameEngine.DrawStringDecal(vPos, { 1, chCurr }, pColor, { fScale, fScale });
    }

private:
    uint8_t nStep;
    int32_t nHeight;
    float fScale;

    char chCurr;

    olc::Pixel pColor;

    olc::vf2d vPos;
    olc::vf2d vPrevPos;
};


class Stream {
public:
    void Init(int32_t nColumn, int32_t nScreenHeight, uint8_t nFontSize) {
        this->nColumn = nColumn;
        vChars.assign((int32_t)(rand() % (nScreenHeight / nFontSize - 5) / 1.3f) + 5, {});

        int32_t nStart = rand() % 1000;
        uint8_t nStep = (uint8_t)(rand() % 50) + 40;

        for (int32_t i = 0; i < int32_t(vChars.size()); i++) {
            vChars[i].Init(
                { nColumn * nFontSize * 1.3f, (float)(-i * nFontSize - nStart) },
                nStep,
                nScreenHeight,
                nFontSize
            );
        }

        if (rand() % 10 > 7) vChars.front().SetColor(WHITE);
    }

    void Draw(olc::PixelGameEngine& GameEngine, float fElapseTime) {
        for (auto& cChar : vChars) {
            cChar.Update(fElapseTime);
            cChar.Draw(GameEngine);
        }
    }
    
private:
    int32_t nColumn;

    std::vector<Char> vChars;
};
