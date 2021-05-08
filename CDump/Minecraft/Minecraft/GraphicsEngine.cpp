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

		Matrix4D mRotation, mTranslated;
		fTheta += 1.0f * fElapsedTime;

		// Rotation ZX
		mRotation = Matrix4D::RoutationOZ(fTheta) * Matrix4D::RoutationOX(fTheta * 0.5f);

		// Translated
		mTranslated = Matrix4D::Identity();
		mTranslated.MA[3][2] = 3.0f;

	for (auto& tr : mCube.tr) {
		sTriangle trProjected, trTranslated;

		trTranslated.p[0] = tr.p[0] * mRotation * mTranslated;
		trTranslated.p[1] = tr.p[1] * mRotation * mTranslated;
		trTranslated.p[2] = tr.p[2] * mRotation * mTranslated;


		sPoint3D normal, vect1, vect2;
		vect1 = trTranslated.p[1] - trTranslated.p[0];
		vect2 = trTranslated.p[2] - trTranslated.p[0];
		normal = vect1.cross(vect2).normalize();

		if (normal.prod(trTranslated.p[0] - vCamera) > 0.0f)
			continue;
			
		sPoint3D light{ 0.0f, 0.0f, -1.0f };
		int32_t color = (int32_t)(normal.prod(light.normalize()) * 255);

		trProjected.p[0] = trTranslated.p[0] * mProjection + 1.0f;
		trProjected.p[1] = trTranslated.p[1] * mProjection + 1.0f;
		trProjected.p[2] = trTranslated.p[2] * mProjection + 1.0f;

		trProjected.p[0].x *= 0.5f * (float)iScreenWidth; trProjected.p[0].y *= 0.5f * (float)iScreenHeight;
		trProjected.p[1].x *= 0.5f * (float)iScreenWidth; trProjected.p[1].y *= 0.5f * (float)iScreenHeight;
		trProjected.p[2].x *= 0.5f * (float)iScreenWidth; trProjected.p[2].y *= 0.5f * (float)iScreenHeight;

		GameEngine.FillTriangle(
			(int32_t)trProjected.p[0].x, (int32_t)trProjected.p[0].y,
			(int32_t)trProjected.p[1].x, (int32_t)trProjected.p[1].y,
			(int32_t)trProjected.p[2].x, (int32_t)trProjected.p[2].y,
			olc::Pixel(color, color, color)
		);

		//GameEngine.DrawTriangle(
		//	(int32_t)trProjected.p[0].x, (int32_t)trProjected.p[0].y,
		//	(int32_t)trProjected.p[1].x, (int32_t)trProjected.p[1].y,
		//	(int32_t)trProjected.p[2].x, (int32_t)trProjected.p[2].y,
		//	olc::BLACK
		//);

	}
}


