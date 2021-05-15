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
Matrix4D GraphicsEngine::CameraPointAt(sPoint3D& vPos, sPoint3D& vTarget, sPoint3D& vUp) {
	sPoint3D vForward = vPos - vTarget;
	vForward = vForward.normalize();

	sPoint3D vNewUp = vUp - (vForward * vUp.prod(vForward));
	vNewUp = vNewUp.normalize();

	sPoint3D vNewRight = vNewUp.cross(vForward);
	Matrix4D m;
	m.MA[0][0] = vNewRight.x;	m.MA[0][1] = vNewRight.y;	m.MA[0][2] = vNewRight.z;	m.MA[0][3] = 0.0f;
	m.MA[1][0] = vNewUp.x;		m.MA[1][1] = vNewUp.y;		m.MA[1][2] = vNewUp.z;		m.MA[1][3] = 0.0f;
	m.MA[2][0] = vForward.x;	m.MA[2][1] = vForward.y;	m.MA[2][2] = vForward.z;	m.MA[2][3] = 0.0f;
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
			oTr1.p[0] = arrInside[1];
			oTr1.p[1] = oTr1.p[2];
			oTr1.p[2] = IntersectionLinePlane(pPlane, vPlane, arrInside[1], arrOutside[0]);

			return 2u;
		}

		default:
			return 0u;
	}
}



void GraphicsEngine::Draw(olc::PixelGameEngine &GameEngine, float fElapsedTime) {
	GameEngine.Clear(olc::BLACK);

	if (GameEngine.GetKey(olc::W).bHeld)
		vCamera.z -= 8.0f * fElapsedTime;

	if (GameEngine.GetKey(olc::S).bHeld)
		vCamera.z += 8.0f * fElapsedTime;

	if (GameEngine.GetKey(olc::D).bHeld)
		vCamera.x -= 8.0f * fElapsedTime;

	if (GameEngine.GetKey(olc::A).bHeld)
		vCamera.x += 8.0f * fElapsedTime;



	Matrix4D mRotation, mTranslated;
	fTheta += 1.0f * fElapsedTime;

	// Rotation ZX
	//mRotation = Matrix4D::RoutationOZ(0.3f) * Matrix4D::RoutationOX(0.5f);
	mRotation = Matrix4D::Identity();

	// Translated
	mTranslated = Matrix4D::Translation(0.0f, 0.0f, 3.0f);

	vLookDir = { 0, 0, 1 };
	sPoint3D vUp = { 0, 1, 0 };
	sPoint3D vTarget = { 1, 1, 1 };

	fYaw += 0.01f * fElapsedTime * (GameEngine.GetMousePos().x - vTemp.x);
	fPitch += 0.01f * fElapsedTime * (GameEngine.GetMousePos().y - vTemp.y);

	vLookDir = vTarget * Matrix4D::RoutationOY(fYaw) * Matrix4D::RoutationOZ(fPitch);
	vTarget = vCamera + vLookDir;
	Matrix4D mView = Matrix4D::Invert(CameraPointAt(vCamera, vTarget, vUp));

	vTemp.x = vTemp.x + (GameEngine.GetMousePos().x - vTemp.x) * fElapsedTime;
	vTemp.y = vTemp.y + (GameEngine.GetMousePos().y - vTemp.y) * fElapsedTime;

	for (auto& tr : mCube.tr) {
		sTriangle trProjected, trTranslated, trView;

		trTranslated.p[0] = tr.p[0] * mRotation * mTranslated;
		trTranslated.p[1] = tr.p[1] * mRotation * mTranslated;
		trTranslated.p[2] = tr.p[2] * mRotation * mTranslated;


		sPoint3D normal, vect1, vect2;
		vect1 = trTranslated.p[1] - trTranslated.p[0];
		vect2 = trTranslated.p[2] - trTranslated.p[0];
		normal = vect1.cross(vect2).normalize();

		if (normal.prod(trTranslated.p[0] - vCamera) >= 0.0f) continue;
			
		sPoint3D light{ 0.0f, 0.0f, -1.0f };
		int32_t color = (int32_t)(normal.prod(light.normalize()) * 255);

		trView.p[0] = trTranslated.p[0] * mView;
		trView.p[1] = trTranslated.p[1] * mView;
		trView.p[2] = trTranslated.p[2] * mView;


		sTriangle trClipped[2];
		uint8_t nClippedTr = ClipTriangle({ 0.0f, 0.0f, 0.1f }, { 0.0f, 0.0f, 1.0f }, trView, trClipped[0], trClipped[1]);


		for (uint8_t i = 0; i < nClippedTr; i++) {
			trProjected.p[0] = trClipped[i].p[0] * mProjection + 1.0f;
			trProjected.p[1] = trClipped[i].p[1] * mProjection + 1.0f;
			trProjected.p[2] = trClipped[i].p[2] * mProjection + 1.0f;

			//trProjected.p[0] = trView.p[0] * mProjection + 1.0f;
			//trProjected.p[1] = trView.p[1] * mProjection + 1.0f;
			//trProjected.p[2] = trView.p[2] * mProjection + 1.0f;

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
				//olc::Pixel(color, color, color)
				olc::WHITE
			);

			GameEngine.DrawTriangle(
				(int32_t)trProjected.p[0].x, (int32_t)trProjected.p[0].y,
				(int32_t)trProjected.p[1].x, (int32_t)trProjected.p[1].y,
				(int32_t)trProjected.p[2].x, (int32_t)trProjected.p[2].y,
				olc::BLACK
			);
		}

	}
}


