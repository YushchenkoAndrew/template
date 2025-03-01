#pragma once
#include "lib/olcPixelGameEngine.h"
#include <stdint.h>
#include <cmath>
#include <vector>

struct Matrix4D {
	float MA[4][4] = { 0 };

	Matrix4D operator * (const Matrix4D& right) const {
		Matrix4D res;
		for (uint8_t i = 0; i < 4; i++)
			for (uint8_t j = 0; j < 4; j++)
				for (uint8_t k = 0; k < 4; k++)
					res.MA[i][j] += this->MA[i][k] * right.MA[k][j];
		return res;
	}

	Matrix4D operator * (const float& right) const {
		Matrix4D res;
		for (uint8_t i = 0; i < 4; i++)
			for (uint8_t j = 0; j < 4; j++)
				res.MA[i][j] = this->MA[i][j] * right;
		return res;
	}

	static Matrix4D Submatrix(const Matrix4D& m, const uint32_t& row, const uint32_t& col, const uint32_t n = 4u) {
		Matrix4D res;
		for (uint32_t i = 0u; i < n; i++) {
			for (uint32_t j = 0u; j < n; j++) 
				res.MA[i][j] = m.MA[i + (i < row ? 0 : 1)][j + (j < col ? 0 : 1)];
		}
		return res;
	}

	static float det(const Matrix4D& m, const uint32_t n = 4u) { 
		if (n == 2)
			return m.MA[0][0] * m.MA[1][1] - m.MA[0][1] * m.MA[1][0];

		float det = 0.0f;
		for (uint32_t i = 0; i < n; i++) {
			det += m.MA[0][i] * Matrix4D::det(Matrix4D::Submatrix(m, 0, i, n - 1), n - 1) * (i % 2 == 1 ? -1.0f : 1.0f);
		}
		return det;
	}

	static Matrix4D Invert(const Matrix4D& m) {
		float det = Matrix4D::det(m);
		Matrix4D res;
		if (det == 0.0f) return res;
		for (uint8_t i = 0; i < 4; i++) {
			for (uint8_t j = 0; j < 4; j++)
				res.MA[j][i] = Matrix4D::det(Matrix4D::Submatrix(m, i, j, 3), 3) * ((i + j) % 2 == 1 ? -1.0f : 1.0f);
		}
		return res * (1 / det);
	}

	static Matrix4D Identity() {
		Matrix4D m;
		m.MA[0][0] = 1.0f;
		m.MA[1][1] = 1.0f;
		m.MA[2][2] = 1.0f;
		m.MA[3][3] = 1.0f;
		return m;
	}

	static Matrix4D RoutationOZ(float angle) {
		Matrix4D m = Identity();
		m.MA[0][0] = cosf(angle);
		m.MA[0][1] = sinf(angle);
		m.MA[1][0] = -sinf(angle);
		m.MA[1][1] = cosf(angle);
		return m;
	}

	static Matrix4D RoutationOX(float angle) {
		Matrix4D m = Identity();
		m.MA[1][1] = cosf(angle);
		m.MA[1][2] = sinf(angle);
		m.MA[2][1] = -sinf(angle);
		m.MA[2][2] = cosf(angle);
		return m;
	}

	static Matrix4D RoutationOY(float angle) {
		Matrix4D m = Identity();
		m.MA[0][0] = cosf(angle);
		m.MA[0][2] = sinf(angle);
		m.MA[2][0] = -sinf(angle);
		m.MA[2][2] = cosf(angle);
		return m;
	}

	static Matrix4D Translation(float x, float y, float z) {
		Matrix4D m = Identity();
		m.MA[3][0] = x;
		m.MA[3][1] = y;
		m.MA[3][2] = z;
		return m;
	}

	static Matrix4D Projection(float fAspectRatio, float fFieldOfView, float fZFar, float fZNear) {
		float fRad = 1.0f / tanf(fFieldOfView * 0.5f / 180.0f * 3.14159f);

		Matrix4D m;
		m.MA[0][0] = fAspectRatio * fRad;
		m.MA[1][1] = fRad;
		m.MA[2][2] = fZFar / (fZFar - fZNear);
		m.MA[3][2] = (-fZFar * fZNear) / (fZFar - fZNear);
		m.MA[2][3] = 1.0f;
		m.MA[3][3] = 0.0f;
		return m;
	}
};


