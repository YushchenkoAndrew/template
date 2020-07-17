#pragma once

namespace MPL{

template<typename T, int Size>
class StaticVector
{
public:
	typedef T value_type;
	typedef value_type& reference;
	typedef const value_type& const_reference;
	typedef value_type* iterator;
	typedef const value_type* const_iterator;

private:
	int  m_size;
	value_type m_data[Size];
public:
	StaticVector(): m_size(0)  {}

	reference       operator[](int n)       { return m_data[n]; }
	const_reference operator[](int n) const { return m_data[n]; }

	int capacity(void) const	{ return Size; }
	int size(void)    	const	{ return m_size; }

	void clear(void) { m_size=0; }
	
	iterator 		begin()			{	return m_data;			}
	iterator 		end()			{	return m_data + m_size;	}
	const_iterator	begin() const	{	return m_data;			}
	const_iterator	end()	 const	{	return m_data + m_size;	}
	reference		front()			{	return m_data[0];		}
	const_reference	front()	const	{	return m_data[0];		}
	void push_back(const value_type & v) { m_data[m_size++] = v; }
};

}//MPL

