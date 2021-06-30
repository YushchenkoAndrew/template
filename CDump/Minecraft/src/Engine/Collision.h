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
			(
				(bl1.vPos.x <= bl2.vPos.x + 1.0f) && (bl1.vPos.x + 1.0f >= bl2.vPos.x) &&
				(bl1.vPos.y <= bl2.vPos.y + 1.0f) && (bl1.vPos.y + 1.0f >= bl2.vPos.y) &&
				(bl1.vPos.z <= bl2.vPos.z + 1.0f) && (bl1.vPos.z + 1.0f >= bl2.vPos.z)
			) || (
				(bl2.vPos.x <= bl1.vPos.x + 1.0f) && (bl2.vPos.x + 1.0f >= bl1.vPos.x) &&
				(bl2.vPos.y <= bl1.vPos.y + 1.0f) && (bl2.vPos.y + 1.0f >= bl1.vPos.y) &&
				(bl2.vPos.z <= bl1.vPos.z + 1.0f) && (bl2.vPos.z + 1.0f >= bl1.vPos.z)
			);
	}


private:

};