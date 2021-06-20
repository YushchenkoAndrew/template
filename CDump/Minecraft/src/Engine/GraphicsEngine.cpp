#include "GraphicsEngine.h"

void GraphicsEngine::Init(int32_t iHeight, int32_t iWidth) {
	cDraw.Init(iHeight, iWidth);
	zBuffer.assign(iHeight * iWidth, 0.0f);

	vMouseLast.x = (float)iWidth / 2.0f;
	vMouseLast.y = (float)iHeight / 2.0f;

	// Projection Matrix
	mProjection = Matrix4D::Projection((float)iHeight / (float)iWidth, 90.0f, 1000.0f, 0.1f);

	lightSrc->Init(10.0f, 30.0f, 10.0f);
	lightSrc->LoadBlock(trMap);
}

Matrix4D GraphicsEngine::CameraPointAt(sPoint3D& vPos, sPoint3D& vTarget) {
	sPoint3D vUp = { 0.0f, 1.0f, 0.0f };
	sPoint3D vDirection = sPoint3D::normalize(vPos - vTarget);
	sPoint3D vNewRight = vUp.cross(vDirection).normalize();
	sPoint3D vNewUp = vDirection.cross(vNewRight);

	Matrix4D m;
	m.MA[0][0] = vNewRight.x;	m.MA[0][1] = vNewRight.y;	m.MA[0][2] = vNewRight.z;	m.MA[0][3] = 0.0f;
	m.MA[1][0] = vNewUp.x;		m.MA[1][1] = vNewUp.y;		m.MA[1][2] = vNewUp.z;		m.MA[1][3] = 0.0f;
	m.MA[2][0] = vDirection.x;	m.MA[2][1] = vDirection.y;	m.MA[2][2] = vDirection.z;	m.MA[2][3] = 0.0f;
	m.MA[3][0] = vPos.x;		m.MA[3][1] = vPos.y;		m.MA[3][2] = vPos.z;		m.MA[3][3] = 1.0f;
	return m;
}

sPoint3D GraphicsEngine::IntersectionLinePlane(sPoint3D& pPlane, sPoint3D& vPlane, sPoint3D& pStart, sPoint3D& pEnd) {
	sPoint3D nPlane = vPlane.normalize();
	float ad = pStart.dot(nPlane);
	float t = (nPlane.dot(pPlane) - ad) / (pEnd.dot(nPlane) - ad);
	return pStart + (pEnd - pStart) * t;
}

uint8_t GraphicsEngine::ClipTriangle(sPoint3D pPlane, sPoint3D vPlane, sTriangle& iTr, sTriangle& oTr1, sTriangle& oTr2) {
	sPoint3D nPlane = vPlane.normalize();

	// Find distance from point to plane
	auto dist = [&](sPoint3D& p) { return nPlane.dot(p) - nPlane.dot(pPlane); };

	uint32_t uInside = 0u; uint32_t uOutside = 0u;
	sPoint3D arrInside[3]; sPoint3D arrOutside[3];

	// Find points location and save it in array
	if (dist(iTr.p[0]) >= 0) arrInside[uInside++] = iTr.p[0];
	else arrOutside[uOutside++] = iTr.p[0];
	if (dist(iTr.p[1]) >= 0) arrInside[uInside++] = iTr.p[1];
	else arrOutside[uOutside++] = iTr.p[1];
	if (dist(iTr.p[2]) >= 0) arrInside[uInside++] = iTr.p[2];
	else arrOutside[uOutside++] = iTr.p[2];

	// Return the num of triangle to draw based on there location
	switch ((uOutside << 2) | uInside)
	{
		// All points are outside of the plane
		case TRIANGLE_OUTSIDE: return 0;

		// All points are inside which mean that we need just to draw our
		// input Triangle
		case TRIANGLE_INSIDE: {
			oTr1 = iTr;
			return 1u;
		}

		// One of the point is located inside end the rest of it
		// outside, which mean that small Triangle is created
		case TRIANGLE_SMALL: {

			// Save the inside point
			oTr1.p[0] = arrInside[0];

			// And the rest of it should be recalculated based on 
			// intersection with the Plane
			oTr1.p[1] = IntersectionLinePlane(pPlane, vPlane, arrInside[0], arrOutside[0]);
			oTr1.p[2] = IntersectionLinePlane(pPlane, vPlane, arrInside[0], arrOutside[1]);
			return 1u;
		}

		// Two points are located inside end the last one is outside
		case TRIANGLE_QAUD: {

			// Save the inside point
			oTr1.p[0] = arrInside[0];
			oTr1.p[1] = arrInside[1];

			// Recalculated point based on Intersection
			oTr1.p[2] = IntersectionLinePlane(pPlane, vPlane, arrInside[0], arrOutside[0]);

			// Second triangle is use one point inside and new calculated point
			// for the first triangle
			oTr2.p[0] = arrInside[1];
			oTr2.p[1] = oTr1.p[2];
			oTr2.p[2] = IntersectionLinePlane(pPlane, vPlane, arrInside[1], arrOutside[0]);

			return 2u;
		}

		default:
			return 0u;
	}
}

