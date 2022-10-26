-- Init Object
YAML = {
	file = nil,
	cCurr = "",
	nOffset = 0,
	error = false,
	tKeywords = { "true", "false", "null" },
	tKeywordsValue = { ["true"] = true, ["false"] = false, ["null"] = nil }
}


-- Skip Functions
function YAML:SkipComma()
	if (YAML.cCurr ~= ",") then YAML.error = true; return false end
	YAML.cCurr = YAML.file:read(1)
	return true
end

function YAML:SkipColon()
	if (YAML.cCurr ~= ":") then YAML.error = true; return false end
	YAML.cCurr = YAML.file:read(1)
	return true
end

function YAML:SkipOffset()
	local nOffset = 0
	while (YAML.cCurr == " " or YAML.cCurr == "\t") do
		nOffset = nOffset + 1
		YAML.cCurr = YAML.file:read(1)
	end

	-- if (!YAML.nOffset and YAML.nOffset ~= nOffset)
end

function YAML:SkipBlanks()
	while (YAML.cCurr == " " or YAML.cCurr == "\n" or YAML.cCurr == "\t" or YAML.cCurr == "\r") do
		YAML.cCurr = YAML.file:read(1)
	end
end

-- Basic Parsers
function YAML:ParseString()
	if (YAML.cCurr ~= "\"") then return nil end
	YAML.cCurr = YAML.file:read(1)
	local str = ""
	while (YAML.cCurr ~= "\"" and YAML.cCurr ~= nil) do
		if (YAML.cCurr == "\\") then YAML.cCurr = YAML.file:read(1) end
		str = str .. YAML.cCurr
		YAML.cCurr = YAML.file:read(1)
	end

	if (YAML.cCurr ~= "\"") then YAML.error = true; return nil end
	YAML.cCurr = YAML.file:read(1)
	return str
end

function YAML:ParseNumber()
	local sign = YAML.cCurr
	local num = 0
	if (YAML.cCurr == "-") then YAML.cCurr = YAML.file:read(1) end

	while (YAML.cCurr >= "0" and YAML.cCurr <= "9") do
		num = num * 10 + YAML.cCurr
		YAML.cCurr = YAML.file:read(1)
	end

	if (YAML.cCurr == ".") then
		YAML.cCurr = YAML.file:read(1)
		local fPos = 0.1
		while (YAML.cCurr >= "0" and YAML.cCurr <= "9") do
			num = num + YAML.cCurr * fPos
			fPos = fPos * 0.1
			YAML.cCurr = YAML.file:read(1)
		end
	end

	if (num == 0 and sign ~= "0") then return nil end

	if (sign == "-") then num = num * -1 end
	return num
end

function YAML:ParseObject()
	if (YAML.cCurr ~= "{") then return nil end
	YAML.cCurr = YAML.file:read(1)
	YAML:SkipBlanks()

	local json = {}
	local first = true
	while (YAML.cCurr ~= "}" and YAML.cCurr ~= nil) do
		if (not first and (not YAML:SkipComma() or YAML:SkipBlanks())) then
			return nil
		end

		local key = YAML:ParseString()
		if (not key or YAML:SkipBlanks() or not YAML:SkipColon()) then return nil end

		json[key] = YAML:ParseValue()
		first = false
	end

	if (YAML.cCurr ~= "}") then YAML.error = true; return nil end
	YAML.cCurr = YAML.file:read(1)
	return json
end

function YAML:ParseList()
	if (YAML.cCurr ~= "[") then return nil end
	YAML.cCurr = YAML.file:read(1)
	YAML:SkipBlanks()

	local list = {}
	local first = true
	while (YAML.cCurr ~= "]" and YAML.cCurr ~= nil) do
		if (not first and not YAML:SkipComma()) then return nil end

		list[#list + 1] = YAML:ParseValue()
		if (not list[#list]) then return nil end
		first = false
	end

	if (YAML.cCurr ~= "]") then YAML.error = true; return nil end
	YAML.cCurr = YAML.file:read(1)
	return list
end

function YAML:ParseKeywords()
	local j = 1
	for _, value in pairs(YAML.tKeywords) do
		while (#value > j and value:sub(j, j) == YAML.cCurr and YAML.cCurr ~= nil) do
			YAML.cCurr = YAML.file:read(1)
			j = j + 1
		end

		if (#value == j) then
			YAML.cCurr = YAML.file:read(1)
			return YAML.tKeywordsValue[value]
		end
	end

	return nil
end

function YAML:ParseValue()
	YAML:SkipBlanks()

	local value = YAML:ParseString() or YAML:ParseNumber() or YAML:ParseObject() or YAML:ParseList() or YAML:ParseKeywords()

	YAML:SkipBlanks()
	return value
end

function YAML:Parse(path)
	YAML.file = io.open(path, "r")
	if not YAML.file then
		print("Unable to open file")
		return nil
	end

	YAML.cCurr = YAML.file:read(1)

	return YAML.ParseValue()
end

function YAML:RepeatStr(str, n)
	local result = ""
	for i = 1, n, 1 do result = result .. str end
	return result
end

function YAML:Stringify(json, i)
	if (json == nil) then return end

	for key, value in pairs(json) do
		if (type(value) == "table") then
			print(YAML:RepeatStr("  ", i) .. key .. " => ")
			YAML:Stringify(value, i + 1)
		else
			print(YAML:RepeatStr("  ", i) .. key .. " => " .. tostring(value))
		end
	end
end

-- Test
YAML:Stringify(YAML:Parse("../../assets/Menu.yaml"), 0)
