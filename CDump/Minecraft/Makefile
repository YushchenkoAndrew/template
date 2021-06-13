EM_CC=em++

LIB=-I./
INCLUDE=include/*.cpp
SOURCE=src

DIRS=Engine Menu
TARGET=$(SOURCE)/*.cpp $(foreach dir, $(DIRS), $(addprefix $(SOURCE)/, $(dir))/*.cpp)

OUTPUT=web

EM_CFLAGS=-std=c++17 -O3 --preload-file assets/
EM_LDFALGS=-s ALLOW_MEMORY_GROWTH=1 -s MAX_WEBGL_VERSION=2 -s MIN_WEBGL_VERSION=2 -s USE_LIBPNG=1

all:
	$(EM_CC) $(TARGET) $(INCLUDE) $(LIB) $(EM_CFLAGS) $(EM_LDFALGS) -o $(OUTPUT)/index.html

dev:
	$(EM_CC) $(TARGET) $(INCLUDE) $(LIB) $(EM_CFLAGS) $(EM_LDFALGS) -o $(OUTPUT)/index.js

