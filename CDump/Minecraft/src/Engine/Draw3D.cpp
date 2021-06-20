#pragma once
#include "Draw3D.h"

void Draw3D::Init(int32_t iHeight, int32_t iWidth) {
	nScreenHeight = iHeight; nScreenWidth = iWidth;

	zBuffer.assign(iHeight * iWidth, 0.0f);
}

void Draw3D::Update() {
	zBuffer.assign(nScreenHeight * nScreenWidth, 0.0f);
}

// Using the implementation of Bresenham Algorithm
// https://jstutorial.medium.com/how-to-code-your-first-algorithm-draw-a-line-ca121f9a1395
void Draw3D::DrawLine(olc::PixelGameEngine& GameEngine, int32_t x1, int32_t y1, float z1, int32_t x2, int32_t y2, float z2, olc::Pixel p) {
	if (y1 == y2 && x1 == x2) return;

	auto sign = [](int32_t& x) { return x > 0 ? 1 : -1; };

	// Calculate line deltas
	int32_t dx = x2 - x1;
	int32_t dy = y2 - y1;
	float dz = z2 - z1;

	int32_t dx1 = abs(dx);
	int32_t dy1 = abs(dy);
	float dz1 = fabsf(dz);

	// Calculate error intervals for both axis
	int32_t px = 2 * dy1 - dx1;
	int32_t py = 2 * dx1 - dy1;
	bool bDraw = false;

	if (dy1 <= dx1) {
		if (x1 > x2) { swap(y1, y2); swap(x1, x2); swap(z1, z2); }
		dx = x2 - x1; dy = y2 - y1;

		float sz = z1, ez = z2;
		int32_t sx = x1, ex = x2, y = y1;

		for (int32_t x = sx; x < ex; x++) {
			if (px < 0) px += 2 * dy1;
			else { y += sign(dy); px += 2 * (dy1 - dx1); }

			// Correct depth error, by finding 'y' by interpolation
			int32_t sy = y1 + (int32_t)((x - sx) * dy / dx1);
			float q = dy1 ? (float)(sy - y1) / dy1 : (float)(x - sx) / dx1;
			float z = 1.0f / ((1.0f - q) / sz + q / ez);

			// Not the best solution but for now it's enough
			// The code below just check if we can draw any point 
			// in the line if so then draw it
			if (z >= zBuffer[sy * nScreenWidth + x]) { bDraw = true; break; }
		}
		
		if (bDraw) GameEngine.DrawLine(sx, y1, ex, y2, p);
		return;
	}

	if (y1 > y2) { swap(y1, y2); swap(x1, x2); swap(z1, z2); }
	dx = x2 - x1; dy = y2 - y1;

	float sz = z1, ez = z2;
	int32_t sy = y1, ey = y2, x = x1;

	for (int32_t y = sy; y < ey; y++) {
		if (py <= 0) py += 2 * dx1;
		else { x -= sign(dx); py += 2 * (dx1 - dy1); }

		// Correct depth error, by finding 'x' by interpolation
		int32_t sx = x1 + (int32_t)((y - sy) * dx / dy1);
		float q = dx1 ? ((float)(sx - x1) / dx1) : ((float)(y - sy) / dy1);
		float z = 1.0f / ((1.0f - q) / sz + q / ez);

		// Not the best solution but for now it's enough
		// The code below just check if we can draw any point 
		// in the line if so then draw it
		if (z >= zBuffer[y * nScreenWidth + sx]) { bDraw = true; break; }
	}

	if (bDraw) GameEngine.DrawLine(x1, sy, x2, ey, p);
}

void Draw3D::DrawTriangle(olc::PixelGameEngine& GameEngine, int32_t x1, int32_t y1, float z1, int32_t x2, int32_t y2, float z2, int32_t x3, int32_t y3, float z3, olc::Pixel p) {
	DrawLine(GameEngine, x1, y1, z1, x2, y2, z2, p);
	DrawLine(GameEngine, x1, y1, z1, x3, y3, z3, p);
	DrawLine(GameEngine, x2, y2, z2, x3, y3, z3, p);
}

// Using this implementation of  Bresenham method
// http://www.sunshine2k.de/coding/java/TriangleRasterization/TriangleRasterization.html#pointintrianglearticle
// https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/visibility-problem-depth-buffer-depth-interpolation
void Draw3D::FillTriangle(olc::PixelGameEngine& GameEngine, int32_t x1, int32_t y1, float z1, int32_t x2, int32_t y2, float z2, int32_t x3, int32_t y3, float z3, olc::Pixel p) {
	float dax = 1.0f;
	float dbx = 1.0f;
	float daz = 1.0f;
	float dbz = 1.0f;

	auto DrawLine = [&](int32_t sx, int32_t ex, int32_t y, float sz, float ez) {
		float step =  1.0f / (float)(ex - sx);
		float q = 0.0f;

		for (int i = sx; i <= ex; i++) {
			float z = 1.0f / ((1.0f - q) / sz + q / ez);
			q += step;

			if (z >= zBuffer[y * nScreenWidth + i]) {
				GameEngine.Draw(i, y, p);
				zBuffer[y * nScreenWidth + i] = z;
			}
		}
	};

    // Sort vertices's
	if (y1 > y2) { swap(y1, y2); swap(x1, x2); swap(z1, z2); }
	if (y1 > y3) { swap(y1, y3); swap(x1, x3); swap(z1, z3); }
	if (y2 > y3) { swap(y2, y3); swap(x2, x3); swap(z2, z3); }

	int32_t dx1 = x2 - x1;
	int32_t dy1 = y2 - y1;
	float dz1 = z2 - z1;

	int32_t dx2 = x3 - x1;
	int32_t dy2 = y3 - y1;
	float dz2 = z3 - z1;

	if (dy1) {
		dax = dx1 / (float)abs(dy1);
		daz = dz1 / (float)abs(dy1);
	}

	if (dy2) {
		dbx = dx2 / (float)abs(dy2);
		dbz = dz2 / (float)abs(dy2);
	}

	if (dy1) {
		for (int32_t i = y1; i <= y2; i++) {
			int32_t sx = x1 + (int32_t)((i - y1) * dax);
			int32_t ex = x1 + (int32_t)((i - y1) * dbx);

			float sz = (float)z1 + (float)((i - y1) * daz);
			float ez = (float)z1 + (float)((i - y1) * dbz);

			if (sx > ex) { swap(sx, ex); swap(sz, ez); }
			DrawLine(sx, ex, i, sz, ez);
		}
	}

	dx1 = x3 - x2;
	dy1 = y3 - y2;
	dz1 = z3 - z2;

	if (!dy1) return;

	dax = dx1 / (float)abs(dy1);
	daz = dz1 / (float)abs(dy1);

	for (int32_t i = y2; i <= y3; i++) {
		int32_t sx = x2 + (int32_t)((i - y2) * dax);
		int32_t ex = x1 + (int32_t)((i - y1) * dbx);

		float sz = (float)z2 + (float)((i - y2) * daz);
		float ez = (float)z1 + (float)((i - y1) * dbz);

		if (sx > ex) { swap(sx, ex); swap(sz, ez); }
		DrawLine(sx, ex, i, sz, ez);
	}
}
