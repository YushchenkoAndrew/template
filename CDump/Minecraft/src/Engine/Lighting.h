#pragma once
#include "Objects3D.h"

class Light {
public:
	void Init(float x, float y, float z) {}
	void LoadBlock(std::vector<sTriangle>& vMap) {}
	int32_t GetLight(const sPoint3D& vTriangle) { return 0; }
};


class AmbientLigh : public Light {
public:
	AmbientLigh() : vPos({ 0.0f, 0.0f, 0.0f }), blLightSrc({ 0.0f, 0.0f, 0.0f, EXIST_MASK }) {}

	void Init(float x, float y, float z) {
		vPos.x = x; vPos.y = y; vPos.z = z;
		blLightSrc.SetPos(x, y, z);
	}

	void LoadBlock(std::vector<sTriangle>& vMap) {
		blLightSrc.LoadMap(vMap);
	}

	int32_t GetLight(const sPoint3D& vTriangle) {
		sPoint3D dxLight = vTriangle - vPos;
		return (int32_t)(1000 / (dxLight.length() + 1)) % 255;
	}

private:
	sPoint3D vPos;
	sBlock blLightSrc;
};
