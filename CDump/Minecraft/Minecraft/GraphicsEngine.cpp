#include "GraphicsEngine.h"

void GraphicsEngine::Construct(int32_t iHeight, int32_t iWidth) {
	iScreenHeight = iHeight; iScreenWidth = iWidth;

	// Projection Matrix
	mProjection = Matrix4D::Projection((float)iScreenHeight / (float)iScreenWidth, 90.0f, 1000.0f, 0.1f);

	// TEMP: Create better solution for Cube Map Init
	mCube.tr = sField::CubeMap();
	mCube += sField::CubeMap(5.0f);
	mCube += sField::CubeMap(-5.0f);
	mCube += sField::CubeMap(0.0f, 5.0f);
	mCube += sField::CubeMap(0.0f, -5.0f);
	mCube += sField::CubeMap(0.0f, 0.0f, 5.0f);
	mCube += sField::CubeMap(0.0f, 0.0f, -5.0f);
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


void GraphicsEngine::Draw(olc::PixelGameEngine &GameEngine, float fElapsedTime) {
	GameEngine.Clear(olc::BLACK);

	Matrix4D mRotation, mTranslated;
	fTheta += 1.0f * fElapsedTime;

	// Rotation ZX
	//mRotation = Matrix4D::RoutationOZ(0.3f) * Matrix4D::RoutationOX(0.5f);
	mRotation = Matrix4D::Identity();

	// Translated
	mTranslated = Matrix4D::Translation(0.0f, 0.0f, 3.0f);


	// Calculate camera rotation based on Mouse Position
	olc::vi2d vMouse = GameEngine.GetMousePos();
	GameEngine.DrawCircle(vMouse.x, vMouse.y, 7);

	if (bStart) {
		vMouseLast.x = 125.0f;
		vMouseLast.y = 124.0f;
		bStart = false;
	}

	vMouseOffset.x = (float)((int32_t)((float)vMouse.x - vMouseLast.x) * MOUSE_SPEED);
	vMouseOffset.y = (float)((int32_t)(vMouseLast.y - (float)vMouse.y) * MOUSE_SPEED);

	if (bFixedMousePos) {
		GameEngine.LockMousePos(iScreenWidth / 2, iScreenHeight / 2);
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

	sPoint3D vUp = { 0.0f, 1.0f, 0.0f };
	
	if (GameEngine.GetKey(olc::W).bHeld && !GameEngine.GetKey(olc::SHIFT).bHeld)
		//vCamera.z += CAMERA_STEP * fElapsedTime * vLookDir.z;
		vCamera -= vLookDir * CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::S).bHeld && !GameEngine.GetKey(olc::SHIFT).bHeld)
		//vCamera.z -= CAMERA_STEP * fElapsedTime * vLookDir.z;
		vCamera += vLookDir * CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::W).bHeld && GameEngine.GetKey(olc::SHIFT).bHeld)
		vCamera.y += CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::S).bHeld && GameEngine.GetKey(olc::SHIFT).bHeld)
		vCamera.y -= CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::D).bHeld)
		//vCamera.x -= CAMERA_STEP * fElapsedTime * vLookDir.x;
		vCamera += sPoint3D::normalize(vLookDir.cross(vUp)) * CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::A).bHeld)
		//vCamera.x += CAMERA_STEP * fElapsedTime * vLookDir.x;
		vCamera -= sPoint3D::normalize(vLookDir.cross(vUp)) * CAMERA_STEP * fElapsedTime;

	if (GameEngine.GetKey(olc::Q).bPressed) bFixedMousePos = !bFixedMousePos;



	//sPoint3D vTarget = { 1.0f, 1.0f, 1.0f };
	//vLookDir = vTarget * Matrix4D::RoutationOY(fYaw) * Matrix4D::RoutationOZ(fPitch);
	sPoint3D vTarget = vCamera - vLookDir;
	Matrix4D mView = Matrix4D::Invert(CameraPointAt(vCamera, vTarget));


	std::vector<sTriangle> trPainted;

	for (auto& tr : mCube.tr) {
		sTriangle trProjected, trTranslated, trView;

		trTranslated.p[0] = tr.p[0] * mRotation * mTranslated;
		trTranslated.p[1] = tr.p[1] * mRotation * mTranslated;
		trTranslated.p[2] = tr.p[2] * mRotation * mTranslated;


		sPoint3D normal, vect1, vect2;
		vect1 = trTranslated.p[1] - trTranslated.p[0];
		vect2 = trTranslated.p[2] - trTranslated.p[0];
		normal = sPoint3D::normalize(vect1.cross(vect2));

		if (normal.prod(trTranslated.p[0] - vCamera) > 0.0f) continue;
			
		//sPoint3D light{ 3.0f, 3.0f, 3.0f };
		//int32_t color = (int32_t)(normal.prod(light.normalize()) * 255);

		trView.p[0] = trTranslated.p[0] * mView;
		trView.p[1] = trTranslated.p[1] * mView;
		trView.p[2] = trTranslated.p[2] * mView;


		sTriangle trClipped[2];
		uint8_t nClippedTr = ClipTriangle({ 0.0f, 0.0f, -0.1f }, { 0.0f, 0.0f, -1.0f }, trView, trClipped[0], trClipped[1]);

		for (uint8_t i = 0; i < nClippedTr; i++) {

			trProjected.p[0] = trClipped[i].p[0] * mProjection + 1.0f;
			trProjected.p[1] = trClipped[i].p[1] * mProjection + 1.0f;
			trProjected.p[2] = trClipped[i].p[2] * mProjection + 1.0f;

			trProjected.p[0].x *= 0.5f * (float)iScreenWidth; trProjected.p[0].y *= 0.5f * (float)iScreenHeight;
			trProjected.p[1].x *= 0.5f * (float)iScreenWidth; trProjected.p[1].y *= 0.5f * (float)iScreenHeight;
			trProjected.p[2].x *= 0.5f * (float)iScreenWidth; trProjected.p[2].y *= 0.5f * (float)iScreenHeight;



			std::list<sTriangle> listClippedTr = { trProjected };
			ClipByScreenEdge(listClippedTr);
			trPainted.insert(trPainted.end(), listClippedTr.begin(), listClippedTr.end());

			//for (auto& trClipped : listClippedTr) {
			//	GameEngine.FillTriangle(
			//		(int32_t)trClipped.p[0].x, (int32_t)trClipped.p[0].y,
			//		(int32_t)trClipped.p[1].x, (int32_t)trClipped.p[1].y,
			//		(int32_t)trClipped.p[2].x, (int32_t)trClipped.p[2].y,
			//		olc::Pixel(color, color, color)
			//		//olc::WHITE
			//	);

			//	GameEngine.DrawTriangle(
			//		(int32_t)trClipped.p[0].x, (int32_t)trClipped.p[0].y,
			//		(int32_t)trClipped.p[1].x, (int32_t)trClipped.p[1].y,
			//		(int32_t)trClipped.p[2].x, (int32_t)trClipped.p[2].y,
			//		olc::BLACK
			//	);
			//}
		}

		// Painter's algorithm
		std::sort(trPainted.begin(), trPainted.end(), [](sTriangle& tr1, sTriangle& tr2) { return tr1.AvgZ() < tr2.AvgZ(); });


		for (auto& trClipped : trPainted) {
			GameEngine.FillTriangle(
				(int32_t)trClipped.p[0].x, (int32_t)trClipped.p[0].y,
				(int32_t)trClipped.p[1].x, (int32_t)trClipped.p[1].y,
				(int32_t)trClipped.p[2].x, (int32_t)trClipped.p[2].y,
				//olc::Pixel(color, color, color)
				olc::WHITE
			);

			GameEngine.DrawTriangle(
				(int32_t)trClipped.p[0].x, (int32_t)trClipped.p[0].y,
				(int32_t)trClipped.p[1].x, (int32_t)trClipped.p[1].y,
				(int32_t)trClipped.p[2].x, (int32_t)trClipped.p[2].y,
				olc::BLACK
			);
		}

	}
}


