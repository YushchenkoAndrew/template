#define OLC_PGE_APPLICATION
#include "olcPixelGameEngine.h"

struct sCell {
	bool exist = false;
};

class ShadowCasting : public olc::PixelGameEngine {
public:
	ShadowCasting() {
		sAppName = "ShadowCasting";

		world = new sCell[iWorldWidth * iWorldHeigh];
	}

public:
	bool OnUserCreate() override {
		return true;
	}

	bool OnUserUpdate(float fElapsedTime) override {
		olc::vi2d mouse = GetMousePos();
		
		if (GetMouse(0).bPressed) {
			int index = (mouse.y / iBlockSize) * iWorldWidth + mouse.x / iBlockSize;
			
			world[index].exist = !world[index].exist;
		}

		Draw();
		return true;
	}

private:
	void Draw() {
		// Clear the screen
		Clear(olc::BLACK);

		for (int x = 0; x < iWorldWidth; x++) {
			for (int y = 0; y < iWorldHeigh; y++) {
				if (world[y * iWorldWidth + x].exist)
					FillRect(x * iBlockSize, y * iBlockSize, iBlockSize, iBlockSize, olc::BLUE);
			}
		}

		FillCircle(GetMousePos(), 6, olc::WHITE);
	}

private:
	sCell* world;
	olc::vi2d header;
	const int iWorldWidth = 40;
	const int iWorldHeigh = 30;
	const int iBlockSize = 16;
};

int main() {
	ShadowCasting demo;
	if (demo.Construct(640, 480, 2, 2))
		demo.Start();

	return 0;
}