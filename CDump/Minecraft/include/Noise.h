#pragma once
#include <stdint.h>
#include <cmath>
#include "src/Engine/Objects3D.h"

class Noise {
public:

	// Random number generator
	// https://lemire.me/blog/2019/03/19/the-fastest-conventional-random-number-generator-that-can-pass-big-crush/
	static uint32_t rand() {
		GetRandState() += 0xe120fc15;
		uint64_t tmp;
		tmp = (uint64_t)GetRandState() * 0x4a39b70d;
		uint32_t m1 = (uint32_t)((tmp >> 32) ^ tmp);
		tmp = (uint64_t)m1 * 0x12fad5c9;
		uint32_t m2 = (uint32_t)((tmp >> 32) ^ tmp);
		return m2;
	}

	static float PerlinNoise(float x, float y) {
		sPoint2D p{ x, y };
		return PerlinNoise(p);
	}

	// Perlin Noise
	// https://gpfault.net/posts/perlin-noise.txt.html
	static float PerlinNoise(const sPoint2D& p) {
		sPoint2D p0{ floorf(p.x), floorf(p.y) };
		sPoint2D p1 = p0 + sPoint2D{ 1.0f, 0.0f };
		sPoint2D p2 = p0 + sPoint2D{ 0.0f, 1.0f };
		sPoint2D p3 = p0 + sPoint2D{ 1.0f, 1.0f };

		// Look up gradients at lattice points
		sPoint2D g0 = grad(p0);
		sPoint2D g1 = grad(p1);
		sPoint2D g2 = grad(p2);
		sPoint2D g3 = grad(p3);

		float t0 = p.x - p0.x;
		float fade_t0 = fade(t0);

		float t1 = p.y - p0.y;
		float fade_t1 = fade(t1);

		float p0p1 = (1.0f - fade_t0) * sPoint2D::dot(g0, p - p0) + fade_t0 * sPoint2D::dot(g1, p - p1);
		float p2p3 = (1.0f - fade_t0) * sPoint2D::dot(g2, p - p2) + fade_t0 * sPoint2D::dot(g3, p - p3);

		return (1.0f - fade_t1) * p0p1 + fade_t1 * p2p3;
	}

	static float FractalNoise(float x, float y) {
		sPoint2D p{ x, y };
		return
			PerlinNoise(p / 64.0f) * 1.0f +
			PerlinNoise(p / 32.0f) * 0.5f +
			PerlinNoise(p / 16.0f) * 0.25f +
			PerlinNoise(p / 8.0f) * 0.125f;
	}


private:
	static inline float fade(float t) { return t * t * t * (t * (t * 6.0f - 15.0f) + 10.0f); }

	static sPoint2D grad(const sPoint2D& p) {
		float random = 2920.0f * sinf(p.x * 21942.0f + p.y * 171324.0f + 8912.0f) * cosf(p.x * 23157.0f * p.y * 217832.0f + 9758.0f);
		return sPoint2D::normalize({ cosf(random), sinf(random) });
	}


	static inline uint32_t& GetRandState() {
		static uint32_t nRandState = 0u;
		return nRandState;
	}
};


// Some envelopes
struct TrueNoise {
	static inline float Noise(float, float) { return 1.0f; }
};

struct PerlinNoise {
	static inline float Noise(float x, float y) { return (Noise::PerlinNoise(x, y) + 1.0f) / 2.0f; }
};

struct FractalNoise {
	static inline float Noise(float x, float y) { return (Noise::FractalNoise(x, y) + 1.0f) / 2.0f; }
};
