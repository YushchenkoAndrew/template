#include "../lib/olcPixelGameEngine.h"
#include "Objects.h"

#define GRAVITY 0.002f
#define FRICTION 0.999f
#define STEP 10.0f
#define RADIUS 2

#define INDEX(X, Y, SIZE) ((X) + (Y) * (SIZE))


class Fabric {
public:
  void Init(int32_t nScreenWidth, int32_t nScreenHeight, float xOffset = 20, float yOffset = 20);

private:
  void UpdateMaterial(float& fElapseTime);
  void ConstrainPoints(float& fElapseTime);

public:
  void Update(float &fElapseTime);
  void Draw(olc::PixelGameEngine& GameEngine);



private:
  int32_t nWidth = 20;
  int32_t nHeight = 20;

  int32_t nScreenWidth;
  int32_t nScreenHeight;

  std::vector<sPoint2D> vMaterial;
  std::vector<sStick> vSticks;

};

