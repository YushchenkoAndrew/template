EM_CC=em++

LIB=-I./
INCLUDE=include/*.cpp lib/*.cpp
SOURCE=src
LUA_SOURCE=$(SOURCE)/lua

DIRS=Engine Menu
TARGET=$(SOURCE)/*.cpp $(foreach dir, $(DIRS), $(addprefix $(SOURCE)/, $(dir))/*.cpp)
COMPILED_TARGET=lua54/emsc/lua54.o

OUTPUT=web

EM_CFLAGS=-std=c++17 -O3 --preload-file assets/ --preload-file $(LUA_SOURCE)/
EM_LDFALGS=-s ALLOW_MEMORY_GROWTH=1 -s MAX_WEBGL_VERSION=2 -s MIN_WEBGL_VERSION=2 -s USE_LIBPNG=1

all:
	$(EM_CC) $(TARGET) $(COMPILED_TARGET) $(INCLUDE) $(LIB) $(EM_CFLAGS) $(EM_LDFALGS) -o $(OUTPUT)/index.html

dev:
	$(EM_CC) $(TARGET) $(COMPILED_TARGET) $(INCLUDE) $(LIB) $(EM_CFLAGS) $(EM_LDFALGS) -o $(OUTPUT)/index.js

