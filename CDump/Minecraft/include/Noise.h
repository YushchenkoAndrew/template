#pragma once
#include <stdint.h>
#include <cmath>

struct sVect2D {
	float x, y;
};

class Random {
public:

	Random(): nHeight(1), nWidth(1) {}
	Random(int32_t height, int32_t width): nHeight(height), nWidth(width) {}


	// Random number generator
	// https://lemire.me/blog/2019/03/19/the-fastest-conventional-random-number-generator-that-can-pass-big-crush/
	uint32_t rand() {
		nRandState += 0xe120fc15;
		uint64_t tmp;
		tmp = (uint64_t)nRandState * 0x4a39b70d;
		uint32_t m1 = (tmp >> 32) ^ tmp;
		tmp = (uint64_t)m1 * 0x12fad5c9;
		uint32_t m2 = (tmp >> 32) ^ tmp;
		return m2;
	}


	// Perlin Noise
	// https://gpfault.net/posts/perlin-noise.txt.html
	float Noise(float x, float y) {
		float x0 = floorf(x); float y0 = floorf(y);
		float x1 = x0 + 1.0f; float y1 = y0 + 0.0f;
		float x2 = x0 + 0.0f; float y2 = y0 + 1.0f;
		float x3 = x0 + 1.0f; float y3 = y0 + 1.0f;

		
		// Look up gradients at lattice points
		sVect2D g0 = grad(x0, y0);
		sVect2D g1 = grad(x1, y1);
		sVect2D g2 = grad(x2, y2);
		sVect2D g3 = grad(x3, y3);

		float t0 = x - x0;
		float fade_t0 = fade(t0);

		float t1 = x - x1;
		float fade_t1 = fade(t1);

		// TODO:
		//float p0p1 = (1.0f - fade_t0) * dot(g0, )
	}


private:
	inline float fade(float t) { return t * t * t * (t * (t * 6.0f - 15.0f) + 10.0f); }

	sVect2D grad(float x, float y) {
		// TODO:
	}


private:
	int32_t nHeight;
	int32_t nWidth;

	uint32_t nRandState = 0u;
};
