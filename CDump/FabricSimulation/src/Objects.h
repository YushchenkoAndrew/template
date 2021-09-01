#define STEP 3.0f

struct sPoint2D {
	float x = 0.0f;
	float y = 0.0f;

  float xPrev = 0.0f;
  float yPrev = 0.0f;

  bool bUpdate = true;
};

struct sStick {
  sPoint2D &vStart;
  sPoint2D &vEnd;
  float len = STEP;

  void Update() {
    float dx = vEnd.x - vStart.x;
    float dy = vEnd.y - vStart.y;
    float fDist = sqrtf(dx * dx + dy * dy);
    float fOffset = ((len - fDist) / fDist) * 0.5f;

    if (vStart.bUpdate) {
      vStart.x -= dx * fOffset;
      vStart.y -= dy * fOffset;
    }

    if (vEnd.bUpdate) {
      vEnd.x += dx * fOffset;
      vEnd.y += dy * fOffset;
    }
  }

  void Draw(olc::PixelGameEngine& GameEngine) {
    GameEngine.DrawLine(vStart.x, vStart.y, vEnd.x, vEnd.y);
  }
};