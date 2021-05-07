#pragma once
#include "olcPixelGameEngine.h"


struct sPoint3D{
	float x, y, z;

	sPoint3D() : x(0.0f), y(0.0f), z(0.0f) {}
	sPoint3D(float x_, float y_, float z_) : x(x_), y(y_), z(z_) {}
	sPoint3D(struct sPoint3D &p) : x(p.x), y(p.y), z(p.z) {}
	sPoint3D(std::vector<float> &v) : x(v[0]), y(v[1]), z(v[2]) {}


	std::vector<float> ToVector() { return std::vector<float>{ x, y, z }; };
	std::vector<float> ToIncreasedVector() { return std::vector<float>{ x, y, z, 1 }; };

	sPoint3D& operator= (std::vector<float> v) { 
		//float w = v.size() > 3 && v[3] != 0.0f ? v[3] : 1.0f;
		float w = 1.0f;
		this->x = v[0] / w; this->y = v[1] / w; this->z = v[2] / w;
		return *this;
	}
};



typedef sPoint3D sVector3D;
typedef std::vector<float> Vector;
typedef std::vector<Vector> Matrix;


struct sTriangle {
	sPoint3D p[3];
};

struct sField {
	std::vector<sTriangle> tr;
};




class GraphicsEngine {
public:
	GraphicsEngine(): mProjection(4, Vector(4, 0)) {
		mProjection[0][0] = fAscpectRation / tanf(fFieldOfView * 0.5f * 3.14159265f);
		mProjection[1][1] = 1 / tanf(fFieldOfView * 0.5f * 3.14159265f);
		mProjection[2][2] = fZFar / (fZFar - fZNear);
		mProjection[3][2] = -fZFar * fZNear / (fZFar - fZNear);
		mProjection[2][3] = 1;

	}

	void Construct(int32_t iHeight, int32_t iWidth);
	void Draw(olc::PixelGameEngine &GameEngine);


private:

	// Basic Function for Matrix Calculation
	Vector MultMatrix(Vector V, Matrix &MA) {
		size_t N = V.size();
		Vector B(N, 0);
		for (size_t i = 0; i < N; i++) {
			for (size_t j = 0; j < N; j++)
				B[i] += V[j] * MA[j][i];
		}
		return B;
	}

	Vector MultMatrix(float fValue, Vector &A) {
		size_t N = A.size();
		Vector B(N, fValue);
		for (size_t i = 0; i < N; i++)
			B[i] *= A[i];
		return B;
	}

	Matrix MultMatrix(Matrix &MA, Matrix &MB) {
		size_t N = MA.size();
		size_t M = MB[0].size();
		size_t K = MA[0].size();
		Matrix MC(N, Vector(M, 0));
		for (size_t i = 0; i < N; i++) {
			for (size_t j = 0; j < M; j++) {
				for (size_t k = 0; k < K; k++)
					MC[i][j] += MA[i][k] * MB[k][j];
			}
		}
		return MC;
	}

	Matrix MultMatrix(float fValue, Matrix MA) {
		size_t N = MA.size();
		size_t M = MA[0].size();
		Matrix MB(N, Vector(M, fValue));
		for (size_t i = 0; i < N; i++)
			for (size_t j = 0; j < M; j++)
				MB[i][j] *= MA[i][j];
		return MB;
	}


	Vector SumMatrix(Vector A, Vector B, float fSub = 1.0f) {
		size_t N = A.size();
		Vector C(N, 0);
		for (size_t i = 0; i < N; i++)
			C[i] = A[i] + B[i] * fSub;
		return C;
	}

	Matrix SumMatrix(Matrix MA, Matrix MB, float fSub = 1.0f) {
		size_t N = MA.size();
		size_t M = MB.size();
		Matrix MC(N, Vector(M, 0));
		for (size_t i = 0; i < N; i++)
			for (size_t j = 0; j < M; j++)
				MC[i][j] = MA[i][j] + MB[i][j] * fSub;
		return MC;
	}

private:
	// Projection Matrix
	const float fZNear = 0.1f;
	const float fZFar = 1000.0f;
	const float fFieldOfView = 90.0f;
	float fAscpectRation;

	int32_t iScreenHeight;
	int32_t iScreenWidth;


	//sField mCube;
	Matrix mProjection;
	sTriangle mCube[12] = {
			{ { {0.0f, 0.0f, 0.0f},  {1.0f, 0.0f, 0.0f},  {1.0f, 1.0f, 0.0f} } },
			{ { {0.0f, 0.0f, 0.0f},  {1.0f, 1.0f, 0.0f},  {1.0f, 0.0f, 0.0f} } },

			{ { {0.0f, 0.0f, 1.0f},  {1.0f, 0.0f, 1.0f},  {1.0f, 1.0f, 1.0f} } },
			{ { {0.0f, 0.0f, 1.0f},  {1.0f, 1.0f, 1.0f},  {1.0f, 0.0f, 1.0f} } },

			{ { {0.0f, 0.0f, 0.0f},  {1.0f, 0.0f, 1.0f},  {0.0f, 0.0f, 1.0f} } },
			{ { {0.0f, 0.0f, 0.0f},  {0.0f, 0.0f, 1.0f},  {1.0f, 0.0f, 1.0f} } },

			{ { {0.0f, 1.0f, 0.0f},  {1.0f, 1.0f, 1.0f},  {0.0f, 1.0f, 1.0f} } },
			{ { {0.0f, 1.0f, 0.0f},  {0.0f, 1.0f, 1.0f},  {1.0f, 1.0f, 1.0f} } },

			{ { {0.0f, 0.0f, 0.0f},  {0.0f, 1.0f, 1.0f},  {0.0f, 0.0f, 1.0f} } },
			{ { {0.0f, 0.0f, 0.0f},  {0.0f, 0.0f, 1.0f},  {0.0f, 1.0f, 1.0f} } },

			{ { {1.0f, 0.0f, 0.0f},  {1.0f, 1.0f, 1.0f},  {1.0f, 0.0f, 1.0f} } },
			{ { {1.0f, 0.0f, 0.0f},  {1.0f, 0.0f, 1.0f},  {1.0f, 1.0f, 1.0f} } }
};
};
