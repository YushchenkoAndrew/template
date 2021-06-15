#include "Objects3D.h"

void sBlock::LoadMap(std::vector<sTriangle>& vMap) {
	if (!IS_EXIST(bStatus)) return;

	if (!IS_NORTH_N(bStatus)) {
		vMap.push_back({ vPos.x + 0.0f, vPos.y + 0.0f, vPos.z + 0.0f,    vPos.x + 0.0f, vPos.y + 1.0f, vPos.z + 0.0f,    vPos.x + 1.0f, vPos.y + 1.0f, vPos.z + 0.0f });
		vMap.push_back({ vPos.x + 0.0f, vPos.y + 0.0f, vPos.z + 0.0f,    vPos.x + 1.0f, vPos.y + 1.0f, vPos.z + 0.0f,    vPos.x + 1.0f, vPos.y + 0.0f, vPos.z + 0.0f });
	}

	if (!IS_SOUTH_N(bStatus)) {
		vMap.push_back({ vPos.x + 1.0f, vPos.y + 0.0f, vPos.z + 1.0f,    vPos.x + 1.0f, vPos.y + 1.0f, vPos.z + 1.0f,    vPos.x + 0.0f, vPos.y + 1.0f, vPos.z + 1.0f });
		vMap.push_back({ vPos.x + 1.0f, vPos.y + 0.0f, vPos.z + 1.0f,    vPos.x + 0.0f, vPos.y + 1.0f, vPos.z + 1.0f,    vPos.x + 0.0f, vPos.y + 0.0f, vPos.z + 1.0f });
	}

	if (!IS_EAST_N(bStatus)) {
			vMap.push_back({ vPos.x + 1.0f, vPos.y + 0.0f, vPos.z + 0.0f,    vPos.x + 1.0f, vPos.y + 1.0f, vPos.z + 0.0f,    vPos.x + 1.0f, vPos.y + 1.0f, vPos.z + 1.0f });
			vMap.push_back({ vPos.x + 1.0f, vPos.y + 0.0f, vPos.z + 0.0f,    vPos.x + 1.0f, vPos.y + 1.0f, vPos.z + 1.0f,    vPos.x + 1.0f, vPos.y + 0.0f, vPos.z + 1.0f });
	}

	if (!IS_WEST_N(bStatus)) {
			vMap.push_back({ vPos.x + 0.0f, vPos.y + 0.0f, vPos.z + 1.0f,    vPos.x + 0.0f, vPos.y + 1.0f, vPos.z + 1.0f,    vPos.x + 0.0f, vPos.y + 1.0f, vPos.z + 0.0f });
			vMap.push_back({ vPos.x + 0.0f, vPos.y + 0.0f, vPos.z + 1.0f,    vPos.x + 0.0f, vPos.y + 1.0f, vPos.z + 0.0f,    vPos.x + 0.0f, vPos.y + 0.0f, vPos.z + 0.0f });
	}

	if (!IS_UP_N(bStatus)) {
			vMap.push_back({ vPos.x + 0.0f, vPos.y + 1.0f, vPos.z + 0.0f,    vPos.x + 0.0f, vPos.y + 1.0f, vPos.z + 1.0f,    vPos.x + 1.0f, vPos.y + 1.0f, vPos.z + 1.0f });
			vMap.push_back({ vPos.x + 0.0f, vPos.y + 1.0f, vPos.z + 0.0f,    vPos.x + 1.0f, vPos.y + 1.0f, vPos.z + 1.0f,    vPos.x + 1.0f, vPos.y + 1.0f, vPos.z + 0.0f });
	}

	if (!IS_DOWN_N(bStatus)) {
			vMap.push_back({ vPos.x + 1.0f, vPos.y + 0.0f, vPos.z + 1.0f,    vPos.x + 0.0f, vPos.y + 0.0f, vPos.z + 1.0f,    vPos.x + 0.0f, vPos.y + 0.0f, vPos.z + 0.0f });
			vMap.push_back({ vPos.x + 1.0f, vPos.y + 0.0f, vPos.z + 1.0f,    vPos.x + 0.0f, vPos.y + 0.0f, vPos.z + 0.0f,    vPos.x + 1.0f, vPos.y + 0.0f, vPos.z + 0.0f });
	}
}

