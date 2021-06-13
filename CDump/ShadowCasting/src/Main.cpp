#define OLC_PGE_APPLICATION
#include "lib/olcPixelGameEngine.h"
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


class cButton {
public:
	cButton() : sTitle("???"), bActive(false) {
		viPos.x = 0; viPos.y = 0;
		viOffset.x = 3; viOffset.y = 3;
		viSize.x = 9 * sTitle.size(); viSize.y = 13;
	}

	void Construct(int32_t x, int32_t y, std::string sTitle_, bool bActive_ = false) {
		sTitle = sTitle_;
		bActive = bActive_;
		viPos.x = x; viPos.y = y;
		viSize.x = 9 * sTitle.size();
	}

	bool OnClicked(olc::vi2d mouse) {
		olc::vi2d viRange = mouse - viPos + viOffset;
		if (viRange.x > 0 && viRange.x < viSize.x && viRange.y > 0 && viRange.y < viSize.y) {
			bActive = !bActive;
			return true;
		}
		return false;
	}

	void Draw(olc::PixelGameEngine& PGE) {
		PGE.FillRect(viPos - viOffset, viSize, bActive ? olc::BLUE : olc::BLACK);
		PGE.DrawString(viPos, sTitle);
	}

	bool GetStatus() {
		return bActive;
	}

	void SetActive(bool bActive_) {
		bActive = bActive_;
	}

	// TODO: Change viSize.x based on max size of string
	// Size of string define as index of first find "\n"
	void SetTitle(std::string sTitle_) {
		sTitle = sTitle_;
		viSize.x = 9 * sTitle.size();
		int32_t iCount = 1;
		for (auto& s : sTitle) iCount += (s == *"\n");
		viSize.y = iCount * 13;
	}

	std::string GetTitle() {
		return sTitle;
	}

private:
	olc::vi2d viPos;
	olc::vi2d viOffset;
	olc::vi2d viSize;
	std::string sTitle;
	bool bActive;
};

class ShadowCasting : public olc::PixelGameEngine {
public:
	ShadowCasting() {
		sAppName = "ShadowCasting";

		world = new sCell[iWorldWidth * iWorldHeight];

		// Define buttons
		bDebug.Construct(100, 4, "Debug (D)");
		bSave.Construct(180, 4, "Save (S)");
		bLoad.Construct(260, 4, "Load (L)", true);
		bPath.Construct(340, 4, "FILE UKNOWN");
	}

public:
	bool OnUserCreate() override {
		sprLightCast = new olc::Sprite("assets/light_cast.png");
		buffLightRay = new olc::Sprite(ScreenWidth(), ScreenHeight());
		buffLightTex = new olc::Sprite(ScreenWidth(), ScreenHeight());

		if (LoadFile("assets/BinaryMap.bin")) {
			bPath.SetTitle("assets/BinaryMap.bin");
			ConvertBitMapIntoPolyMap(0, 0, iWorldWidth, iWorldHeight, (float)iBlockSize, iWorldWidth);
		}

		return true;
	}

