--[[
	This is simple custom YAML parser (MIT)

	Grammar:
	expr      -> 	offset | array
	offset    -> 	(" ")? offset | type colon
	array     -> 	"-" " " offset
	colon     -> 	(" ")? colon | ":" " " value
	value     -> 	(" ")? value | val
	val       -> 	full_type | new_line
	new_line  -> 	"/n" expr
	list      -> 	"[" (full_type ("," full_type)* | "]")
	obj       -> 	"{" (map ("," map)* | "}")
	map       -> 	type ":" full_type  FIXME:
	type      -> 	STRING | NUMBER | INDENTIFIER | TRUE | FALSE | YES | NO
	full_type -> 	type | list | obj


]]

TokenType = {
	-- Sing char tokens
	LEFT_BRACE = 0, RIGHT_BRACE = 1, LEFT_SQUARE_BRACE = 2, RIGHT_SQUARE_BRACE = 3,
	COMMA = 4, DOT = 5, MINUS = 6, PLUS = 7, COLON = 8, HASH = 9, QUOTE = 10,
	DOUBLE_QUOTE = 11, SPACE = 12, TAB = 13, NEW_LINE = 14,

	-- Literals
	INDENTIFIER = 15, STIRNG = 16, NUMBER = 17,

	-- Key words
	TRUE = 18, FALSE = 19, YES = 20, NO = 21, NULL = 22,

	EOF = 23
}


function TokenType:key(value)
	for k, v in pairs(TokenType) do
		if v == value then return k end
	end
end

-- Init Object
Token = {
	type = nil,
	lexem = nil,
	literal = nil,
	line = nil
}

function Token:new(type, lexem, literal, line)
	local obj = {}
	setmetatable(obj, self)
	self.__index = self

	obj.type = type
	obj.lexem = lexem
	obj.literal = literal
	obj.line = line
	return obj
end

function Token:print()
	local lexem = self.lexem or "nil"
	if lexem == "\n" then lexem = "\\n" end

	print("type=" .. (TokenType:key(self.type) or "nil") .. " " ..
		"lexem='" .. lexem .. "' " ..
		"literal='" .. (self.literal or "nil") .. "'")
end

-- Init Object
Lexer = {
	src = "",
	tokens = {},

	start = 1, -- index of the src, that points to first char in the lexem
	curr = 1, -- index of the src, that points at the curr char
	line = 1, -- tracks current line position

	handler = {},
	keywords = {},

	error = nil -- error message
}

function Lexer:new(src)
	local obj = {}
	setmetatable(obj, self)
	self.__index = self

	obj.src = src or ""
	obj.tokens = {}

	obj.handler = {
		["{"] = function() obj:addToken(TokenType.LEFT_BRACE) end,
		["}"] = function() obj:addToken(TokenType.RIGHT_BRACE) end,
		["["] = function() obj:addToken(TokenType.LEFT_SQUARE_BRACE) end,
		["]"] = function() obj:addToken(TokenType.RIGHT_SQUARE_BRACE) end,
		[","] = function() obj:addToken(TokenType.COMMA) end,
		["."] = function() obj:addToken(TokenType.DOT) end,
		["-"] = function() obj:addToken(TokenType.MINUS) end,
		["+"] = function() obj:addToken(TokenType.PLUS) end,
		[" "] = function() obj:addToken(TokenType.SPACE) end,
		["\t"] = function() obj:addToken(TokenType.TAB) end,
		["#"] = function() while obj:peek() ~= "\n" and not obj:isAtEnd() do obj:advance() end end,
		["\r"] = function() end,
		["\""] = function() obj:string("\"") end,
		["'"] = function() obj:string("'") end,

		["\n"] = function()
			obj:addToken(TokenType.NEW_LINE)
			obj.line = obj.line + 1
		end,

		[":"] = function()
			obj:addToken(TokenType.COLON)
			while obj:peek() == " " and not obj:isAtEnd() do
				obj.start = obj.curr
				obj:advance()
				obj:addToken(TokenType.SPACE)
			end

			if not obj:isAlpha(obj:peek()) then return end

			obj.start = obj.curr
			obj:string()
		end,
	}

	obj.keywords = {
		["Yes"] = TokenType.YES,
		["No"] = TokenType.NO,
		["true"] = TokenType.TRUE,
		["false"] = TokenType.FALSE,
		["null"] = TokenType.NULL,
	}

	return obj
end

