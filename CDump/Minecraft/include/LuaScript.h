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
	~LuaScript() { lua_close(L); }

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


	template<class T>
	T GetTableValue(const char* table, const char* key) {
		if (table != nullptr) {
			if (sPrevTable != table) lua_getglobal(L, table);
			else sPrevTable = table;
		}

		if (!lua_istable(L, -1)) return NULL;
		lua_pushstring(L, key);
		lua_gettable(L, -2);
		if (lua_istable(L, -1)) return NULL;
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
		if (lua_istable(L, -1)) return NULL;
		T value = GetValue<T>();
		lua_pop(L, 1);
		return value;
	}

	template <class T>
	std::vector<T> GetArray(const char* table, int32_t nSize) {
		if (table != nullptr)  lua_getglobal(L, table);
		if (!lua_istable(L, -1)) return {};

		std::vector<T> res;
		for (int32_t i = 0; i < nSize; i++) {
			lua_pushinteger(L, i + 1);
			lua_gettable(L, -2);
			res.push_back(GetValue<T>());
			lua_pop(L, 1);
		}
		return res;
	}

	// Stack function
	void Pop(int32_t n = 1) { lua_pop(L, n); }



	// FIXME: 
	//template<class T>
	void CallFunction(const char* func, const std::string& argv, int32_t nRes = 0) {
		lua_getglobal(L, func);
		if (!lua_isfunction(L, -1)) return;
		//for (auto& value : argv) 
			lua_pushstring(L, argv.c_str());
		CheckState(lua_pcall(L, 1, nRes, 0));
	}

private:
	lua_State* const L;
	std::string sPrevTable;
};
