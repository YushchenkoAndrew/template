#pragma once
#include "lib/olcPixelGameEngine.h"
#include "src/Menu/MenuManager.h"
#include "include/Typelist.h"
#include "Lighting.h"
#include "Draw3D.h"
#include "Camera.h"

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

	sPoint3D IntersectionLinePlane(sPoint3D& pPlane, sPoint3D& vPlane, sPoint3D& pStart, sPoint3D& pEnd);
	uint8_t ClipTriangle(sPoint3D pPlane, sPoint3D vPlane, sTriangle& iTr, sTriangle& oTr1, sTriangle& oTr2);
	void ClipByScreenEdge(std::list<sTriangle>& listClippedTr);


	friend class Minecraft;

private:
	Draw3D cDraw;
	Camera cCamera;

	Matrix4D mTranslated;
	Matrix4D mProjection;

	std::vector<sBlock*> vpBlocks;
	std::vector<sTriangle> trPainted;

	std::unique_ptr<Light> lightSrc;
};
