#pragma once
#include <thread>
#include<Windows.h>
#include<vector>
#include<string>
#include<math.h>

namespace Game
{
	struct Position
	{
		int x;
		int y;
	};

	struct Lines
	{
		int count;
		int y;
	};

	class Tetris
	{
	public:

		enum {
			W = 15,
			H = 18,
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

		~Tetris()
		{
			delete[] buffScreen;
			delete[] pField;
			stLines.clear();
		}

		void init()
		{
			hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
			SetConsoleActiveScreenBuffer(hConsole);

			CONSOLE_SCREEN_BUFFER_INFO csbi;
			GetConsoleScreenBufferInfo(hConsole, &csbi);

			ScreenWidth = csbi.srWindow.Right - csbi.srWindow.Left + 1;
			ScreenHeigth = csbi.srWindow.Bottom - csbi.srWindow.Top + 1;
			rWindow = {0, 0, (short)ScreenWidth, (short)ScreenHeigth};

			// Initialize Console Buffer
			buffScreen = new CHAR_INFO[ScreenHeigth * ScreenWidth];
			memset(buffScreen, 0, sizeof(CHAR_INFO) * ScreenHeigth * ScreenWidth);

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
					if (shapes[currIndex][rotate(j, i, currRotation)] == 'X') {
						buffScreen[j + 2 + pos.x + (i + 1 + pos.y) * ScreenWidth].Char.UnicodeChar = (int)'A' + currIndex;
						buffScreen[j + 2 + pos.x + (i + 1 + pos.y) * ScreenWidth].Attributes = L"\x00\x0B\x0E\x06\x05\x01\x0A\x0C\x0E\x0F"[currIndex + 1];;
					}
		}

		bool AllowNextStep(int Index, int Rotate, int nX, int nY)
		{
			for (int x = 0; x < 4; x++)
				for (int y = 0; y < 4; y++)
				{
					// Get index
					int Index_ = rotate(x, y, Rotate);

					// Get Field index
					int FieldIndex = (nY + y) * W + nX + x;

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

		void showUserHelper()
		{
			std::wstring score = L" Score:   " + std::to_wstring(plScore);
			int scoreSize = (int)log10(plScore) + 1;

			for (int i = 0; i < 23; i++) {
				buffScreen[ScreenWidth * 2 + 25 + i].Char.UnicodeChar = L"+========Cotrol:======+"[i];
				buffScreen[ScreenWidth * 3 + 25 + i].Char.UnicodeChar = L"|Arrow Down  -> Down  |"[i];
				buffScreen[ScreenWidth * 4 + 25 + i].Char.UnicodeChar = L"|Arrow Left  -> Left  |"[i];
				buffScreen[ScreenWidth * 5 + 25 + i].Char.UnicodeChar = L"|Arrow Right -> Right |"[i];
				buffScreen[ScreenWidth * 6 + 25 + i].Char.UnicodeChar = L"|Space Key   -> Rotate|"[i];
				buffScreen[ScreenWidth * 7 + 25 + i].Char.UnicodeChar = L"+---------------------+"[i];
				buffScreen[ScreenWidth * 12 + 25 + i].Char.UnicodeChar = score[i < score.length() ? i : 0];

				for (int j = 2; j < 8; j++)
					buffScreen[ScreenWidth * j + 25 + i].Attributes = 0x000F;
				buffScreen[ScreenWidth * 12 + 25 + i].Attributes = i < 7 ? 0x000E : 0x0000F;

			}
		}

	public:
		void show()
		{
			while (!gameOver)
			{
				// Game Time (Time Clock)
				std::this_thread::sleep_for(std::chrono::milliseconds(gameSpeed));

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

						// Check if current STOPED shape create a line in a pField
						for (int i = 0; i < 4; i++)
							if (i + pos.y < H - 1)		// Don't check last line - border line
							{
								bool isLine = true;
								for (int j = 0; j < W; j++)
									isLine &= pField[j + (i + pos.y) * W] != 0;

								if (isLine)
								{
									for (int j = 1; j < W - 1; j++)
										pField[j + (i + pos.y) * W] = 8;

									stLines.push_back(Lines{ 0, i + pos.y });
								}
							}

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
					for (int j = 0; j < W; j++) {
						buffScreen[j + 2 + (i + 1) * ScreenWidth].Char.UnicodeChar = L" ABCDEFG=#"[pField[j + i * W]];
						buffScreen[j + 2 + (i + 1) * ScreenWidth].Attributes = L"\x00\x0B\x0E\x06\x05\x01\x0A\x0C\x0E\x0F"[pField[j + i * W]];
					}

				showCurrShape();
				showUserHelper();

				if (!stLines.empty())
				{
					for (int i = 0; i < stLines.size(); i++)
					{
						stLines[i].count++;

						if (stLines[i].count >= 20)
						{
							for (int x = 1; x < W - 1; x++)		// Don't touch border
								for (int y = stLines[i].y; y > 0; y--)
									pField[y * W + x] = pField[(y - 1) * W + x];

							plScore += (55 - gameSpeed);
							stLines.erase(stLines.begin() + i);
							gameSpeed -= gameSpeed > 5 ? 5 : 0;
						}
					}
				}


				// Display
				WriteConsoleOutput(hConsole, buffScreen, { (short)ScreenWidth, (short)ScreenHeigth }, { 0, 0 }, &rWindow);
			}
			CloseHandle(hConsole);
			std::cout << "Game Over! \n Your Score = " + std::to_string(plScore) + "\n Well done!" << std::endl;
		}



	private:
		int ScreenWidth;
		int ScreenHeigth;

		std::string shapes[7];
		unsigned char* pField = nullptr;

		CHAR_INFO* buffScreen;
		HANDLE hConsole;
		SMALL_RECT rWindow;

		Position pos = { W / 2 - 2, 0 };
		int currRotation = 0;
		int currIndex = 0;

		bool keyStat[4];
		bool keyHold = false;

		int count = 0;
		bool moveShapeDown;

		bool gameOver = false;
		int plScore = 0;
		int gameSpeed = 50;
		std::vector<Lines> stLines;
	};
}