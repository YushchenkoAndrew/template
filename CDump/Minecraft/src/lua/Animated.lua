require("src/lua/Json")

-- Init Object
Animated = {
  sprites = {},
}

function Animated:Init(path)
  Animated.sprites = JSON:Parse(path)
  -- JSON:Stringify(Animated.sprites, 0)

  -- Create Frame StateMachine (NextFrame) for each State
  for key, sprites in pairs(Animated.sprites) do
    for _, state in pairs(sprites.states) do
      state.NextFrame = {}
    end

    sprites.NextState = {}
    Animated:AddStateMachine(key, 1)
  end
end


function Animated:AddStateMachine(sName, nId)
  -- print("[lua] CREATED [" .. nId .. "] " .. sName)

  -- Create Frame StateMachine (NextFrame) for each State
  local sprites = Animated.sprites[sName]
  for name, state in pairs(sprites.states) do
    state.NextFrame[nId] = coroutine.create(Animated.NextFrame)
    coroutine.resume(state.NextFrame[nId], Animated, 0.0, sName, name)
  end

  sprites.NextState[nId] = coroutine.create(Animated.NextState)
  coroutine.resume(sprites.NextState[nId], Animated, 0.0, sName, nId)
end


function Animated:NextFrame(fElapsedTime, sName, sState)

  -- Init StateMachine
  local class = nil
  local stMachine = Animated.sprites[sName]["states"][sState]
  local time = 0.0
  class, fElapsedTime = coroutine.yield()

  -- Main Loop
  repeat
    for _, frame in pairs(stMachine.frames) do
      time = 0.0

      while true do
        class, fElapsedTime = coroutine.yield(frame.pos)

        time = time + fElapsedTime
        if time >= frame.duration then break end
      end
    end
  until stMachine.mode ~= "LOOP"

  return nil
end


function Animated:NextState(fElapsedTime, sName, nId)

  -- Init StateMachine
  -- local sprite =
  local stMachine = Animated.sprites[sName]
  local status = nil
  local frame = nil
  local class = nil
  class, fElapsedTime = coroutine.yield()

  repeat
    for key, state in pairs(stMachine.states) do
      if coroutine.status(state.NextFrame[nId]) ~= "dead" then
        status, frame = coroutine.resume(state.NextFrame[nId], Animated, fElapsedTime, sName, key)
      elseif state.next then
        -- Create and init value of coroutine
        state.NextFrame[nId] = coroutine.create(Animated.NextFrame)
        coroutine.resume(state.NextFrame[nId], Animated, fElapsedTime, sName, key)

        -- Get new values
        status, frame = coroutine.resume(state.NextFrame[nId], Animated, fElapsedTime, sName, key)
      else status = true; break end

      if frame ~= nil then
        class, fElapsedTime = coroutine.yield(
          {
            size = stMachine.size,
            scale = stMachine.scale,
            offset = { frame["x"] * 8, frame["y"] * 8 }
          }
        )
      end

      status = true
      if frame == nil and not state.next then break end
      status = false
    end
  until status

  return nil
end


function Animated:GetFrame(fElapsedTime, sName, nId)
  -- if nId > #Animated.sprites[sName].NextState then Animated:AddStateMachine(sName, nId) end
  if Animated.sprites[sName].NextState[nId] == nil then Animated:AddStateMachine(sName, nId) end

  local stMachine = Animated.sprites[sName].NextState[nId]
  if (coroutine.status(stMachine) == "dead") then return nil end

  local status, frame = coroutine.resume(stMachine, Animated, fElapsedTime, sName)
  return frame
end


-- TODO: this method on demand
function Animated:GetFrameByState()

end

-- Test
-- Animated:Init("assets/AnimatedSprite.json")
-- JSON:Stringify(Animated:GetFrame(0.0, "MenuCursor"), 0)
-- print(Animated:GetFrame(1.0, "MenuCursor"))
-- print(Animated:GetFrame(2.0, "MenuCursor"))
-- print(Animated:GetFrame(3.0, "MenuCursor"))
