#pragma once
#include <thread>
#include<Windows.h>

namespace Game
{
	struct Position
	{
		int x;
		int y;
	};

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
					pField[j + i * W] = (i == H - 1) || (j == 0 || j == W - 1) ? 9 : 0;

		}

	private:
		int rotate(int x, int y, int angle)
		{
			switch (angle % 4)
			{
			case 0: return x + y * 4;			//   0 degree
			case 1: return y + 12 - x * 4;		//  90 degree
			case 2:	return 15 - x - y * 4;		// 180 degree
			case 3:	return 3 - y + x * 4;		// 270 degree 
			}
			return 0;
		}

		void showCurrShape()
				{
					for (int i = 0; i < 4; i++)
						for (int j = 0; j < 4; j++)
							if (shapes[currIndex][rotate(j, i, currRotation)] == 'X')
								screen[j + 2 + pos.x + (i + 1 + pos.y) * ScreenWidth] = (int)'A' + currIndex;
				}

		bool AllowNextStep(int Index, int Rotate, int nX, int nY)
		{
			for (int x = 0; x < 4; x++)
				for (int y = 0; y < 4; y++)
				{
					// Get index
					int Index_ = rotate(x, y, Rotate);

					// Get Field index
					int FieldIndex = (nY + y) * W  + nX + x;

					// Check if we don't go out of bounds
					if (nX + x >= 0 && nX + x < W && nY + y >= 0 && nY + y < H)
					{
						// Check if next pos is Free
						if (shapes[Index][Index_] == 'X' && pField[FieldIndex] != 0)
							return false;
					}
				}

			return true;
		}

		void KeyPressed()
		{
			for (int i = 0; i < 4; i++) {
				// Store arrow keys in Array ["Down", "Left", "Right", "Space"], used a String of ASCII characters
				keyStat[i] = (0x8000 & GetAsyncKeyState("\x28\x25\x27 "[i]));
			}
		}

		void move()
		{
			pos.y += keyStat[0] && AllowNextStep(currIndex, currRotation, pos.x, pos.y + 1) ? 1 : 0;
			pos.x += keyStat[1] && AllowNextStep(currIndex, currRotation, pos.x - 1, pos.y) ? -1 : 0;
			pos.x += keyStat[2] && AllowNextStep(currIndex, currRotation, pos.x + 1, pos.y) ? 1 : 0;
				
			if (keyStat[3]) {
				if (!keyHold && AllowNextStep(currIndex, currRotation + 1, pos.x, pos.y))
					currRotation++;
				keyHold = true;
			}
			else
				keyHold = false;
		}

	public:
		void show()
		{
			while (!gameOver)
			{
				// Game Time (Time Clock)
				std::this_thread::sleep_for(std::chrono::milliseconds(50));

				moveShapeDown = (++count == 20);

				// Player Movement
				KeyPressed();
				move();

				if (moveShapeDown)
				{
					if (AllowNextStep(currIndex, currRotation, pos.x, pos.y + 1))
						pos.y++;
					else 
					{
						// Add current Shape as a solid piece to pField
						for (int i = 0; i < 4; i++)
							for (int j = 0; j < 4; j++)
								if (shapes[currIndex][rotate(j, i, currRotation)] == 'X')
									pField[j + pos.x + (i + pos.y) * W] = currIndex + 1;

						// Set next Shape
						pos = { W / 2 - 2, 0 };
						currIndex = rand() % 7;
						currRotation = 0;

						// Check if next shape is fit? If is not then -> GameOver 
						gameOver = !AllowNextStep(currIndex, currRotation, pos.x, pos.y);
					}

					count = 0;
				}
				


				for (int i = 0; i < H; i++)
					for (int j = 0; j < W; j++)
						screen[j + 2 + (i + 1) * ScreenWidth] = L" ABCDEFG=#"[pField[j + i * W]];

				showCurrShape();

					
				// Display
				WriteConsoleOutputCharacter(hConsole, screen, ScreenHeigth * ScreenWidth, { 0, 0 }, &dwBytesWritten);
			}
			CloseHandle(hConsole);
			std::cout << "Game Over!" << std::endl;
		}

		

	private:
		std::string shapes[7];
		unsigned char *pField = nullptr;

		wchar_t *screen;
		HANDLE hConsole;
		DWORD dwBytesWritten;

		Position pos = {W / 2 - 2, 0};
		int currRotation = 0;
		int currIndex = 0;

		bool keyStat[4];
		bool keyHold = false;

		int count = 0;
		bool moveShapeDown;

		bool gameOver = false;
	};
}