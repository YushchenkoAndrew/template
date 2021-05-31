#include <string>
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <map>
#include <any>

class JSON {
public:
	enum nType {
		INT,
		FLOAT,
		STRING,
		UNDEFINED,
		MAP
	};

	struct sVariable {
		std::any value = 0;
		nType type = JSON::INT;
	};

	typedef std::map<std::string, sVariable> json_t;

private:
	static void SkipComma(std::ifstream& iFile) {
		if (cCurr != ',') {
			printf("Expected \",\"\n");
		}
		iFile.get(cCurr);
	}

	static void SkipColon(std::ifstream& iFile) {
		if (cCurr != ':') {
			printf("Expected \":\"\n");
		}
		iFile.get(cCurr);
	}

	typedef std::map<std::string, sVariable> json_t;


private:
	static void SkipBlanks(std::ifstream& iFile) {
		while ((cCurr == ' ' || cCurr == '\n' || cCurr == '\t' || cCurr == '\r') && iFile >> cCurr);
	}

	static uint8_t ParseString(std::ifstream& iFile, sVariable& sVar) {
		if (cCurr != '"') return 0u;
		std::string sValue = "";
		iFile.get(cCurr);
		while (cCurr != '"' && !iFile.eof()) {
			sValue += cCurr;
			iFile.get(cCurr);
		}
		
		sVar.type = JSON::STRING;
		sVar.value = sValue;

		iFile.get(cCurr);
		return 1u;
	}

	static uint8_t ParseNumber(std::ifstream& iFile, sVariable& sVar) {
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
		fNum *= iNum == 0 && cSign == '-' ? -1.0f : 1.0f;

		if (iNum == 0 && fNum == 0.0f) return 0u;

		if (fNum == 0.0f) {
			sVar.type = JSON::INT;
			sVar.value = iNum;
			return 1u;
		}

		sVar.type = JSON::FLOAT;
		sVar.value = (float)iNum + fNum;
		return 1u;
	}

	static uint8_t ParseObject(std::ifstream& iFile, sVariable& sVar) {
		if (cCurr != '{') return 0u;
		iFile.get(cCurr);
		SkipBlanks(iFile);

		uint8_t bFirst = 1u;
		json_t json;

		while (cCurr != '}' && !iFile.eof()) {
			if (!bFirst) {
				SkipComma(iFile);
				SkipBlanks(iFile);
			}

			sVariable key;
			ParseString(iFile, key);
			SkipBlanks(iFile);
			SkipColon(iFile);

			sVariable value;
			ParseValue(iFile, value);

			json[std::any_cast<std::string>(key.value)] = value;
			bFirst = 0u;
		}

		sVar.type = JSON::MAP;
		sVar.value = json;

		iFile.get(cCurr);
		return 1u;
	}

	static void ParseValue(std::ifstream& iFile, sVariable& sVar) {
		SkipBlanks(iFile);

		if (!ParseString(iFile, sVar) && !ParseNumber(iFile, sVar) && !ParseObject(iFile, sVar)) {
			printf("Exception: Unknown type\n");
		}

		SkipBlanks(iFile);
	}


public:
	static json_t parse(const std::string& sPath) {
		std::ifstream iFile;
		iFile.open(sPath);
		//if (!iFile.is_open()) {
		//	printf("Unable to open file");
		//	return;
		//}

		sVariable json;
		iFile.get(cCurr);
		ParseValue(iFile, json);

		iFile.close();
		return std::any_cast<json_t>(json.value);
	}

	static void Print(const json_t& json) {
		printf("{\n");
		for (auto& e : json) {
			printf("%s : ", std::any_cast<std::string>(e.first).c_str());

			switch (e.second.type) {
				case JSON::INT: 
					printf("%d,\n", std::any_cast<int32_t>(e.second.value));
					break;

				case JSON::FLOAT:
					printf("%.5f,\n", std::any_cast<float>(e.second.value));
					break;

				case JSON::STRING:
					printf("%s,\n", std::any_cast<std::string>(e.second.value).c_str());
					break;

				case JSON::MAP:
					json_t child = std::any_cast<json_t>(e.second);
					Print(child);
					break;
			}
		}
		printf("}\n");
	}

private:
	static char cCurr;
};
