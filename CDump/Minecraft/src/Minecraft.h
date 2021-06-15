#pragma once
#include "Engine/GraphicsEngine.h"

#define CHUNK_SIZE 24
#define GET_INDEX(X, Y, Z) ((X) + (Y) * CHUNK_SIZE + (Z) * CHUNK_SIZE * CHUNK_SIZE)
struct sChunk {
	sChunk() { vBlock.reserve(CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE); }

	void Init(int32_t(*fMapGen)(int32_t, int32_t));
	void LoadMap(std::vector<sTriangle>& vMap);

	std::vector<sBlock> vBlock;
};

// TEMP: In future change to Noise function
static int32_t temp(int32_t, int32_t) { return CHUNK_SIZE; }




class Minecraft {
public:
	Minecraft() : vChunk({ {} }) {}
	~Minecraft() {}

	void Init(int32_t iHeight, int32_t iWidth);
	void Update(olc::PixelGameEngine& GameEngine, MenuManager& mManager, float& fElapsedTime);
	void Draw(olc::PixelGameEngine& GameEngine, MenuManager& mManager);


private:
	std::vector<sChunk> vChunk;
	GraphicsEngine cEngine3D;
};
