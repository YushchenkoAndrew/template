#include "Json.h"

const char* JSON::sKeywords[KEYWORDS_SIZE] = { "null$", "true$", "false$" };
const bool	JSON::vKeywords[KEYWORDS_SIZE] = { NULL, true, false };
const value_t JSON::tKeywords[KEYWORDS_SIZE] = { value_t::UNDEFINED, value_t::BOOL, value_t::BOOL };


