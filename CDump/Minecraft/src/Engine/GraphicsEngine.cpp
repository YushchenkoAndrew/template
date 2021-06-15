#include "GraphicsEngine.h"

void GraphicsEngine::Init(int32_t iHeight, int32_t iWidth, std::unique_ptr<Light> pLightSrc) {
	iScreenHeight = iHeight; iScreenWidth = iWidth;
	zBuffer.assign(iHeight * iWidth, 0.0f);

	vMouseLast.x = (float)iScreenWidth / 2.0f;
	vMouseLast.y = (float)iScreenHeight / 2.0f;

	// Projection Matrix
	mProjection = Matrix4D::Projection((float)iScreenHeight / (float)iScreenWidth, 90.0f, 1000.0f, 0.1f);

	lightSrc = std::move(pLightSrc);
	lightSrc->Init(-5.0f, 10.0f, 10.0f);
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
	float ad = pStart.prod(nPlane);
	float t = (nPlane.prod(pPlane) - ad) / (pEnd.prod(nPlane) - ad);
	return pStart + (pEnd - pStart) * t;
}

uint8_t GraphicsEngine::ClipTriangle(sPoint3D pPlane, sPoint3D vPlane, sTriangle& iTr, sTriangle& oTr1, sTriangle& oTr2) {
	sPoint3D nPlane = vPlane.normalize();

	// Find distance from point to plane
	auto dist = [&](sPoint3D& p) { return nPlane.prod(p) - nPlane.prod(pPlane); };

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
	float fWidth = (float)iScreenWidth - 1.0f;
	float fHeight = (float)iScreenHeight - 1.0f;

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
		GameEngine.LockMousePos((int32_t)(iScreenWidth / 2), (int32_t)(iScreenHeight / 2));
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

	CameraLookAt(GameEngine);
	CameraMove(GameEngine, fElapsedTime);

	// Calculate camera direction and View Matrix
	vTarget = vCamera - vLookDir;
	mView = Matrix4D::Invert(CameraPointAt(vCamera, vTarget));
}

void GraphicsEngine::Draw(olc::PixelGameEngine &GameEngine, MenuManager& mManager) {
	//sPoint3D light{ 0.0f, -2.0f, 0.0f };
	zBuffer.assign(iScreenHeight * iScreenWidth, 0.0f);

	sPoint3D normal, vect1, vect2;
	sTriangle trProjected, trTranslated, trView;

	sTriangle trClipped[2];
	std::list<sTriangle> listClippedTr;

	for (auto& tr : trMap) {
		trTranslated.p[0] = tr.p[0] * mTranslated;
		trTranslated.p[1] = tr.p[1] * mTranslated;
		trTranslated.p[2] = tr.p[2] * mTranslated;


		vect1 = trTranslated.p[1] - trTranslated.p[0];
		vect2 = trTranslated.p[2] - trTranslated.p[0];
		normal = sPoint3D::normalize(vect1.cross(vect2));

		if (normal.prod(trTranslated.p[0] - vCamera) > 0.0f) continue;
		//int32_t color = (int32_t)(normal.prod(light.normalize())) * 255;
		//sPoint3D dxLight = (trTranslated.p[0] + trTranslated.p[1] + trTranslated.p[2]) / 3 - light;
		//int32_t color = (int32_t)(1000 / (dxLight.length() + 1)) % 255;


		trView.p[0] = trTranslated.p[0] * mView;
		trView.p[1] = trTranslated.p[1] * mView;
		trView.p[2] = trTranslated.p[2] * mView;

		//int32_t color = lightSrc->GetLight((trView.p[0] + trView.p[1] + trView.p[2]) / 3, vCamera);
		int32_t color = lightSrc->GetLight(normal, vCamera);


		uint8_t nClippedTr = ClipTriangle({ 0.0f, 0.0f, -0.1f }, { 0.0f, 0.0f, -1.0f }, trView, trClipped[0], trClipped[1]);

		for (uint8_t i = 0; i < nClippedTr; i++) {

			trProjected.p[0] = trClipped[i].p[0] * mProjection + 1.0f;
			trProjected.p[1] = trClipped[i].p[1] * mProjection + 1.0f;
			trProjected.p[2] = trClipped[i].p[2] * mProjection + 1.0f;

			trProjected.p[0].x *= 0.5f * (float)iScreenWidth; trProjected.p[0].y *= 0.5f * (float)iScreenHeight;
			trProjected.p[1].x *= 0.5f * (float)iScreenWidth; trProjected.p[1].y *= 0.5f * (float)iScreenHeight;
			trProjected.p[2].x *= 0.5f * (float)iScreenWidth; trProjected.p[2].y *= 0.5f * (float)iScreenHeight;


			listClippedTr.clear();
			listClippedTr.push_back(trProjected);
			ClipByScreenEdge(listClippedTr);

			for (auto& trClipped : listClippedTr) {
				if (!mManager.GetState(eMenuStates::COLOR_DIS).bHeld) {
					//GameEngine.FillTriangle(
					DrawTriangle(GameEngine,
						(int32_t)trClipped.p[0].x, (int32_t)trClipped.p[0].y, (int32_t)trClipped.p[0].z,
						(int32_t)trClipped.p[1].x, (int32_t)trClipped.p[1].y, (int32_t)trClipped.p[1].z,
						(int32_t)trClipped.p[2].x, (int32_t)trClipped.p[2].y, (int32_t)trClipped.p[2].z,
						mManager.GetState(eMenuStates::SHADOW_EN).bHeld ? olc::Pixel(color, color, color) : olc::WHITE
					);
				}

				if (!mManager.GetState(eMenuStates::EDGE_DIS).bHeld) {
					GameEngine.DrawTriangle(
						(int32_t)trClipped.p[0].x, (int32_t)trClipped.p[0].y,
						(int32_t)trClipped.p[1].x, (int32_t)trClipped.p[1].y,
						(int32_t)trClipped.p[2].x, (int32_t)trClipped.p[2].y,
						mManager.GetState(eMenuStates::COLOR_DIS).bHeld ? olc::WHITE : olc::BLACK
					);
				}
			}
		}
	}
}