function Lexer:scan()
	while not self:isAtEnd() do
		self.start = self.curr

		local c = self:advance()
		local handler = self.handler[c]

		if handler then handler()
		elseif self:isDigit(c) then self:number()
		elseif self:isAlpha(c) then self:indentifier()
		else self.error = "Unexpected char '" .. c .. "'. line:" .. self.line end

		if self.error then break end
	end

	table.insert(self.tokens, Token:new(TokenType.EOF, "", nil, self.line))
end

function Lexer:isAtEnd()
	return self.curr >= self.src:len()
end

function Lexer:advance()
	local c = self.src:sub(self.curr, self.curr)
	self.curr = self.curr + 1
	return c
end

function Lexer:addToken(type, literal)
	table.insert(self.tokens, Token:new(type, self.src:sub(self.start, self.curr - 1), literal, self.line))
end

function Lexer:peek()
	if (self:isAtEnd()) then return "\0" end
	return self.src:sub(self.curr, self.curr)
end

function Lexer:peekNext()
	if (self.curr + 1 >= self.src:len()) then return "\0" end
	return self.src:sub(self.curr + 1, self.curr + 1)
end

function Lexer:match(c)
	if (self:isAtEnd()) then return false end
	if (self.src:sub(self.curr, self.curr) ~= c) then return false end

	self.curr = self.curr + 1
	return true
end

function Lexer:isDigit(c)
	return c >= "0" and c <= "9"
end

function Lexer:isAlpha(c)
	return (c >= "a" and c <= "z") or (c >= "A" and c <= "Z") or c == "_"
end

function Lexer:isAlphaNumeric(c)
	return self:isAlpha(c) or self:isDigit(c)
end

function Lexer:string(c)
	if not c then
		while self:peek() ~= "\n" and not self:isAtEnd() do self:advance() end
		self:addToken(TokenType.STIRNG, self.src:sub(self.start, self.curr - 1))
		return
	end

	while self:peek() ~= c and not self:isAtEnd() do
		if self:peek() == "\n" then self.line = self.line + 1 end
		self:advance()
	end

	if self:isAtEnd() then
		self.error = "Unclosed string. line:" .. self.line
		return
	end


	self:advance() -- closing quoute
	self:addToken(TokenType.STIRNG, self.src:sub(self.start + 1, self.curr - 2))
end

function Lexer:number()
	while self:isDigit(self:peek()) do self:advance() end

	if self:peek() == '.' and self:peekNext() then
		self:advance()
		while self:isDigit(self:peek()) do self:advance() end
	end

	self:addToken(TokenType.NUMBER, tonumber(self.src:sub(self.start, self.curr - 1)))
end

function Lexer:indentifier()
	while self:isAlphaNumeric(self:peek()) do self:advance() end
	local word = self.src:sub(self.start, self.curr - 1)
	local type = self.keywords[word]
	if type == nil then type = TokenType.INDENTIFIER end
	self:addToken(type, word)
end

function Lexer:print()
	print("LEXER:")

	for _, token in ipairs(self.tokens) do
		token:print()
	end

	print()
end

ExprType = {
	LIST = "list", OBJ = "obj", LITERAL = "literal", OFFSET = "offset"
}

ExprList = {
	curr = nil,
	next = nil,

	type = ExprType.LIST
}

function ExprList:new(curr, next)
	local obj = {}
	setmetatable(obj, self)
	self.__index = self

	obj.curr = curr or nil
	obj.next = next or nil
	return obj
end

function ExprList:print(offset)
	offset = offset or 0
	print(string.rep(" ", offset) .. "Expr[" .. self.type .. "]")
	self.curr:print(offset + 2)
	if self.next then self.next:print(offset) end
end

ExprObj = {
	key = nil,
	value = nil,
	next = nil,

	type = ExprType.OBJ
}

function ExprObj:new(key, value)
	local obj = {}
	setmetatable(obj, self)
	self.__index = self

	obj.key = key or nil
	obj.value = value or nil
	return obj
end

function ExprObj:print(offset)
	offset = offset or 0
	print(string.rep(" ", offset) .. "Expr[" .. self.type .. "]")
	self.key:print(offset + 2)
	self.value:print(offset + 2)
	if self.next then self.next:print(offset) end
end

ExprLiteral = {
	value = nil,

	type = ExprType.LITERAL
}

function ExprLiteral:new(value)
	local obj = {}
	setmetatable(obj, self)
	self.__index = self

	obj.value = value
	return obj
end

function ExprLiteral:print(offset)
	offset = offset or 0
	print(string.rep(" ", offset) ..
		"Expr[" .. self.type .. "]" ..
		" val = '" .. self.value .. "'"
	)
