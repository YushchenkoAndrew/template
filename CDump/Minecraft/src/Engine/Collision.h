#pragma once
#include <cmath>
#include "Objects3D.h"

class Collision {
public:

	template <class T>
	static inline bool RectangleCollision(const T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		return
			abs(v1Pos.x - v2Pos.x) <= (v1Size.x + v2Size.x) / 2 &&
			abs(v1Pos.y - v2Pos.y) <= (v1Size.y + v2Size.y) / 2;
	}

	template <class T>
	static bool SeparatedAxisRectIntersection(const T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		const T* pv1Pos = &v1Pos; const T* pv1Size = &v1Size;
		const T* pv2Pos = &v2Pos; const T* pv2Size = &v2Size;

		for (int32_t k = 0; k < 2; k++) {
			if (k) {
				std::swap(pv1Pos, pv2Pos);
				std::swap(pv1Size, pv2Size);
			}

			for (int32_t i = 0; i < 4; i++) {
				T vStart = (GetRectCoords<T>(i) * (*pv1Size)) + (*pv1Pos);
				T vEnd = (GetRectCoords<T>((i + 1) % 4) * (*pv1Size)) + (*pv1Pos);

				T vProject = { vEnd.x - vStart.x, -(vEnd.y - vStart.y) };
				float d = sqrtf((float)(vProject.x * vProject.x + vProject.y * vProject.y));
				sPoint2D vNormalized = { (float)vProject.x / d, (float)vProject.y / d };

				float p1Min = INFINITY;
				float p1Max = -INFINITY;

				float p2Min = INFINITY;
				float p2Max = -INFINITY;

				for (int32_t j = 0; j < 4; j++) {
					T vPos = (GetRectCoords<T>(j) * (*pv1Size)) + (*pv1Pos);
					float q = ((float)vPos.x * vNormalized.x + (float)vPos.y * vNormalized.y);
					p1Min = std::min(p1Min, q);
					p1Max = std::max(p1Max, q);

					vPos = (GetRectCoords<T>(j) * (*pv2Size)) + (*pv2Pos);
					q = ((float)vPos.x * vNormalized.x + (float)vPos.y * vNormalized.y);
					p2Min = std::min(p2Min, q);
					p2Max = std::max(p2Max, q);
				}

				if (!(p2Max >= p1Min && p1Max >= p2Min)) return false;
			}
		}

		return true;
	}

	template <class T>
	static bool SeparatedAxisStaticRectIntersection(T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		const T* pv1Pos = &v1Pos; const T* pv1Size = &v1Size;
		const T* pv2Pos = &v2Pos; const T* pv2Size = &v2Size;

		float fOverlap = INFINITY;

		for (int32_t k = 0; k < 2; k++) {
			if (k) {
				std::swap(pv1Pos, pv2Pos);
				std::swap(pv1Size, pv2Size);
			}

			for (int32_t i = 0; i < 4; i++) {
				T vStart = (GetRectCoords<T>(i) * (*pv1Size)) + (*pv1Pos);
				T vEnd = (GetRectCoords<T>((i + 1) % 4) * (*pv1Size)) + (*pv1Pos);

				sPoint2D vProject = { vEnd.x - vStart.x, -(vEnd.y - vStart.y) };
				vProject = vProject.normalize();

				float p1Min = INFINITY;
				float p1Max = -INFINITY;

				float p2Min = INFINITY;
				float p2Max = -INFINITY;

				for (int32_t j = 0; j < 4; j++) {
					T vPos = (GetRectCoords<T>(j) * (*pv1Size)) + (*pv1Pos);
					float q = ((float)vPos.x * vProject.x + (float)vPos.y * vProject.y);
					p1Min = std::min(p1Min, q);
					p1Max = std::max(p1Max, q);

					vPos = (GetRectCoords<T>(j) * (*pv2Size)) + (*pv2Pos);
					q = ((float)vPos.x * vProject.x + (float)vPos.y * vProject.y);
					p2Min = std::min(p2Min, q);
					p2Max = std::max(p2Max, q);
				}

				if (!(p2Max >= p1Min && p1Max >= p2Min)) return false;
				fOverlap = std::min(std::min(p1Max, p2Max) - std::max(p1Min, p2Min), fOverlap);
			}
		}

		// FIXME: 
		sPoint2D vPos = { v2Pos.x - v1Pos.x, v2Pos.y - v1Pos.y };
		vPos = vPos.normalize() * fOverlap;

		v1Pos.x -= vPos.x; v1Pos.y -= vPos.y;
		return true;
	}



