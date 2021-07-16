
Automation = {
  required = {},
  states = {},
}

function Automation:AddState(key, className, data)
  -- Dynamic module Load
  if Automation.required[className] == nil then
    Automation.required[className] = true
    require(className)
  end

  Automation.states[key] = _G[className]
  Automation.states[key]:Init(data)
end


function Automation:AddNode(key, params)
  Automation.states[key]:AddNode(params)
end


function Automation:Log()
  for _, state in pairs(Automation.states) do state:Log() end
end


function Automation:Update(params)
  for _, state in pairs(Automation.states) do state:Update(params) end
end


-- Test Module
Automation:AddState("test", "RepeatedStates")
Automation:Log()


function TestCallback(id) print("HERE - " .. id) end
Automation:AddNode("test", { condition = "a + 5 > 10", callback = TestCallback, id = 58})

for i = 1, 10 do Automation:Update({ a = i }) end

Automation:Log()




