#include "LuaScript.h"



template<>
int32_t LuaScript::GetValue(const char* var) {
	if (var != nullptr) lua_getglobal(L, var);
	if (!lua_isinteger(L, -1)) return 0;
	return (int32_t)lua_tointeger(L, -1);
}

template<>
float LuaScript::GetValue(const char* var) {
	if (var != nullptr) lua_getglobal(L, var);
	if (!lua_isnumber(L, -1)) return 0.0f;
	return (float)lua_tonumber(L, -1);
}

template<>
std::string LuaScript::GetValue(const char* var) {
	if (var != nullptr) lua_getglobal(L, var);
	if (!lua_isstring(L, -1)) return "";
	return lua_tostring(L, -1);
}

template<>
const char* LuaScript::GetValue(const char* var) {
	if (var != nullptr) lua_getglobal(L, var);
	if (!lua_isstring(L, -1)) return "";
	return lua_tostring(L, -1);
}

template<>
bool LuaScript::GetValue(const char* var) {
	if (var != nullptr) lua_getglobal(L, var);
	if (!lua_isboolean(L, -1)) return false;
	return lua_toboolean(L, -1);
}


template<> int32_t LuaScript::Push(int32_t value) { lua_pushinteger(L, value);  return 1; }
template<> int32_t LuaScript::Push(float value) { lua_pushnumber(L, value); return 1; }
template<> int32_t LuaScript::Push(std::string value) { lua_pushstring(L, value.c_str()); return 1; }
template<> int32_t LuaScript::Push(const char* value) { lua_pushstring(L, value); return 1; }
template<> int32_t LuaScript::Push(bool value) { lua_pushboolean(L, value); return 1; }