#include "../lib/olcPixelGameEngine.h"


class EdgeDetection {
public: 
  void Init(std::unique_ptr<olc::Sprite>& sptImage);

  // Canny Algorithm steps
  void Grayscale();
  void GaussFilter(int32_t k = 2, float fSigma = 1);
  void IntensityGradient();

  void Draw(olc::PixelGameEngine& GameEngine);

private:
  int32_t nHeight;
  int32_t nWidth;

  // Sobel Edge detection operator
  int32_t Kx[9] = { -1, 0, 1, -2, 0, 2, -1, 0, 1 };
  int32_t Ky[9] = { 1, 2, 1, 0, 0, 0, -1, -2, -1 };

  std::vector<olc::Pixel> vPixels;
};


