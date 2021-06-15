#include "Minecraft.h"

void sChunk::Init(int32_t (*fMapGen)(int32_t, int32_t)) {
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

void sChunk::LoadMap(std::vector<sTriangle>& vMap) {
	for (auto& block : vBlock) {
		block.LoadMap(vMap);
	}
}




void Minecraft::Init(int32_t iHeight, int32_t iWidth) {
	cEngine3D.Init(iHeight, iWidth);

	for (auto& chunk : vChunk) {
		chunk.Init(temp); 
		chunk.LoadMap(cEngine3D.trMap);
	}
}

void Minecraft::Update(olc::PixelGameEngine& GameEngine, MenuManager& mManager, float& fElapsedTime) {
	cEngine3D.Update(GameEngine, mManager, fElapsedTime);
}


void Minecraft::Draw(olc::PixelGameEngine& GameEngine, MenuManager& mManager) {
	cEngine3D.Draw(GameEngine, mManager);
}
