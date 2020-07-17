#pragma once
#include "TypeList.h"

namespace MPL
{
	
	template<class T, class F, class Arg0 = NullType, class Arg1 = NullType, class Arg2 = NullType>
	struct foreach;

	//-------------- 3Arg Inst -----------------------------------------

	template<class T, class U, class F, class Arg0, class Arg1, class Arg2>
	struct foreach<TypeList<T, U>, F, Arg0, Arg1, Arg2>
	{
		#pragma always_inline
		static inline void Process(Arg0 x, Arg1 y, Arg2 z)
		{
			F::Process<T>(x, y, z);
			foreach<U, F, Arg0, Arg1, Arg2>::Process(x, y, z);
		}
	};

	template<class F, class Arg0, class Arg1, class Arg2>
	struct foreach<NullType, F, Arg0, Arg1, Arg2>
	{
		#pragma always_inline
		static inline void Process(Arg0, Arg1, Arg2) { }
	};

	//---------------- 2Arg Inst ----------------------------------------


	template<class T, class U, class F, class Arg0, class Arg1>
	struct foreach<TypeList<T, U>, F, Arg0, Arg1, NullType>
	{
		#pragma always_inline
		static inline void Process(Arg0 x, Arg1 y)
		{
			F::Process<T>(x, y, z);
			foreach<U, F, Arg0, Arg1, NullType>::Process(x, y, z);
		}
	};

	template<class F, class Arg0, class Arg1>
	struct foreach<NullType, F, Arg0, Arg1, NullType>
	{
		#pragma always_inline
		static inline void Process(Arg0, Arg1){ }
	};

	//-----------------1Arg Inst --------------------------------

	template<class T, class U, class F, class Arg0>
	struct foreach<TypeList<T, U>, F, Arg0, NullType, NullType>
	{
		#pragma always_inline
		static inline void Process(Arg0 x)
		{
			F::Process<T>(x);
			foreach<U, F, Arg0, NullType, NullType>::Process(x);
		}
	};

	template<class F, class Arg0>
	struct foreach<NullType, F, Arg0, NullType, NullType>
	{
		#pragma always_inline
		static inline void Process(Arg0){ }
	};

	//----------------- 0 Arg Inst --------------------------------


	template<class T, class U, class F>
	struct foreach<TypeList<T, U>, F, NullType, NullType, NullType>
	{
		#pragma always_inline 
		static inline void Process()
		{
			F::Process<T>();
			foreach<U, F, NullType, NullType, NullType>::Process();
		}
	};

	template<class F>
	struct foreach<NullType, F, NullType, NullType, NullType>
	{
		#pragma always_inline
		static inline void Process(){ }
	};
}