struct sPoint2D {
	float x = 0.0f;
	float y = 0.0f;

	static inline sPoint2D normalize(const sPoint2D& p) { return p / sPoint2D::length(p); }
	static inline float length(const sPoint2D& p) { return sqrtf(p.x * p.x + p.y * p.y); }
	static inline float dot(const sPoint2D& right, const sPoint2D& left) { return right.x * left.x + right.y * left.y; }

	inline sPoint2D normalize() const { return sPoint2D::normalize(*this); }
	inline float length() const { return sPoint2D::length(*this); }
	inline float dot(const sPoint2D& right) const { return this->x * right.x + this->y * right.y; }

	sPoint2D operator + (const sPoint2D& right) const { return sPoint2D{ this->x + right.x, this->y + right.y }; }
	sPoint2D operator - (const sPoint2D& right) const { return sPoint2D{ this->x - right.x, this->y - right.y }; }
	sPoint2D operator * (const float& w) const { return sPoint2D{ this->x * w, this->y * w }; }
	sPoint2D operator / (const float& w) const { return sPoint2D{ this->x / w, this->y / w }; }
};



struct sPoint3D {
	float x = 0.0f;
	float y = 0.0f;
	float z = 0.0f;

	static inline sPoint3D normalize(const sPoint3D& p) { return p / sPoint3D::length(p); }
	static inline float length(const sPoint3D& p) { return sqrtf(p.x * p.x + p.y * p.y + p.z * p.z); }
	static inline sPoint3D abs(const sPoint3D& p) { return { fabsf(p.x), fabsf(p.y), fabsf(p.z) }; }
	static inline float dot(const sPoint3D& right, const sPoint3D& left) { return right.x * left.x + right.y * left.y + right.z * left.z; }
	static inline float Avg(const sPoint3D& p) { return (p.x + p.y + p.z) / 3.0f; }

	inline sPoint3D normalize() const { return sPoint3D::normalize(*this); }
	inline float length() const { return sPoint3D::length(*this); }
	inline float dot(const sPoint3D& right) const { return this->x * right.x + this->y * right.y + this->z * right.z; }
	inline float Avg() const { return (this->x + this->y + this->z) / 3.0f; }
	inline float GetW(const Matrix4D& MA) { return this->x * MA.MA[0][3] + this->y * MA.MA[1][3] + this->z * MA.MA[2][3] + MA.MA[3][3]; }
	inline sPoint3D cross(const sPoint3D& right) const { 
		return {
			this->y * right.z - this->z * right.y,
			this->z * right.x - this->x * right.z,
			this->x * right.y - this->y * right.x
		}; 
	}

	sPoint3D operator + (const sPoint3D& right) const { return sPoint3D{ this->x + right.x, this->y + right.y, this->z + right.z }; }
	sPoint3D operator + (const float& w) const { return sPoint3D{ this->x + w, this->y + w, this->z + w }; }
	sPoint3D operator - (const sPoint3D& right) const { return sPoint3D{ this->x - right.x, this->y - right.y, this->z - right.z }; }
	sPoint3D operator - (const float& w) const { return sPoint3D{ this->x - w, this->y - w, this->z - w }; }
	sPoint3D operator * (const sPoint3D& right) const { return sPoint3D{ this->x * right.x, this->y * right.y, this->z * right.z }; }
	sPoint3D operator * (const float& w) const { return sPoint3D{ this->x * w, this->y * w, this->z * w }; }
	sPoint3D operator / (const sPoint3D& right) const { return sPoint3D{ this->x / right.x, this->y / right.y, this->z / right.z }; }
	sPoint3D operator / (const float& w) const { return sPoint3D{ this->x / w, this->y / w, this->z / w }; }