// Using this implementation of  Bresenham method
// https://www.avrfreaks.net/sites/default/files/triangles.c
void GraphicsEngine::DrawTriangle(olc::PixelGameEngine &GameEngine, int32_t x1, int32_t y1, int32_t z1, int32_t x2, int32_t y2, int32_t z2, int32_t x3, int32_t y3, int32_t z3, olc::Pixel p) {
	int32_t signx1 = 1;
	int32_t signx2 = 1;
	bool bChanged1 = false;
	bool bChanged2 = false;
	bool bLoopEnd = false;

	int32_t t1xp, t2xp;
	int32_t xMin, xMax;

	auto DrawLine = [&](int sx, int ex, int ny) { for (int i = sx; i <= ex; i++) GameEngine.Draw(i, ny, p); };

    // Sort vertices's
	if (y1 > y2) { swap(y1, y2); swap(x1, x2); swap(z1, z2); }
	if (y1 > y3) { swap(y1, y3); swap(x1, x3); swap(z1, z3); }
	if (y2 > y3) { swap(y2, y3); swap(x2, x3); swap(z2, z3); }

	// Starting points
	int32_t t1x = x1;
	int32_t t2x = x1;
	int32_t y = y1;

	int32_t dx1, dx2;
	int32_t dy1 = y2 - y1;
	int32_t dy2 = y3 - y1;

	if ((dx1 = x2 - x1) < 0) { dx1 = -dx1; signx1 = -1; } 
	if ((dx2 = x3 - x1) < 0) { dx2 = -dx2; signx2 = -1; }

	if (dy1 > dx1) { swap(dx1, dy1); bChanged1 = true; }
	if (dy2 > dx2) { swap(dy2, dx2); bChanged2 = true; }
	
	int32_t e1, e2 = dx2 >> 1;

    // Flat top, just process the second half
	if (y1 != y2) {
		e1 = dx1 >> 1;

		for (uint8_t i = 0; i < dx1;) {
			t1xp = 0; t2xp = 0;

			xMin = std::min(t1x, t2x);
			xMax = std::max(t1x, t2x);

			bLoopEnd = false;

			// process first line until y value is about to change
			while (i < dx1 && ++i) {
				e1 += dy1;

				while (e1 >= dx1) {
					e1 -= dx1;
					bLoopEnd = !bChanged1;
					if (!bChanged1) break;
					t1xp = signx1;
				}

				if (bChanged1 || bLoopEnd) break;
				t1x += signx1;
			}

			bLoopEnd = false;

			// process second line until y value is about to change
			while (1) {
				e2 += dy2;
				while (e2 >= dx2) {
					e2 -= dx2;
					bLoopEnd = !bChanged2;
					if (!bChanged2) break;
					t2xp = signx2;
				}

				if (bChanged2 || bLoopEnd) break;
				t2x += signx2;
			}

			xMin = std::min(xMin, std::min(t1x, t2x));
			xMax = std::max(xMax, std::max(t1x, t2x));

			// Draw line from min to max points found on the y
			DrawLine(xMin, xMax, y);

			// Now increase y
			if (!bChanged1) t1x += signx1;
			if (!bChanged2) t2x += signx2;

			t1x += t1xp;
			t2x += t2xp;
			if (++y == y2) break;
		}
	}
	
	// Second half
	dx1 = x3 - x2;
	dy1 = y3 - y2;
	t1x = x2;

	if (dx1 < 0) { dx1 = -dx1; signx1 = -1; }
	else signx1 = 1;

	if (dy1 > dx1) { swap(dy1, dx1); bChanged1 = true; }
	else bChanged1 = false;
	
	e1 = dx1 >> 1;
	
	for (uint8_t i = 0; i <= dx1; i++) {
		t1xp = 0; t2xp = 0;

		xMin = std::min(t1x, t2x);
		xMax = std::max(t1x, t2x);

		bLoopEnd = false;

	    // process first line until y value is about to change
		while (i < dx1) {
			e1 += dy1;
			while (e1 >= dx1) {
				e1 -= dx1;
				bLoopEnd = !bChanged1;
				if (!bChanged1) break;
				t1xp = signx1;
			}

			if (bChanged1 || bLoopEnd) break;
			t1x += signx1;
			if (i < dx1) i++;
		}

		bLoopEnd = false;

        // process second line until y value is about to change
		while (t2x != x3) {
			e2 += dy2;
			while (e2 >= dx2) {
				e2 -= dx2;
				bLoopEnd = !bChanged2;
				if (!bChanged2) break;
				t2xp = signx2;
			}

			if (bChanged2 || bLoopEnd) break;
			t2x += signx2;
		}

		xMin = std::min(xMin, std::min(t1x, t2x));
		xMax = std::max(xMax, std::max(t1x, t2x));

		// Draw line from min to max points found on the y
		DrawLine(xMin, xMax, y);

		// Now increase y
		if(!bChanged1) t1x += signx1;
		if(!bChanged2) t2x += signx2;

		t1x += t1xp;
		t2x += t2xp;
		if(++y > y3) return;
	}

}
