import pygame

class Snake:
  pos = []
  step = 20
  prev = (1, 0)

  DIRACTION = { 'up': (0, -1), 'down': (0, 1), 'left': (-1, 0), 'right': (1, 0) }

  def __init__(self, pos, step):
    self.pos.append(pos)

    print("Initialize Snake pos:", self.pos)


  def move(self, key, apple, callback):
    for i in range(len(self.pos) - 1, 0, -1):
      self.pos[i] = self.pos[i - 1]

    [x, y] = self.pos[0]
    [dx, dy] = self.DIRACTION[key] if key else self.prev

    self.pos[0] =  [x + dx, y + dy]
    self.prev = (dx, dy)

    if (self.pos[0] == apple):
      self.pos.append(self.pos[-1])
      print(self.pos)
      callback()

  def draw(self, screen, offset):
    [dx, dy] = offset
    for (x, y) in self.pos:
      x = x * self.step + dx
      y = y * self.step + dy

      pygame.draw.rect(screen, (255,) * 3, (x, y, self.step, self.step))
