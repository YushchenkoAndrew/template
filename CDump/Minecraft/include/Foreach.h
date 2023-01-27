#include "include/Typelist.h"
#include <string>

template<class T, class U> 
struct foreach;

template<int32_t T, class U, class F>
struct foreach<TypeList<AnyType<T, std::string>, U>, F> {
	static inline int32_t Operation() {
		return F::template Compare<T>() ? T : foreach<U, F>::Operation();
	}

// typedef TypeList<Int2Type<OP_DRAW_EDGE>, TypeList<Int2Type<SUB_OP_YES>, NullType>> Temp;
	// static inline void Operation2() {
	// 	if (F::template Compare<T>()) {
	// 		TypeList<Int2Type<T>, >;
	// 		return;
	// 	}

	// 	foreach<U, F>::Operation();
	// }
};

template<int32_t T, class F>
struct foreach<TypeList<AnyType<T, std::string>, NullType>, F> {
	static inline int32_t Operation() {
    return F::template Compare<T>() ? T : -1;
	}
};