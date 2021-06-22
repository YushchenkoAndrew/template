#include "LuaScript.h"


int32_t LuaScript::GetInt32(const char* var, int32_t stOffset) {
	lua_getglobal(L, var);
	if (!lua_isinteger(L, stOffset)) return 0;
	return (int32_t)lua_tointeger(L, stOffset);
}

float LuaScript::GetNumber(const char* var, int32_t stOffset) {
	lua_getglobal(L, var);
	if (!lua_isnumber(L, stOffset)) return 0.0f;
	return (float)lua_tonumber(L, stOffset);
}


std::string LuaScript::GetString(const char* var, int32_t stOffset) {
	lua_getglobal(L, var);
	if (!lua_isstring(L, stOffset)) return 0;
	return lua_tostring(L, stOffset);
}

bool LuaScript::GetBoolean(const char* var, int32_t stOffset) {
	lua_getglobal(L, var);
	if (!lua_isboolean(L, stOffset)) return 0;
	return lua_toboolean(L, stOffset);
}