end

ExprOffset = {
	expr = nil,
	next = nil,

	depth = 0, -- Offset befor the next key word

	type = ExprType.OFFSET
}

function ExprOffset:new(expr, next)
	local obj = {}
	setmetatable(obj, self)
	self.__index = self

	obj.expr = expr
	obj.next = next
	if not expr or type(expr) ~= "table" then return obj end

	if expr.type == ExprType.OFFSET then obj.expr:shift() end
	-- if expr.type == ExprType.OFFSET then obj.depth = (expr.depth or 0) + 1
	-- elseif expr.type == ExprType.LIST then obj.depth = 2 end
	return obj;
end

function ExprOffset:shift()
	self.depth = (self.depth or 0) + 1
	if not self.expr then return end
	if self.expr.type == ExprType.OFFSET then self.expr:shift() end
end

function ExprOffset:print(offset)
	print(string.rep(" ", self.depth) .. "Expr[" .. self.type .. "]")
	if self.expr then self.expr:print(self.depth + 1) end
	if self.next then self.next:print(self.depth + 1) end
end

Parser = {
	tokens = {},

	curr = 1, -- index of the token, that points at the curr token

	error = nil -- error message
}

function Parser:new(tokens)
	local obj = {}
	setmetatable(obj, self)
	self.__index = self

	obj.tokens = tokens or {}
	return obj
end

function Parser:match(...)
	for _, v in ipairs({ ... }) do
		if self:check(v) then self:advance() return true end
	end

	return false
end

function Parser:check(...)
	if (self:isAtEnd()) then return false end
	for _, v in ipairs({ ... }) do
		if self:peek().type == v then return true end
	end

	return false
end

function Parser:advance()
	if (not self:isAtEnd()) then self.curr = self.curr + 1 end
	return self:prev()
end

function Parser:peek()
	return self.tokens[self.curr]
end

function Parser:prev()
	if self.curr == 1 then return nil end
	return self.tokens[self.curr - 1]
end

function Parser:isAtEnd()
	return self:peek() == TokenType.EOF
end

function Parser:consume(type, message)
	if self:check(type) then return self:advance() end

	local token = self:peek()
	local lexem = token.lexem or "nil"
	if lexem == "\n" then lexem = "\\n" end

	self.error = "At line " .. token.line ..
			" '" .. lexem .. "' " ..
			(message or "")
end

-- expr -> obj | array | new_line | EOF
function Parser:expr()
	if self.error then return nil end

	if self:match(TokenType.EOF) then return nil end

	if self:check(TokenType.NEW_LINE) then return self:new_line() end

	if self:check(TokenType.MINUS) then return self:array() end

	return self:obj()
end

-- new_line -> EOF | "\n" ("\n")* expr
function Parser:new_line()
	if self.error then return nil end
	if self:match(TokenType.EOF) then return nil end

	self:consume(TokenType.NEW_LINE, "Expect '\\n' at end of the line")
	while self:match(TokenType.NEW_LINE) do end

	-- return ExprOffset:new(self:expr())
	return self:expr()
end

-- offset -> " " offset | obj | array
function Parser:offset()
	if self.error then return nil end
	if self:check(TokenType.MINUS) then return self:array() end
	if self:match(TokenType.SPACE, TokenType.TAB) then return ExprOffset:new(self:offset()) end

	return self:obj()
end

-- obj -> offset | type (" ")* value
function Parser:obj()
	if self.error then return nil end

	if self:check(TokenType.SPACE, TokenType.TAB) then return self:offset() end

	local key = self:type()
	while self:match(TokenType.SPACE, TokenType.TAB) do end
	return ExprOffset:new(self:value(key))
end

-- value -> ":" (" " (" ")* full_type new_line | new_line)
function Parser:value(key)
	if self.error then return nil end

	self:consume(TokenType.COLON, "Expect ':' at the end of indentifier")
	if self:check(TokenType.NEW_LINE) then return ExprObj:new(key, self:new_line()) end
	if not self:match(TokenType.SPACE, TokenType.TAB) then self.error = "Expect ' ' to create an offset" end

	while self:match(TokenType.SPACE, TokenType.TAB) do end


	return ExprObj:new(key, self:full_type()), self:new_line()
end

