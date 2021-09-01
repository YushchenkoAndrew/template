#include "../lib/olcPixelGameEngine.h"
#include "Objects.h"

#define GRAVITY 0.002f
#define FORCE 0.05f
#define FRICTION 0.999f
#define RADIUS 2

#define INDEX(X, Y, SIZE) ((X) + (Y) * (SIZE))


class Fabric {
public:
  void Init(int32_t nScreenWidth, int32_t nScreenHeight, float xOffset = 20, float yOffset = 20);
  void Reset(float xOffset, float yOffset);

private:
  void UpdateMaterial(float& fElapseTime, olc::vi2d &vMouse);
  void ConstrainPoints(float& fElapseTime);

public:
  void Update(float& fElapseTime, olc::vi2d &vMouse);
  void Draw(olc::PixelGameEngine& GameEngine);



private:
  int32_t nWidth = 60;
  int32_t nHeight = 65;
  
  olc::vi2d vMouse = { -1, -1 };

  int32_t nScreenWidth;
  int32_t nScreenHeight;

  std::vector<sPoint2D> vMaterial;
  std::vector<sStick> vSticks;

};

