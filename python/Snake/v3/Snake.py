import pygame

class Snake:
  pos = []
  step = 20
  prev = (1, 0)
  alive = True

  path = []
  apples = 0

  DIRACTION = { 'up': (0, -1), 'down': (0, 1), 'left': (-1, 0), 'right': (1, 0) }

  def __init__(self, pos, step, grid, n = 3):
    self.grid = grid
    self.step = step
    self.pos = [[x, y + i] for (x, y), i in zip([pos] * n, range(n))]

    self.printMessage('Initialize pos:', self.pos)


  def printMessage(self, *message):
    print('\033[1;32;40mSnake:\033[0m', *message)


  def isInside(self, pos):
    [x, y] = pos
    [w, h] = self.grid
    return x >= 0 and y >= 0 and x < w and y < h


  def move(self, key, apple, callback):
    for i in range(len(self.pos) - 1, 0, -1):
      self.pos[i] = self.pos[i - 1]

    [x, y] = self.pos[0]
    [dx, dy] = self.DIRACTION[key] if key else self.prev

    # Check if Snake face neck at the next step
    if [x + dx, y + dy] == self.pos[2]:
      [dx, dy] = self.prev

    # Check if Snake bite self tail
    if ([x + dx, y + dy] in self.pos) or not self.isInside([x + dx, y + dy]):
      self.alive = False
      self.printMessage('Dead, apples', self.apples)
      return

    self.pos[0] =  [x + dx, y + dy]
    self.prev = (dx, dy)

    # Save path of Snake
    self.path.append(self.pos[0])

    if (self.pos[0] == apple):
      # Grow Snake
      self.pos.append(self.pos[-1])

      # Add to apple counter
      # Erase path
      self.apples += 1
      self.path = []

      callback(self.pos)


  def draw(self, screen, offset):
    [dx, dy] = offset
    for (x, y) in self.pos:
      x = x * self.step + dx
      y = y * self.step + dy

      pygame.draw.rect(screen, (255,) * 3, (x, y, self.step, self.step))
