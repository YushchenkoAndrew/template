#pragma once
#include "Objects3D.h"

class Light {
public:
	virtual void Init(float x, float y, float z) = 0;
	virtual void LoadBlock(std::vector<sTriangle>& vMap) = 0;
	virtual int32_t GetLight(const sPoint3D& vTriangle) = 0;
	virtual int32_t GetLight(const sPoint3D& vTriangle, const sPoint3D& vCamera) = 0;
};


class AmbientLigh : public Light {
public:
	AmbientLigh() : vPos({ 0.0f, 0.0f, 0.0f }), blLightSrc({ 0.0f, 0.0f, 0.0f, EXIST_MASK }) {}

	void Init(float x, float y, float z) override {
		vPos.x = x; vPos.y = y; vPos.z = z;
		blLightSrc.SetPos(x, y, z);
	}

	void LoadBlock(std::vector<sTriangle>& vMap) override {
		blLightSrc.LoadMap(vMap);
	}

	int32_t GetLight(const sPoint3D& vTriangle) override { return 0; }

	int32_t GetLight(const sPoint3D& vTriangle, const sPoint3D& vCamera) override {
		//sPoint3D light = vSrcIntensity * vDiffusion * fmaxf(sPoint3D::prod(sPoint3D::normalize(vPos - vCamera), sPoint3D::normalize(vTriangle)), 0.0f);
		//printf("%f\n", light.x + light.y + light.z);
		//return (int32_t)(((light.x + light.y + light.z) / 3.0f) * 255.0f);


		//sPoint3D dxLight = vTriangle - vPos;
		return (int32_t)(vTriangle.prod(sPoint3D::normalize(vLightDir)) * 255);
	}

private:
	sPoint3D vPos;

	const sPoint3D vDiffusion = { 0.9f, 0.5f, 0.3f };
	const sPoint3D vSrcIntensity = { 1.0f, 1.0f, 1.0f };
	const sPoint3D vLightDir = { 1.0f, 0.0f, 1.0f };



	sBlock blLightSrc;
};
