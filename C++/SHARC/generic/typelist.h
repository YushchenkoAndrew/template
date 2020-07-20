#pragma once
#include "utils.h"

template< typename TID_, TID_ Id, class Entitys>
struct Node
{
	typedef	TID_	TID;
	static const TID ID = SwapBytes<TID, Id>::Result;
};


//---------------------------------------------------

template <int T>
struct Int2Type 
{
	#pragma always_inline
	inline Int2Type() {}
	#pragma always_inline
	inline Int2Type(int) {}	//solve some compiler bug
};

template <typename T>
struct Type2Type
{
	#pragma always_inline
	inline Type2Type() {}
	#pragma always_inline
	inline Type2Type(int) {}	//solve some compiler bug
};


template <unsigned int T>
struct UInt2Type 
{
	#pragma always_inline
	inline UInt2Type() {}
	#pragma always_inline
	inline UInt2Type(int) {}
};


//---------------------------------------------------

template < class T0, class T1 >
struct TypeList
{
	typedef	T0 Head;
	typedef T1 Tail;
};


//---------------------------------------------------


template < class T, int i >
struct Index;

template < class T, class U, int i>
struct Index < TypeList<T, U>, i >
{
	typedef Index<U, i - 1 >::type type;
};

template < class T, class U >
struct Index < TypeList< T, U >, 0 >
{
	typedef T	type;
};

template <int i> 
struct Index< NullType, i >
{
	typedef NullType type;
};

//----------------------------------------

template <bool flag, typename T, typename U>
struct Select
{
	typedef T type;	
};

template <typename T, typename U>
struct Select<false, T, U>
{
	typedef U type;
};

//----------------------------------------

template < typename T, typename U >
struct IsTypes
{
	enum { equal = false };
};
	
template < typename T >
struct IsTypes<T, T>
{
	enum {	equal = true };
};

//----------------------------------------------



