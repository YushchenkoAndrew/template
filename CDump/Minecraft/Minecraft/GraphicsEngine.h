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

#define TRIANGLE_OUTSIDE	12u
#define TRIANGLE_INSIDE		3u
#define TRIANGLE_SMALL		9u
#define TRIANGLE_QAUD		13u


class GraphicsEngine {
public:
	GraphicsEngine() {}
	~GraphicsEngine() {}

	void Construct(int32_t iHeight, int32_t iWidth);
	Matrix4D CameraPointAt(sPoint3D& vPos, sPoint3D& vTarget, sPoint3D& vUp);
	sPoint3D IntersectionLinePlane(sPoint3D& pPlane, sPoint3D& vPlane, sPoint3D& pStart, sPoint3D& pEnd);
	uint8_t ClipTriangle(sPoint3D pPlane, sPoint3D vPlane, sTriangle& iTr, sTriangle& oTr1, sTriangle& oTr2);
	void Draw(olc::PixelGameEngine &GameEngine, float fElapsedTime);

private:
	int32_t iScreenHeight = 0;
	int32_t iScreenWidth = 0;

	float fTheta = 0.0f;
	float fYaw = 0.0f;
	float fPitch = 0.0f;

	Matrix4D mProjection;
	sField mCube;
	sPoint3D vCamera;
	sPoint3D vLookDir;
	sPoint3D vTemp;
};