void GraphicsEngine::ClipByScreenEdge(std::list<sTriangle>& listClippedTr) {
	float fWidth = (float)cDraw.nScreenWidth - 1.0f;
	float fHeight = (float)cDraw.nScreenHeight - 1.0f;

	size_t nUnClippedTr = 1u;
	sTriangle trClipped[2];

	for (uint8_t i = 0u; i < 4u; i++) {
		uint8_t nClippedTr = 0u;

		while (nUnClippedTr > 0u) {
			sTriangle trFront = listClippedTr.front();
			listClippedTr.pop_front();
			nUnClippedTr--;

			switch (i)
			{
				case 0u: nClippedTr = ClipTriangle({ 0.0f, 0.0f, 0.0f }, { 1.0f, 0.0f, 0.0f }, trFront, trClipped[0], trClipped[1]); break;
				case 1u: nClippedTr = ClipTriangle({ 0.0f, 0.0f, 0.0f }, { 0.0f, 1.0f, 0.0f }, trFront, trClipped[0], trClipped[1]); break;
				case 2u: nClippedTr = ClipTriangle({ fWidth, 0.0f, 0.0f }, { -1.0f, 0.0f, 0.0f }, trFront, trClipped[0], trClipped[1]); break;
				case 3u: nClippedTr = ClipTriangle({ 0.0f, fHeight, 0.0f }, { 0.0f, -1.0f, 0.0f }, trFront, trClipped[0], trClipped[1]); break;
			}

			for (uint8_t j = 0u; j < nClippedTr; j++)
				listClippedTr.push_back(trClipped[j]);
		}

		nUnClippedTr = listClippedTr.size();
	}
}

// Camera Methods
void GraphicsEngine::CameraLookAt(olc::PixelGameEngine &GameEngine) {

	// Calculate camera rotation based on Mouse Position
	olc::vi2d vMouse = GameEngine.GetMousePos();
	GameEngine.DrawCircle(vMouse.x, vMouse.y, 7);

	vMouseOffset.x = (float)((int32_t)((float)vMouse.x - vMouseLast.x) * MOUSE_SPEED);
	vMouseOffset.y = (float)((int32_t)(vMouseLast.y - (float)vMouse.y) * MOUSE_SPEED);

	if (bFixedMousePos) {
		GameEngine.LockMousePos((int32_t)(cDraw.nScreenWidth / 2), (int32_t)(cDraw.nScreenHeight / 2));
		vMouse = GameEngine.GetLockedMousePos();
	}

	vMouseLast.x = (float)vMouse.x;
	vMouseLast.y = (float)vMouse.y;

	fYaw += vMouseOffset.x;
	fPitch += vMouseOffset.y;

	if (fPitch > 89.0f) fPitch = 89.0f;
	if (fPitch < -89.0f) fPitch = -89.0f;

	auto funcToRadians = [](const float fAngle) { return fAngle * 0.5f / 180.0f * 3.14159f; };


	vLookDir = { 
		cosf(funcToRadians(fYaw)) * cos(funcToRadians(fPitch)),
		sinf(funcToRadians(fPitch)),
		sinf(funcToRadians(fYaw)) * cos(funcToRadians(fPitch)),
	};

	vLookDir = sPoint3D::normalize(vLookDir);
}

void GraphicsEngine::CameraMove(olc::PixelGameEngine &GameEngine, float& fElapsedTime) {
	sPoint3D vUp = { 0.0f, 1.0f, 0.0f };

	if (GameEngine.GetKey(olc::W).bHeld && !GameEngine.GetKey(olc::SHIFT).bHeld)
		vCamera -= vLookDir * CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::S).bHeld && !GameEngine.GetKey(olc::SHIFT).bHeld)
		vCamera += vLookDir * CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::W).bHeld && GameEngine.GetKey(olc::SHIFT).bHeld)
		vCamera.y += CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::S).bHeld && GameEngine.GetKey(olc::SHIFT).bHeld)
		vCamera.y -= CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::D).bHeld)
		vCamera += sPoint3D::normalize(vLookDir.cross(vUp)) * CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::A).bHeld)
		vCamera -= sPoint3D::normalize(vLookDir.cross(vUp)) * CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::ESCAPE).bPressed) bFixedMousePos = false;
	if (GameEngine.GetMouse(0).bPressed) bFixedMousePos = true;
}

