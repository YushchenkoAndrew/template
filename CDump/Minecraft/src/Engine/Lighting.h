#pragma once
#include "Objects3D.h"

class Light {
public:
	virtual void Init(float x, float y, float z) = 0;
	virtual void LoadBlock(std::vector<sTriangle>& vMap) = 0;
	virtual int32_t GetLight(const sPoint3D& vTriangle, const sPoint3D& normal, bool bDistribute) = 0;
};


class LambertLightModel : public Light {
public:
	LambertLightModel() : vPos({ 0.0f, 0.0f, 0.0f }), blLightSrc({ 0.0f, 0.0f, 0.0f, EXIST_MASK }) {}

	void Init(float x, float y, float z) override {
		vPos.x = x; vPos.y = y; vPos.z = z;
		blLightSrc.SetPos(x, y, z);
	}

	void LoadBlock(std::vector<sTriangle>& vMap) override { blLightSrc.LoadMap(vMap); }

	int32_t GetLight(const sPoint3D& vTriangle, const sPoint3D& normal, bool bDistribute) override {
		sPoint3D vIncomingLight = sPoint3D::normalize(vPos - vTriangle);
		sPoint3D vLightIntesity = vSrcIntensity * vDiffusion * fmaxf(sPoint3D::prod(vIncomingLight, normal), 0.0f);
		if (bDistribute) vLightIntesity = sPoint3D::normalize(vLightIntesity);
		return (int32_t)(vLightIntesity.Avg() * 240.0f);
	}

private:
	sPoint3D vPos;

	const sPoint3D vDiffusion = { 1.0f, 1.0f, 1.0f };
	const sPoint3D vSrcIntensity = { 1.0f, 1.0f, 1.0f };

	sBlock blLightSrc;
};
