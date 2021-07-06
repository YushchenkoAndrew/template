#include "Camera.h"

void Camera::Init(int32_t iHeight, int32_t iWidth, LuaScript& luaConfig) {
	nScreenHeight = iHeight; nScreenWidth = iWidth;

	vMouseLast.x = (float)iWidth / 2.0f;
	vMouseLast.y = (float)iHeight / 2.0f;

	nCameraStep = luaConfig.GetTableValue<float>(nullptr, "nCameraStep");
	nMouseSpeed = luaConfig.GetTableValue<float>(nullptr, "nMouseSpeed");


	luaConfig.GetTableValue<bool>(nullptr, "vCamera"),
	vPos = {
		luaConfig.GetTableValue<float>(nullptr, "x"),
		luaConfig.GetTableValue<float>(nullptr, "y"),
		luaConfig.GetTableValue<float>(nullptr, "z")
	};
	luaConfig.Pop();
}

Matrix4D Camera::PointAt(sPoint3D& vPos, sPoint3D& vTarget) {
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


void Camera::LookAt(olc::PixelGameEngine &GameEngine) {

	// Calculate camera rotation based on Mouse Position
	olc::vi2d vMouse = GameEngine.GetMousePos();
	GameEngine.DrawCircle(vMouse.x, vMouse.y, 7);

	vMouseOffset.x = (float)((int32_t)((float)vMouse.x - vMouseLast.x) * nMouseSpeed);
	vMouseOffset.y = (float)((int32_t)(vMouseLast.y - (float)vMouse.y) * nMouseSpeed);

	if (bFixedMousePos) {
		GameEngine.LockMousePos((int32_t)(nScreenWidth / 2), (int32_t)(nScreenHeight / 2));
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

void Camera::Move(olc::PixelGameEngine &GameEngine, float& fElapsedTime) {
	sPoint3D vUp = { 0.0f, 1.0f, 0.0f };

	if (GameEngine.GetKey(olc::W).bHeld && !GameEngine.GetKey(olc::SHIFT).bHeld)
		vPos -= vLookDir * nCameraStep * fElapsedTime;

	if (GameEngine.GetKey(olc::S).bHeld && !GameEngine.GetKey(olc::SHIFT).bHeld)
		vPos += vLookDir * nCameraStep * fElapsedTime;

	if (GameEngine.GetKey(olc::W).bHeld && GameEngine.GetKey(olc::SHIFT).bHeld)
		vPos.y += nCameraStep * fElapsedTime;

	if (GameEngine.GetKey(olc::S).bHeld && GameEngine.GetKey(olc::SHIFT).bHeld)
		vPos.y -= nCameraStep * fElapsedTime;

	if (GameEngine.GetKey(olc::D).bHeld)
		vPos += sPoint3D::normalize(vLookDir.cross(vUp)) * nCameraStep * fElapsedTime;

	if (GameEngine.GetKey(olc::A).bHeld)
		vPos -= sPoint3D::normalize(vLookDir.cross(vUp)) * nCameraStep * fElapsedTime;

	if (GameEngine.GetKey(olc::ESCAPE).bPressed) bFixedMousePos = false;
	if (GameEngine.GetMouse(0).bPressed) bFixedMousePos = true;
}


void Camera::Update(olc::PixelGameEngine& GameEngine, float& fElapsedTime) {
	LookAt(GameEngine);
	Move(GameEngine, fElapsedTime);

	// Calculate camera direction and View Matrix
	vTarget = vPos - vLookDir;
	mView = Matrix4D::Invert(PointAt(vPos, vTarget));
}
