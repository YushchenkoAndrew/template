#pragma once

template<typename T>
struct Type2Type {
	typedef T Type;
	inline Type2Type() {}
};

template<int v>
struct Int2Type {
	enum { value = v };
	inline Int2Type() {}
};

template<class T, class U>
struct TypeList {
	typedef T Head;
	typedef U Tail;
	inline TypeList() {}
};


/*	~ How to USE AnyType:
*   AnyType<const char*>::GetValue() = "Test";
*   AnyType<int32_t>::GetValue() = 2;
*   luaJson.CallFunction("Test", TypeList<AnyType<const char *>, TypeList<AnyType<int32_t>, NullType>>(), 1);
* 
*	~ But be aware of that you can't initialize the same type twice
*	because it will return already initialized one
*/

template<class T>
struct AnyType {
	static inline volatile T& GetValue() {
		static volatile T value;
		return value;
	}
};

struct NullType {};
