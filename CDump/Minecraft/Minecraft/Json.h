#include <string>
#include <stdio.h>
#include <iostream>
#include <fstream>

class JSON {

private:
	static void SkipComma(std::ifstream& iFile) {
		if (cCurr != ',') {
			printf("Expected \",\"");
		}
		iFile.get(cCurr);
	}

	static void SkipColon(std::ifstream& iFile) {
		if (cCurr != ':') {
			printf("Expected \":\"");
		}
		iFile.get(cCurr);
	}


private:
	static void SkipBlanks(std::ifstream& iFile) {
		while ((cCurr == ' ' || cCurr == '\n' || cCurr == '\t' || cCurr == '\r') && iFile >> cCurr);
	}

	static void ParseString(std::ifstream& iFile) {
		if (cCurr != '"') return;
		std::string sValue = "";
		iFile.get(cCurr);
		while (cCurr != '"' && !iFile.eof()) {
			sValue += cCurr;
			iFile.get(cCurr);
		}
		iFile.get(cCurr);
		printf("%s", sValue.c_str());
	}

	static void ParseNumber(std::ifstream& iFile) {
		char cSign = cCurr;
		int32_t iNum = 0;
		float fNum = 0.0f;
		if (cCurr == '-') iFile.get(cCurr);

		// Parse Integer part of Number
		while (cCurr >= '0' && cCurr <= '9' && !iFile.eof()) {
			iNum = iNum * 10 + cCurr - (int32_t)'0';
			iFile.get(cCurr);
		}

		// Parse Float part of Number
		if (cCurr == '.') {
			iFile.get(cCurr);
			float fPos = 0.1f;
			while (cCurr >= '0' && cCurr <= '9' && !iFile.eof()) {
				fNum += (cCurr - (float)'0') * fPos;
				fPos *= 0.1f;
				iFile.get(cCurr);
			}
		}
		
		iNum *= cSign == '-' ? -1 : 1;

		if (iNum != 0 || fNum != 0.0f) printf("%d - %.5f", iNum, fNum);
	}

	static void ParseObject(std::ifstream& iFile) {
		if (cCurr != '{') return;
		iFile.get(cCurr);
		SkipBlanks(iFile);

		uint8_t bFirst = 1u;

		while (cCurr != '}' && !iFile.eof()) {
			if (!bFirst) {
				SkipComma(iFile);
				SkipBlanks(iFile);
			}

			printf("key = \"");
			ParseString(iFile);
			SkipBlanks(iFile);
			SkipColon(iFile);

			printf("\" value = \"");
			ParseValue(iFile);
			printf("\"\n");
			bFirst = 0u;
		}

		iFile.get(cCurr);
	}

	static void ParseValue(std::ifstream& iFile) {
		SkipBlanks(iFile);

		ParseString(iFile);
		ParseNumber(iFile);
		ParseObject(iFile);

		SkipBlanks(iFile);
	}


public:
	static void parse(const std::string& sPath) {
		std::ifstream iFile;
		iFile.open(sPath);
		if (!iFile.is_open()) {
			printf("Unable to open file");
			return;
		}

		iFile.get(cCurr);
		ParseValue(iFile);

		iFile.close();
	}

private:
	static char cCurr;
};
