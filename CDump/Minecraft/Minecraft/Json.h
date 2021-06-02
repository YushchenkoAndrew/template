#include <string>
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <map>


enum class value_t {
	UNDEFINED,
	INT32,
	FLOAT,
	STRING,
	JSON
};

template <typename T>
struct Map2Type {
	const std::string v;
	inline Map2Type(const std::string& v_) : v(v_) {}
};

class sMap;

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
	void SetValue(const T& v, const value_t t) {
		type = t;
		value = std::make_shared<T>(v);
	}



	// TODO: Delete Tree
	~jObject() {
		//if (value == NULL) return;
		//if (type != value_t::JSON) free(value);
	}

	template<typename T>
	T* GetValue() {
		return std::static_pointer_cast<T>(value).get();
	}

public:
	//std::string key;
	//void* value = NULL;
	std::shared_ptr<void> value;
	value_t type = value_t::UNDEFINED;
};

//class sMap {
//public:
//
//	//sMap() {}
//
//	//sMap(sMap* ptr) : value(ptr->value), key(ptr->key) {
//	//	std::cout << ptr->key;
//	//}
//
//	void SetValue(const std::string& k, const jObject& v) {
//		if (next != nullptr) return next.get()->SetValue(k, v);
//
//		key = k;
//		value = v;
//	}
//
//
//	template<typename T>
//	T* operator[] (Map2Type<T> key) {
//		std::cout << key.v;
//		//if (std::string(K) != key && next != nullptr) return (*next.get())[k];
//		//else return nullptr;
//		return value.GetValue<T>();
//	}
//
//public:
//	std::string key;
//	//jObject* value;
//	jObject value;
//
//	//sMap* next;
//	std::unique_ptr<sMap> next;
//	//std::unique_ptr<sMap> prev;
//};

typedef std::map<std::string, jObject> json_t;

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
		iFile.get(cCurr);
		return 1u;
	}

	static uint8_t ParseNumber(std::ifstream& iFile, jObject& sVar) {
		const char cSign = cCurr;
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
		
		if (iNum == 0 && fNum == 0.0f) return 0u;

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
		if (cCurr != '{') return 0u;
		iFile.get(cCurr);
		SkipBlanks(iFile);

		uint8_t bFirst = 1u;
		//std::map<std::string, jObject> json;

		//sVar.SetValue(sMap, value_t::JSON);
		//sMap* json = sVar.GetValue<sMap>();

		sVar.value = std::make_shared<json_t>();
		json_t* json = sVar.GetValue<json_t>();

		//sVar.value = std::make_shared<sMap>();
		//sMap* json = sVar.GetValue<sMap>();

		//sMap json;
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

			ParseValue(iFile, (*json)[*key.GetValue<std::string>()]);
			//ParseValue(iFile, json->value);


			//(*json)[*((std::string*)key.value)] = value;
			//json.key = *((std::string*)key.value);
			//json->value = value;

			//ParseValue(iFile, json.value);

			//json->SetValue(*key.GetValue<std::string>(), value);

			//json[*((std::string*)key.value)] = value;

			//json[std::get<std::string>(key)] = value;
			bFirst = 0u;
		}

		//printf("%d", *((int32_t *)json["test"].value));

		//sVar.SetValue(new sMap(&json), value_t::JSON);
		//sVar.SetValue(json, value_t::JSON);

		//printf("%d", *json->GetValue<int32_t>(std::string("test")));

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

		if (!ParseString(iFile, sVar) && !ParseNumber(iFile, sVar)
			&& !ParseObject(iFile, sVar)
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

		printf("%d\n", *(*json.GetValue<json_t>())["test"].GetValue<int32_t>());
		printf("%.5f\n", *(*json.GetValue<json_t>())["test2"].GetValue<float>());
		printf("%s\n", (*(*json.GetValue<json_t>())["test3"].GetValue<json_t>())["test"].GetValue<std::string>()->c_str());
		//printf("%d", *(*json.GetValue<sMap>())[Map2Type<int32_t>(std::string("test"))]);
		//printf("%d", *json.GetValue<sMap>()->GetValue<int32_t>(std::string("test")));
		//printf("%s", json.GetValue<sMap>()->key.c_str());
		//printf("%s", json.GetValue<std::string>()->c_str());
		//printf("%.5f", *json.GetValue<float>());
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
