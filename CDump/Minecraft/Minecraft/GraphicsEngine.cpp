#include "GraphicsEngine.h"

void GraphicsEngine::Construct(int32_t iHeight, int32_t iWidth) {
		iScreenHeight = iHeight; iScreenWidth = iWidth;
		fAspectRatio = (float)iScreenHeight / (float)iScreenWidth;

		float fRad = 1.0f / tanf(fFieldOfView * 0.5f / 180.0f * 3.14159f);

		mProjection.MA[0][0] = fAspectRatio * fRad;
		mProjection.MA[1][1] = fRad;
		mProjection.MA[2][2] = fZFar / (fZFar - fZNear);
		mProjection.MA[3][2] = (-fZFar * fZNear) / (fZFar - fZNear);
		mProjection.MA[2][3] = 1.0f;
		mProjection.MA[3][3] = 0.0f;

		mCube.tr = {
			{ 0.0f, 0.0f, 0.0f,    0.0f, 1.0f, 0.0f,    1.0f, 1.0f, 0.0f },
			{ 0.0f, 0.0f, 0.0f,    1.0f, 1.0f, 0.0f,    1.0f, 0.0f, 0.0f },

			{ 1.0f, 0.0f, 0.0f,    1.0f, 1.0f, 0.0f,    1.0f, 1.0f, 1.0f },
			{ 1.0f, 0.0f, 0.0f,    1.0f, 1.0f, 1.0f,    1.0f, 0.0f, 1.0f },

			{ 1.0f, 0.0f, 1.0f,    1.0f, 1.0f, 1.0f,    0.0f, 1.0f, 1.0f },
			{ 1.0f, 0.0f, 1.0f,    0.0f, 1.0f, 1.0f,    0.0f, 0.0f, 1.0f },

			{ 0.0f, 0.0f, 1.0f,    0.0f, 1.0f, 1.0f,    0.0f, 1.0f, 0.0f },
			{ 0.0f, 0.0f, 1.0f,    0.0f, 1.0f, 0.0f,    0.0f, 0.0f, 0.0f },

			{ 0.0f, 1.0f, 0.0f,    0.0f, 1.0f, 1.0f,    1.0f, 1.0f, 1.0f },
			{ 0.0f, 1.0f, 0.0f,    1.0f, 1.0f, 1.0f,    1.0f, 1.0f, 0.0f },

			{ 1.0f, 0.0f, 1.0f,    0.0f, 0.0f, 1.0f,    0.0f, 0.0f, 0.0f },
			{ 1.0f, 0.0f, 1.0f,    0.0f, 0.0f, 0.0f,    1.0f, 0.0f, 0.0f }
		};
}


void GraphicsEngine::Draw(olc::PixelGameEngine &GameEngine, float fElapsedTime) {
	GameEngine.Clear(olc::BLACK);

		Matrix4D matRotZ, matRotX;
		fTheta += 1.0f * fElapsedTime;

		// Rotation Z
		matRotZ.MA[0][0] = cosf(fTheta);
		matRotZ.MA[0][1] = sinf(fTheta);
		matRotZ.MA[1][0] = -sinf(fTheta);
		matRotZ.MA[1][1] = cosf(fTheta);
		matRotZ.MA[2][2] = 1;
		matRotZ.MA[3][3] = 1;

		// Rotation X
		matRotX.MA[0][0] = 1;
		matRotX.MA[1][1] = cosf(fTheta * 0.5f);
		matRotX.MA[1][2] = sinf(fTheta * 0.5f);
		matRotX.MA[2][1] = -sinf(fTheta * 0.5f);
		matRotX.MA[2][2] = cosf(fTheta * 0.5f);
		matRotX.MA[3][3] = 1;

	for (auto& tr : mCube.tr) {
		sTriangle trProjected, trTranslated, trRotatedZ, trRotatedZX;

		MultMatrix(tr.p[0], trRotatedZ.p[0], matRotZ);
		MultMatrix(tr.p[1], trRotatedZ.p[1], matRotZ);
		MultMatrix(tr.p[2], trRotatedZ.p[2], matRotZ);


		MultMatrix(trRotatedZ.p[0], trRotatedZX.p[0], matRotX);
		MultMatrix(trRotatedZ.p[1], trRotatedZX.p[1], matRotX);
		MultMatrix(trRotatedZ.p[2], trRotatedZX.p[2], matRotX);


		trTranslated = trRotatedZX;
		trTranslated.p[0].z += 3.0f;
		trTranslated.p[1].z += 3.0f;
		trTranslated.p[2].z += 3.0f;

		sPoint3D normal, vect1, vect2;
		vect1 = trTranslated.p[1] - trTranslated.p[0];
		vect2 = trTranslated.p[2] - trTranslated.p[0];

		normal.x = vect1.y * vect2.z - vect1.z * vect2.y;
		normal.y = vect1.z * vect2.x - vect1.x * vect2.z;
		normal.z = vect1.x * vect2.y - vect1.y * vect2.x;
		normal /=  sqrtf(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);

		sPoint3D vect3 = normal * (trTranslated.p[0] - vCamera);
		if (vect3.x + vect3.y + vect3.z > 0.0f)
			continue;
			
		sPoint3D light{ 0.0f, 0.0f, -1.0f };
		light /= sqrtf(light.x * light.x + light.y * light.y + light.z * light.z);

		sPoint3D vect4 = normal * light;
		int32_t color = (int32_t)((vect4.x + vect4.y + vect4.z) * 255);

		MultMatrix(trTranslated.p[0], trProjected.p[0], mProjection);
		MultMatrix(trTranslated.p[1], trProjected.p[1], mProjection);
		MultMatrix(trTranslated.p[2], trProjected.p[2], mProjection);

		trProjected.p[0] += 1.0f; trProjected.p[1] += 1.0f; trProjected.p[2] += 1.0f;

		trProjected.p[0].x *= 0.5f * (float)iScreenWidth; trProjected.p[0].y *= 0.5f * (float)iScreenHeight;
		trProjected.p[1].x *= 0.5f * (float)iScreenWidth; trProjected.p[1].y *= 0.5f * (float)iScreenHeight;
		trProjected.p[2].x *= 0.5f * (float)iScreenWidth; trProjected.p[2].y *= 0.5f * (float)iScreenHeight;

		GameEngine.FillTriangle(
			(int32_t)trProjected.p[0].x, (int32_t)trProjected.p[0].y,
			(int32_t)trProjected.p[1].x, (int32_t)trProjected.p[1].y,
			(int32_t)trProjected.p[2].x, (int32_t)trProjected.p[2].y,
			olc::Pixel(color, color, color)
		);

		GameEngine.DrawTriangle(
			(int32_t)trProjected.p[0].x, (int32_t)trProjected.p[0].y,
			(int32_t)trProjected.p[1].x, (int32_t)trProjected.p[1].y,
			(int32_t)trProjected.p[2].x, (int32_t)trProjected.p[2].y,
			olc::BLACK
		);

	}
}


