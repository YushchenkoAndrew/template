#include "Minecraft.h"

void sChunk::LoadMap(std::vector<sTriangle>& vMap) {
	for (auto& block : vBlock) {
		block.LoadMap(vMap);
	}
}




void Minecraft::Init(int32_t iHeight, int32_t iWidth) {
	cEngine3D.Init(iHeight, iWidth);

	InitMap(Type2Type<FractalNoise>());
}

void Minecraft::Update(olc::PixelGameEngine& GameEngine, MenuManager& mManager, float& fElapsedTime) {
	cEngine3D.Update(GameEngine, mManager, fElapsedTime);

	if (mManager.GetState(eMenuStates::TRUE_NOISE).bPressed) InitMap(Type2Type<TrueNoise>());
	if (mManager.GetState(eMenuStates::PERLIN_NOISE).bPressed) InitMap(Type2Type<PerlinNoise>());
	if (mManager.GetState(eMenuStates::FRACTAL_NOISE).bPressed) InitMap(Type2Type<FractalNoise>());
}


void Minecraft::Draw(olc::PixelGameEngine& GameEngine, MenuManager& mManager) {
	cEngine3D.Draw(GameEngine, mManager);

	if (mManager.GetState(eMenuStates::DRAW_NOISE_YES).bHeld) DrawNoise(GameEngine);
}

void Minecraft::DrawNoise(olc::PixelGameEngine& GameEngine) {
	for (int32_t x = 0; x < NOISE_MAP_SIZE; x++) {
		for (int32_t y = 0; y < NOISE_MAP_SIZE; y++) {
			int32_t color = (int32_t)(FractalNoise::Noise((float)x, (float)y) * 255.0f);
			GameEngine.Draw(x, y, olc::Pixel(color, color, color));
		}
	}
}
