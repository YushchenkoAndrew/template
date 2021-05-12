#include "GraphicsEngine.h"

void GraphicsEngine::Construct(int32_t iHeight, int32_t iWidth) {
	iScreenHeight = iHeight; iScreenWidth = iWidth;

	// Projection Matrix
	mProjection = Matrix4D::Projection((float)iScreenHeight / (float)iScreenWidth, 90.0f, 1000.0f, 0.1f);

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

	if (GameEngine.GetKey(olc::W).bHeld)
		vCamera.y += 8.0f * fElapsedTime;

	if (GameEngine.GetKey(olc::S).bHeld)
		vCamera.y -= 8.0f * fElapsedTime;

	if (GameEngine.GetKey(olc::D).bHeld)
		vCamera.x += 8.0f * fElapsedTime;

	if (GameEngine.GetKey(olc::A).bHeld)
		vCamera.x -= 8.0f * fElapsedTime;



	Matrix4D mRotation, mTranslated;
	fTheta += 1.0f * fElapsedTime;

	// Rotation ZX
	mRotation = Matrix4D::RoutationOZ(0.3) * Matrix4D::RoutationOX(0.5f);
	//mRotation = Matrix4D::Identity();

	// Translated
	mTranslated = Matrix4D::Translation(0.0f, 0.0f, 3.0f);

	vLookDir = { 0, 0, 1 };
	sPoint3D vUp = { 0, 1, 0 };
	sPoint3D vTarget = vCamera + vLookDir;
	Matrix4D mView = Matrix4D::Invert(CameraPointAt(vCamera, vTarget, vUp));

	for (auto& tr : mCube.tr) {
		sTriangle trProjected, trTranslated, trView;

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

		trView.p[0] = trTranslated.p[0] * mView;
		trView.p[1] = trTranslated.p[1] * mView;
		trView.p[2] = trTranslated.p[2] * mView;

		trProjected.p[0] = trView.p[0] * mProjection + 1.0f;
		trProjected.p[1] = trView.p[1] * mProjection + 1.0f;
		trProjected.p[2] = trView.p[2] * mProjection + 1.0f;

		//trProjected.p[0] = trTranslated.p[0] * mProjection + 1.0f;
		//trProjected.p[1] = trTranslated.p[1] * mProjection + 1.0f;
		//trProjected.p[2] = trTranslated.p[2] * mProjection + 1.0f;

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


