#include <iostream>
#include "Tetris.h"

int main(int argv, char* argc[])
{
	auto tetris = Game::Tetris();
	tetris.init();

	tetris.show();

	return 0;
}