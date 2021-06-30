#include "Minecraft.h"

void sChunk::LoadMap(std::vector<sBlock*>& vpBlock) {
	for (auto& block : vBlock) {
		block.Update();
		//if (IS_EXIST(block.bStatus)) vpBlock.push_back(std::make_unique<sBlock>(block));
		vpBlock.push_back(&block);
	}
	
}

void sChunk::SetBlock(int32_t x, int32_t y, int32_t z) {
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

	vBlock[CHUNK_INDEX(x, y, z)].Update();
}


void sChunk::ResetBlock(int32_t x, int32_t y, int32_t z) {
}





void Minecraft::Init(int32_t iHeight, int32_t iWidth, LuaScript& luaConfig) {
	nMapSize = luaConfig.GetValue<int32_t>("nMapSize");
	nNoiseSize = luaConfig.GetValue<int32_t>("nNoiseSize");

	vChunk.assign(nMapSize * nMapSize, {}); 
	cEngine3D.Init(iHeight, iWidth, luaConfig);

	InitMap(Type2Type<FractalNoise>());
	for (auto& chunk : vChunk) chunk.LoadMap(cEngine3D.vpBlocks);

	SetBlock(25, CHUNK_SIZE - 1, 1);
}

void Minecraft::Update(olc::PixelGameEngine& GameEngine, MenuManager& mManager, float& fElapsedTime) {
	cEngine3D.Update(GameEngine, mManager, fElapsedTime);

	if (mManager.GetState(eMenuStates::TRUE_NOISE).bPressed) InitMap(Type2Type<TrueNoise>());
	if (mManager.GetState(eMenuStates::PERLIN_NOISE).bPressed) InitMap(Type2Type<PerlinNoise>());
	if (mManager.GetState(eMenuStates::FRACTAL_NOISE).bPressed) InitMap(Type2Type<FractalNoise>());



	// TEMP:
	//sBlock blCamera;
	//blCamera.SetPos(cEngine3D.cCamera.GetPos());
	//blCamera.vPos.z += 5.0f;

	//for (int32_t x = -1; x < 2; x++) {
	//	for (int32_t y = -1; y < 2; y++) {
	//		for (int32_t z = -1; z < 2; z++) {
	//			sBlock blNext = vChunk[0].GetBlock((int32_t)blCamera.vPos.x + x, (int32_t)blCamera.vPos.y + y, (int32_t)blCamera.vPos.z + z);

	//			if (BlockCollision::IsCollide(blCamera, blNext)) {
	//				printf("Collide - (%d, %d, %d)\n", (int32_t)blCamera.vPos.x + x, (int32_t)blCamera.vPos.y + y, (int32_t)blCamera.vPos.z + z);

	//				blNext.bStatus |= EXIST_MASK;
	//				blNext.bStatus &= ~(DOWN_MASK | UP_MASK | WEST_MASK | EAST_MASK | SOUTH_MASK | NORTH_MASK);
	//				blNext.LoadMap(cEngine3D.trMap);
	//			}
	//		}
	//	}
	//}
}

void Minecraft::Draw(olc::PixelGameEngine& GameEngine, MenuManager& mManager) {
	cEngine3D.Draw(GameEngine, mManager);

	if (mManager.GetState(eMenuStates::DRAW_NOISE_YES).bHeld) DrawNoise(GameEngine);
}

void Minecraft::DrawNoise(olc::PixelGameEngine& GameEngine) {
	for (int32_t x = 0; x < nNoiseSize; x++) {
		for (int32_t y = 0; y < nNoiseSize; y++) {
			int32_t color = (int32_t)(FractalNoise::Noise((float)x, (float)y) * 255.0f);
			GameEngine.Draw(x, y, olc::Pixel(color, color, color));
		}
	}
}



void Minecraft::SetBlock(int32_t x, int32_t y, int32_t z) {
	int32_t index = MapIndex(x / CHUNK_SIZE, z / CHUNK_SIZE);
	if (index >= vChunk.size() || y > CHUNK_SIZE) return;
	vChunk[index].SetBlock(x, y, z);
}


void Minecraft::ResetBlock(int32_t x, int32_t y, int32_t z) {
	int32_t index = MapIndex(x / CHUNK_SIZE, z / CHUNK_SIZE);
	if (index >= vChunk.size() || y > CHUNK_SIZE) return;
	vChunk[index].ResetBlock(x, y, z);
}

