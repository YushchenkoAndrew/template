CC=gcc
CFLAGS=`sdl-config --cflags` `sdl-config --libs` -std=c99
TARGET = Main
OBJ = a.out

all: $(TARGET)

$(TARGET): $(TARGET).c
	$(CC) $(TARGET).c $(CFLAGS)

run:
	./$(OBJ)

web:
	emcc -o index.html *.c -s USE_SDL=2