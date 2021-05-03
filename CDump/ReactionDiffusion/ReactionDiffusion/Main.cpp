#define OLC_PGE_APPLICATION
#include "olcPixelGameEngine.h"


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


		// Key interface
		if (GetKey(olc::Key::Z).bHeld) fKill -= 0.001f;
		if (GetKey(olc::Key::X).bHeld) fKill += 0.001f;
		if (GetKey(olc::Key::S).bHeld) fFeed -= 0.001f;
		if (GetKey(olc::Key::D).bHeld) fFeed += 0.001f;
		if (GetKey(olc::Key::Q).bHeld) fTime -= 0.001f;
		if (GetKey(olc::Key::W).bHeld) fTime += 0.001f;
		if (GetKey(olc::Key::C).bPressed) 
			for (int32_t i = 0; i < iWorldHeight * iWorldWidth; i++) {
				curr[i].a = 1.0f;
				curr[i].b = 0.0f;
			}


		Clear(olc::BLACK);
		DrawString(4, 110, "Kill = " + std::to_string(fKill));
		DrawString(4, 120, "Feed = " + std::to_string(fFeed));
		DrawString(4, 130, "Time = " + std::to_string(fTime));
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

				int32_t R, G, B;
				HSVtoRGB((a - b) * 180 + 180, 90, 90, R, G, B);

				olc::PixelGameEngine::Draw(x + iXOffset, y + iYOffset, olc::Pixel(R, G, B));


				//uint32_t color = roundf(a < b ? 0 : (a - b) * 255);
				//olc::PixelGameEngine::Draw(x + iXOffset, y + iYOffset, olc::Pixel(color, color, color));
			}
		}
	}

	void HSVtoRGB(float H, float S, float V, int32_t& R, int32_t& G, int32_t& B) {
		float s = S / 100;
		float v = V / 100;
		float C = s * v;
		float X = C * (1 - abs(fmod(H / 60.0, 2) - 1));
		float m = v - C;
		float r, g, b;
		if (H >= 0 && H < 60) {
			r = C, g = X, b = 0;
		}
		else if (H >= 60 && H < 120) {
			r = X, g = C, b = 0;
		}
		else if (H >= 120 && H < 180) {
			r = 0, g = C, b = X;
		}
		else if (H >= 180 && H < 240) {
			r = 0, g = X, b = C;
		}
		else if (H >= 240 && H < 300) {
			r = X, g = 0, b = C;
		}
		else {
			r = C, g = 0, b = X;
		}
		R = (int32_t)((r + m) * 255) % 255;
		G = (int32_t)((g + m) * 255) % 255;
		B = (int32_t)((b + m) * 255) % 255;

		//std::cout << R << G << B << std::endl;
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

	const int32_t iWorldWidth = 200;
	const int32_t iWorldHeight = 100;
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
	if (demo.Construct(200, 200, 4, 4))
		demo.Start();

	return 0;
}
