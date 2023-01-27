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


template<int32_t T, class U>
struct AnyType {

	#pragma always_inline
	static inline U& GetValue() __attribute__((always_inline)) {
		static U value;
		return value;
	}
};

template<int32_t T>
struct AnyType<T, int32_t> {
	static inline int32_t& GetValue() __attribute__((always_inline)) {
		static int32_t value = 0;
		return value;
	}

	template<int32_t U>
	static inline bool Compare() {
		return GetValue() == AnyType<U, int32_t>::GetValue();
	}
};

template<int32_t T>
struct AnyType<T, std::string> {

	#pragma always_inline
	static inline std::string& GetValue() __attribute__((always_inline)) {
		static std::string value;
		return value;
	}

	template<int32_t U>
	static inline bool Compare() {
		return GetValue().compare(AnyType<U, std::string>::GetValue()) == 0;
	}
};


struct NullType {};

template<class T, class U>
struct AnyListType {}; 

template<int32_t T, class U, class L, class F>
struct AnyListType<TypeList<AnyType<T, U>, L>, F> {

	#pragma always_inline
	static inline F& GetValue() __attribute__((always_inline)) {
		return L::GetValue();
	}
};

template<int32_t T, class U>
struct AnyListType<TypeList<AnyType<T, U>, NullType>, U> {

	#pragma always_inline
	static inline U& GetValue() __attribute__((always_inline)) {
		return AnyType<T, U>::GetValue();
	}
};
