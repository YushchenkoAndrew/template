#pragma once
#include "include/Typelist.h"
#include <string>


enum {
  // Draw operations
  OP_DRAW_EDGE,   OP_DRAW_SHADOW,     OP_DRAW_COLOR,    OP_DRAW_DISTRIBUTION,
  OP_DRAW_NOISE,  OP_DRAW_COLLISION,  OP_DRAW_OUTLINE,  

  // Stand alone operations
  OP_FOLLOW_CAMERA, OP_EXIT,


  // Sub Operations
  SUB_OP_YES,         SUB_OP_NO,
  SUB_OP_TRUE_NOISE,  SUB_OP_PERLIN_NOISE,    SUB_OP_FRACTAL_NOISE
};



	// DRAW_RECTANGLE_COLLISION = 129,
	// DRAW_DIAGONAL_COLLISION = 131,
	// DRAW_DIAGONAL_STAT_COLLISION = 133,
	// DRAW_AXIS_COLLISION = 135,
	// DRAW_AXIS_STAT_COLLISION = 137,
  
typedef TypeList<
  AnyType<OP_DRAW_EDGE, std::string>, TypeList<
  AnyType<OP_DRAW_SHADOW, std::string>, TypeList<
  AnyType<OP_DRAW_COLOR, std::string>, TypeList<
  AnyType<OP_DRAW_DISTRIBUTION, std::string>, TypeList<
  AnyType<OP_DRAW_NOISE, std::string>, TypeList<
  AnyType<OP_DRAW_COLLISION, std::string>, TypeList<
  AnyType<OP_DRAW_OUTLINE, std::string>, TypeList<
  AnyType<OP_FOLLOW_CAMERA, std::string>, TypeList<
  AnyType<OP_EXIT, std::string>, TypeList<
  AnyType<SUB_OP_YES, std::string>, TypeList<
  AnyType<SUB_OP_NO, std::string>, TypeList<
  AnyType<SUB_OP_TRUE_NOISE, std::string>, TypeList<
  AnyType<SUB_OP_PERLIN_NOISE, std::string>, TypeList<
  AnyType<SUB_OP_FRACTAL_NOISE, std::string>, NullType>>>>>>>>>>>>>> OperationsList;


// [OP_DRAW_EDGE] -> SUB_OP_YES -> { ..... }
// [OP_DRAW_EDGE] -> SUB_OP_NO -> { ..... }

typedef TypeList<Int2Type<OP_DRAW_EDGE>, TypeList<Int2Type<SUB_OP_YES>, NullType>> Temp;