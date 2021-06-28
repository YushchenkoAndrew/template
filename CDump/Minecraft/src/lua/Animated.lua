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
    for name, state in pairs(sprites.states) do
      state.NextFrame = coroutine.create(Animated.NextFrame)
      coroutine.resume(state.NextFrame, Animated, 0.0, key, name)
    end

    sprites.NextState = coroutine.create(Animated.NextState)
    coroutine.resume(sprites.NextState, Animated, 0.0, key)
  end
end

-- TODO:
function Animated:LoadSpritePtr(sName, pSprite)

end

function Animated:NextFrame(fElapsedTime, sName, sState)

  -- Init StateMachine
  local class = nil
  local stMachine = Animated.sprites[sName]["states"][sState]
  stMachine.time = 0.0
  class, fElapsedTime = coroutine.yield()

  -- Main Loop
  repeat
    for key, frame in pairs(stMachine.frames) do
      stMachine.time = 0.0

      while true do
        -- FIXME: Change with returning ptr
        class, fElapsedTime = coroutine.yield(key)

        stMachine.time = stMachine.time + fElapsedTime
        if stMachine.time >= frame.duration then break end
      end
    end
  until stMachine.mode ~= "LOOP"

  return nil
end


function Animated:NextState(fElapsedTime, sName)

  -- Init StateMachine
  local stMachine = Animated.sprites[sName]["states"]
  local status = nil
  local frame = nil
  local class = nil
  class, fElapsedTime = coroutine.yield()

  repeat
    for key, state in pairs(stMachine) do
      if coroutine.status(state.NextFrame) ~= "dead" then
        status, frame = coroutine.resume(state.NextFrame, Animated, fElapsedTime, sName, key)
        if frame ~= nil then class, fElapsedTime = coroutine.yield(frame) end
      elseif state.next then
        -- Create and init value of coroutine
        state.NextFrame = coroutine.create(Animated.NextFrame)
        coroutine.resume(state.NextFrame, Animated, fElapsedTime, sName, key)

        -- Get new values
        status, frame = coroutine.resume(state.NextFrame, Animated, fElapsedTime, sName, key)
        if frame ~= nil then class, fElapsedTime = coroutine.yield(frame) end
      else status = true; break end

      status = true
      if frame == nil and not state.next then break end
      status = false
    end
  until status

  return nil
end


function Animated:GetFrame(fElapsedTime, sName)
  local stMachine = Animated.sprites[sName].NextState
  if (coroutine.status(stMachine) == "dead") then return nil end

  local status, frame = coroutine.resume(stMachine, Animated, fElapsedTime, sName)
  return frame
end


-- TODO: this method on demand
function Animated:GetFrameByState()

end

Animated:Init("assets/AnimatedSprite.json")
print(Animated:GetFrame(0.0, "MenuCursor"))
print(Animated:GetFrame(1.0, "MenuCursor"))
print(Animated:GetFrame(2.0, "MenuCursor"))
print(Animated:GetFrame(3.0, "MenuCursor"))
print(Animated:GetFrame(4.0, "MenuCursor"))
print(Animated:GetFrame(5.0, "MenuCursor"))
print(Animated:GetFrame(6.0, "MenuCursor"))

-- local thread = coroutine.create(Animated.GetFrame)
-- print(coroutine.resume(thread, "Animated", 0.0, "MenuCursor"))
-- print(coroutine.resume(thread))
-- print(coroutine.resume(thread))
-- print(coroutine.resume(thread))
-- print(coroutine.resume(thread))
-- Animated:GetFrame(0.0, "MenuCursor")
