TokenType = {
	-- Sing char tokens
	LEFT_BRACE = 0, RIGHT_BRACE = 1, LEFT_SQUARE_BRACE = 2, RIGHT_SQUARE_BRACE = 3,
	COMMA = 4, DOT = 5, MINUS = 6, PLUS = 7, COLON = 8, HASH = 9, QUOTE = 10,
	DOUBLE_QUOTE = 11, SPACE = 12, TAB = 13,

	-- Literals
	INDENTIFIER = 14, STIRNG = 15, NUMBER = 16,

	-- Key words
	TRUE = 17, FALSE = 18, YES = 19, NO = 20,

	EOF = 21
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
	print("type=" .. (TokenType:key(self.type) or "nil") .. " " ..
		"lexem='" .. (self.lexem or "nil") .. "' " ..
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
		["\n"] = function() obj.line = obj.line + 1 end,
		["\""] = function() obj:string("\"") end,
		["'"] = function() obj:string("'") end,

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
	self:addToken(type)
end

-- Init Object
YAML = {
	lexer = nil
}


function YAML:Parse(path)
	local file = io.open(path, "r")
	if not file then return print("Unable to open file") or nil end

	self.lexer = Lexer:new(file:read("a"))
	self.lexer:scan()


	-- if self.lexer.error then return
	print(self.lexer.error)

	for _, token in ipairs(self.lexer.tokens) do
		token:print()
	end
end

-- Test
-- YAML:Stringify(
YAML:Parse("../../assets/Config.yaml")
