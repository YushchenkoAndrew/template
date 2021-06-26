require("src/lua/Json")

-- Init Object
Animated = {
  sprites = {},

  frame = 0,
  frameTime = 0.0,

  currState = "click",
}

function Animated:Init(path)
  Animated.sprites = JSON:Parse(path)
  JSON:Stringify(Animated.sprites, 0)
end

function Animated:NextFrame(fElapsedTime, sName)
  -- Animated.frameTime = Animated.frameTime + fElapsedTime

  -- FIXME: Change code bellow
  -- if Animated.frameTime < Animated.sprites[name] then return 0 end
  -- Animated.frameTime = Animated.frameTime - Animated.sprites[name]

  local class = nil

  while true do
    for key, value in pairs(Animated.sprites[sName]["states"][Animated.currState]) do
      print(value["duration"] .. " " .. fElapsedTime)
      class, fElapsedTime, sName = coroutine.yield(2)
    end
  end
end

function Animated:GetFrame(fElapsedTime, sName)
  if (Animated.sprites[sName].FrameThread == nil or coroutine.status(Animated.sprites[sName].FrameThread) == "dead") then
    Animated.sprites[sName].FrameThread = coroutine.create(Animated.NextFrame)
  end

  return coroutine.resume(Animated.sprites[sName].FrameThread, Animated, fElapsedTime, sName)
end

function Animated:SetState(state)
  Animated.currState = state
  Animated.frame = 0
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
