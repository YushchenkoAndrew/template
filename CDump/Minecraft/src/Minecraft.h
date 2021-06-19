#pragma once
#include "Engine/GraphicsEngine.h"
#include "include/Noise.h"

#define NOISE_MAP_SIZE 100

#define MAP_SIZE 1
#define MAP_INDEX(X, Z) ((Z) + (X) * MAP_SIZE)

#define CHUNK_SIZE 24
#define CHUNK_INDEX(X, Y, Z) ((Y) + (X) * CHUNK_SIZE + (Z) * CHUNK_SIZE * CHUNK_SIZE)

class sChunk {
public:
	sChunk() { vBlock.reserve(CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE); }

	// TODO: Do not include cube side of the neighbor chunk
	template <class T>
	void Init(sPoint3D vOffset, Type2Type<T>) {
		vOffset *= CHUNK_SIZE;
		vBlock.clear();

		for (int32_t z = 0; z < CHUNK_SIZE; z++) {
			for (int32_t x = 0; x < CHUNK_SIZE; x++) {
				// Maybe just send the vector of Hight for each point
				int32_t yLevel = (int32_t)(T::Noise((float)x + vOffset.x, (float)z + vOffset.z) * CHUNK_SIZE);

				for (int32_t y = 0; y < CHUNK_SIZE; y++) {

					vBlock.push_back({ (float)x + vOffset.x, (float)y + vOffset.y, (float)z + vOffset.z, 0 });
					if (y > yLevel) continue;

					vBlock[CHUNK_INDEX(x, y, z)].bStatus |= EXIST_MASK;

					if (x != 0 && IS_EXIST(vBlock[CHUNK_INDEX(x - 1, y, z)].bStatus)) {
						vBlock[CHUNK_INDEX(x - 1, y, z)].bStatus |= EAST_MASK;
						vBlock[CHUNK_INDEX(x, y, z)].bStatus |= WEST_MASK;
					}

					if (y != 0 && IS_EXIST(vBlock[CHUNK_INDEX(x, y - 1, z)].bStatus)) {
						vBlock[CHUNK_INDEX(x, y - 1, z)].bStatus |= UP_MASK;
						vBlock[CHUNK_INDEX(x, y, z)].bStatus |= DOWN_MASK;
					}

					if (z != 0 && IS_EXIST(vBlock[CHUNK_INDEX(x, y, z - 1)].bStatus)) {
						vBlock[CHUNK_INDEX(x, y, z - 1)].bStatus |= SOUTH_MASK;
						vBlock[CHUNK_INDEX(x, y, z)].bStatus |= NORTH_MASK;
					}
				}
			}
		}
	}


	void LoadMap(std::vector<sTriangle>& vMap);

private:
	std::vector<sBlock> vBlock;
};




class Minecraft {
public:
	Minecraft() : cEngine3D(Type2Type<LambertLightModel>()) { vChunk.assign(MAP_SIZE * MAP_SIZE, {}); }
	~Minecraft() {}

	void Init(int32_t iHeight, int32_t iWidth);
	void Update(olc::PixelGameEngine& GameEngine, MenuManager& mManager, float& fElapsedTime);
	void Draw(olc::PixelGameEngine& GameEngine, MenuManager& mManager);

private:
	void DrawNoise(olc::PixelGameEngine& GameEngine);

	template <class T>
	void InitMap(Type2Type<T>) {
		cEngine3D.trMap.clear();
		for (int32_t x = 0; x < MAP_SIZE; x++) {
			for (int32_t z = 0; z < MAP_SIZE; z++) {
				vChunk[MAP_INDEX(x, z)].Init({ (float)x, 0.0f, (float)z }, Type2Type<T>());
				vChunk[MAP_INDEX(x, z)].LoadMap(cEngine3D.trMap);
			}
		}
	}

private:
	std::vector<sChunk> vChunk;
	GraphicsEngine cEngine3D;
};
