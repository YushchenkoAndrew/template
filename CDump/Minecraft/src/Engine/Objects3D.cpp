#include "Objects3D.h"

void sBlock::Update() {
	vMap.clear();

	if (!IS_EXIST(bStatus)) return;

	if (!IS_NORTH_N(bStatus)) {
		vMap.push_back({ vPos.x - 0.5f, vPos.y - 0.5f, vPos.z - 0.5f,    vPos.x - 0.5f, vPos.y + 0.5f, vPos.z - 0.5f,    vPos.x + 0.5f, vPos.y + 0.5f, vPos.z - 0.5f });
		vMap.push_back({ vPos.x - 0.5f, vPos.y - 0.5f, vPos.z - 0.5f,    vPos.x + 0.5f, vPos.y + 0.5f, vPos.z - 0.5f,    vPos.x + 0.5f, vPos.y - 0.5f, vPos.z - 0.5f });
	}

	if (!IS_SOUTH_N(bStatus)) {
		vMap.push_back({ vPos.x + 0.5f, vPos.y - 0.5f, vPos.z + 0.5f,    vPos.x + 0.5f, vPos.y + 0.5f, vPos.z + 0.5f,    vPos.x - 0.5f, vPos.y + 0.5f, vPos.z + 0.5f });
		vMap.push_back({ vPos.x + 0.5f, vPos.y - 0.5f, vPos.z + 0.5f,    vPos.x - 0.5f, vPos.y + 0.5f, vPos.z + 0.5f,    vPos.x - 0.5f, vPos.y - 0.5f, vPos.z + 0.5f });
	}

	if (!IS_EAST_N(bStatus)) {
			vMap.push_back({ vPos.x + 0.5f, vPos.y - 0.5f, vPos.z - 0.5f,    vPos.x + 0.5f, vPos.y + 0.5f, vPos.z - 0.5f,    vPos.x + 0.5f, vPos.y + 0.5f, vPos.z + 0.5f });
			vMap.push_back({ vPos.x + 0.5f, vPos.y - 0.5f, vPos.z - 0.5f,    vPos.x + 0.5f, vPos.y + 0.5f, vPos.z + 0.5f,    vPos.x + 0.5f, vPos.y - 0.5f, vPos.z + 0.5f });
	}

	if (!IS_WEST_N(bStatus)) {
			vMap.push_back({ vPos.x - 0.5f, vPos.y - 0.5f, vPos.z + 0.5f,    vPos.x - 0.5f, vPos.y + 0.5f, vPos.z + 0.5f,    vPos.x - 0.5f, vPos.y + 0.5f, vPos.z - 0.5f });
			vMap.push_back({ vPos.x - 0.5f, vPos.y - 0.5f, vPos.z + 0.5f,    vPos.x - 0.5f, vPos.y + 0.5f, vPos.z - 0.5f,    vPos.x - 0.5f, vPos.y - 0.5f, vPos.z - 0.5f });
	}

	if (!IS_UP_N(bStatus)) {
			vMap.push_back({ vPos.x - 0.5f, vPos.y + 0.5f, vPos.z - 0.5f,    vPos.x - 0.5f, vPos.y + 0.5f, vPos.z + 0.5f,    vPos.x + 0.5f, vPos.y + 0.5f, vPos.z + 0.5f });
			vMap.push_back({ vPos.x - 0.5f, vPos.y + 0.5f, vPos.z - 0.5f,    vPos.x + 0.5f, vPos.y + 0.5f, vPos.z + 0.5f,    vPos.x + 0.5f, vPos.y + 0.5f, vPos.z - 0.5f });
	}

	if (!IS_DOWN_N(bStatus)) {
			vMap.push_back({ vPos.x + 0.5f, vPos.y - 0.5f, vPos.z + 0.5f,    vPos.x - 0.5f, vPos.y - 0.5f, vPos.z + 0.5f,    vPos.x - 0.5f, vPos.y - 0.5f, vPos.z - 0.5f });
			vMap.push_back({ vPos.x + 0.5f, vPos.y - 0.5f, vPos.z + 0.5f,    vPos.x - 0.5f, vPos.y - 0.5f, vPos.z - 0.5f,    vPos.x + 0.5f, vPos.y - 0.5f, vPos.z - 0.5f });
	}
}
