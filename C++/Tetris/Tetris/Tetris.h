#pragma once
#include<Windows.h>

namespace Game
{
	class Tetris
	{
	public:

		enum {
			W = 15,
			H = 18,
			ScreenWidth = 120,
		    ScreenHeigth = 20,
		};

		Tetris()
		{
			// Create standart Shapes
			shapes[0] = "..X...X...X...X.";	// Line
			shapes[1] = "..X..XX...X.....";	// T form
			shapes[2] = "..X..XX..X......";	// Z form 1
			shapes[3] = ".X...XX...X....."; // Z form 2
			shapes[4] = "..X...X..XX.....";	// L form 1
			shapes[5] = ".X...X...XX.....";	// L form 2
			shapes[6] = ".XX..XX.........";	// Cube
		}

		void init()
		{
			// Initialize Console Buffer
			screen = new wchar_t[ScreenHeigth * ScreenWidth];
			for (int i = 0; i < ScreenHeigth * ScreenWidth; i++)
				screen[i] = L' ';		// Set empty space

			hConsole = CreateConsoleScreenBuffer(GENERIC_READ | GENERIC_WRITE, 0, NULL, CONSOLE_TEXTMODE_BUFFER, NULL);
			SetConsoleActiveScreenBuffer(hConsole);
			dwBytesWritten = 0;



			// Create Game Field
			pField = new unsigned char[W * H];

			for (int i = 0; i < H; i++)
				for (int j = 0; j < W; j++)
					pField[j + i * H] = (i == H - 1) || (j == 0 || j == W - 1) ? 1 : 0;

		}

		~Tetris()
		{
			delete[] screen;
			delete[] pField;
		}

		int rotate(int x, int y, int angle)
		{
			switch (angle % 4)
			{
			case 0: return x + y * 4;			//   0 degree
			case 1: return y + 12 - x * 4;		//  90 degree
			case 2:	return 15 - x - y * 4;		// 180 degree
			case 3:	return 3 - y + x * 4;		// 270 degree 
			}
		}

		void show()
		{
			while (true)
			{
				for (int i = 0; i < H; i++)
					for (int j = 0; j < W; j++)
						screen[j + 2 + (i + 1) * ScreenWidth] = L" #"[pField[j + i * H]];
					
				// Display
				WriteConsoleOutputCharacter(hConsole, screen, ScreenHeigth * ScreenWidth, { 0, 0 }, &dwBytesWritten);
			}
		}

	private:
		std::string shapes[7];
		unsigned char* pField = nullptr;
		wchar_t *screen;
		HANDLE hConsole;
		DWORD dwBytesWritten;
	};
}