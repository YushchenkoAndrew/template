#pragma once
#include "olcPixelGameEngine.h"
#include "MenuManager.h"
#include "Objects3D.h"

#define TRIANGLE_OUTSIDE	12u
#define TRIANGLE_INSIDE		3u
#define TRIANGLE_SMALL		9u
#define TRIANGLE_QAUD		6u

#define CAMERA_STEP			4.0f
#define MOUSE_SPEED			0.5f


class GraphicsEngine {
public:
	GraphicsEngine() {}
	~GraphicsEngine() {}

	void Construct(int32_t iHeight, int32_t iWidth);
	Matrix4D CameraPointAt(sPoint3D& vPos, sPoint3D& vTarget);
	sPoint3D IntersectionLinePlane(sPoint3D& pPlane, sPoint3D& vPlane, sPoint3D& pStart, sPoint3D& pEnd);
	uint8_t ClipTriangle(sPoint3D pPlane, sPoint3D vPlane, sTriangle& iTr, sTriangle& oTr1, sTriangle& oTr2);
	void ClipByScreenEdge(std::list<sTriangle>& listClippedTr);

	void CameraLookAt(olc::PixelGameEngine &GameEngine);
	void CameraMove(olc::PixelGameEngine &GameEngine, float fElapsedTime);

	void DrawTriangle(olc::PixelGameEngine &GameEngine, int32_t x1, int32_t y1, int32_t x2, int32_t y2, int32_t x3, int32_t y3, olc::Pixel p);
	void Draw(olc::PixelGameEngine& GameEngine, float fElapsedTime, MenuManager& mManager);

private:
	int32_t iScreenHeight = 0;
	int32_t iScreenWidth = 0;

	float fTheta = 0.0f;
	float fYaw = 0.0f;
	float fPitch = 0.0f;

	Matrix4D mProjection;
	sField mCube;
	sPoint3D vCamera = { 0.0f, 0.0f, 10.0f };
	sPoint3D vLookDir;

	olc::vf2d vMouseOffset;
	olc::vf2d vMouseLast;
	
	bool bFixedMousePos = false;

	std::vector<float> zBuffer;
};
