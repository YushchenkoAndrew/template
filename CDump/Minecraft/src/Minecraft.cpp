#include "Minecraft.h"

void sChunk::LoadMap(std::vector<sBlock*>& vpBlock) {
	for (auto& block : vBlock) {
		block.Update();
		//if (IS_EXIST(block.bStatus)) vpBlock.push_back(std::make_unique<sBlock>(block));
		vpBlock.push_back(&block);
	}
	
}

void sChunk::SetMaskBlock(int32_t x, int32_t y, int32_t z, bool bStatus, sChunk* pWestChunk, sChunk* pEastChunk, sChunk* pNorthChunk, sChunk* pSouthChunk) {
	vBlock[CHUNK_INDEX(x, y, z)].bStatus |= EXIST_MASK;

	if (x != 0 && IS_EXIST(vBlock[CHUNK_INDEX(x - 1, y, z)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(WEST_MASK, bStatus);
		vBlock[CHUNK_INDEX(x - 1, y, z)].SetMask(EAST_MASK, bStatus);
		vBlock[CHUNK_INDEX(x - 1, y, z)].Update();
	}

	if (y != 0 && IS_EXIST(vBlock[CHUNK_INDEX(x, y - 1, z)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(DOWN_MASK, bStatus);
		vBlock[CHUNK_INDEX(x, y - 1, z)].SetMask(UP_MASK, bStatus);
		vBlock[CHUNK_INDEX(x, y - 1, z)].Update();
	}

	if (z != 0 && IS_EXIST(vBlock[CHUNK_INDEX(x, y, z - 1)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(NORTH_MASK, bStatus);
		vBlock[CHUNK_INDEX(x, y, z - 1)].SetMask(SOUTH_MASK, bStatus);
		vBlock[CHUNK_INDEX(x, y, z - 1)].Update();
	}


	if (x != CHUNK_SIZE - 1 && IS_EXIST(vBlock[CHUNK_INDEX(x + 1, y, z)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(EAST_MASK, bStatus);
		vBlock[CHUNK_INDEX(x + 1, y, z)].SetMask(WEST_MASK, bStatus);
		vBlock[CHUNK_INDEX(x + 1, y, z)].Update();
	}

	if (y != CHUNK_SIZE - 1 && IS_EXIST(vBlock[CHUNK_INDEX(x, y + 1, z)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(UP_MASK, bStatus);
		vBlock[CHUNK_INDEX(x, y + 1, z)].SetMask(DOWN_MASK, bStatus);
		vBlock[CHUNK_INDEX(x, y + 1, z)].Update();
	}

	if (z != CHUNK_SIZE - 1 && IS_EXIST(vBlock[CHUNK_INDEX(x, y, z + 1)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(SOUTH_MASK, bStatus);
		vBlock[CHUNK_INDEX(x, y, z + 1)].SetMask(NORTH_MASK, bStatus);
		vBlock[CHUNK_INDEX(x, y, z + 1)].Update();
	}



	// Check neighbors Chunk
	if (x == 0 && pWestChunk != nullptr && IS_EXIST(pWestChunk->vBlock[CHUNK_INDEX(CHUNK_SIZE - 1, y, z)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(WEST_MASK, bStatus);
		pWestChunk->vBlock[CHUNK_INDEX(CHUNK_SIZE - 1, y, z)].SetMask(EAST_MASK, bStatus);
		pWestChunk->vBlock[CHUNK_INDEX(CHUNK_SIZE - 1, y, z)].Update();
	}

	if (z == 0 && pNorthChunk != nullptr && IS_EXIST(pNorthChunk->vBlock[CHUNK_INDEX(x, y, CHUNK_SIZE - 1)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(NORTH_MASK, bStatus);
		pNorthChunk->vBlock[CHUNK_INDEX(x, y, CHUNK_SIZE - 1)].SetMask(SOUTH_MASK, bStatus);
		pNorthChunk->vBlock[CHUNK_INDEX(x, y, CHUNK_SIZE - 1)].Update();
	}

	// Check neighbors Chunk
	if (x == CHUNK_SIZE - 1 && pEastChunk != nullptr && IS_EXIST(pEastChunk->vBlock[CHUNK_INDEX(0, y, z)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(EAST_MASK, bStatus);
		pEastChunk->vBlock[CHUNK_INDEX(0, y, z)].SetMask(WEST_MASK, bStatus);
		pEastChunk->vBlock[CHUNK_INDEX(0, y, z)].Update();
	}

	if (z == CHUNK_SIZE - 1 && pSouthChunk != nullptr && IS_EXIST(pSouthChunk->vBlock[CHUNK_INDEX(x, y, 0)].bStatus)) {
		vBlock[CHUNK_INDEX(x, y, z)].SetMask(SOUTH_MASK, bStatus);
		pSouthChunk->vBlock[CHUNK_INDEX(x, y, 0)].SetMask(NORTH_MASK, bStatus);
		pSouthChunk->vBlock[CHUNK_INDEX(x, y, 0)].Update();
	}


	vBlock[CHUNK_INDEX(x, y, z)].Update();
}


sBlock* const sChunk::GetBlock(int32_t x, int32_t y, int32_t z) {
	return &vBlock[CHUNK_INDEX(x, y, z)];
}



void Minecraft::Init(int32_t iHeight, int32_t iWidth, LuaScript& luaConfig) {
	nMapSize = luaConfig.GetTableValue<int32_t>(nullptr, "nMapSize");
	nNoiseSize = luaConfig.GetTableValue<int32_t>(nullptr, "nNoiseSize");

	// Init Menu
	mManager.Init(luaConfig.GetTableValue<std::string>(nullptr, "sMenuConfig"), luaConfig);
    sprMenu = std::make_unique<olc::Sprite>(luaConfig.GetTableValue<std::string>(nullptr, "sMenuSprite"));
    decMenu = std::make_unique<olc::Decal>(sprMenu.get());

	vChunk.assign(nMapSize * nMapSize, {}); 
	cEngine3D.Init(iHeight, iWidth, luaConfig);

	InitMap(Type2Type<FractalNoise>(), mManager.GetState(eMenuStates::DRAW_OUTLINE).bHeld);

	SetBlock(24, CHUNK_SIZE - 1, 0);
	SetBlock(23, CHUNK_SIZE - 1, 0);
}

void Minecraft::Update(olc::PixelGameEngine& GameEngine, const float& fElapsedTime) {
	mManager.Update(GameEngine);
	cEngine3D.Update(GameEngine, mManager, fElapsedTime);

	//if (mManager.GetState(eMenuStates::TRUE_NOISE).bPressed) InitMap(Type2Type<TrueNoise>());
	//if (mManager.GetState(eMenuStates::PERLIN_NOISE).bPressed) InitMap(Type2Type<PerlinNoise>());
	//if (mManager.GetState(eMenuStates::FRACTAL_NOISE).bPressed) InitMap(Type2Type<FractalNoise>());

	//if (mManager.GetState(eMenuStates::DRAW_OUTLINE).bPressed || mManager.GetState(eMenuStates::DRAW_OUTLINE).bRealeased) {
	//	if (mManager.GetState(eMenuStates::TRUE_NOISE).bHeld) InitMap(Type2Type<TrueNoise>());
	//	if (mManager.GetState(eMenuStates::PERLIN_NOISE).bHeld) InitMap(Type2Type<PerlinNoise>());
	//	if (mManager.GetState(eMenuStates::FRACTAL_NOISE).bHeld) InitMap(Type2Type<FractalNoise>());
	//}

	// FIXME:
	sPoint3D vMapRange = sPoint3D::abs(cEngine3D.cCamera.GetPos() - vWorldPos);
	if (vMapRange.z > (float)(nMapLoadRange + nMapSize * 0.5f) * CHUNK_SIZE) {
		InitMap(Type2Type<FractalNoise>(), vWorldPos + sPoint3D{ 0.0f, 0.0f, 24.0f });
	}


	//// TEMP:
	//sBlock blCamera;
	//blCamera.SetPos(cEngine3D.cCamera.GetPos());
	//float temp = blCamera.vPos.z;
	////blCamera.vPos.z -= 2.0f;

	//for (int32_t x = -1; x < 2; x++) {
	//	for (int32_t y = -1; y < 2; y++) {
	//		for (int32_t z = -1; z < 2; z++) {
	//			sBlock* blNext = GetBlock((int32_t)(blCamera.vPos.x + x), (int32_t)(blCamera.vPos.y + y), (int32_t)(blCamera.vPos.z + z));
	//			if (blNext == nullptr) continue;

	//			if (blNext->IsCollide<sRectanleCollision>(blCamera.vPos)) {
	//				//printf("Collide - (%d, %d, %d)\n", (int32_t)blCamera.vPos.x + x, (int32_t)blCamera.vPos.y + y, (int32_t)blCamera.vPos.z + z);

	//				SetBlock((int32_t)(blCamera.vPos.x + x), (int32_t)(blCamera.vPos.y + y), (int32_t)(blCamera.vPos.z + z));
	//				//blCamera.vPos.z -= 2.0f;
	//			}
	//		}
	//	}
	//}
}

void Minecraft::Draw(olc::PixelGameEngine& GameEngine, const float& fElapsedTime) {
	bool bFreeToDraw = true;
    mManager.Draw(GameEngine, decMenu, fElapsedTime);

	if (mManager.GetState(eMenuStates::DRAW_NOISE_YES).bHeld) { DrawNoise(GameEngine); bFreeToDraw = false; }

	// Collision
	if (mManager.GetState(eMenuStates::DRAW_RECTANGLE_COLLISION).bHeld) { DrawCollision<sRectanleCollision>(GameEngine); bFreeToDraw = false; }
	if (mManager.GetState(eMenuStates::DRAW_DIAGONAL_COLLISION).bHeld) { DrawCollision<sDiagonalCollision>(GameEngine); bFreeToDraw = false; }
	if (mManager.GetState(eMenuStates::DRAW_DIAGONAL_STAT_COLLISION).bHeld) { DrawCollision<sDiagonalStaticCollision>(GameEngine); bFreeToDraw = false; }
	if (mManager.GetState(eMenuStates::DRAW_AXIS_COLLISION).bHeld) { DrawCollision<sSeparatedAxisCollision>(GameEngine); bFreeToDraw = false; }
	if (mManager.GetState(eMenuStates::DRAW_AXIS_STAT_COLLISION).bHeld) { DrawCollision<sSeparatedAxisStaticCollision>(GameEngine); bFreeToDraw = false; }


	if (bFreeToDraw) cEngine3D.Draw(GameEngine, mManager);
}

void Minecraft::DrawNoise(olc::PixelGameEngine& GameEngine) {
	for (int32_t x = 0; x < nNoiseSize; x++) {
		for (int32_t y = 0; y < nNoiseSize; y++) {
			int32_t color = (int32_t)(FractalNoise::Noise((float)x, (float)y) * 255.0f);
			GameEngine.Draw(x, y, olc::Pixel(color, color, color));
		}
	}
}

sBlock* const Minecraft::GetBlock(int32_t x, int32_t y, int32_t z) {
	int32_t x_ = x / CHUNK_SIZE;
	int32_t z_ = z / CHUNK_SIZE;
	int32_t index = MapIndex(x_, z_);
	if (x < 0 || z < 0 || index >= int32_t(vChunk.size()) || y > CHUNK_SIZE) return nullptr;
	return vChunk[index].GetBlock(x % CHUNK_SIZE, y, z % CHUNK_SIZE);
}


void Minecraft::SetBlock(int32_t x, int32_t y, int32_t z) {
	int32_t x_ = x / CHUNK_SIZE;
	int32_t z_ = z / CHUNK_SIZE;
	int32_t index = MapIndex(x_, z_);
	int32_t size = int32_t(vChunk.size());
	if (x < 0 || z < 0 || index >= size || y > CHUNK_SIZE) return;
	vChunk[index].SetMaskBlock(
		x % CHUNK_SIZE, y, z % CHUNK_SIZE, true,
		x_ ? &vChunk[MapIndex(x_ - 1, z_)] : nullptr,
		MapIndex(x_ + 1, z_) < size ? &vChunk[MapIndex(x_ + 1, z_)] : nullptr,
		z_ ? &vChunk[MapIndex(x_, z_ - 1)] : nullptr,
		MapIndex(x_, z_ + 1) < size ? &vChunk[MapIndex(x_, z_ + 1)] : nullptr
	);
}


void Minecraft::ResetBlock(int32_t x, int32_t y, int32_t z) {
	int32_t x_ = x / CHUNK_SIZE;
	int32_t z_ = z / CHUNK_SIZE;
	int32_t index = MapIndex(x_, z_);
	int32_t size = int32_t(vChunk.size());
	if (x < 0 || z < 0 || index >= size || y > CHUNK_SIZE) return;
	vChunk[index].SetMaskBlock(
		x % CHUNK_SIZE, y, z % CHUNK_SIZE, false,
		x_ ? &vChunk[MapIndex(x_ - 1, z_)] : nullptr,
		size / nMapSize > x_ ? &vChunk[MapIndex(x_ + 1, z_)] : nullptr,
		z_ ? &vChunk[MapIndex(x_, z_ - 1)] : nullptr,
		MapIndex(x_, z_ + 1) < size ? &vChunk[MapIndex(x_, z_ + 1)] : nullptr
	);
}

