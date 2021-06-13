#pragma once
#include "Engine/GraphicsEngine.h"

#define CHUNK_SIZE 24
#define GET_INDEX(X, Y, Z) ((X) + (Y) * CHUNK_SIZE + (Z) * CHUNK_SIZE * CHUNK_SIZE)

#define NORTH_MASK	((1 << 0))
#define SOUTH_MASK	((1 << 1))
#define EAST_MASK	((1 << 2))
#define WEST_MASK	((1 << 3))
#define UP_MASK		((1 << 4))
#define DOWN_MASK	((1 << 5))
#define EXIST_MASK	((1 << 6))

#define IS_NORTH_N(X)	(((X) & NORTH_MASK))
#define IS_SOUTH_N(X)	((X) & SOUTH_MASK)
#define IS_EAST_N(X)	((X) & EAST_MASK)
#define IS_WEST_N(X)	((X) & WEST_MASK)
#define IS_UP_N(X)		((X) & UP_MASK)
#define IS_DOWN_N(X)	((X) & DOWN_MASK)
#define IS_EXIST(X)		((X) & EXIST_MASK)

struct sBlock {

	void LoadMap(std::vector<sTriangle>& vMap) {
		if (!IS_EXIST(bStatus)) return;

		if (!IS_NORTH_N(bStatus)) {
			vMap.push_back({ pPos.x + 0.0f, pPos.y + 0.0f, pPos.z + 0.0f,    pPos.x + 0.0f, pPos.y + 1.0f, pPos.z + 0.0f,    pPos.x + 1.0f, pPos.y + 1.0f, pPos.z + 0.0f });
			vMap.push_back({ pPos.x + 0.0f, pPos.y + 0.0f, pPos.z + 0.0f,    pPos.x + 1.0f, pPos.y + 1.0f, pPos.z + 0.0f,    pPos.x + 1.0f, pPos.y + 0.0f, pPos.z + 0.0f });
		}

		if (!IS_SOUTH_N(bStatus)) {
			vMap.push_back({ pPos.x + 1.0f, pPos.y + 0.0f, pPos.z + 1.0f,    pPos.x + 1.0f, pPos.y + 1.0f, pPos.z + 1.0f,    pPos.x + 0.0f, pPos.y + 1.0f, pPos.z + 1.0f });
			vMap.push_back({ pPos.x + 1.0f, pPos.y + 0.0f, pPos.z + 1.0f,    pPos.x + 0.0f, pPos.y + 1.0f, pPos.z + 1.0f,    pPos.x + 0.0f, pPos.y + 0.0f, pPos.z + 1.0f });
		}

		if (!IS_EAST_N(bStatus)) {
				vMap.push_back({ pPos.x + 1.0f, pPos.y + 0.0f, pPos.z + 0.0f,    pPos.x + 1.0f, pPos.y + 1.0f, pPos.z + 0.0f,    pPos.x + 1.0f, pPos.y + 1.0f, pPos.z + 1.0f });
				vMap.push_back({ pPos.x + 1.0f, pPos.y + 0.0f, pPos.z + 0.0f,    pPos.x + 1.0f, pPos.y + 1.0f, pPos.z + 1.0f,    pPos.x + 1.0f, pPos.y + 0.0f, pPos.z + 1.0f });
		}

		if (!IS_WEST_N(bStatus)) {
				vMap.push_back({ pPos.x + 0.0f, pPos.y + 0.0f, pPos.z + 1.0f,    pPos.x + 0.0f, pPos.y + 1.0f, pPos.z + 1.0f,    pPos.x + 0.0f, pPos.y + 1.0f, pPos.z + 0.0f });
				vMap.push_back({ pPos.x + 0.0f, pPos.y + 0.0f, pPos.z + 1.0f,    pPos.x + 0.0f, pPos.y + 1.0f, pPos.z + 0.0f,    pPos.x + 0.0f, pPos.y + 0.0f, pPos.z + 0.0f });
		}

		if (!IS_UP_N(bStatus)) {
				vMap.push_back({ pPos.x + 0.0f, pPos.y + 1.0f, pPos.z + 0.0f,    pPos.x + 0.0f, pPos.y + 1.0f, pPos.z + 1.0f,    pPos.x + 1.0f, pPos.y + 1.0f, pPos.z + 1.0f });
				vMap.push_back({ pPos.x + 0.0f, pPos.y + 1.0f, pPos.z + 0.0f,    pPos.x + 1.0f, pPos.y + 1.0f, pPos.z + 1.0f,    pPos.x + 1.0f, pPos.y + 1.0f, pPos.z + 0.0f });
		}

		if (!IS_DOWN_N(bStatus)) {
				vMap.push_back({ pPos.x + 1.0f, pPos.y + 0.0f, pPos.z + 1.0f,    pPos.x + 0.0f, pPos.y + 0.0f, pPos.z + 1.0f,    pPos.x + 0.0f, pPos.y + 0.0f, pPos.z + 0.0f });
				vMap.push_back({ pPos.x + 1.0f, pPos.y + 0.0f, pPos.z + 1.0f,    pPos.x + 0.0f, pPos.y + 0.0f, pPos.z + 0.0f,    pPos.x + 1.0f, pPos.y + 0.0f, pPos.z + 0.0f });
		}
	}

	sPoint3D pPos;
	uint8_t bStatus;
};

struct sChunk {
	sChunk() { vBlock.reserve(CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE); }

	void Init(int32_t (*fMapGen)(int32_t, int32_t)) {
		for (int32_t z = 0; z < CHUNK_SIZE; z++) {
			for (int32_t y = 0; y < CHUNK_SIZE; y++) {
				for (int32_t x = 0; x < CHUNK_SIZE; x++) {
					// Maybe just send the vector of Hight for each point
					int32_t zLevel = fMapGen(x, y);

					vBlock.push_back({(float)x, (float)y, (float)z, 0});
					if (z > zLevel) break;

					vBlock[GET_INDEX(x, y, z)].bStatus |= EXIST_MASK;

					if (x != 0 && IS_EXIST(vBlock[GET_INDEX(x - 1, y, z)].bStatus)) {
						vBlock[GET_INDEX(x - 1, y, z)].bStatus |= EAST_MASK;
						vBlock[GET_INDEX(x, y, z)].bStatus |= WEST_MASK;
					}

					if (y != 0 && IS_EXIST(vBlock[GET_INDEX(x, y - 1, z)].bStatus)) {
						vBlock[GET_INDEX(x, y - 1, z)].bStatus |= UP_MASK;
						vBlock[GET_INDEX(x, y, z)].bStatus |= DOWN_MASK;
					}

					if (z != 0 && IS_EXIST(vBlock[GET_INDEX(x, y, z - 1)].bStatus)) {
						vBlock[GET_INDEX(x, y, z - 1)].bStatus |= SOUTH_MASK;
						vBlock[GET_INDEX(x, y, z)].bStatus |= NORTH_MASK;
					}
				}
			}
		}
	}

	void LoadMap(std::vector<sTriangle>& vMap) {
		for (auto& block : vBlock) {
			block.LoadMap(vMap);
		}
	}

	std::vector<sBlock> vBlock;
};

// TEMP: In future change to Noise function
int32_t temp(int32_t, int32_t) { return CHUNK_SIZE; }

class Minecraft {

public:
	Minecraft() { vChunk.push_back({}); }

	void Init() { for (auto& chunk : vChunk) chunk.Init(temp); };
	void LoadMap(std::vector<sTriangle>& vMap) { for (auto& chunk : vChunk) chunk.LoadMap(vMap); }

private:
	std::vector<sChunk> vChunk;
};
