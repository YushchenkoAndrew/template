
-- Local varialbes
local file = nil
local cCurr = ""


-- Skip Functions
function SkipComma()
  if (cCurr ~= ",") then return false end
  cCurr = file:read(1)
  return true
end

function SkipColon()
  if (cCurr ~= ":") then return false end
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
    if (not first) then
      SkipComma()
      SkipBlanks()
    end

    local key = ParseString()
    if (not key) then return nil end

    SkipBlanks()
    SkipColon()

    json[key] = ParseValue()

    first = false
  end

  if (cCurr ~= "}") then return nil end

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
    if (not first) then SkipComma() end

    list[#list + 1] = ParseValue()
    if (not list[#list]) then return nil end
    first = false
  end

  if (cCurr ~= "]") then return nil end

  cCurr = file:read(1)
  return list
end


function ParseValue()
  SkipBlanks()

  local value = ParseString() or ParseNumber() or ParseObject() or ParseList()

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


-- Temporary
Parse_JSON("./assets/Menu.json")
