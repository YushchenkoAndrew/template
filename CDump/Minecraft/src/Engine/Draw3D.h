#pragma once
#include "lib/olcPixelGameEngine.h"
#include <cmath>
#include <vector>

class GraphicsEngine;

class Draw3D {
public:
	Draw3D() : nScreenHeight(0), nScreenWidth(0) {}

	void Init(int32_t iHeight, int32_t iWidth);
	void Update();

	void DrawLine(olc::PixelGameEngine& GameEngine, int32_t x1, int32_t y1, float z1, int32_t x2, int32_t y2, float z2, olc::Pixel p);
	void DrawTriangle(olc::PixelGameEngine& GameEngine, int32_t x1, int32_t y1, float z1, int32_t x2, int32_t y2, float z2, int32_t x3, int32_t y3, float z3, olc::Pixel p);
	void FillTriangle(olc::PixelGameEngine& GameEngine, int32_t x1, int32_t y1, float z1, int32_t x2, int32_t y2, float z2, int32_t x3, int32_t y3, float z3, olc::Pixel p);

private:
	inline void swap(int32_t& x, int32_t& y) { x = x ^ y; y = x ^ y; x = x ^ y; }
	inline void swap(float& x, float& y) { float z = x; x = y; y = z; }

	friend class GraphicsEngine;

private:
	int32_t nScreenHeight;
	int32_t nScreenWidth;

	std::vector<float> zBuffer;
};
