
-- One of the RepeatedStates state
Node = {
  id = -1,
  condition = "return false",
  callback = nil
}

-- Execute condition code at runtime
function Node:Load(params)
  local varInit = ""

  for key, value in pairs(params) do
    varInit = varInit .. key .. " = " .. value .. "\n"
  end

  return load(varInit .. "return " .. Node.condition)
end

function Node:Log()
  for key, value in pairs(Node) do
	  print("[Node][var] " .. key .. " => " .. tostring(value))
  end
end




-- State class
RepeatedStates = {
  nodes = {},
  index = 1
}

function RepeatedStates:Init(data)
  if data == nil then return end

  for key, value in pairs(data) do
    RepeatedStates[key] = value
  end
end

function RepeatedStates:AddNode(params)
  RepeatedStates.nodes[#RepeatedStates.nodes + 1] = Node

  for key, value in pairs(params) do
    RepeatedStates.nodes[#RepeatedStates.nodes][key] = value
  end
end


function RepeatedStates:Log()
  print("[class] RepeatedStates")

  for key, value in pairs(RepeatedStates) do
    if type(value) ~= "table" then
	    print("[var] " .. key .. " => " .. tostring(value))

    else for _, class in pairs(value) do class:Log() end
    end
  end
end


function RepeatedStates:Update(params)
  if #RepeatedStates.nodes == 0 then return end
  if RepeatedStates.nodes[RepeatedStates.index] == nil then RepeatedStates.index = 1 end

  local node = RepeatedStates.nodes[RepeatedStates.index]

  if (node:Load(params)()) then
    RepeatedStates.index = RepeatedStates.index + 1
    if node.callback ~= nil then node.callback(node.id) end
  end
end