-- array -> offset | "-" " " (" ")* full_type value
function Parser:array()
	if self.error then return nil end

	if self:check(TokenType.SPACE, TokenType.TAB) then return self:offset() end


	self:consume(TokenType.MINUS, "Expect '-' at the start of array")
	if not self:match(TokenType.SPACE, TokenType.TAB) then self.error = "Expect ' ' to create an offset" end

	while self:match(TokenType.SPACE, TokenType.TAB) do end

	local key = self:full_type()

	while self:match(TokenType.SPACE, TokenType.TAB) do end
	if not self:check(TokenType.COLON) then return ExprOffset:new(ExprList:new(key), self:new_line()) end

	return ExprOffset:new(ExprOffset:new(ExprOffset:new(ExprList:new(self:value(key)))))
end

-- number -> (MINUS | PLUS)? NUMBER
function Parser:number()
	if self.error then return nil end

	local sign = ""

	if self:match(TokenType.MINUS) then sign = "-" end
	if self:match(TokenType.PLUS) then sign = "+" end

	self:consume(TokenType.NUMBER, "Expected number")

	return ExprLiteral:new(sign .. self:prev().literal)
end

-- type -> number | STRING | INDENTIFIER | TRUE | FALSE | YES | NO
function Parser:type()
	if self.error then return nil end

	if self:match(TokenType.YES, TokenType.TRUE) then return ExprLiteral:new(true) end
	if self:match(TokenType.NO, TokenType.FALSE) then return ExprLiteral:new(false) end
	if self:match(TokenType.NULL) then return ExprLiteral:new(nil) end
	if self:check(TokenType.MINUS, TokenType.PLUS, TokenType.NUMBER) then return self:number() end


	if self:match(TokenType.STIRNG, TokenType.NUMBER, TokenType.INDENTIFIER) then
		return ExprLiteral:new(self:prev().literal)
	end
end

-- full_type -> (type | list | json) (" ")*
function Parser:full_type()
	if self.error then return nil end

	local expr = nil

	if self:match(TokenType.LEFT_SQUARE_BRACE) then
		expr = self:list()
	end

	if self:match(TokenType.LEFT_BRACE) then
		expr = self:json()
	end

	expr = expr or self:type()

	while self:match(TokenType.SPACE, TokenType.TAB) do end
	return expr
end

-- list -> "[" (" ")* (full_type ("," (" ")* full_type)* "]" | "]")
function Parser:list()
	if self.error then return nil end
	while self:match(TokenType.SPACE, TokenType.TAB) do end

	if self:match(TokenType.RIGHT_SQUARE_BRACE) then return ExprList:new() end
	local expr = ExprList:new(self:full_type())
	local curr = expr
	while self:match(TokenType.COMMA) do
		while self:match(TokenType.SPACE, TokenType.TAB) do end
		curr.next = ExprList:new(self:full_type())
		curr = curr.next
	end

	self:consume(TokenType.RIGHT_SQUARE_BRACE, "Expect ']' at the end of list")

	if self.error then return nil end
	return expr
end

-- json -> "{" (" ")* (map ("," map)* "}" | "}")
function Parser:json()
	if self.error then return nil end

	while self:match(TokenType.SPACE, TokenType.TAB) do end

	if self:match(TokenType.RIGHT_BRACE) then return ExprObj:new() end
	local expr = self:map()
	if not expr then return nil end
	local curr = expr
	while self:match(TokenType.COMMA) do
		while self:match(TokenType.SPACE, TokenType.TAB) do end

		curr.next = self:map()
		curr = curr.next
	end

	self:consume(TokenType.RIGHT_BRACE, "Expect '}' at the end of list")

	return expr
end

-- map -> type (" ")* ":" " " (" ")* full_type
function Parser:map()
	if self.error then return nil end

	local key = self:type()
	while self:match(TokenType.SPACE, TokenType.TAB) do end

	self:consume(TokenType.COLON, "Expect ':' at the end of indentifier")
	if not self:match(TokenType.SPACE, TokenType.TAB) then self.error = "Expect ' ' to create an offset" end

	while self:match(TokenType.SPACE, TokenType.TAB) do end

	return ExprObj:new(key, self:full_type())
end

-- Init Object
YAML = {}

function YAML:Parse(path, debug)
	local file = io.open(path, "r")
	if not file then return print("Unable to open file") or nil end

	local lexer = Lexer:new(file:read("a"))
	lexer:scan()

	if lexer.error then return print(lexer.error) end
	if debug then lexer:print() end

	local parser = Parser:new(lexer.tokens)
	local expr = parser:expr()
	if parser.error then return print(parser.error) end
	-- if debug then expr:print() end

end

-- Test
-- YAML:Stringify(
YAML:Parse("../../assets/Config.yaml", true)
-- YAML:Parse("../../assets/Menu.yaml", true)
