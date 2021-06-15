#pragma once

template <typename T>
struct Type2Type {
	typedef T struct_t;
};

template <int v>
struct Int2Type {
	enum { value = v };
};
