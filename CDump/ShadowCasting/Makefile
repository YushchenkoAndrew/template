CC=gcc
CFLAGS=`sdl-config --cflags` `sdl-config --libs` -std=c99
TARGET = Main
OBJ = a.out

EM_ENV=LLVM=/usr/bin NODE_JS=node EMSCRIPTEN_ROOT=/usr/lib/emscripten
EM_CC=emcc
EM_CFLAGS=-Wall -lm
# EM_CFLAGS=-s WASM=1 -O3
EM_LDFALGS=-s USE_SDL=2
# EM_LDFALGS=-s USE_SDL=2 -s USE_SDL_IMAGE=2 -s SDL2_IMAGE_FORMATS='["png"]'

all: $(TARGET)

$(TARGET): $(TARGET).c
	$(CC) $(TARGET).c $(CFLAGS)

run:
	./$(OBJ)

web:
	$(EM_CC) *.c $(EM_CFLAGS) $(EM_LDFALGS) -o index.html
# $(EM_CC) *.c $(EM_CFLAGS) $(EM_LDFALGS) -o index.html -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'