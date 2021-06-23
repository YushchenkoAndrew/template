#pragma once
#include "lib/olcPixelGameEngine.h"
#include "src/Menu/MenuManager.h"
#include "include/Typelist.h"
#include "include/LuaScript.h"
#include "Objects3D.h"
#include "Lighting.h"
#include "Draw3D.h"

#define TRIANGLE_OUTSIDE	12u
#define TRIANGLE_INSIDE		3u
#define TRIANGLE_SMALL		9u
#define TRIANGLE_QAUD		6u


class Minecraft;

class GraphicsEngine {
public:

	template<class T>
	GraphicsEngine(Type2Type<T>): mTranslated(Matrix4D::Translation(0.0f, 0.0f, 3.0f)), lightSrc(std::make_unique<T>()) {}
	~GraphicsEngine() {}

	void Init(int32_t iHeight, int32_t iWidth, LuaScript& luaConfig);
	void Update(olc::PixelGameEngine& GameEngine,MenuManager& mManager, float& fElapsedTime);

	void Draw(olc::PixelGameEngine& GameEngine, MenuManager& mManager);

private:
	Matrix4D CameraPointAt(sPoint3D& vPos, sPoint3D& vTarget);
	void CameraLookAt(olc::PixelGameEngine& GameEngine);
	void CameraMove(olc::PixelGameEngine& GameEngine, float& fElapsedTime);

	sPoint3D IntersectionLinePlane(sPoint3D& pPlane, sPoint3D& vPlane, sPoint3D& pStart, sPoint3D& pEnd);
	uint8_t ClipTriangle(sPoint3D pPlane, sPoint3D vPlane, sTriangle& iTr, sTriangle& oTr1, sTriangle& oTr2);
	void ClipByScreenEdge(std::list<sTriangle>& listClippedTr);


	friend class Minecraft;

private:
	Draw3D cDraw;

	float nCameraStep = 4.0f;
	float nMouseSpeed = 0.5f;

	float fYaw = 0.0f;
	float fPitch = 0.0f;

	Matrix4D mTranslated;
	Matrix4D mProjection;
	Matrix4D mView;

	sPoint3D vCamera = { -1.0f,  1.0f, -1.0f };
	sPoint3D vLookDir;
	sPoint3D vTarget;

	olc::vf2d vMouseOffset;
	olc::vf2d vMouseLast;
	bool bFixedMousePos = false;

	std::vector<sTriangle> trMap;
	std::vector<sTriangle> trPainted;

	std::unique_ptr<Light> lightSrc;
};
