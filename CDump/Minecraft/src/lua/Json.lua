-- Init Object
JSON = {
	file = nil,
	cCurr = "",
	error = false,
	tKeywords = { "true", "false", "null" },
	tKeywordsValue = { ["true"] = true, ["false"] = false, ["null"] = nil }
}


-- Skip Functions
function JSON:SkipComma()
	if (JSON.cCurr ~= ",") then JSON.error = true; return false end
	JSON.cCurr = JSON.file:read(1)
	return true
end

function JSON:SkipColon()
	if (JSON.cCurr ~= ":") then JSON.error = true; return false end
	JSON.cCurr = JSON.file:read(1)
	return true
end

function JSON:SkipBlanks()
	while (JSON.cCurr == " " or JSON.cCurr == "\n" or JSON.cCurr == "\t" or JSON.cCurr == "\r") do
		JSON.cCurr = JSON.file:read(1)
	end
end

-- Basic Parsers
function JSON:ParseString()
	if (JSON.cCurr ~= "\"") then return nil end
	JSON.cCurr = JSON.file:read(1)
	local str = ""
	while (JSON.cCurr ~= "\"" and JSON.cCurr ~= nil) do
		if (JSON.cCurr == "\\") then JSON.cCurr = JSON.file:read(1) end
		str = str .. JSON.cCurr
		JSON.cCurr = JSON.file:read(1)
	end

	if (JSON.cCurr ~= "\"") then JSON.error = true; return nil end
	JSON.cCurr = JSON.file:read(1)
	return str
end

function JSON:ParseNumber()
	local sign = JSON.cCurr
	local num = 0
	if (JSON.cCurr == "-") then JSON.cCurr = JSON.file:read(1) end

	while (JSON.cCurr >= "0" and JSON.cCurr <= "9") do
		num = num * 10 + JSON.cCurr
		JSON.cCurr = JSON.file:read(1)
	end

	if (JSON.cCurr == ".") then
		JSON.cCurr = JSON.file:read(1)
		local fPos = 0.1
		while (JSON.cCurr >= "0" and JSON.cCurr <= "9") do
			num = num + JSON.cCurr * fPos
			fPos = fPos * 0.1
			JSON.cCurr = JSON.file:read(1)
		end
	end

	if (num == 0 and sign ~= "0") then return nil end

	if (sign == "-") then num = num * -1 end
	return num
end

function JSON:ParseObject()
	if (JSON.cCurr ~= "{") then return nil end
	JSON.cCurr = JSON.file:read(1)
	JSON:SkipBlanks()

	local json = {}
	local first = true
	while (JSON.cCurr ~= "}" and JSON.cCurr ~= nil) do
		if (not first and (not JSON:SkipComma() or JSON:SkipBlanks())) then
			return nil
		end

		local key = JSON:ParseString()
		if (not key or JSON:SkipBlanks() or not JSON:SkipColon()) then return nil end

		json[key] = JSON:ParseValue()
		first = false
	end

	if (JSON.cCurr ~= "}") then JSON.error = true; return nil end
	JSON.cCurr = JSON.file:read(1)
	return json
end

function JSON:ParseList()
	if (JSON.cCurr ~= "[") then return nil end
	JSON.cCurr = JSON.file:read(1)
	JSON:SkipBlanks()

	local list = {}
	local first = true
	while (JSON.cCurr ~= "]" and JSON.cCurr ~= nil) do
		if (not first and not JSON:SkipComma()) then return nil end

		list[#list + 1] = JSON:ParseValue()
		if (not list[#list]) then return nil end
		first = false
	end

	if (JSON.cCurr ~= "]") then JSON.error = true; return nil end
	JSON.cCurr = JSON.file:read(1)
	return list
end

function JSON:ParseKeywords()
	local j = 1
	for _, value in pairs(JSON.tKeywords) do
		while (#value > j and value:sub(j, j) == JSON.cCurr and JSON.cCurr ~= nil) do
			JSON.cCurr = JSON.file:read(1)
			j = j + 1
		end

		if (#value == j) then
			JSON.cCurr = JSON.file:read(1)
			return JSON.tKeywordsValue[value]
		end
	end

	return nil
end

function JSON:ParseValue()
	JSON:SkipBlanks()

	local value = JSON:ParseString() or JSON:ParseNumber() or JSON:ParseObject() or JSON:ParseList() or JSON:ParseKeywords()

	JSON:SkipBlanks()
	return value
end

function JSON:Parse(path)
	JSON.file = io.open(path, "r")
	if not JSON.file then
		print("Unable to open file")
		return nil
	end

	JSON.cCurr = JSON.file:read(1)

	return JSON.ParseValue()
end

function JSON:RepeatStr(str, n)
	local result = ""
	for i = 1, n, 1 do result = result .. str end
	return result
end

function JSON:Stringify(json, i)
	if (json == nil) then return end

	for key, value in pairs(json) do
		if (type(value) == "table") then
			print(JSON:RepeatStr("  ", i) .. key .. " => ")
			JSON:Stringify(value, i + 1)
		else
			print(JSON:RepeatStr("  ", i) .. key .. " => " .. tostring(value))
		end
	end
end

-- Test
-- JSON:Stringify(JSON:Parse("../../assets/Menu.json"), 0)
