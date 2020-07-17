#pragma once
#include "utils.h"

namespace Generic
{
namespace Details{

template<class Container, bool infinite>
class iterator
{
public:
	typedef typename Container::reference	reference;
	typedef typename Container::pointer		pointer;

	iterator(): m_container(NULL), m_pointer(0) {}
	iterator(const iterator & it): m_container(it.m_container), m_pointer(it.m_container) {}
	iterator(Container * c, int p): m_container(c), m_pointer(p) {}
	
	iterator & operator = (const iterator & it)
	{
		m_container = it.m_container;
		m_pointer = it.m_pointer;
		return *this;
	}

	reference operator * () const {	return m_container->at(m_pointer);	}
    pointer operator -> ()  const { return &(operator*()); }
	
	iterator & operator ++ ()
	{
		if (infinite)
			m_container->increment(m_pointer);
		else
			Container::inbuffer_increment(m_pointer);
		return *this;
	}
	
	iterator & operator -- ()
	{
		if (infinite)
			m_container->decrement(m_pointer);
		else
			Container::inbuffer_decrement(m_pointer);
		return *this;
	}
	
	iterator operator ++ (int)
	{
		iterator tmp<Container, infinite> = *this;
		++*this;
		return tmp;
	}
	
	iterator operator -- (int)
	{
		iterator tmp<Container, infinite> = *this;
		--*this;
		return tmp;
	}
	
	bool operator == (const iterator & it) const
	{
		return m_pointer == it.m_pointer;
	}
	
	bool operator != (const iterator & it) const
	{
		return m_pointer != it.m_pointer;
	}
	
private:
	Container * m_container;
	int m_pointer;
};


}//Details


template<class T, int Size>
class cvector
{
public:
	typedef cvector<T, Size>	this_type;
	typedef T value_type;
	typedef value_type * pointer;
	typedef value_type & reference;
	typedef const value_type & const_reference;

	typedef Details::iterator<this_type, false>			iterator;
	typedef const Details::iterator<this_type, false>	const_iterator;
	typedef Details::iterator<this_type, true>			inf_iterator;
	typedef Details::iterator<this_type, true>			const_inf_iterator;

private:
	int		m_first;
	int		m_last;
	int		m_count;
	value_type m_storage[Size];
public:
	cvector(): m_first(0), m_last(0), m_count(0) 
	{
	}

	int capacity() const	{ return Size; 		}
	int size()    	const	{ return m_count;	}
	
	bool full()	const	{	return m_count == capacity();	}
	bool empty() const	{	return m_count == 0;			}
	
	void clear()		{	m_first = 0;	m_last = 0;		m_count = 0; }
	
	reference at(int i)			{/*	assert(i < m_count && i >= 0);*/ return m_storage[i];	}
	reference operator [] (int i){/*	assert(i < m_count && i >= 0);*/ return m_storage[i];	}
	
	iterator 		begin()			{	return iterator(this, m_first);			}
	iterator 		end()			{	return iterator(this, m_last);			}
	const_iterator	begin() const	{	return const_iterator(this, m_first);	}
	const_iterator	end()	 const	{	return const_iterator(this, m_last);	}
	inf_iterator	infbegin()		{	return inf_iterator(this, m_first);		}
	const_inf_iterator	infbegin() const {	return const_inf_iterator(this, m_first);		}


	reference		front()			{	return at(m_first);	}
	const_reference	front()	const	{	return at(m_first);	}
	
	void push_back(const value_type & v)
	{
		assert(!full());
		++m_count;
		m_storage[m_last] = v;
		inbuffer_increment(m_last);
	}
	
	void push_front(const value_type & v)
	{
		assert(!full());
		++m_count;
		inbuffer_decrement(m_first);
		m_storage[m_first] = v;
	}
	
	void pop_back()
	{
		assert(!empty());
		--m_count;
		inbuffer_decrement(m_last);
	}
	
	void pop_front()
	{
		assert(!empty());
		--m_count;
		inbuffer_increment(m_first);
	}
	
private:
	
	static void inbuffer_increment(int & index)
	{
		++index;
		if (index == Size)	index = 0;
		//if (index >= Size)	index -= Size; //поправить позже...
	}
	
	static void inbuffer_decrement(int & index)
	{
		--index;
		if (index < 0)	index += Size;
	}
	
	void increment(int & index) const
	{
		inbuffer_increment(index);
		if (index == m_last)
			index = m_first;
	}
	
	void decrement(int & index)  const
	{
		if (index == m_first)
			index = m_last;
		inbuffer_decrement(index);
	}
	
	friend iterator;
	friend inf_iterator;
};

}//Generic

