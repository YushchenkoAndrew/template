require("src/lua/Json")

-- Init Object
Animated = {
  sprites = {},

  frame = 0,
  frameTime = 0.0,

  currState = "click"
}

function Animated:Init(path)
  Animated.sprites = JSON:Parse(path)
  JSON:Stringify(Animated.sprites, 0)
end

function Animated:GetFrame(fElapsedTime, name)
  -- Animated.frameTime = Animated.frameTime + fElapsedTime

  -- FIXME: Change code bellow
  -- if Animated.frameTime < Animated.sprites[name] then return 0 end
  -- Animated.frameTime = Animated.frameTime - Animated.sprites[name]

  while true do
    for key, value in pairs(Animated.sprites[name]["states"][Animated.currState]) do
      -- print(value["duration"])
      coroutine.yield(value["duration"])
    end
  end
end

function Animated:SetState(state)
  Animated.currState = state
  Animated.frame = 0
end

Animated:Init("assets/AnimatedSprite.json")

local thread = coroutine.create(Animated.GetFrame)
print(coroutine.resume(thread, "Animated", 0.0, "MenuCursor"))
print(coroutine.resume(thread))
print(coroutine.resume(thread))
print(coroutine.resume(thread))
print(coroutine.resume(thread))
-- Animated:GetFrame(0.0, "MenuCursor")
