#pragma once
#include <string>
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <map>
#include <vector>

#define KEYWORDS_SIZE 3

enum class value_t {
	UNDEFINED,
	INT32,
	FLOAT,
	STRING,
	JSON,
	LIST,
	BOOL
};

template <typename T>
struct Type2Type {
	inline Type2Type() {}
	inline ~Type2Type() {}
};

class jObject {
public:
	template<typename T>
	void SetValue(const T& v, const value_t t) {
		type = t;
		value = std::make_shared<T>(v);
	}

	template<typename T>
	void SetValue(Type2Type<T>, const value_t t) {
		type = t;
		value = std::make_shared<T>();
	}

	template<typename T>
	void MoveValue(std::shared_ptr<T>& dst) const {
		dst = std::move(std::static_pointer_cast<T>(value));
	}

	template<typename T>
	T* GetValue() const {
		return value.get() != nullptr ? std::static_pointer_cast<T>(value).get() : nullptr;
	}

	const value_t GetType() {
		return type;
	}

private:
	std::shared_ptr<void> value;
	value_t type = value_t::UNDEFINED;
};

typedef std::map<std::string, jObject> json_t;
typedef std::vector<jObject> list_t;


class JSON {

private:
	static uint8_t SkipComma(std::ifstream& iFile) {
		if (cCurr() != ',') {
			printf("Expected \",\"\n");
			return 0u;
		}
		iFile.get(cCurr());
		return 1u;
	}

	static uint8_t SkipColon(std::ifstream& iFile) {
		if (cCurr() != ':') {
			printf("Expected \":\"\n");
			return 0u;
		}
		iFile.get(cCurr());
		return 1u;
	}


private:
	static void SkipBlanks(std::ifstream& iFile) {
		while ((cCurr() == ' ' || cCurr() == '\n' || cCurr() == '\t' || cCurr() == '\r') && iFile >> cCurr());
	}

	static uint8_t ParseString(std::ifstream& iFile, jObject& sVar) {
		if (cCurr() != '"') return 0u;
		std::string sValue = "";
		iFile.get(cCurr());
		while (cCurr() != '"' && !iFile.eof()) {
			if (cCurr() == '\\') iFile.get(cCurr());
			sValue += cCurr();
			iFile.get(cCurr());
		}

		if (cCurr() != '"') return 0;
		
		sVar.SetValue(sValue, value_t::STRING);
		iFile.get(cCurr());
		return 1u;
	}

	static uint8_t ParseNumber(std::ifstream& iFile, jObject& sVar) {
		const char cSign = cCurr();
		int32_t iNum = 0;
		float fNum = 0.0f;
		if (cCurr() == '-') iFile.get(cCurr());

		// Parse Integer part of Number
		while (cCurr() >= '0' && cCurr() <= '9' && !iFile.eof()) {
			iNum = iNum * 10 + cCurr() - (int32_t)'0';
			iFile.get(cCurr());
		}

		// Parse Float part of Number
		if (cCurr() == '.') {
			iFile.get(cCurr());
			float fPos = 0.1f;
			while (cCurr() >= '0' && cCurr() <= '9' && !iFile.eof()) {
				fNum += (cCurr() - (float)'0') * fPos;
				fPos *= 0.1f;
				iFile.get(cCurr());
			}
		}
		
		// Quick fix with sSign check, just in the case of 0
		// don't assign sign to it
		if (iNum == 0 && fNum == 0.0f && cSign != '0') return 0u;

		if (fNum == 0.0f) {
			iNum *= cSign == '-' ? -1 : 1;
			sVar.SetValue(iNum, value_t::INT32);
			return 1u;
		}

		fNum = ((float)iNum + fNum) * (cSign == '-' ? -1.0f : 1.0f);
		sVar.SetValue(fNum, value_t::FLOAT);
		return 1u;
	}

	static uint8_t ParseObject(std::ifstream& iFile, jObject& sVar) {
		if (cCurr() != '{') return 0u;
		iFile.get(cCurr());
		SkipBlanks(iFile);

		uint8_t bFirst = 1u;

		sVar.SetValue(Type2Type<json_t>(), value_t::JSON);
		json_t* json = sVar.GetValue<json_t>();

		while (cCurr() != '}' && !iFile.eof()) {
			if (!bFirst) {
				SkipComma(iFile);
				SkipBlanks(iFile);
			}

			jObject key;
			if (!ParseString(iFile, key) || key.GetType() != value_t::STRING) return 0u;

			SkipBlanks(iFile);

			if (!SkipColon(iFile) || !ParseValue(iFile, (*json)[*key.GetValue<std::string>()])) return 0u;
			bFirst = 0u;
		}

		if (cCurr() != '}') return 0u;

		iFile.get(cCurr());
		return 1u;
	}

	static uint8_t ParseList(std::ifstream& iFile, jObject& sVar) {
		if (cCurr() != '[') return 0u;
		iFile.get(cCurr());
		SkipBlanks(iFile);

		uint8_t bFirst = 1u;

		sVar.SetValue(Type2Type<list_t>(), value_t::LIST);
		list_t* list = sVar.GetValue<list_t>();

		while (cCurr() != ']' && !iFile.eof()) {
			if (!bFirst) {
				if (!SkipComma(iFile)) return 0u;
			}

			list->push_back(jObject());
			if (!ParseValue(iFile, list->back())) return 0u;
			bFirst = 0u;
		}

		if (cCurr() != ']') return 0u;

		iFile.get(cCurr());
		return 1u;
	}

	static uint8_t ParseKeywords(std::ifstream& iFile, jObject& sVar) {
		int32_t j = 0;
		for (int32_t i= 0; i < KEYWORDS_SIZE; i++) {
			while (sKeywords[i][j] != '$' && sKeywords[i][j] == cCurr() && !iFile.eof()) {
				iFile.get(cCurr());
				j++;
			}

			if (sKeywords[i][j] == '$') {
				sVar.SetValue(vKeywords[i], tKeywords[i]);
				return 1u;
			}
		}

		return 0u;
	}

	// Didn't implement true/false and null
	static uint8_t ParseValue(std::ifstream& iFile, jObject& sVar) {
		SkipBlanks(iFile);

		if (!ParseString(iFile, sVar) && !ParseNumber(iFile, sVar) && !ParseObject(iFile, sVar) && !ParseList(iFile, sVar) && !ParseKeywords(iFile, sVar)) {
			printf("Exception: Unknown type\n");
			return 0u;
		}

		SkipBlanks(iFile);
		return 1u;
	}


public:
	static uint8_t parse(const std::string& sPath, std::shared_ptr<json_t>& json) {
		std::ifstream iFile;
		iFile.open(sPath);
		if (!iFile.is_open()) {
			printf("Unable to open file");
			return 0u;
		}

		jObject obj;
		iFile.get(cCurr());
		uint8_t err = ParseValue(iFile, obj);


		if (obj.GetType() == value_t::JSON) obj.MoveValue(json);
		else err = 0u;

		iFile.close();
		return err;
	}

private:
	// Use Singleton Meyers
	static inline char& cCurr() {
		static char cCurr;
		return cCurr;
	}

	static const char* sKeywords[KEYWORDS_SIZE];
	static const bool vKeywords[KEYWORDS_SIZE];
	static const value_t tKeywords[KEYWORDS_SIZE];
};

