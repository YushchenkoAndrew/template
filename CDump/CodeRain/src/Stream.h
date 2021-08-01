#pragma once
#include "../lib/olcPixelGameEngine.h"

#define GREEN(alpha) olc::Pixel(100, 255, 20, alpha)
#define WHITE olc::Pixel(250, 255, 220)
#define PATCH_SIZE 8

class Char {
public:
    void Init(const olc::vf2d& vPos, uint8_t nStep, int32_t nHeight, uint8_t nFontSize) {
        fScale = (float)nFontSize / 8.0f;
        this->vPos = vPos;
        this->nStep = nStep;
        this->nHeight = nHeight;
    }

    inline void SetColor(const olc::Pixel& col) { pColor = col; }
    inline olc::vf2d GetPos() { return vPos; }

    void Update(float fElapseTime) {
        float prev = vPos.y;
        vPos.y = vPos.y > nHeight ? 0.0f : vPos.y + (float)nStep * fElapseTime;

        if ((int32_t)prev != (int32_t)vPos.y && rand() % 20 > 17) {
            decPos = { rand() % 26 + 1, rand() % 6 + 2 };
        }
    }

    void Draw(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decFont) {
        GameEngine.DrawPartialDecal(vPos, decFont.get(), decPos * PATCH_SIZE, { PATCH_SIZE, PATCH_SIZE }, { fScale, fScale }, pColor);
    }

    // void LightEffect(olc::PixelGameEngine& GameEngine, std::unique_ptr<olc::Decal>& decFont) {
    //     olc::Pixel col = pColor;
    //     for (int32_t i = 0; i < 5; i++) {
    //         col.a = (col.a / 6) * (5 - i);
    //         GameEngine.DrawPartialDecal(
    //             vPos - olc::vf2d(0.0f, (float)i),
    //             decFont.get(),
    //             decPos * PATCH_SIZE,
    //             { PATCH_SIZE, PATCH_SIZE },
    //             { fScale, fScale },
    //             col
    //         );
    //     }
    // }

private:
    uint8_t nStep;
    int32_t nHeight;
    float fScale;

    olc::Pixel pColor = GREEN(255);

    olc::vf2d vPos;
    olc::vi2d decPos;
};


class Stream {
public:
    void Init(int32_t nColumn, int32_t nHeight, uint8_t nFontSize) {
        this->nColumn = nColumn;
        vChars.assign((int32_t)(rand() % (nHeight / nFontSize) / 2.6f) + 5, {});

        olc::vf2d vStart = { nColumn * nFontSize * 1.3f, -(float)(rand() % 1000) };
        uint8_t nStep = (uint8_t)(rand() % 50) + 40;

        if (rand() % 10 > 7) vChars.front().SetColor(WHITE);
        for (int32_t i = 0; i < int32_t(vChars.size()); i++) {
            vChars[i].Init(vStart - olc::vf2d(0.0f, (float)i * nFontSize), nStep, nHeight, nFontSize);
        }

        int32_t nShadowLen = rand() % 10 + 8;
        vStart = vChars.back().GetPos();
        for (int32_t i = 0; i < nShadowLen; i++) {
            vChars.push_back({});
            vChars.back().Init(vStart - olc::vf2d(0.0f, (float)i * nFontSize), nStep, nHeight, nFontSize);
            vChars.back().SetColor(GREEN((255 / nShadowLen) * (nShadowLen - i)));
        }
    }

    void Draw(olc::PixelGameEngine& GameEngine, float fElapseTime, std::unique_ptr<olc::Decal>& decFont) {
        for (auto& cChar : vChars) {
            cChar.Update(fElapseTime);
            cChar.Draw(GameEngine, decFont);
        }
    }
    
private:
    int32_t nColumn;

    std::vector<Char> vChars;
};
