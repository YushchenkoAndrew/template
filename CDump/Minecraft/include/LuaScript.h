#pragma once
#include <string>
#include <vector>

extern "C" {
#include "lua54/include/lua.h"
#include "lua54/include/lauxlib.h"
#include "lua54/include/lualib.h"
}

// Link to lua library
#ifdef _WIN32
#pragma comment(lib, "lua54/win32/liblua54.a")
#endif // _WIN32

#ifdef __EMSCRIPTEN__
#pragma comment(lib, "lua54/emsc/liblua54.a")
#endif // __EMPSCRIPTEN__


class LuaScript {
public:
	LuaScript() : L(luaL_newstate()) { luaL_openlibs(L); }
	~LuaScript() { lua_settop(L, 0); lua_close(L); }

	bool Init(const char* path) { return CheckState(luaL_dofile(L, path)); }
	bool Init(const std::string& path) { return CheckState(luaL_dofile(L, path.c_str())); }

	bool CheckState(int state) {
		if (state == LUA_OK) return true;
		printf("[lua]: %s\n", lua_tostring(L, -1));
		return false;
	}

	template<class T>
	T GetValue(const char* var = nullptr);

	template<>
	int32_t GetValue(const char* var) {
		if (var != nullptr) lua_getglobal(L, var);
		if (!lua_isinteger(L, -1)) return 0;
		return (int32_t)lua_tointeger(L, -1);
	}

	template<>
	float GetValue(const char* var) {
		if (var != nullptr) lua_getglobal(L, var);
		if (!lua_isnumber(L, -1)) return 0.0f;
		return (float)lua_tonumber(L, -1);
	}

	template<>
	std::string GetValue(const char* var) {
		if (var != nullptr) lua_getglobal(L, var);
		if (!lua_isstring(L, -1)) return "";
		return lua_tostring(L, -1);
	}

	template<>
	const char* GetValue(const char* var) {
		if (var != nullptr) lua_getglobal(L, var);
		if (!lua_isstring(L, -1)) return "";
		return lua_tostring(L, -1);
	}

	template<>
	bool GetValue(const char* var) {
		if (var != nullptr) lua_getglobal(L, var);
		if (!lua_isboolean(L, -1)) return false;
		return lua_toboolean(L, -1);
	}

	bool GetTable(const char* table) {
		if (table != nullptr) {
			if (sPrevTable != table) lua_getglobal(L, table);
			else sPrevTable = table;
		}

		return lua_istable(L, -1);
	}

	template<class T>
	T GetTableValue(const char* table, const char* key) {
		if (table != nullptr) {
			if (sPrevTable != table) lua_getglobal(L, table);
			else sPrevTable = table;
		}

		if (!lua_istable(L, -1)) return NULL;
		lua_pushstring(L, key);
		lua_gettable(L, -2);
		if (lua_istable(L, -1) || lua_isfunction(L, -1)) return NULL;
		T value = GetValue<T>();
		lua_pop(L, 1);
		return value;
	}

	template<class T>
	T GetTableValue(const char* table, int32_t index) {
		if (table != nullptr) {
			if (sPrevTable != table) lua_getglobal(L, table);
			else sPrevTable = table;
		}

		if (!lua_istable(L, -1)) return NULL;
		lua_pushinteger(L, index);
		lua_gettable(L, -2);
		if (lua_istable(L, -1) || lua_isfunction(L, -1)) return NULL;
		T value = GetValue<T>();
		lua_pop(L, 1);
		return value;
	}

	bool IsKeyExist(const char* table, const char* key) {
		if (table != nullptr) {
			if (sPrevTable != table) lua_getglobal(L, table);
			else sPrevTable = table;
		}

		if (!lua_istable(L, -1)) return false;
		lua_pushstring(L, key);
		lua_gettable(L, -2);
		bool res = !lua_isnil(L, -1);
		lua_pop(L, 1);
		return res;
	}

	template <class T>
	std::vector<T> GetArray(const char* arr = nullptr) {
		if (arr != nullptr) lua_getglobal(L, arr);
		if (!lua_istable(L, -1)) return {};

		std::vector<T> res;
		int32_t nSize = (int32_t)lua_rawlen(L, -1);
		for (int32_t i = 0; i < nSize; i++) {
			lua_pushinteger(L, i + 1);
			lua_gettable(L, -2);
			res.push_back(GetValue<T>());
			lua_pop(L, 1);
		}
		return res;
	}

	int32_t Length() { return lua_istable(L, -1) ? (int32_t)lua_rawlen(L, -1) : 0; }

	// Stack function
	void Pop(int32_t n = 1) { lua_pop(L, n); }

	template <class T> void Push(T value);
	template<> void Push(int32_t value) { lua_pushinteger(L, value); }
	template<> void Push(float value) { lua_pushnumber(L, value); }
	template<> void Push(std::string value) { lua_pushstring(L, value.c_str()); }
	template<> void Push(const char* value) { lua_pushstring(L, value); }
	template<> void Push(bool value) { lua_pushboolean(L, value); }



	template<class T>
	void CallFunction(const char* func, const std::initializer_list<T> argv, int32_t nRes = 0) {
		if (func != nullptr) lua_getglobal(L, func);
		if (!lua_isfunction(L, -1)) return;
		for (auto& value : argv)
			Push(value);
		CheckState(lua_pcall(L, argv.size(), nRes, 0));
	}


	void CallFunction(const char* func, int32_t nRes = 0) {
		if (func != nullptr) lua_getglobal(L, func);
		if (!lua_isfunction(L, -1)) return;
		CheckState(lua_pcall(L, 0, nRes, 0));
	}


	template<class T>
	void CallMethod(const char* table, const char* func, const std::initializer_list<T> argv, int32_t nRes = 0) {
		if (table != nullptr) {
			if (sPrevTable != table) lua_getglobal(L, table);
			else sPrevTable = table;
		}

		if (!lua_istable(L, -1)) return;
		lua_pushstring(L, func);
		lua_gettable(L, -2);
		if (!lua_isfunction(L, -1)) return;
		lua_pushstring(L, table); 
		for (auto& value : argv)
			Push(value);
		CheckState(lua_pcall(L, argv.size() + 1, nRes, 0));
	}



private:
	lua_State* const L;
	std::string sPrevTable;
};