	template <class T>
	static bool DiagonalRectIntesection(const T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		const T* pv1Pos = &v1Pos; const T* pv1Size = &v1Size;
		const T* pv2Pos = &v2Pos; const T* pv2Size = &v2Size;

		for (int32_t k = 0; k < 2; k++) {
			if (k) {
				std::swap(pv1Pos, pv2Pos);
				std::swap(pv1Size, pv2Size);
			}

			for (int32_t i = 0; i < 4; i++) {
				T vDiag = (GetRectCoords<T>(i) * (*pv1Size)) + (*pv1Pos);

				for (int32_t j = 0; j < 4; j++) {
					T vStart = (GetRectCoords<T>(j) * (*pv2Size)) + (*pv2Pos);
					T vEnd = (GetRectCoords<T>((j + 1) % 4) * (*pv2Size)) + (*pv2Pos);

					// Line intersection
					float h = (float)(vEnd.x - vStart.x) * (pv1Pos->y - vDiag.y) - (float)(pv1Pos->x - vDiag.x) * (vEnd.y - vStart.y);
					if (h == 0.0f) continue;

					float t1 = (float)((vStart.y - vEnd.y) * (pv1Pos->x - vStart.x) + (vEnd.x - vStart.x) * (pv1Pos->y - vStart.y)) / h;
					float t2 = (float)((pv1Pos->y - vDiag.y) * (pv1Pos->x - vStart.x) + (vDiag.x - pv1Pos->x) * (pv1Pos->y - vStart.y)) / h;

					if (t1 >= 0.0f && t1 < 1.0f && t2 >= 0.0f && t2 < 1.0f) return true;
				}
			}
		}

		return false;
	}

	template <class T>
	static bool DiagonalStaticRectIntesection(T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		const T* pv1Pos = &v1Pos; const T* pv1Size = &v1Size;
		const T* pv2Pos = &v2Pos; const T* pv2Size = &v2Size;
		bool bCollide = false;

		for (int32_t k = 0; k < 2; k++) {
			if (k) {
				std::swap(pv1Pos, pv2Pos);
				std::swap(pv1Size, pv2Size);
			}

			for (int32_t i = 0; i < 4; i++) {
				T vDiag = GetRectCoords<T>(i) * (*pv1Size) + (*pv1Pos);
				sPoint2D vDisplacement = { 0.0f, 0.0f };

				for (int32_t j = 0; j < 4; j++) {
					T vStart = GetRectCoords<T>(j) * (*pv2Size) + (*pv2Pos);
					T vEnd = GetRectCoords<T>((j + 1) % 4) * (*pv2Size) + (*pv2Pos);

					// Line intersection
					float h = (float)(vEnd.x - vStart.x) * (pv1Pos->y - vDiag.y) - (float)(pv1Pos->x - vDiag.x) * (vEnd.y - vStart.y);
					if (h == 0.0f) continue;

					float t1 = (float)((vStart.y - vEnd.y) * (pv1Pos->x - vStart.x) + (vEnd.x - vStart.x) * (pv1Pos->y - vStart.y)) / h;
					float t2 = (float)((pv1Pos->y - vDiag.y) * (pv1Pos->x - vStart.x) + (vDiag.x - pv1Pos->x) * (pv1Pos->y - vStart.y)) / h;

					if (t1 >= 0.0f && t1 < 1.0f && t2 >= 0.0f && t2 < 1.0f) {
						vDisplacement.x += (1.0f - t1) * (float)(vDiag.x - pv1Pos->x);
						vDisplacement.y += (1.0f - t1) * (float)(vDiag.y - pv1Pos->y);
						bCollide |= true;
					}
				}

				v1Pos.x += vDisplacement.x * (k ? 1.0f : -1.0f);
				v1Pos.y += vDisplacement.y * (k ? 1.0f : -1.0f);
			}
		}

		return bCollide;
	}




private:
	template <class T>
	static inline const T GetRectCoords(int32_t i) {
		switch (i) {
			case 0: return { -1, -1 };
			case 1: return {  1, -1 };
			case 2: return {  1,  1 };
			case 3: return { -1,  1 };
			default: return { 0, 0 };
		}
	}

private:
};


 

// Envelopes
struct sRectanleCollision {
	template<class T>
	static inline bool IsCollide(const T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		return Collision::RectangleCollision(v1Pos, v2Pos, v1Size, v2Size);
	}
};

struct sDiagonalCollision {
	template<class T>
	static inline bool IsCollide(const T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		return Collision::DiagonalRectIntesection(v1Pos, v2Pos, v1Size / 2, v2Size / 2);
	}
};

struct sDiagonalStaticCollision {
	template<class T>
	static inline bool IsCollide(T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		return Collision::DiagonalStaticRectIntesection(v1Pos, v2Pos, v1Size / 2, v2Size / 2);
	}
};

struct sSeparatedAxisCollision {
	template<class T>
	static inline bool IsCollide(const T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		return Collision::SeparatedAxisRectIntersection(v1Pos, v2Pos, v1Size / 2, v2Size / 2);
	}
};

struct sSeparatedAxisStaticCollision {
	template<class T>
	static inline bool IsCollide(T& v1Pos, const T& v2Pos, const T& v1Size, const T& v2Size) {
		return Collision::SeparatedAxisStaticRectIntersection(v1Pos, v2Pos, v1Size / 2, v2Size / 2);
	}
};




