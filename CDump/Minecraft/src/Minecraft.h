#pragma once
#include "Engine/GraphicsEngine.h"
#include "Engine/Collision.h"
#include "include/Noise.h"

#define CHUNK_SIZE 24
#define CHUNK_INDEX(X, Y, Z) ((Y) + (X) * CHUNK_SIZE + (Z) * CHUNK_SIZE * CHUNK_SIZE)

class sChunk {
public:
	sChunk() { vBlock.reserve(CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE); }

	template <class T>
	void Init(sPoint3D vOffset, const bool& bOutline, const bool& bLastChunkX,const bool& bLastChunkZ, sChunk* pWestChunk, sChunk* pNorthChunk) {
		vOffset *= CHUNK_SIZE;
		vBlock.clear();

		for (int32_t z = 0; z < CHUNK_SIZE; z++) {
			for (int32_t x = 0; x < CHUNK_SIZE; x++) {
				// Maybe just send the vector of Hight for each point
				int32_t yLevel = (int32_t)(T::Noise((float)x + vOffset.x, (float)z + vOffset.z) * CHUNK_SIZE);

				for (int32_t y = 0; y < CHUNK_SIZE; y++) {

					vBlock.push_back({ (float)x + vOffset.x, (float)y + vOffset.y, (float)z + vOffset.z, 0 });
					if (y > yLevel) continue;

					vBlock[CHUNK_INDEX(x, y, z)].SetMask(EXIST_MASK);

					if (x != 0 && IS_EXIST(vBlock[CHUNK_INDEX(x - 1, y, z)].bStatus)) {
						vBlock[CHUNK_INDEX(x - 1, y, z)].SetMask(EAST_MASK);
						vBlock[CHUNK_INDEX(x, y, z)].SetMask(WEST_MASK);
					}

					if (y != 0 && IS_EXIST(vBlock[CHUNK_INDEX(x, y - 1, z)].bStatus)) {
						vBlock[CHUNK_INDEX(x, y - 1, z)].SetMask(UP_MASK);
						vBlock[CHUNK_INDEX(x, y, z)].SetMask(DOWN_MASK);
					}

					if (z != 0 && IS_EXIST(vBlock[CHUNK_INDEX(x, y, z - 1)].bStatus)) {
						vBlock[CHUNK_INDEX(x, y, z - 1)].SetMask(SOUTH_MASK);
						vBlock[CHUNK_INDEX(x, y, z)].SetMask(NORTH_MASK);
					}


					// Check neighbors Chunk
					if (x == 0) {
						if (pWestChunk != nullptr && IS_EXIST(pWestChunk->vBlock[CHUNK_INDEX(CHUNK_SIZE - 1, y, z)].bStatus)) {
							pWestChunk->vBlock[CHUNK_INDEX(CHUNK_SIZE - 1, y, z)].SetMask(EAST_MASK);
							vBlock[CHUNK_INDEX(x, y, z)].SetMask(WEST_MASK);
						}
						else if (!bOutline && pWestChunk == nullptr) vBlock[CHUNK_INDEX(x, y, z)].SetMask(WEST_MASK);
					}

					if (z == 0) {
						if (pNorthChunk != nullptr && IS_EXIST(pNorthChunk->vBlock[CHUNK_INDEX(x, y, CHUNK_SIZE - 1)].bStatus)) {
							pNorthChunk->vBlock[CHUNK_INDEX(x, y, CHUNK_SIZE - 1)].SetMask(SOUTH_MASK);
							vBlock[CHUNK_INDEX(x, y, z)].SetMask(NORTH_MASK);
						} 
						else if (!bOutline && pNorthChunk == nullptr) vBlock[CHUNK_INDEX(x, y, z)].SetMask(NORTH_MASK);
					}


					if (!bOutline) {
						if (y == 0) vBlock[CHUNK_INDEX(x, y, z)].SetMask(DOWN_MASK);
						if (y == CHUNK_SIZE - 1) vBlock[CHUNK_INDEX(x, y, z)].SetMask(UP_MASK);

						if (x == CHUNK_SIZE - 1 && bLastChunkX) vBlock[CHUNK_INDEX(x, y, z)].SetMask(EAST_MASK);
						if (z == CHUNK_SIZE - 1 && bLastChunkZ) vBlock[CHUNK_INDEX(x, y, z)].SetMask(SOUTH_MASK);
					}
				}
			}
		}
	}


	void LoadMap(std::vector<sBlock*>& vpBlock);

	sBlock* const GetBlock(int32_t x, int32_t y, int32_t z);
	void SetMaskBlock(int32_t x, int32_t y, int32_t z, bool bStatus, sChunk* pWestChunk, sChunk* pEastChunk, sChunk* pNorthChunk, sChunk* pSouthChunk);

private:
	std::vector<sBlock> vBlock;
};




class Minecraft {
public:
	Minecraft() : cEngine3D(Type2Type<LambertLightModel>()) {}
	~Minecraft() {}

	void Init(int32_t iHeight, int32_t iWidth, LuaScript& luaConfig);
	void Update(olc::PixelGameEngine& GameEngine, const float& fElapsedTime);
	void Draw(olc::PixelGameEngine& GameEngine, const float& fElapsedTime);

	sBlock* const GetBlock(int32_t x, int32_t y, int32_t z);
	void SetBlock(int32_t x, int32_t y, int32_t z);
	void ResetBlock(int32_t x, int32_t y, int32_t z);

	bool IsFinished() { return !mManager.GetState(eMenuStates::EXIT).bPressed; }

private:
	void DrawNoise(olc::PixelGameEngine& GameEngine);
	inline int32_t MapIndex(int32_t x, int32_t z) { return z + x * nMapSize; }

	template <class T>
	void InitMap(Type2Type<T>, const bool& bOutline) {
		for (int32_t x = 0; x < nMapSize; x++) {
			for (int32_t z = 0; z < nMapSize; z++) {
				vChunk[MapIndex(x, z)].Init<T>(
					{ (float)x, 0.0f, (float)z }, bOutline,
					x == nMapSize - 1, z == nMapSize - 1,
					x ? &vChunk[MapIndex(x - 1, z)] : nullptr,
					z ? &vChunk[MapIndex(x, z - 1)] : nullptr
				);
			}
		}

		for (auto& chunk : vChunk) chunk.LoadMap(cEngine3D.vpBlocks);
	}

	template <class T>
	void DrawCollision(olc::PixelGameEngine& GameEngine) {
		olc::vf2d vMainBlock = { GameEngine.ScreenWidth() / 2.0f, GameEngine.ScreenHeight() / 2.0f };
		olc::vf2d vMouse = GameEngine.GetMousePos();

		GameEngine.DrawRect(vMainBlock - olc::vi2d(50, 50), { 100, 100 }, T::IsCollide(vMouse, vMainBlock, { 20.0f, 20.0f }, { 100.0f, 100.0f }) ? olc::RED : olc::YELLOW);
		GameEngine.DrawRect(vMouse - olc::vi2d(10, 10), { 20, 20 }, olc::YELLOW);
	}


private:
	int32_t nMapSize = 1;
	int32_t nNoiseSize = 0;

	std::vector<sChunk> vChunk;
	GraphicsEngine cEngine3D;

    MenuManager mManager;
    std::unique_ptr<olc::Sprite> sprMenu;
    std::unique_ptr<olc::Decal> decMenu;
};
