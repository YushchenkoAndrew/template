#include "EdgeDetection.h"

void EdgeDetection::Init(std::unique_ptr<olc::Sprite>& sprImage) {
  nWidth = sprImage->width; nHeight = sprImage->height;

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
          fBlur += (float)vPixels[(y + i) * nWidth + x + j].r * 
                    (p * expf((float)(i * i + j * j) / (-2.0f * fSigma * fSigma)));
        }
      }

      vPixels[x + y * nWidth].r = (int32_t)fBlur;
      vPixels[x + y * nWidth].g = (int32_t)fBlur;
      vPixels[x + y * nWidth].b = (int32_t)fBlur;
    }
  }
}

void EdgeDetection::IntensityGradient() {

}


void EdgeDetection::Draw(olc::PixelGameEngine& GameEngine) {
  for (int32_t y = 0; y < nHeight; y++) {
    for (int32_t x = 0; x < nWidth; x++) {
      GameEngine.Draw(x, y, vPixels[x + y * nWidth]);
    }
  }
}

