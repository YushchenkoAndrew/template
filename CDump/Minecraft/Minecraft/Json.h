#include <string>
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <map>
#include <any>
#include <variant>


enum class value_t {
	UNDEFINED,
	INT32,
	FLOAT,
	STRING,
	JSON
};

struct sMap;

class jObject {
public:


	//template<typename T>
	//void SetValue(T v, value_t t) {
	//	//if (value != NULL) free(value);

	//	type = t;
	//	size = sizeof(T);
	//	value = malloc(size);
	//	if (value != NULL) memcpy(value, &v, sizeof(T));
	//	else size = 0u;
	//}

	template<typename T>
	void SetValue(T v, value_t t) {
		type = t;
		value = std::make_shared<T>(v);
	}



	// TODO: Delete Tree
	~jObject() {
		//if (value == NULL) return;
		//if (type != value_t::JSON) free(value);
	}

	template<typename T>
	const T* GetValue() {
		return std::static_pointer_cast<T>(value).get();
	}

public:
	//std::string key;
	//void* value = NULL;
	std::shared_ptr<void> value;
	value_t type = value_t::UNDEFINED;
	size_t size = 0;
};

class sMap {
public:
	std::string key;
	//jObject* value;
	jObject value;

	sMap* next;

	//jObject*& operator[] (const std::string& str) {
	//	key = str;
	//	return value;
	//}
};



class JSON {

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


private:
	static void SkipBlanks(std::ifstream& iFile) {
		while ((cCurr == ' ' || cCurr == '\n' || cCurr == '\t' || cCurr == '\r') && iFile >> cCurr);
	}

	//static uint8_t ParseString(std::ifstream& iFile, jObject& sVar) {
	//	if (cCurr != '"') return 0u;
	//	std::string sValue = "";
	//	iFile.get(cCurr);
	//	while (cCurr != '"' && !iFile.eof()) {
	//		sValue += cCurr;
	//		iFile.get(cCurr);
	//	}
	//	

	//	sVar.SetValue(sValue, value_t::STRING);

	//	//sVar = jObject(sValue, value_t::STRING);
	//	//*((std::string*)sVar) = sValue;

	//	//sVar = sVariable<std::string>(sValue, json_t::STRING);
	//	//sVar.type = json_t::jSTRING;
	//	//sVar.value = sValue;

	//	iFile.get(cCurr);
	//	return 1u;
	//}

	static uint8_t ParseNumber(std::ifstream& iFile, jObject& sVar) {
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
			sVar.SetValue(iNum, value_t::INT32);

			//sVar = jObject(iNum, value_t::INT32);

			//sVar = sVariable<int32_t>(iNum, json_t::INT32);

			//sVar.type = JSON::INT;
			//sVar.value = iNum;
			return 1u;
		}

		sVar.SetValue((float)iNum + fNum, value_t::FLOAT);

		//sVar = jObject((float)iNum + fNum, value_t::FLOAT);

		//sVar = sVariable<float>((float)iNum + fNum, json_t::FLOAT);
		//sVar.type = JSON::FLOAT;
		//sVar.value = (float)iNum + fNum;
		return 1u;
	}

	//static uint8_t ParseObject(std::ifstream& iFile, jObject& sVar) {
	//	if (cCurr != '{') return 0u;
	//	iFile.get(cCurr);
	//	SkipBlanks(iFile);

	//	uint8_t bFirst = 1u;
	//	//std::map<std::string, jObject> json;

	//	sMap json;
	//	//sMap* json = (sMap*)malloc(sizeof(sMap));
	//	//if ((void *)json == NULL) return 0u;

	//	while (cCurr != '}' && !iFile.eof()) {
	//		if (!bFirst) {
	//			SkipComma(iFile);
	//			SkipBlanks(iFile);
	//		}

	//		jObject key;
	//		ParseString(iFile, key);
	//		SkipBlanks(iFile);
	//		SkipColon(iFile);


	//		//jObject* value = (jObject *)malloc(sizeof(jObject));

	//		//jObject value;
	//		//ParseValue(iFile, value);


	//		//(*json)[*((std::string*)key.value)] = value;
	//		json.key = *((std::string*)key.value);
	//		//json->value = value;

	//		ParseValue(iFile, json.value);

	//		//json[*((std::string*)key.value)] = value;

	//		//json[std::get<std::string>(key)] = value;
	//		bFirst = 0u;
	//	}

	//	//printf("%d", *((int32_t *)json["test"].value));

	//	sVar.SetValue(json, value_t::JSON);


	//	//std::map<std::string, jObject>* temp = reinterpret_cast<std::map<std::string, jObject>*>(sVar.value);
	//	//printf("%d", *((int32_t *)(*temp)["test"].value));

	//	//sVar = jObject(json);
	//	//sVar.type = JSON::MAP;
	//	//sVar.value = json;

	//	iFile.get(cCurr);
	//	return 1u;
	//}

	static void ParseValue(std::ifstream& iFile, jObject& sVar) {
		SkipBlanks(iFile);

		if (
			//!ParseString(iFile, sVar) && 
			!ParseNumber(iFile, sVar)
			//&& !ParseObject(iFile, sVar)
			) {
			printf("Exception: Unknown type\n");
		}


		SkipBlanks(iFile);
	}


public:
	static void parse(const std::string& sPath) {
		std::ifstream iFile;
		iFile.open(sPath);
		//if (!iFile.is_open()) {
		//	printf("Unable to open file");
		//	return;
		//}

		jObject json;
		iFile.get(cCurr);
		ParseValue(iFile, json);

		printf("%.5f", *json.GetValue<float>());
		//printf("%.5f", *(std::static_pointer_cast<float>(json.value)).get());

		//std::map<std::string, jObject> temp = *((std::map<std::string, jObject>*)json.value);

		//jObject temp = (*((std::map<std::string, jObject>*)json.value))["test"];


		//printf("%s", ((std::string*)((*(sMap*)json.value).value).value)->c_str());

		iFile.close();
		//return std::any_cast<json_t>(json.value);
	}

private:
	static char cCurr;
};
