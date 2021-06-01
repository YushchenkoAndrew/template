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


	template<typename T>
	void SetValue(T v, value_t t) {
		//if (value != NULL) free(value);

		type = t;
		size = sizeof(T);
		value = malloc(size);
		if (value != NULL) memcpy(value, &v, sizeof(T));
		else size = 0u;
	}

	//template<>
	//void SetValue(sMap*& v, value_t t) {
	//	if (value != NULL) free(value);

	//	type = t;
	//	size = sizeof(v);
	//	value = (void *)v;
	//	//value = malloc(size);
	//	//if (value != NULL) memcpy(value, &v, sizeof(v));
	//	//else size = 0u;
	//}



	//template<>
	//void SetValue(std::map<std::string, value_t> v, value_t t) {
	//	if (value != NULL) free(value);

	//	type = t;
	//	size = v.size();
	//	value = malloc(size);
	//	if (value != NULL) memcpy(value, &v, v.size());
	//	else size = 0u;
	//}



	~jObject() {
		if (value == NULL) return;
		//if (type != value_t::JSON) free(value);

		// TODO: Delete Tree
	}

public:
	//std::string key;
	void* value = NULL;
	//std::unique_ptr<void> value;
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

//struct sMap {
//	std::string key;
//	jObject* value;
//
//	sMap* next;
//
//	jObject*& operator[] (const std::string& str) {
//		key = str;
//		return value;
//	}
//};

//typedef std::map<std::string, jObject> json_t;


//template <typename T>
//struct sVariable {
//	sVariable() : value(NULL), type(json_t::UNDEFINED) {}
//	sVariable(T v, json_t t) : value(v), type(t) {}
//
//	T value;
//	json_t type;
//};
//
//struct jObject;
//typedef std::variant<sVariable<int32_t>, sVariable<float>, sVariable<std::string>, jObject> value_t;


//template<>
//struct sVariable<int32_t> {
//	int32_t value = 0;
//	json_t type = json_t::jINT;
//};
//
//template<>
//struct sVariable<float> {
//	float value = 0;
//	json_t type = json_t::jFLOAT;
//};
//
//template<>
//struct sVariable<std::string> {
//	std::string value = "";
//	json_t type = json_t::jSTRING;
//};

//template<>
//struct sVariable<std::map<std::string, value_t>> {
//	std::map<std::string, value_t> value;
//	json_t type = json_t::jJSON;
//
//	value_t& operator[](const std::string& key) {
//		return value[key];
//	}
//};

//struct jObject {
//	jObject(std::map<std::string, value_t> v) : value(v) {}
//
//
//	value_t& operator[](const std::string& key) {
//		return value[key];
//	}
//
//	std::map<std::string, value_t> value;
//	json_t type = json_t::JSON;
//};
//






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

	static uint8_t ParseString(std::ifstream& iFile, jObject& sVar) {
		if (cCurr != '"') return 0u;
		std::string sValue = "";
		iFile.get(cCurr);
		while (cCurr != '"' && !iFile.eof()) {
			sValue += cCurr;
			iFile.get(cCurr);
		}
		

		sVar.SetValue(sValue, value_t::STRING);

		//sVar = jObject(sValue, value_t::STRING);
		//*((std::string*)sVar) = sValue;

		//sVar = sVariable<std::string>(sValue, json_t::STRING);
		//sVar.type = json_t::jSTRING;
		//sVar.value = sValue;

		iFile.get(cCurr);
		return 1u;
	}

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

	static uint8_t ParseObject(std::ifstream& iFile, jObject& sVar) {
		if (cCurr != '{') return 0u;
		iFile.get(cCurr);
		SkipBlanks(iFile);

		uint8_t bFirst = 1u;
		//std::map<std::string, jObject> json;

		sMap json;
		//sMap* json = (sMap*)malloc(sizeof(sMap));
		//if ((void *)json == NULL) return 0u;

		while (cCurr != '}' && !iFile.eof()) {
			if (!bFirst) {
				SkipComma(iFile);
				SkipBlanks(iFile);
			}

			jObject key;
			ParseString(iFile, key);
			SkipBlanks(iFile);
			SkipColon(iFile);


			//jObject* value = (jObject *)malloc(sizeof(jObject));

			//jObject value;
			//ParseValue(iFile, value);


			//(*json)[*((std::string*)key.value)] = value;
			json.key = *((std::string*)key.value);
			//json->value = value;

			ParseValue(iFile, json.value);

			//json[*((std::string*)key.value)] = value;

			//json[std::get<std::string>(key)] = value;
			bFirst = 0u;
		}

		//printf("%d", *((int32_t *)json["test"].value));

		sVar.SetValue(json, value_t::JSON);


		//std::map<std::string, jObject>* temp = reinterpret_cast<std::map<std::string, jObject>*>(sVar.value);
		//printf("%d", *((int32_t *)(*temp)["test"].value));

		//sVar = jObject(json);
		//sVar.type = JSON::MAP;
		//sVar.value = json;

		iFile.get(cCurr);
		return 1u;
	}

	static void ParseValue(std::ifstream& iFile, jObject& sVar) {
		SkipBlanks(iFile);

		if (!ParseString(iFile, sVar) && !ParseNumber(iFile, sVar) && !ParseObject(iFile, sVar)) {
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

		//std::map<std::string, jObject> temp = *((std::map<std::string, jObject>*)json.value);

		//jObject temp = (*((std::map<std::string, jObject>*)json.value))["test"];


		printf("%s", ((std::string*)((*(sMap*)json.value).value).value)->c_str());
		//printf("%d", *(int32_t*)((*(sMap*)json.value).value).value);

		//printf("%d", *(int32_t *)((*(sMap*)json.value).value).value);

		//printf("%s", (*((std::string *)json.value)).c_str());
		//printf("%.5f", *((float *)json.value));
		//printf("%d", *((int32_t *)temp.value));

		iFile.close();
		//return std::any_cast<json_t>(json.value);
	}

	//static void Print(const json_t& json) {
	//	printf("{\n");
	//	for (auto& e : json) {
	//		printf("%s : ", std::any_cast<std::string>(e.first).c_str());

	//		switch (e.second.type) {
	//			case JSON::INT: 
	//				printf("%d,\n", std::any_cast<int32_t>(e.second.value));
	//				break;

	//			case JSON::FLOAT:
	//				printf("%.5f,\n", std::any_cast<float>(e.second.value));
	//				break;

	//			case JSON::STRING:
	//				printf("%s,\n", std::any_cast<std::string>(e.second.value).c_str());
	//				break;

	//			case JSON::MAP:
	//				json_t child = std::any_cast<json_t>(e.second);
	//				Print(child);
	//				break;
	//		}
	//	}
	//	printf("}\n");
	//}

private:
	static char cCurr;
};
