#pragma once
#include "lib/olcPixelGameEngine.h"
#include "include/LuaScript.h"
#include "Objects3D.h"

class GraphicsEngine;

class Camera {
public:
	void Init(int32_t iHeight, int32_t iWidth, LuaScript& luaConfig);
	void Update(olc::PixelGameEngine& GameEngine, float& fElapsedTime);

	Matrix4D PointAt(sPoint3D& vPos, sPoint3D& vTarget);
	void LookAt(olc::PixelGameEngine& GameEngine);
	void Move(olc::PixelGameEngine& GameEngine, float& fElapsedTime);

	inline Matrix4D GetViewMatrix() { return mView; }
	inline sPoint3D GetPos() { return vPos; }

	inline void SetPos(sPoint3D vPos) { this->vPos = vPos; }


	friend class GraphicsEngine;

private:
	int32_t nScreenHeight = 0;
	int32_t nScreenWidth = 0;

	float nCameraStep = 4.0f;
	float nMouseSpeed = 0.5f;

	float fYaw = 0.0f;
	float fPitch = 0.0f;

	sPoint3D vPos = { -1.0f,  1.0f, -1.0f };
	sPoint3D vLookDir;
	sPoint3D vTarget;

	Matrix4D mView;

	olc::vf2d vMouseOffset;
	olc::vf2d vMouseLast;
	bool bFixedMousePos = false;
};