	sPoint3D& operator += (const float& w) { this->x += w; this->y += w; this->z += w; return *this; }
	sPoint3D& operator += (const sPoint3D& right) { this->x += right.x; this->y += right.y; this->z += right.z; return *this; }
	sPoint3D& operator -= (const float& w) { this->x -= w; this->y -= w; this->z -= w; return *this; }
	sPoint3D& operator -= (const sPoint3D& right) { this->x -= right.x; this->y -= right.y; this->z -= right.z; return *this; }
	sPoint3D& operator *= (const float& w) { this->x *= w; this->y *= w; this->z *= w; return *this; }
	sPoint3D& operator *= (const sPoint3D& right) { this->x *= right.x; this->y *= right.y; this->z *= right.z; return *this; }
	sPoint3D& operator /= (const float& w) { this->x /= w; this->y /= w; this->z /= w; return *this; }
	sPoint3D& operator /= (const sPoint3D& right) { this->x /= right.x; this->y /= right.y; this->z /= right.z; return *this; }


	sPoint3D operator * (const Matrix4D& MA) const {
		float w = this->x * MA.MA[0][3] + this->y * MA.MA[1][3] + this->z * MA.MA[2][3] + MA.MA[3][3];
		return sPoint3D{ 
			this->x * MA.MA[0][0] + this->y * MA.MA[1][0] + this->z * MA.MA[2][0] + MA.MA[3][0],
			this->x * MA.MA[0][1] + this->y * MA.MA[1][1] + this->z * MA.MA[2][1] + MA.MA[3][1],
			this->x * MA.MA[0][2] + this->y * MA.MA[1][2] + this->z * MA.MA[2][2] + MA.MA[3][2]
		} / (w != 0 ? w : 1.0f); 
	}
};




struct sTriangle {
	sPoint3D p[3];

	inline float AvgX() { return (p[0].x + p[1].x + p[2].x) / 3.0f; }
	inline float AvgY() { return (p[0].y + p[1].y + p[2].y) / 3.0f; }
	inline float AvgZ() { return (p[0].z + p[1].z + p[2].z) / 3.0f; }
	sPoint3D Avg() { return (p[0] + p[1] + p[2]) / 3.0f; }


	sPoint3D& operator[] (const int32_t i) { return p[i]; }
};



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
	void SetPos(float x, float y, float z) { vPos.x = x; vPos.y = y; vPos.z = z; }
	void SetPos(sPoint3D vPos) { this->vPos = vPos; }
	void Update();

	void SetColor(uint8_t red, uint8_t green, uint8_t blue) { nColor = ((uint32_t)red << 16) | ((uint32_t)green << 8) | blue; }
	olc::Pixel GetColor() { return { GetRed(), GetGreen(), GetBlue() }; }
	olc::Pixel GetColor(float fBrightness) { return GetColor() * fBrightness; }

	inline uint8_t GetRed() { return (uint8_t)((nColor & 0xFF0000) >> 16); }
	inline uint8_t GetGreen() { return (uint8_t)((nColor & 0xFF00) >> 8); }
	inline uint8_t GetBlue() { return (uint8_t)((nColor & 0xFF)); }

	inline void SetMask(uint8_t nMask, bool bSet = true) { bStatus = bSet ? (bStatus | nMask) : (bStatus & ~nMask); }
	inline bool HasMask() { return (bool)(~IS_EXIST(bStatus) & (IS_NORTH_N(bStatus) | IS_SOUTH_N(bStatus) | IS_EAST_N(bStatus) | IS_WEST_N(bStatus) | IS_UP_N(bStatus) | IS_DOWN_N(bStatus) )); }

	template <class T>
	bool IsCollide(sPoint3D& vPos) {
		// TODO: At some point
		//if (!IS_EXIST(bStatus)) return false;

		//if (!IS_NORTH_N(bStatus) && T::IsCollide(sPoint2D{vPos.x, vP})) {}

		//if (!IS_SOUTH_N(bStatus)) {}

		//if (!IS_EAST_N(bStatus)) {}

		//if (!IS_WEST_N(bStatus)) {}

		//if (!IS_UP_N(bStatus) && T::IsCollide(sPoint2D{ this->vPos.x , this->vPos.y }, sPoint2D{ vPos.x, vPos.y }, { 1, 1 }, { 1, 1 })) return true;
		if (T::IsCollide(sPoint2D{ this->vPos.x , this->vPos.y }, sPoint2D{ vPos.x, vPos.y }, { 1, 1 }, { 1, 1 })) return true;

		if (!IS_DOWN_N(bStatus)) {}

		return false;
	}

	sPoint3D vPos;
	uint8_t bStatus = 0u;
	uint32_t nColor = 0xFFFFFF;

	std::vector<sTriangle> vMap;
};

