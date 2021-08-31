#include "Fabric.h"

void Fabric::Init(int32_t nScreenWidth, int32_t nScreenHeight, float xOffset, float yOffset) {
  this->nScreenWidth = nScreenWidth;
  this->nScreenHeight = nScreenHeight;

  for (int i = 0; i < nHeight; i++) { 
    for (int j = 0; j < nWidth; j++) { 
      vMaterial.push_back({ 
        j * STEP + xOffset, 
        i * STEP + yOffset, 
        j * STEP - 0.2f + xOffset, 
        i * STEP + yOffset,
         i != 0 
      });
    }
  }

  for (int32_t i = 1; i < nHeight; i++) {
    for (int32_t j = 0; j < nWidth - 1; j++) {
      vSticks.push_back({ vMaterial[INDEX(j, i, nWidth)], vMaterial[INDEX(j + 1, i, nWidth)] });
      vSticks.push_back({ vMaterial[INDEX(j, i - 1, nWidth)], vMaterial[INDEX(j, i, nWidth)] });
    }

    vSticks.push_back({ vMaterial[INDEX(nWidth - 1, i - 1, nWidth)], vMaterial[INDEX(nWidth - 1, i, nWidth)] });
  }
}

void Fabric::UpdateMaterial(float &fElapseTime) {
  for (auto& p : vMaterial) {
    if (!p.bUpdate) continue;
    // float xV = (p.x - p.xPrev) * FRICTION * fElapseTime;
    // float yV = (p.y - p.yPrev) * FRICTION * fElapseTime;
    float xV = (p.x - p.xPrev) * FRICTION;
    float yV = (p.y - p.yPrev) * FRICTION;

    p.xPrev = p.x; p.yPrev = p.y;
    p.x += xV; p.y += yV;


    // External forcess
    // p.y += GRAVITY * fElapseTime;
    p.y += GRAVITY;
  }
}

void Fabric::ConstrainPoints(float &fElapseTime) { 
  for (auto& p : vMaterial) {
    // if (!p.bUpdate) continue;
    // float xV = (p.x - p.xPrev) * FRICTION * fElapseTime;
    // float yV = (p.y - p.yPrev) * FRICTION * fElapseTime;
    float xV = (p.x - p.xPrev) * FRICTION;
    float yV = (p.y - p.yPrev) * FRICTION;

    // Comment this for now
    // if (p.x < 0 || p.x > nScreenWidth) {
    //   p.x = p.x < 0 ? 0 : nScreenWidth;
    //   p.xPrev = p.x + xV;
    // }

    if (p.y < 0 || p.y > nScreenHeight) {
      p.y = p.y < 0 ? 0 : nScreenHeight;
      p.yPrev = p.y + yV;
    }
  }
}

void Fabric::Update(float& fElapseTime) {
  UpdateMaterial(fElapseTime);
  ConstrainPoints(fElapseTime);

  for (int32_t i = 0; i < 5; i++) {
    for (auto& stick : vSticks) stick.Update();
  }
}

void Fabric::Draw(olc::PixelGameEngine& GameEngine) {
  for (auto& stick : vSticks) stick.Draw(GameEngine);

  for (auto& p : vMaterial) {
    GameEngine.DrawCircle(p.x, p.y, RADIUS);
  }
}
