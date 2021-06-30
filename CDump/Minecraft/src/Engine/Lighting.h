#pragma once
#include <memory>
#include "Objects3D.h"
#include "include/LuaScript.h"

class Light {
public:
	virtual void Init(float x, float y, float z) = 0;
	virtual void Init(LuaScript& luaConfig) = 0;
	virtual void LoadBlock(std::vector<sBlock*>& vpBlocks) = 0;
	virtual float GetBrightness(const sPoint3D& vTriangle, const sPoint3D& normal, bool bDistribute) = 0;
	virtual ~Light() {}
};


class LambertLightModel : public Light {
public:
	LambertLightModel() : vPos({ 0.0f, 0.0f, 0.0f }), blLightSrc({ 0.0f, 0.0f, 0.0f, EXIST_MASK }) {}
	~LambertLightModel() override {}

	void Init(float x, float y, float z) override {
		vPos.x = x; vPos.y = y; vPos.z = z;
		blLightSrc.SetPos(x, y, z);
	}

	void Init(LuaScript& luaConfig) override {
		vPos.x = luaConfig.GetTableValue<float>("vLightSource", "x");
		vPos.y = luaConfig.GetTableValue<float>("vLightSource", "y");
		vPos.z = luaConfig.GetTableValue<float>("vLightSource", "z");
		blLightSrc.SetPos(vPos);
	}

	void LoadBlock(std::vector<sBlock*>& vpBlocks) override { 
		vpBlocks.push_back(&blLightSrc);

		blLightSrc.SetColor(0xFF, 0xFF, 0xA0);
		blLightSrc.Update();
	}

	float GetBrightness(const sPoint3D& vTriangle, const sPoint3D& normal, bool bDistribute) override {
		sPoint3D vIncomingLight = sPoint3D::normalize(vPos - vTriangle);
		sPoint3D vLightIntesity = vSrcIntensity * vDiffusion * fmaxf(sPoint3D::dot(vIncomingLight, normal), 0.0f);
		if (bDistribute) vLightIntesity = sPoint3D::normalize(vLightIntesity);
		return vLightIntesity.Avg();
	}

private:
	sPoint3D vPos;

	const sPoint3D vDiffusion = { 1.0f, 1.0f, 1.0f };
	const sPoint3D vSrcIntensity = { 1.0f, 1.0f, 1.0f };

	sBlock blLightSrc;
};
