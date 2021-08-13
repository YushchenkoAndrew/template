#include "EdgeDetection.h"

void EdgeDetection::Init(std::unique_ptr<olc::Sprite>& sprImage, bool bInvert) {
  nWidth = sprImage->width; nHeight = sprImage->height;
  vTheta.assign(nWidth * nHeight, 0.0f);
  this->bInvert = bInvert;

	for (int32_t y = 0; y < nHeight; y++) {
	  for (int32_t x = 0; x < nWidth; x++) {
      vPixels.push_back(sprImage->GetPixel(x, y));
    }
	}
}


void EdgeDetection::Grayscale() {
  int32_t lightDensity;
	for (auto& pixel : vPixels) {
    lightDensity = (pixel.r + pixel.g + pixel.b) / 3;
    pixel.r = lightDensity; pixel.g = lightDensity; pixel.b = lightDensity;
  }
}

void EdgeDetection::GaussFilter(int32_t k, float fSigma) {
  float p = 1.0f /  (2 * M_PI * fSigma * fSigma);

  for (int32_t y = k; y < nHeight - k; y++) {
    for (int32_t x = k; x < nWidth - k; x++) {
      float fBlur = 0.0f;

      for (int32_t i = -k; i <= k; i++) {
        for (int32_t j = -k; j <= k; j++) {
          fBlur += (float)vPixels[INDEX(x + j, y + i, nWidth)].r * 
                    (p * expf((float)(i * i + j * j) / (-2.0f * fSigma * fSigma)));
        }
      }

      vPixels[INDEX(x, y, nWidth)].r = (int32_t)fBlur;
      vPixels[INDEX(x, y, nWidth)].g = (int32_t)fBlur;
      vPixels[INDEX(x, y, nWidth)].b = (int32_t)fBlur;
    }
  }
}

void EdgeDetection::IntensityGradient() {
  int32_t nIndex = 0;
  uint8_t nMax = 0;
  uint8_t nValue = 0;

  for (int32_t y = 0; y < nHeight - 3; y++) {
    for (int32_t x = 0; x < nWidth - 3; x++) {
      nIndex = INDEX(x, y, nWidth);

      int32_t Ix = 0;
      int32_t Iy = 0;

      for (int32_t i = 0; i < 9; i++) {
        Ix += Kx[i] * vPixels[INDEX(x + i % 3, y + i / 3, nWidth)].r;
        Iy += Ky[i] * vPixels[INDEX(x + i % 3, y + i / 3, nWidth)].r;
      }

      nValue = (uint8_t)sqrtf((float)(Ix * Ix + Iy * Iy));
      nMax = std::max(nMax, nValue);
      vTheta[nIndex] = atanf((float)Iy / Ix);

      vPixels[nIndex].r = nValue;
      vPixels[nIndex].g = nValue;
      vPixels[nIndex].b = nValue;
    }
  }

  for (auto& pixel : vPixels) {
    pixel.r = (pixel.r * 255u) / nMax;
    pixel.g = (pixel.g * 255u) / nMax;
    pixel.b = (pixel.b * 255u) / nMax;

    if (bInvert) pixel = pixel.inv();
  }
}

void EdgeDetection::CheckDir(int32_t x, int32_t y, uint8_t& prev, uint8_t& next) {
  float fAngle = vTheta[INDEX(x, y, nWidth)];
  fAngle += fAngle < 0 ? M_PI : 0;

  if ((fAngle >= 0.0f && fAngle < M_PI) || (fAngle <= M_PI && fAngle > M_PI * 7 / 8)) {
    prev = vPixels[INDEX(x - 1, y, nWidth)].r;
    next = vPixels[INDEX(x + 1, y, nWidth)].r;
    return;
  }

  if (fAngle >= M_PI / 8 && fAngle < M_PI * 3 / 8) {
    prev = vPixels[INDEX(x - 1, y - 1, nWidth)].r;
    next = vPixels[INDEX(x + 1, y + 1, nWidth)].r;
    return;
  }

  if (fAngle >= M_PI * 3 / 8 && fAngle < M_PI * 5 / 8) {
    prev = vPixels[INDEX(x, y - 1, nWidth)].r;
    next = vPixels[INDEX(x, y + 1, nWidth)].r;
    return;
  }

  if (fAngle >= M_PI * 5 / 8 && fAngle < M_PI * 7 / 8) {
    prev = vPixels[INDEX(x + 1, y - 1, nWidth)].r;
    next = vPixels[INDEX(x - 1, y + 1, nWidth)].r;
    return;
  }

  next = prev = bInvert ? 0 : 255;
}

void EdgeDetection::NonMaximumSuppression() {
  int32_t nIndex;
  uint8_t nNext, nPrev;
  std::vector<uint8_t> vTemp;
  vTemp.assign(nWidth * 2, 0u);

  for (int32_t y = 1; y < nHeight - 1; y++) {
    for (int32_t x = 1; x < nWidth - 1; x++) {
      CheckDir(x, y, nPrev, nNext);

      if (y > 2) {
        nIndex = INDEX(x, y - 2, nWidth);
        vPixels[nIndex].r = vTemp[INDEX(x, (y - 1) % 2, nWidth)];
        vPixels[nIndex].g = vPixels[nIndex].b = vPixels[nIndex].r;
      }

      nIndex = INDEX(x, y, nWidth);
      vTemp[INDEX(x, (y - 1) % 2, nWidth)] = vPixels[nIndex].r >= nPrev && vPixels[nIndex].r >= nNext ? vPixels[nIndex].r : 0;
    }
  }
}

void EdgeDetection::DoubleThreshold(float fHighRatio, float fLowRatio) {
  uint8_t fHighTreshold = uint8_t(GetMax() * fHighRatio);
  uint8_t fLowTreshold = uint8_t(fHighTreshold * fLowRatio);

  for (auto& pixel : vPixels) {
    pixel.r = pixel.r > fHighTreshold ? STRONG : pixel.r;
    pixel.r = pixel.r < fHighTreshold && pixel.r > fLowTreshold ? WEAK : pixel.r;
    pixel.r = pixel.r <= fLowTreshold ? 0 : pixel.r;
    pixel.g = pixel.b = pixel.r;
  }
}

void EdgeDetection::EdgeTrack(int32_t nStep) {
  auto fnHaveStrong = [&](int32_t& x, int32_t& y) {
    for (int32_t i = -nStep; i < nStep; i++) {
      for (int32_t j = -nStep; j < nStep; j++) {
        if (vPixels[INDEX(x + j, y + i, nWidth)] == STRONG) return true;
      }
    }

    return false;
  };

  int32_t nIndex;
  for (int32_t y = nStep; y < nHeight - nStep; y++) {
    for (int32_t x = nStep; x < nWidth - nStep; x++) {
      nIndex = INDEX(x, y, nWidth);
      if (vPixels[nIndex].r != WEAK) continue;
      vPixels[nIndex].r = fnHaveStrong(x, y) ? STRONG : 0;
      vPixels[nIndex].g = vPixels[nIndex].b = vPixels[nIndex].r;
    }
  }
}


void EdgeDetection::Draw(olc::PixelGameEngine& GameEngine) {
  for (int32_t y = OFFSET; y < nHeight - OFFSET; y++) {
    for (int32_t x = OFFSET; x < nWidth - OFFSET; x++) {
      GameEngine.Draw(x + nWidth - OFFSET, y - OFFSET, vPixels[INDEX(x, y, nWidth)]);
    }
  }
}

