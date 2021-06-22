#pragma once
#include <string>

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
	~LuaScript() { Close(); }

	bool Init(const char* path) { return CheckState(luaL_dofile(L, path)); }
	void Close() { lua_close(L); }


	bool CheckState(int state) {
		if (state == LUA_OK) return true;
		printf("[lua]: %s\n", lua_tostring(L, -1));
		return false;
	}

	int32_t GetInt32(const char* var, int32_t stOffset = -1);
	float GetNumber(const char* var, int32_t stOffset = -1);
	std::string GetString(const char* var, int32_t stOffset = -1);
	bool GetBoolean(const char* var, int32_t stOffset = -1);


private:
	lua_State* const L;
};
