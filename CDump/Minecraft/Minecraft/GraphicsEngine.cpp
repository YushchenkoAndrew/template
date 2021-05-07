#include "GraphicsEngine.h"

void GraphicsEngine::Construct(int32_t iHeight, int32_t iWidth) {
		iScreenHeight = iHeight; iScreenWidth = iWidth;
		fAscpectRation = (float)iScreenHeight / (float)iScreenWidth;
}


void GraphicsEngine::Draw(olc::PixelGameEngine &GameEngine) {
	GameEngine.Clear(olc::RED);

	for (auto& tr : mCube) {
		sTriangle temp;
		temp.p[0] = MultMatrix(tr.p[0].ToIncreasedVector(), mProjection);
		temp.p[1] = MultMatrix(tr.p[1].ToIncreasedVector(), mProjection);
		temp.p[2] = MultMatrix(tr.p[2].ToIncreasedVector(), mProjection);

		//temp.p[0].x += 1.0f; temp.p[0].y += 1.0f; temp.p[0].z += 1.0f;
		//temp.p[1].x += 1.0f; temp.p[1].y += 1.0f; temp.p[1].z += 1.0f;
		//temp.p[2].x += 1.0f; temp.p[2].y += 1.0f; temp.p[2].z += 1.0f;

		//temp.p[0].x *= 0.5f * (float)iScreenWidth; temp.p[0].y *= 0.5f * (float)iScreenHeight;
		//temp.p[1].x *= 0.5f * (float)iScreenWidth; temp.p[1].y *= 0.5f * (float)iScreenHeight;
		//temp.p[2].x *= 0.5f * (float)iScreenWidth; temp.p[2].y *= 0.5f * (float)iScreenHeight;


		olc::vi2d mouse = GameEngine.GetMousePos();
		GameEngine.DrawLine((int32_t)temp.p[0].x, (int32_t)temp.p[0].y, mouse.x, mouse.y);
		//GameEngine->DrawCircle((int32_t)temp.p[1].x, (int32_t)temp.p[1].y, 5);
		//GameEngine->DrawCircle((int32_t)temp.p[2].x, (int32_t)temp.p[2].y, 5);

		//GameEngine->DrawTriangle(
		//	(int32_t)temp.p[0].x, (int32_t)temp.p[0].y,
		//	(int32_t)temp.p[1].x, (int32_t)temp.p[1].y,
		//	(int32_t)temp.p[2].x, (int32_t)temp.p[2].y
		//);
	}
}


