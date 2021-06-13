#define OLC_PGE_APPLICATION
#include "lib/olcPixelGameEngine.h"


#define INDEX(X, Y, STEP) (((Y) * (STEP)) + (X))

// For more information about this algorithm check out
// the source http://karlsims.com/rd.html

struct sChemical {
	sChemical() : a(1.0f), b(0.0f) {}
	sChemical(float a_, float b_) : a(a_), b(b_) {}

	float a, b;
};

class ReactionDiffusion : public olc::PixelGameEngine {
public:
	ReactionDiffusion() : fFeed(0.0367f), fKill(0.0649f), fTime(1.0f) {
	//ReactionDiffusion() : fFeed(0.0545f), fKill(0.062f) {
		sAppName = "ReactionDiffusion";
		chDiffusion = sChemical(1.0f, 0.5f);

		curr = new sChemical[iWorldHeight * iWorldWidth];
		next = new sChemical[iWorldHeight * iWorldWidth];
	}

public:
	bool OnUserCreate() override {
		return true;
	}

	bool OnUserUpdate(float fElapsedTime) override {
		olc::vi2d viOffset((ScreenWidth() - iWorldWidth) / 2, 0);
		olc::vi2d mouse = GetMousePos() - viOffset;

		if (GetMouse(0).bPressed && 
			mouse.x > iRange && mouse.x < iWorldWidth - iRange &&
			mouse.y > iRange && mouse.y < iWorldHeight - iRange) {
			for (int32_t i = -iRange; i < iRange; i++) {
				for (int32_t j = -iRange; j < iRange; j++) {
					curr[INDEX(i + mouse.x, j + mouse.y, iWorldWidth)].b = 1;
				}
			}
		}

		Clear(olc::BLACK);
		UpdateDiffusion(viOffset.x, viOffset.y);
		return true;
	}

private:
	void UpdateDiffusion(int32_t iXOffset, int32_t iYOffset) {
		for (int32_t y = 1; y < iWorldHeight - 1; y++) {
			for (int32_t x = 1; x < iWorldWidth - 1; x++) {
				const int32_t index = INDEX(x, y, iWorldWidth);
				float a = curr[index].a;
				float b = curr[index].b;
				sChemical laplace = LaplacianFunc(x, y);

				next[index].a = a + (chDiffusion.a * laplace.a - a * b * b + fFeed * (1 - a)) * fTime;
				next[index].b = b + (chDiffusion.b * laplace.b + a * b * b - (fKill + fFeed) * b) * fTime;


				// Swap layers
				if (y >= 2) curr[INDEX(x, y - 1, iWorldWidth)] = next[INDEX(x, y - 1, iWorldWidth)];

				uint32_t color = roundf(a < b ? 0 : (a - b) * 255);
				olc::PixelGameEngine::Draw(x + iXOffset, y + iYOffset, olc::Pixel(color, color, color));
			}
		}
	}

private:
	sChemical LaplacianFunc(int32_t x, int32_t y) {
		sChemical result = sChemical(0, 0);
		for (int32_t i = -1; i < 2; i++) {
			for (int32_t j = -1; j < 2; j++) {
				result.a += curr[INDEX(x + j, y + i, iWorldWidth)].a * aWeight[INDEX(j + 1, i + 1, 3)];
				result.b += curr[INDEX(x + j, y + i, iWorldWidth)].b * aWeight[INDEX(j + 1, i + 1, 3)];
			}
		}

		return result;
	}

private:
	sChemical* curr;
	sChemical* next;
	sChemical chDiffusion;
	float fFeed;
	float fKill;
	float fTime;

	const int32_t iWorldWidth = 150;
	const int32_t iWorldHeight = 150;
	const int32_t iRange = 8;

	const float aWeight[9] = {
		0.05f, 0.2f, 0.05f,
		0.2f, -1.0f, 0.2f,
		0.05f, 0.2f, 0.05f,
	};
};


int main()
{
	ReactionDiffusion demo;
	if (demo.Construct(150, 150, 4, 4))
		demo.Start();

	return 0;
}
