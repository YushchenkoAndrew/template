#pragma once

extern "C" {
#include "lua54/include/lua.h"
#include "lua54/include/lauxlib.h"
#include "lua54/include/lualib.h"
}

// Link to lua library
#ifdef _WIN32
#pragma comment(lib, "lua54/win32/liblua54.a")
#elif __EMSCRIPTEN__
#pragma comment(lib, "lua54/win32/liblua54.a")
#endif // _WIN32

