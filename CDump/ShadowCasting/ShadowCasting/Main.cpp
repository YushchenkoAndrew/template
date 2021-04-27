#define OLC_PGE_APPLICATION
#include "olcPixelGameEngine.h"

#include <stdio.h>

#define NORTH 0
#define SOUTH 1
#define WEST  2
#define EAST  3

#define INDEX(X, Y, STEP) (((Y) * (STEP)) + (X))
#define NORTH_NEIGBOR(X, Y, STEP) (INDEX(X, Y - 1, STEP))
#define SOUTH_NEIGBOR(X, Y, STEP) (INDEX(X, Y + 1, STEP))
#define WEST_NEIGBOR(X, Y, STEP) (INDEX((X - 1), Y, STEP))
#define EAST_NEIGBOR(X, Y, STEP) (INDEX((X + 1), Y, STEP))


struct sEdge {
	int sx, sy;
	int ex, ey;
};

struct sCell {
	bool exist = false;
	bool edge_exist[4];
	int edge_id[4];
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
		
		if (GetMouse(0).bReleased) {
			int index = INDEX(mouse.x / iBlockSize, mouse.y / iBlockSize, iWorldWidth);
			world[index].exist = !world[index].exist;

			ConvertBitMapIntoPolyMap(0, 0, iWorldWidth, iWorldHeigh, iBlockSize, iWorldWidth);
		}

		Draw();
		return true;
	}

	void ConvertBitMapIntoPolyMap(int sx, int sy, int w, int h, int iBlockSize, int pitch) {

		// Reset PolyMap
		vEdge.clear();
		for (int x = 0; x < w; x++) {
			for (int y = 0; y < h; y++) {
				int index = INDEX(x, y, pitch);

				for (int j = 0; j < 4; j++) {
					world[index].edge_exist[j] = 0;
					world[index].edge_id[j] = 0;
				}
			}
		}

		for (int x = 1; x < w - 1; x++) {
			for (int y = 1; y < h - 1; y++) {

				// Calculate index and all neighbors
				int i = INDEX(x + sx, y + sy, pitch);
				int n = NORTH_NEIGBOR(x + sx, y + sy, pitch);
				int s = SOUTH_NEIGBOR(x + sx, y + sy, pitch);
				int w = WEST_NEIGBOR(x + sx, y + sy, pitch);
				int e = EAST_NEIGBOR(x + sx, y + sy, pitch);

				if (world[i].exist) {

					// Check WEST SIDE
					if (!world[w].exist) {
						if (world[n].edge_exist[WEST]) {
							// Increase bounder of the edge
							vEdge[world[n].edge_id[WEST]].ey += iBlockSize;
							world[i].edge_id[WEST] = world[n].edge_id[WEST];
							world[i].edge_exist[WEST] = true;
						}
						else {
							sEdge edge;
							edge.sx = x * iBlockSize; edge.sy = y * iBlockSize;
							edge.ex = x * iBlockSize; edge.ey = (y + 1) * iBlockSize;

							int edge_id = vEdge.size();
							vEdge.push_back(edge);

							world[i].edge_exist[WEST] = true;
							world[i].edge_id[WEST] = edge_id;
						}
					}

					// Check EAST SIDE
					if (!world[e].exist) {
						if (world[n].edge_exist[EAST]) {
							// Increase bounder of the edge
							vEdge[world[n].edge_id[EAST]].ey += iBlockSize;
							world[i].edge_id[EAST] = world[n].edge_id[EAST];
							world[i].edge_exist[EAST] = true;
						}
						else {
							sEdge edge;
							edge.sx = (x + 1) * iBlockSize; edge.sy = y * iBlockSize;
							edge.ex = (x + 1) * iBlockSize; edge.ey = (y + 1) * iBlockSize;

							int edge_id = vEdge.size();
							vEdge.push_back(edge);

							world[i].edge_exist[EAST] = true;
							world[i].edge_id[EAST] = edge_id;
						}
					}

					// Check NORTH SIDE
					if (!world[n].exist) {
						if (world[w].edge_exist[NORTH]) {
							// Increase bounder of the edge
							vEdge[world[w].edge_id[NORTH]].ex += iBlockSize;
							world[i].edge_id[NORTH] = world[w].edge_id[NORTH];
							world[i].edge_exist[NORTH] = true;
						}
						else {
							sEdge edge;
							edge.sx = x * iBlockSize; edge.sy = y * iBlockSize;
							edge.ex = (x + 1) * iBlockSize; edge.ey = y * iBlockSize;

							int edge_id = vEdge.size();
							vEdge.push_back(edge);

							world[i].edge_exist[NORTH] = true;
							world[i].edge_id[NORTH] = edge_id;
						}
					}

					// Check SOUTH SIDE
					if (!world[s].exist) {
						if (world[w].edge_exist[SOUTH]) {
							// Increase bounder of the edge
							vEdge[world[w].edge_id[SOUTH]].ex += iBlockSize;
							world[i].edge_id[SOUTH] = world[w].edge_id[SOUTH];
							world[i].edge_exist[SOUTH] = true;
						}
						else {
							sEdge edge;
							edge.sx = x * iBlockSize; edge.sy = (y + 1) * iBlockSize;
							edge.ex = (x + 1) * iBlockSize; edge.ey = (y + 1) * iBlockSize;

							int edge_id = vEdge.size();
							vEdge.push_back(edge);

							world[i].edge_exist[SOUTH] = true;
							world[i].edge_id[SOUTH] = edge_id;
						}
					}

				}
			}
		}
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

		for (int i = 0; i < vEdge.size(); i++) {
			DrawLine(vEdge[i].sx, vEdge[i].sy, vEdge[i].ex, vEdge[i].ey);
			FillCircle(vEdge[i].sx, vEdge[i].sy, 3, olc::RED);
			FillCircle(vEdge[i].ex, vEdge[i].ey, 3, olc::RED);
		}
	}

private:
	sCell* world;
	std::vector<sEdge> vEdge;
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