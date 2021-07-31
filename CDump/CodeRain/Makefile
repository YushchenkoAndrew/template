GCC=g++

SOURCE=src
LIB=-I./
INCLUDE=lib/*.cpp

DIRS=
TARGET=$(SOURCE)/*.cpp $(foreach dir, $(DIRS), $(addprefix $(SOURCE)/, $(dir))/*.cpp)

OUTPUT_GCC=build
OUT_NAME_GCC=project.o

CFLAGS_GCC=-lX11 -lGL -lpthread -lpng -lstdc++fs -std=c++17
LDFALGS_GCC=

all:
	$(GCC) $(TARGET) $(INCLUDE) $(LIB) $(CFLAGS_GCC) -O3 $(EM_LDFALGS_GCC) -o $(OUTPUT_GCC)/$(OUT_NAME_GCC)

debug:
	$(GCC) $(TARGET) $(INCLUDE) $(LIB) $(CFLAGS_GCC) -O0 $(EM_LDFALGS_GCC) -o $(OUTPUT_GCC)/$(OUT_NAME_GCC)

run:
	./$(OUTPUT_GCC)/$(OUT_NAME_GCC)