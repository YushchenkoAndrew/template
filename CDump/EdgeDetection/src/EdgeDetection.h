#include "../lib/olcPixelGameEngine.h"

#define INDEX(X, Y, STEP) ((X) + (Y) * (STEP))
#define OFFSET 5
#define STRONG 255u
#define WEAK 50u

class EdgeDetection {
public: 
  void Init(std::unique_ptr<olc::Sprite>& sptImage, bool bInvert = false);

  // Canny Algorithm steps
  void Grayscale();
  void GaussFilter(int32_t k = 2, float fSigma = 1);
  void IntensityGradient();
  void NonMaximumSuppression();
  void DoubleThreshold(float fHighRatio = 0.08f, float fLowRatio = 0.05f);
  void EdgeTrack(int32_t nStep = 1);

  void Draw(olc::PixelGameEngine& GameEngine);

private:
  void CheckDir(int32_t x, int32_t y, uint8_t& prev, uint8_t& next);
  inline uint8_t GetMax() {
    uint8_t nMax = 0;
    for(auto& pixel : vPixels) nMax = std::max(pixel.r, nMax);
    return nMax;
  }

private:
  int32_t nHeight;
  int32_t nWidth;

  bool bInvert;

  // Sobel Edge detection operator
  int32_t Kx[9] = { -1, 0, 1, -2, 0, 2, -1, 0, 1 };
  int32_t Ky[9] = { 1, 2, 1, 0, 0, 0, -1, -2, -1 };

  std::vector<olc::Pixel> vPixels;
  std::vector<float> vTheta;
};


