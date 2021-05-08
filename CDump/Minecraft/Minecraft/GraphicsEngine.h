#pragma once
#include "olcPixelGameEngine.h"

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
};

struct sPoint3D {
	float x = 0.0f;
	float y = 0.0f;
	float z = 0.0f;


	float length() const { return sqrtf(this->x * this->x + this->y * this->y + this->z * this->z); }
	sPoint3D normalize() const { return *this / length(); }
	float prod(const sPoint3D& right) const { return this->x * right.x + this->y * right.y + this->z * right.z; }
	sPoint3D cross(const sPoint3D& right) const { 
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
};

struct sField {
	std::vector<sTriangle> tr;
};


class GraphicsEngine {
public:
	GraphicsEngine() {}
	~GraphicsEngine() {}

	void Construct(int32_t iHeight, int32_t iWidth);
	void Draw(olc::PixelGameEngine &GameEngine, float fElapsedTime);

private:
	// Projection Matrix
	const float fZNear = 0.1f;
	const float fZFar = 1000.0f;
	const float fFieldOfView = 90.0f;
	float fAspectRatio = 0.0f;

	int32_t iScreenHeight = 0;
	int32_t iScreenWidth = 0;

	float fTheta = 0.0f;

	Matrix4D mProjection;
	sField mCube;
	sPoint3D vCamera;
};
