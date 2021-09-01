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
      if (i < nHeight / 4 * 3)
        vSticks.push_back({ vMaterial[INDEX(j, i, nWidth)], vMaterial[INDEX(j + 1, i, nWidth)] });
      vSticks.push_back({ vMaterial[INDEX(j, i - 1, nWidth)], vMaterial[INDEX(j, i, nWidth)] });
    }

    vSticks.push_back({ vMaterial[INDEX(nWidth - 1, i - 1, nWidth)], vMaterial[INDEX(nWidth - 1, i, nWidth)] });
  }
}

void Fabric::Reset(float xOffset, float yOffset) {
  for (int i = 0; i < nHeight; i++) { 
    for (int j = 0; j < nWidth; j++) { 
      vMaterial[INDEX(j, i, nWidth)].x = j * STEP + xOffset;
      vMaterial[INDEX(j, i, nWidth)].y = i * STEP + yOffset;
      vMaterial[INDEX(j, i, nWidth)].xPrev = j * STEP - 0.2f + xOffset;
      vMaterial[INDEX(j, i, nWidth)].yPrev = i * STEP + yOffset;
    }
  }
}

void Fabric::UpdateMaterial(float &fElapseTime, olc::vi2d &vMouse) {
  for (auto& p : vMaterial) {
    if (!p.bUpdate) continue;
    float xV = (p.x - p.xPrev) * FRICTION;
    float yV = (p.y - p.yPrev) * FRICTION;

    p.xPrev = p.x; p.yPrev = p.y;
    p.x += xV; p.y += yV;


    // External forcess
    p.y += GRAVITY;
    if (vMouse.x == -1 && vMouse.y == -1) continue;
    if (this->vMouse.x == -1 && this->vMouse.y == -1) this->vMouse = vMouse;

    float dx = p.x - (float)vMouse.x;
    float dy = p.y - (float)vMouse.y;
    float len = sqrtf(dx * dx + dy * dy);
    if (len > STEP * 5) continue;

    p.xPrev -= (vMouse.x - this->vMouse.x) * FORCE;
    p.yPrev -= (vMouse.y - this->vMouse.y) * FORCE;
  }

  this->vMouse = vMouse;
}

void Fabric::ConstrainPoints(float &fElapseTime) { 
  for (auto& p : vMaterial) {
    float xV = (p.x - p.xPrev) * FRICTION;
    float yV = (p.y - p.yPrev) * FRICTION;

    if (p.x < 0 || p.x > nScreenWidth) {
      p.x = p.x < 0 ? 0 : nScreenWidth;
      p.xPrev = p.x + xV;
    }

    if (p.y < 0 || p.y > nScreenHeight) {
      p.y = p.y < 0 ? 0 : nScreenHeight;
      p.yPrev = p.y + yV;
    }
  }
}

void Fabric::Update(float& fElapseTime, olc::vi2d &vMouse) {
  UpdateMaterial(fElapseTime, vMouse);
  // ConstrainPoints(fElapseTime);

  // for (int32_t i = 0; i < 5; i++) {
  for (auto& stick : vSticks) stick.Update();
  // }
}

void Fabric::Draw(olc::PixelGameEngine& GameEngine) {
  for (auto& stick : vSticks) stick.Draw(GameEngine);
  // for (auto& p : vMaterial) GameEngine.DrawCircle(p.x, p.y, RADIUS);
}
