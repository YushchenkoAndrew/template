#pragma once
#include "olcPixelGameEngine.h"


struct sPoint3D {
	float x, y, z;

	sPoint3D operator + (const sPoint3D& right) const { return sPoint3D{ this->x + right.x, this->y + right.y, this->z + right.z }; }
	sPoint3D operator - (const sPoint3D& right) const { return sPoint3D{ this->x - right.x, this->y - right.y, this->z - right.z }; }
	sPoint3D operator * (const sPoint3D& right) const { return sPoint3D{ this->x * right.x, this->y * right.y, this->z * right.z }; }
	sPoint3D operator / (const sPoint3D& right) const { return sPoint3D{ this->x / right.x, this->y / right.y, this->z / right.z }; }

	sPoint3D& operator += (const float &w) { this->x += w; this->y += w; this->z += w; return *this; }
	sPoint3D& operator -= (const float &w) { this->x -= w; this->y -= w; this->z -= w; return *this; }
	sPoint3D& operator *= (const float &w) { this->x *= w; this->y *= w; this->z *= w; return *this; }
	sPoint3D& operator /= (const float &w) { this->x /= w; this->y /= w; this->z /= w; return *this; }
};


struct sTriangle {
	sPoint3D p[3];
};

struct sField {
	std::vector<sTriangle> tr;
};


struct Matrix4D {
	float MA[4][4] = { 0 };
};


class GraphicsEngine {
public:
	GraphicsEngine() {}
	~GraphicsEngine() {}

	void Construct(int32_t iHeight, int32_t iWidth);
	void Draw(olc::PixelGameEngine &GameEngine, float fElapsedTime);


private:
	// Basic Function for Matrix Calculation
	void MultMatrix(sPoint3D &iV, sPoint3D &oV, Matrix4D &MA) {
		oV.x = iV.x * MA.MA[0][0] + iV.y * MA.MA[1][0] + iV.z * MA.MA[2][0] + MA.MA[3][0];
		oV.y = iV.x * MA.MA[0][1] + iV.y * MA.MA[1][1] + iV.z * MA.MA[2][1] + MA.MA[3][1];
		oV.z = iV.x * MA.MA[0][2] + iV.y * MA.MA[1][2] + iV.z * MA.MA[2][2] + MA.MA[3][2];
		float w = iV.x * MA.MA[0][3] + iV.y * MA.MA[1][3] + iV.z * MA.MA[2][3] + MA.MA[3][3];

		if (w != 0.0f) oV /= w;
	}

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