void GraphicsEngine::Update(olc::PixelGameEngine& GameEngine, MenuManager& mManager, float& fElapsedTime) {
	if (mManager.InUse()) return;
	cDraw.Update();

	CameraLookAt(GameEngine);
	CameraMove(GameEngine, fElapsedTime);

	// Calculate camera direction and View Matrix
	vTarget = vCamera - vLookDir;
	mView = Matrix4D::Invert(CameraPointAt(vCamera, vTarget));
}

void GraphicsEngine::Draw(olc::PixelGameEngine &GameEngine, MenuManager& mManager) {
	sPoint3D normal, vect1, vect2;
	sTriangle trProjected, trTranslated, trView;

	sTriangle trClipped[2];
	std::list<sTriangle> listClippedTr;

	for (auto& tr : trMap) {
		trTranslated[0] = tr[0] * mTranslated;
		trTranslated[1] = tr[1] * mTranslated;
		trTranslated[2] = tr[2] * mTranslated;


		vect1 = trTranslated[1] - trTranslated[0];
		vect2 = trTranslated[2] - trTranslated[0];
		normal = sPoint3D::normalize(vect1.cross(vect2));

		if (normal.dot(trTranslated.p[0] - vCamera) > 0.0f) continue;
		int32_t color = lightSrc->GetLight(tr.Avg(), normal, mManager.GetState(eMenuStates::DISTRIBUTE_EN).bHeld);


		trView[0] = trTranslated[0] * mView;
		trView[1] = trTranslated[1] * mView;
		trView[2] = trTranslated[2] * mView;


		uint8_t nClippedTr = ClipTriangle({ 0.0f, 0.0f, -0.1f }, { 0.0f, 0.0f, -1.0f }, trView, trClipped[0], trClipped[1]);

		for (uint8_t i = 0; i < nClippedTr; i++) {

			trProjected[0] = trClipped[i][0] * mProjection + 1.0f;
			trProjected[1] = trClipped[i][1] * mProjection + 1.0f;
			trProjected[2] = trClipped[i][2] * mProjection + 1.0f;

			trProjected[0].x *= 0.5f * (float)cDraw.nScreenWidth; trProjected[0].y *= 0.5f * (float)cDraw.nScreenHeight;
			trProjected[1].x *= 0.5f * (float)cDraw.nScreenWidth; trProjected[1].y *= 0.5f * (float)cDraw.nScreenHeight;
			trProjected[2].x *= 0.5f * (float)cDraw.nScreenWidth; trProjected[2].y *= 0.5f * (float)cDraw.nScreenHeight;


			listClippedTr.clear();
			listClippedTr.push_back(trProjected);
			ClipByScreenEdge(listClippedTr);

			for (auto& trClipped : listClippedTr) {
				if (mManager.GetState(eMenuStates::COLOR_EN).bHeld) {
					cDraw.FillTriangle(GameEngine,
						(int32_t)trClipped[0].x, (int32_t)trClipped[0].y, trClipped[0].z,
						(int32_t)trClipped[1].x, (int32_t)trClipped[1].y, trClipped[1].z,
						(int32_t)trClipped[2].x, (int32_t)trClipped[2].y, trClipped[2].z,
						mManager.GetState(eMenuStates::SHADOW_EN).bHeld ? olc::Pixel(color, color, color) : olc::WHITE
					);
				}

				if (mManager.GetState(eMenuStates::EDGE_EN).bHeld) {
					//GameEngine.DrawTriangle(
					cDraw.DrawTriangle(GameEngine,
						(int32_t)trClipped[0].x, (int32_t)trClipped[0].y, trClipped[0].z,
						(int32_t)trClipped[1].x, (int32_t)trClipped[1].y, trClipped[1].z,
						(int32_t)trClipped[2].x, (int32_t)trClipped[2].y, trClipped[2].z,
						mManager.GetState(eMenuStates::COLOR_DIS).bHeld ? olc::WHITE : olc::BLACK
					);
				}
			}
		}
	}
}

