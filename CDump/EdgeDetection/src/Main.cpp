#include "EdgeDetection.h"

class Project : public olc::PixelGameEngine {
public:
  Project() {
    sAppName = "EdgeDetection";
  }

  bool OnUserCreate() override {
    sprImage = std::make_unique<olc::Sprite>("assets/test.png");
    
    cEdgeDetection.Init(sprImage);
    cEdgeDetection.Grayscale();
    cEdgeDetection.GaussFilter(5, 1.5f);
    cEdgeDetection.IntensityGradient();
    cEdgeDetection.NonMaximumSuppression();
    cEdgeDetection.DoubleThreshold(0.09f, 0.01f);
    cEdgeDetection.EdgeTrack(3);

    return true;
  } 

  bool OnUserUpdate(float fElapsedTime) override {
    Clear(olc::BLACK);

    cEdgeDetection.Draw(*this);
    return true;
  }

private:
  EdgeDetection cEdgeDetection;

  std::unique_ptr<olc::Sprite> sprImage;
};

int main() {
  Project demo;
  if (demo.Construct(299, 600, 1, 1)) demo.Start();

  return 0;
}

