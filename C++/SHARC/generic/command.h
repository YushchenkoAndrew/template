#pragma once
#include "TypeList.h"

namespace MPL
{
	template<class R, class ArgList>
	class Command;
	
	template<class R>
	class Command<R, NullType >
	{
	public:
		typedef R			RetType;
		virtual R operator () ()  = 0;
	};

	template<class R, class A0>
	class Command<R, TypeList<A0, NullType> >
	{
	public:
		typedef R			RetType;
		typedef A0			Arg0Type;
		virtual R operator () (A0)  = 0;
	};

	template<class R, class A0, class A1>
	class Command<R, TypeList<A0, TypeList<A1, NullType> > >
	{
	public:
		typedef R		RetType;
		typedef A0		Arg0Type;
		typedef A1		Arg1Type;	
		virtual R operator () (A0, A1) = 0;
	};
	
/*
	template<class Base, class H, typename Tag>
	class CallBack: public Base
	{
	public:
		CallBack(H & h): ref_(h) {}

		Base::RetType operator() ()
		{
			return ref_.Execute(Tag());
		}

		Base::RetType operator() (Base::Arg0Type A)
		{
			return ref_.Execute(A, Tag());
		}

		Base::RetType operator() (Base::Arg0Type A0, Base::Arg1Type A1)
		{	
			return ref_.Execute(A0, A1, Tag());
		}
	private:
		H & ref_;
	};*/
	
	template<class Base, class H, typename Tag>
	class CallBack;
	
	template<class R, class H, typename Tag>
	class CallBack<Command<R, NullType>, H, Tag>: 
			public Command<R, NullType>
	{
	public:
		CallBack(H & h): ref_(h) {}
		
		virtual R operator() ()
		{
			return ref_.Execute(Tag());
		}	
	private:
		H & ref_;
	};
	
	template<class R, class A0, class H, typename Tag>
	class CallBack<Command<R, TypeList<A0, NullType> >, H, Tag>: 
			public Command<R, TypeList<A0, NullType> >
	{
	public:
		CallBack(H & h): ref_(h) {}
		
		virtual R operator() (A0 A)
		{
			return ref_.Execute(A, Tag());
		}
	private:
		H & ref_;
	};
	
	template<class R, class A0, class A1, class H, typename Tag>
	class CallBack<Command<R, TypeList<A0, TypeList<A1, NullType> > >, H, Tag>:
			public Command<R, TypeList<A0, TypeList<A1, NullType> > >
	{
	public:
		CallBack(H & h): ref_(h) {}
		
		virtual R operator() (A0 a0, A1 a1)
		{
			return ref_.Execute(a0, a1, Tag());
		}
	private:
		H & ref_;
	};
}



