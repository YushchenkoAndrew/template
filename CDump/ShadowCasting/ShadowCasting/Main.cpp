#define OLC_PGE_APPLICATION
#include "olcPixelGameEngine.h"
#include "BinaryTree.h"

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
	float sx, sy;
	float ex, ey;
};

struct sCell {
	bool exist = false;
	bool edge_exist[4];
	unsigned int edge_id[4];
};

class ShadowCasting : public olc::PixelGameEngine {
public:
	ShadowCasting() {
		sAppName = "ShadowCasting";

		world = new sCell[iWorldWidth * iWorldHeigh];
	}

public:
	bool OnUserCreate() override {
		printf("Start\n");
		olc::ResourcePack cResource;
		cResource.LoadPack("BinaryMap.bin", "");
		olc::ResourceBuffer buf = cResource.GetFileBuffer("BinaryMap.bin");

		for (size_t i = 0; i < buf.vMemory.size(); i++) {
			printf("%c", buf.vMemory[i]);
		}


		return true;
	}

	bool OnUserUpdate(float fElapsedTime) override {
		olc::vi2d mouse = GetMousePos();
		int index = 0;
		
		if (GetMouse(0).bReleased &&
			// Check the Top and Bottom boundary
			(index = INDEX(mouse.x / iBlockSize, mouse.y / iBlockSize, iWorldWidth)) >= iWorldWidth &&
			index < INDEX(0, iWorldHeigh - 1, iWorldWidth) &&
			// Check Left and Right boundary
			index % iWorldWidth != 0 && (index + 1) % iWorldWidth != 0) {
			//int index = INDEX(mouse.x / iBlockSize, mouse.y / iBlockSize, iWorldWidth);
			world[index].exist = !world[index].exist;

			ConvertBitMapIntoPolyMap(0, 0, iWorldWidth, iWorldHeigh, (float)iBlockSize, iWorldWidth);
		}

		//if (GetMouse(1).bHeld)
		CalcVisiablePolyMap((float)mouse.x, (float)mouse.y, 100000.0f);
		Draw();
		return true;
	}

private:
	void ConvertBitMapIntoPolyMap(int sx, int sy, int w, int h, float fBlockSize, int pitch) {

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
							vEdge[world[n].edge_id[WEST]].ey += fBlockSize;
							world[i].edge_id[WEST] = world[n].edge_id[WEST];
							world[i].edge_exist[WEST] = true;
						}
						else {
							sEdge edge;
							edge.sx = x * fBlockSize; edge.sy = y * fBlockSize;
							edge.ex = x * fBlockSize; edge.ey = (y + 1) * fBlockSize;

							unsigned int edge_id = vEdge.size();
							vEdge.push_back(edge);

							world[i].edge_exist[WEST] = true;
							world[i].edge_id[WEST] = edge_id;
						}
					}

					// Check EAST SIDE
					if (!world[e].exist) {
						if (world[n].edge_exist[EAST]) {
							// Increase bounder of the edge
							vEdge[world[n].edge_id[EAST]].ey += fBlockSize;
							world[i].edge_id[EAST] = world[n].edge_id[EAST];
							world[i].edge_exist[EAST] = true;
						}
						else {
							sEdge edge;
							edge.sx = (x + 1) * fBlockSize; edge.sy = y * fBlockSize;
							edge.ex = (x + 1) * fBlockSize; edge.ey = (y + 1) * fBlockSize;

							unsigned int edge_id = vEdge.size();
							vEdge.push_back(edge);

							world[i].edge_exist[EAST] = true;
							world[i].edge_id[EAST] = edge_id;
						}
					}

					// Check NORTH SIDE
					if (!world[n].exist) {
						if (world[w].edge_exist[NORTH]) {
							// Increase bounder of the edge
							vEdge[world[w].edge_id[NORTH]].ex += fBlockSize;
							world[i].edge_id[NORTH] = world[w].edge_id[NORTH];
							world[i].edge_exist[NORTH] = true;
						}
						else {
							sEdge edge;
							edge.sx = x * fBlockSize; edge.sy = y * fBlockSize;
							edge.ex = (x + 1) * fBlockSize; edge.ey = y * fBlockSize;

							unsigned int edge_id = vEdge.size();
							vEdge.push_back(edge);

							world[i].edge_exist[NORTH] = true;
							world[i].edge_id[NORTH] = edge_id;
						}
					}

					// Check SOUTH SIDE
					if (!world[s].exist) {
						if (world[w].edge_exist[SOUTH]) {
							// Increase bounder of the edge
							vEdge[world[w].edge_id[SOUTH]].ex += fBlockSize;
							world[i].edge_id[SOUTH] = world[w].edge_id[SOUTH];
							world[i].edge_exist[SOUTH] = true;
						}
						else {
							sEdge edge;
							edge.sx = x * fBlockSize; edge.sy = (y + 1) * fBlockSize;
							edge.ex = (x + 1) * fBlockSize; edge.ey = (y + 1) * fBlockSize;

							unsigned int edge_id = vEdge.size();
							vEdge.push_back(edge);

							world[i].edge_exist[SOUTH] = true;
							world[i].edge_id[SOUTH] = edge_id;
						}
					}

				}
			}
		}
	}

	void CalcVisiablePolyMap(float x, float y, float radius) {
		tPolyMap.RemoveAll();

		for (size_t i = 0; i < vEdge.size(); i++) {
			// Use 'for' loop for simplify code appearance
			for (int j = 0; j < 2; j++) {
				float dx, dy;
				dx = (j == 0 ? vEdge[i].sx : vEdge[i].ex) - x;
				dy = (j == 0 ? vEdge[i].sy : vEdge[i].ey) - y;

				const float cAngle = atan2f(dy, dx);

				float angle = 0.0f;
				// Calculate 3 more Vector with a slit angle changed  
				for (int k = 0; k < 3; k++) {
					if (k == 0) angle = cAngle - 0.000001f;
					if (k == 1) angle = cAngle;
					if (k == 2) angle = cAngle + 0.000001f;

					dx = radius * cosf(angle);
					dy = radius * sinf(angle);

					float min_t = INFINITY;
					float min_x, min_y, min_angle;
					bool bValid = false;

					for (auto& e : vEdge) {
						float sdx, sdy;
						sdx = e.ex - e.sx + 0.001f;
						sdy = e.ey - e.sy;


						if (fabs(sdx - dx) > 0.0f && fabs(sdy - dy) > 0.0f) {
							float s = (dx * (y - e.sy) + (dy * (e.sx - x))) / (dx * sdy - sdx * dy);
							float t = (sdx * (y - e.sy) + (sdy * (e.sx - x))) / (dx * sdy - sdx * dy);

							if (s >= 0.0f && s <= 1.0f && t <= 1.0f && t >= 0.0f) {
								if (t < min_t) {
									min_t = t;
									min_x = x + (t * dx);
									min_y = y + (t * dy);
									min_angle = atan2f(min_y - y, min_x - x);
									bValid = true;
								}
							}
						}
					}

					if (bValid) 
						tPolyMap.Insert(min_x, min_y, min_angle);
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
					FillRect((int32_t)(x * iBlockSize), (int32_t)(y * iBlockSize), iBlockSize, iBlockSize, olc::BLUE);
			}
		}

		for (size_t i = 0; i < vEdge.size(); i++) {
			DrawLine((int32_t)vEdge[i].sx, (int32_t)vEdge[i].sy, (int32_t)vEdge[i].ex, (int32_t)vEdge[i].ey);
			FillCircle((int32_t)vEdge[i].sx, (int32_t)vEdge[i].sy, 3, olc::RED);
			FillCircle((int32_t)vEdge[i].ex, (int32_t)vEdge[i].ey, 3, olc::RED);
		}


		std::vector<Node*> vPolyMap = tPolyMap.GetVector();
		DrawString(4, 4, "Nodes: " + std::to_string(vPolyMap.size()));
		olc::vf2d mouse = GetMousePos();
		for (size_t i = 0; i < vPolyMap.size(); i++) {
			DrawLine((int32_t)mouse.x, (int32_t)mouse.y, (int32_t)vPolyMap[i]->x, (int32_t)vPolyMap[i]->y);
		}

	}

private:
	sCell* world;
	std::vector<sEdge> vEdge;
	BinaryTree tPolyMap;
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