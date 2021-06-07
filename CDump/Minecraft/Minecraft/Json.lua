
-- Local variables
local file = nil
local cCurr = ""
local error = false
local Keywords = { "true", "false", "null" }
local KeywordsValue = { ["true"] = true, ["false"] = false, ["null"] = nil }

-- Skip Functions
function SkipComma()
	if (cCurr ~= ",") then error = true; return false end
		cCurr = file:read(1)
	return true
end

function SkipColon()
	if (cCurr ~= ":") then error = true; return false end
		cCurr = file:read(1)
	return true
end


function SkipBlanks()
	while (cCurr == " " or cCurr == "\n" or cCurr == "\t" or cCurr == "\r") do
		cCurr = file:read(1)
	end
end


-- Basic Parsers
function ParseString()
	if (cCurr ~= "\"") then return nil end
	cCurr = file:read(1)
	local str = ""
	while (cCurr ~= "\"" and cCurr ~= nil) do
		if (cCurr == "\\") then cCurr = file:read(1) end
		str = str .. cCurr
		cCurr = file:read(1)
	end

	if (cCurr ~= "\"") then error = true; return nil end
	cCurr = file:read(1)
	return str
end

function ParseNumber()
	local sign = cCurr
	local num = 0
	if (cCurr == "-") then cCurr = file:read(1) end

	while (cCurr >= "0" and cCurr <= "9") do
		num = num * 10 +  cCurr
		cCurr = file:read(1)
	end

	if (cCurr == ".") then
		cCurr = file:read(1)
		local fPos = 0.1
		while (cCurr >= "0" and cCurr <= "9") do
			num = num + cCurr * fPos
			fPos = fPos * 0.1
			cCurr = file:read(1)
		end
	end

	if (num == 0 and sign ~= "0") then return nil end

	if (sign == "-") then num = num * -1 end
	return num
end

function ParseObject()
	if (cCurr ~= "{") then return nil end
	cCurr = file:read(1)
	SkipBlanks()

	local json = {}
	local first = true
	while (cCurr ~= "}" and cCurr ~= nil) do
		if (not first and (not SkipComma() or SkipBlanks())) then
			return nil
		end

		local key = ParseString()
		if (not key or SkipBlanks() or not SkipColon()) then return nil end

		json[key] = ParseValue()
		first = false
	end

	if (cCurr ~= "}") then error = true; return nil end
	cCurr = file:read(1)
	return json
end

function ParseList()
	if (cCurr ~= "[") then return nil end
	cCurr = file:read(1)
	SkipBlanks()

	local list = {}
	local first = true
	while (cCurr ~= "]" and cCurr ~= nil) do
		if (not first and not SkipComma()) then return nil end

		list[#list + 1] = ParseValue()
		if (not list[#list]) then return nil end
		first = false
	end

	if (cCurr ~= "]") then error = true; return nil end
	cCurr = file:read(1)
	return list
end

function ParseKeywords()
	local j = 1
	for key, value in pairs(Keywords) do
		while (#value > j and value:sub(j, j) == cCurr and cCurr ~= nil) do
			cCurr = file:read(1)
			j = j + 1
		end

		if (#value == j) then
			cCurr = file:read(1)
			return KeywordsValue[value]
		end
	end

	return nil
end

function ParseValue()
	SkipBlanks()

	local value = ParseString() or ParseNumber() or ParseObject() or ParseList() or ParseKeywords()

	SkipBlanks()
	return value
end


function Parse_JSON(path)
	file = io.open(path, "r")
	if not file then
		print("Unable to open file")
		return
	end

	cCurr = file:read(1)
	return ParseValue()
end


function RepeatStr(str, n)
	local result = ""
	for i = 1, n, 1 do result = result .. str end
	return result
end

function Stringify_JSON(json, i)
	if (json == nil) then return end

	for key, value in pairs(json) do
		if (type(value) == "table") then
			print(RepeatStr("  ", i) .. key .. " => ")
			Stringify_JSON(value, i + 1)
		else
			print(RepeatStr("  ", i) ..  key .. " => " .. tostring(value))
		end
	end
end


-- Temporary
Stringify_JSON(Parse_JSON("./assets/Menu.json"), 0)
