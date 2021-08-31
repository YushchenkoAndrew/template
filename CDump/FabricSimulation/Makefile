GCC=g++
EM_CC=em++

SOURCE=src
LIB=-L./ -I./
INCLUDE=lib/*.cpp

DIRS=
TARGET=$(SOURCE)/*.cpp $(foreach dir, $(DIRS), $(addprefix $(SOURCE)/, $(dir))/*.cpp)
COMPILED_TARGET=

OUTPUT_GCC=build
OUT_NAME_GCC=project.o

OUTPUT_EM=web
OUT_NAME_EM=index

LUA_FLAG=
CFLAGS_GCC=-lX11 -lGL -lpthread -lpng -lstdc++fs -std=c++17
LDFALGS_GCC=

CFLAGS_EM=-std=c++17 -O3 --preload-file assets/
LDFALGS_EM=-s ALLOW_MEMORY_GROWTH=1 -s MAX_WEBGL_VERSION=2 -s MIN_WEBGL_VERSION=2 -s USE_LIBPNG=1

all:
	if [ ! -d "./web" ]; then mkdir $(OUTPUT_EM); fi
	if [ ! -d "./build" ]; then mkdir $(OUTPUT_GCC); fi
	$(GCC) $(TARGET) $(INCLUDE) $(LIB) $(CFLAGS_GCC) $(LUA_FLAG) -O3 $(EM_LDFALGS_GCC) -o $(OUTPUT_GCC)/$(OUT_NAME_GCC)
	$(EM_CC) $(TARGET) $(COMPILED_TARGET) $(INCLUDE) $(LIB) $(CFLAGS_EM) $(LDFALGS_EM) -o $(OUTPUT_EM)/$(OUT_NAME_EM).js

debug:
	if [ ! -d "./build" ]; then mkdir $(OUTPUT_GCC); fi
	$(GCC) $(TARGET) $(INCLUDE) $(LIB) $(CFLAGS_GCC) $(LUA_FLAG) -O0 -ggdb $(EM_LDFALGS_GCC) -o $(OUTPUT_GCC)/$(OUT_NAME_GCC)

dev:
	if [ ! -d "./web" ]; then mkdir $(OUTPUT_EM); fi
	$(EM_CC) $(TARGET) $(COMPILED_TARGET) $(INCLUDE) $(LIB) $(CFLAGS_EM) $(LDFALGS_EM) -o $(OUTPUT_EM)/$(OUT_NAME_EM).html

run:
	LD_LIBRARY_PATH='$(shell pwd)' ./$(OUTPUT_GCC)/$(OUT_NAME_GCC)
