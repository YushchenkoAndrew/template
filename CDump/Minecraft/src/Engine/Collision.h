#pragma once
#include <cmath>
#include "Objects3D.h"


// TODO:
// Interface for overlapping
class Collision {

};

//class DiagonalCollision : public Collision {
class BlockCollision {
public:

	static bool IsCollide(sBlock& bl1, sBlock& bl2) {
		return
			(fabsf(bl1.vPos.x - bl2.vPos.x) < 2.0f) &&
			(fabsf(bl1.vPos.y - bl2.vPos.y) < 2.0f) &&
			(fabsf(bl1.vPos.z - bl2.vPos.z) < 2.0f);
	}


private:

};