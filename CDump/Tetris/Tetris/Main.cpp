#include <iostream>
#include "Tetris.h"

int main()
{
	Game::Tetris tetris;
	tetris.init();

	tetris.show();
	//delete &tetris;

	return 0;
}