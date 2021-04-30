EM_CC=em++
TARGET=ShadowCasting/Main.cpp
EM_CFLAGS=-std=c++17 -O2 --preload-file ShadowCasting/assets/
EM_LDFALGS=-s ALLOW_MEMORY_GROWTH=1 -s MAX_WEBGL_VERSION=2 -s MIN_WEBGL_VERSION=2 -s USE_LIBPNG=1

all:
	$(EM_CC) $(TARGET) $(EM_CFLAGS) $(EM_LDFALGS) -o index.html

clear:
	rm index.*
