require("src/lua/Json")

-- Init Object
Animated = {
  sprites = {},

  frame = 0,
  frameTime = 0.0,
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
  end
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
        class, fElapsedTime = coroutine.yield(key)

        stMachine.time = stMachine.time + fElapsedTime
        if stMachine.time >= frame.duration then break end
      end
    end
  until stMachine.mode ~= "LOOP"

  -- TODO: Do correct exit
end

-- TODO: Create StateMachine
function Animated:GetFrame(fElapsedTime, sName, sState)
  if (coroutine.status(Animated.sprites[sName]["states"][sState].NextFrame) == "dead") then
    -- Animated.sprites[sName].FrameThread = coroutine.create(Animated.NextFrame)
    return -1
  end

  return coroutine.resume(Animated.sprites[sName]["states"][sState].NextFrame, Animated, fElapsedTime, sName, sState)
end

function Animated:SetState(state)
  Animated.currState = state
  Animated.frame = 0
end

Animated:Init("assets/AnimatedSprite.json")
print(Animated:GetFrame(0.0, "MenuCursor", "click"))
print(Animated:GetFrame(1.0, "MenuCursor", "click"))
print(Animated:GetFrame(2.0, "MenuCursor", "click"))
print(Animated:GetFrame(3.0, "MenuCursor", "click"))
print(Animated:GetFrame(4.0, "MenuCursor", "click"))
print(Animated:GetFrame(5.0, "MenuCursor", "click"))
print(Animated:GetFrame(6.0, "MenuCursor", "click"))

-- local thread = coroutine.create(Animated.GetFrame)
-- print(coroutine.resume(thread, "Animated", 0.0, "MenuCursor"))
-- print(coroutine.resume(thread))
-- print(coroutine.resume(thread))
-- print(coroutine.resume(thread))
-- print(coroutine.resume(thread))
-- Animated:GetFrame(0.0, "MenuCursor")