	bool OnUserUpdate(float fElapsedTime) override {
		// Clear all Rays to the objects
		tPolyMap.RemoveAll();

		olc::vi2d mouse = GetMousePos();
		bool bLoadUpdate = false;
		int index = 0;

		// Check the Top and Bottom boundary
		if ((index = INDEX(mouse.x / iBlockSize, mouse.y / iBlockSize, iWorldWidth)) >= iWorldWidth &&
			index < INDEX(0, iWorldHeight - 1, iWorldWidth) &&
			// Check Left and Right boundary
			index % iWorldWidth != 0 && (index + 1) % iWorldWidth != 0) {

			bool bCellExist = false;
			if (((bCellExist = GetMouse(0).bHeld) || GetMouse(1).bHeld)) {
				world[index].exist = bCellExist;
				ConvertBitMapIntoPolyMap(0, 0, iWorldWidth, iWorldHeight, (float)iBlockSize, iWorldWidth);
			}

			// Find all crossed rays 
			CalcVisiablePolyMap((float)mouse.x, (float)mouse.y, 100000.0f);
		}

		// Some buttons events
		if (GetMouse(0).bPressed) {
			bDebug.OnClicked(mouse);
			bSave.SetTitle("Save (S)");
			bSave.SetActive(false);
			bLoad.SetActive(false);

			if (bPath.OnClicked(mouse)) {
				if (bPath.GetStatus())
					bPath.SetTitle("assets/BinaryMap.bin\n\nassets/BinaryMap2.bin");
				else {
					// Update with the second one
					bPath.SetTitle("assets/BinaryMap2.bin");
					// Check if mouse was on a first Title then change it
					if (bPath.OnClicked(mouse)) bPath.SetTitle("assets/BinaryMap.bin");
					bPath.SetActive(false);
					bLoadUpdate = true;
				}
			}
		}


		// Simple Key shortcuts and button event
		if (GetKey(olc::Key::S).bPressed || (GetMouse(0).bPressed && bSave.OnClicked(mouse))) {
			SaveFile(bPath.GetTitle());
			bSave.SetTitle("Saved (S)");
			bSave.SetActive(true);
		}


		// Simple Key shortcuts and button event
		if (GetKey(olc::Key::L).bPressed || (GetMouse(0).bPressed && bLoad.OnClicked(mouse)) || bLoadUpdate) {
			if (LoadFile(bPath.GetTitle())) {
				ConvertBitMapIntoPolyMap(0, 0, iWorldWidth, iWorldHeight, (float)iBlockSize, iWorldWidth);
				bLoad.SetActive(true);
			}
		}

		if (GetKey(olc::Key::D).bPressed) bDebug.SetActive(!bDebug.GetStatus());

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
					if (k == 0) angle = cAngle - 0.002f;
					if (k == 1) angle = cAngle;
					if (k == 2) angle = cAngle + 0.002f;

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
	bool LoadFile(std::string sFile) {
		olc::ResourcePack cResource;
		if (!cResource.LoadPack(sFile, ""))
			return false;
		olc::ResourceBuffer buf = cResource.GetFileBuffer(sFile);
		for (int32_t i = 0; i < (int32_t)buf.vMemory.size(); i++) {
			for (int32_t j = 0; j < 8; j++)
				if (INDEX(j, i, 8) < iWorldHeight * iWorldWidth)
					world[INDEX(j, i, 8)].exist = (buf.vMemory[i] & (1u << j)) != 0;
		}
		return true;
	}

	bool SaveFile(std::string sFile) {
		olc::ResourcePack cResource ;
		std::vector<char> vData;
		char cData = NULL;

		for (int32_t i = 0; i < iWorldHeight * iWorldWidth; i++) {
			if (i % 8 == 0 && i != 0) {
				vData.push_back(cData);
				cData = NULL;
			}
			cData |= (world[i].exist << (i % 8));
		}

		return cResource.SaveFile(sFile, vData);
	}


	void Draw() {
		SetDrawTarget(buffLightTex);
		Clear(olc::BLACK);

		std::vector<Node*> vPolyMap = tPolyMap.GetVector();
		olc::vi2d mouse = GetMousePos();

		DrawSprite((int32_t)mouse.x - 255, (int32_t)mouse.y - 255, sprLightCast);


		SetDrawTarget(buffLightRay);
		Clear(olc::BLACK);

		if (vPolyMap.size() != 0) {
			// Use pointer to the function, such a way reduce if condition in the for-loop
			void (olc::PixelGameEngine:: * DrawTriangle)(int32_t, int32_t, int32_t, int32_t, int32_t, int32_t, olc::Pixel) = NULL;
			if (bDebug.GetStatus()) DrawTriangle = &olc::PixelGameEngine::DrawTriangle;
			else DrawTriangle = &olc::PixelGameEngine::FillTriangle;

			for (uint32_t i = 0; i < vPolyMap.size() - 1; i++) {
				(*this.*DrawTriangle)(
					mouse.x, mouse.y,
					(int32_t)vPolyMap[i]->x, (int32_t)vPolyMap[i]->y,
					(int32_t)vPolyMap[i + 1]->x, (int32_t)vPolyMap[i + 1]->y,
					olc::WHITE);
			}

			(*this.*DrawTriangle)(
				mouse.x, mouse.y,
				(int32_t)vPolyMap[0]->x, (int32_t)vPolyMap[0]->y,
				(int32_t)vPolyMap.back()->x, (int32_t)vPolyMap.back()->y,
				olc::WHITE);
		}


		// Clear the screen
		SetDrawTarget(nullptr);
		Clear(olc::BLACK);


		// Draw Sprite Texture pixel where the source of light exist
		for (int x = 0; x < ScreenWidth(); x++) {
			for (int y = 0; y < ScreenWidth(); y++) {
				// Draw the Sprite pixel or just a WHITE pixel depend on the curr mode
				if (buffLightRay->GetPixel(x, y).r > 0)
					PixelGameEngine::Draw(x, y, bDebug.GetStatus() ? olc::WHITE : buffLightTex->GetPixel(x, y));
			}
		}


		if (bDebug.GetStatus()) {
			for (int x = 0; x < iWorldWidth; x++) {
				for (int y = 0; y < iWorldHeight; y++) {
					if (world[y * iWorldWidth + x].exist)
						FillRect((int32_t)(x * iBlockSize), (int32_t)(y * iBlockSize), iBlockSize, iBlockSize, olc::BLUE);
				}
			}
		}


		for (size_t i = 0; i < vEdge.size(); i++) {
			if (bDebug.GetStatus()) {
				DrawLine((int32_t)vEdge[i].sx, (int32_t)vEdge[i].sy, (int32_t)vEdge[i].ex, (int32_t)vEdge[i].ey);
				FillCircle((int32_t)vEdge[i].sx, (int32_t)vEdge[i].sy, 3, olc::RED);
				FillCircle((int32_t)vEdge[i].ex, (int32_t)vEdge[i].ey, 3, olc::RED);
				continue;
			}

			DrawLine((int32_t)vEdge[i].sx, (int32_t)vEdge[i].sy, (int32_t)vEdge[i].ex, (int32_t)vEdge[i].ey, olc::Pixel(50, 50, 50));
		}


		// Draw Additional information
		DrawString(4, 4, "Nodes: " + std::to_string(vPolyMap.size()));
		bDebug.Draw(*this); 
		bSave.Draw(*this); 
		bLoad.Draw(*this);
		bPath.Draw(*this);
	}

private:
	sCell* world;
	std::vector<sEdge> vEdge;
	BinaryTree tPolyMap;
	olc::Sprite* sprLightCast;
	olc::Sprite* buffLightRay;
	olc::Sprite* buffLightTex;

	cButton bDebug;
	cButton bSave;
	cButton bLoad;
	cButton bPath;

	const int32_t iWorldWidth = 40;
	const int32_t iWorldHeight = 30;
	const int32_t iBlockSize = 16;
};

int main() {
	ShadowCasting demo;
	if (demo.Construct(640, 480, 2, 2))
		demo.Start();

	return 0;
}