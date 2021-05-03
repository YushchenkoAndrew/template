#define OLC_PGE_APPLICATION
#include "olcPixelGameEngine.h"


// For more information about this algorithm check out
// the source http://karlsims.com/rd.html

struct sChemical {
	sChemical() : a(1.0f), b(0.0f) {}
	sChemical(float a_, float b_) : a(a_), b(b_) {}

	float a, b;
};

class ReactionDiffusion : public olc::PixelGameEngine {
public:
	enum {
		H = 150,
		W = 150
	};


	ReactionDiffusion() : fFeed(0.0367f), fKill(0.0649f) {
	//ReactionDiffusion() : fFeed(0.0545f), fKill(0.062f) {
		sAppName = "ReactionDiffusion";
		chDiffusion = sChemical(1.0f, 0.5f);
	}

public:
	bool OnUserCreate() override {
		return true;
	}

	bool OnUserUpdate(float fElapsedTime) override {
		olc::vi2d mouse = GetMousePos();
		if (GetMouse(0).bPressed) {
			for (int i = -10; i < 10; i++) {
				for (int j = -10; j < 10; j++) {
					curr[i + mouse.y][j + mouse.x].b = 1;
				}
			}
		}



		for (int32_t i = 1; i < H - 1; i++) {
			for (int32_t j = 1; j < W - 1; j++) {
				float a = curr[i][j].a;
				float b = curr[i][j].b;
				sChemical laplace = LaplacianFunc(j, i);

				next[i][j].a = a + (chDiffusion.a * laplace.a - a * b * b + fFeed * (1 - a));
				next[i][j].b = b + (chDiffusion.b * laplace.b + a * b * b - (fKill + fFeed) * b);
			}
		}

		swap();
		Draw();
		return true;
	}


private:
	sChemical LaplacianFunc(int32_t x, int32_t y) {
		sChemical result = sChemical(0, 0);
		for (int32_t i = -1; i < 2; i++) {
			for (int32_t j = -1; j < 2; j++) {
				result.a += curr[y + i][x + j].a * aWeight[i + 1][j + 1];
				result.b += curr[y + i][x + j].b * aWeight[i + 1][j + 1];
			}
		}

		return result;
	}


	void swap() {
		for (int32_t i = 0; i < H; i++) {
			for (int32_t j = 0; j < W; j++) {
				sChemical temp = curr[i][j];
				curr[i][j] = next[i][j];
				next[i][j] = temp;
			}
		}
	}



private:
	void Draw() {
		for (int32_t i = 0; i < H; i++) {
			for (int32_t j = 0; j < W; j++) {
				float sub = curr[i][j].a - curr[i][j].b;

				uint32_t color = roundf(sub < 0 ? 0 : sub * 255);
				olc::PixelGameEngine::Draw(j, i, olc::Pixel(color, color, color));
			}
		}

	}

private:
	sChemical curr[H][W];
	sChemical next[H][W];
	float fFeed;
	float fKill;
	sChemical chDiffusion;
	const float aWeight[3][3] = {
		{0.05f, 0.2f, 0.05f},
		{0.2f, -1.0f, 0.2f},
		{0.05f, 0.2f, 0.05f},
	};
};


int main()
{
	ReactionDiffusion demo;
	if (demo.Construct(150, 150, 4, 4))
		demo.Start();

	return 0;
}
