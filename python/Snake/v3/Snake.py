import pygame

class Snake:
  pos = []
  step = 20
  prev = (1, 0)
  alive = True

  path = []
  apples = 0

  DIRACTION = { 'up': (0, -1), 'down': (0, 1), 'left': (-1, 0), 'right': (1, 0) }

  def __init__(self, index, pos, step, grid, n, log):
    self.grid = grid
    self.step = step
    self.index = index
    self.log = log
    self.pos = [[x, y + i] for i, (x, y) in enumerate([pos] * n)]

    self.printMessage('Initialize pos:', self.pos)


  def printMessage(self, *message):
    if self.log:
      print(f'\033[1;32;40mSnake[{self.index}]:\033[0m', *message)


  def getDistanceToObstacle(self):
    [x, y] = self.pos[0]
    [w, h] = self.grid

    [W, N, E, S] = (x, y, w - x - 1, h - y - 1)

    for (_x, _y) in self.pos[1:]:
      if _x == x:
        dist = abs(y - _y) - 1

        if y >= _y:
          N = dist if dist < N else N
        else:
          S = dist if dist < S else S

      elif _y == y:
        dist = abs(x - _x) - 1

        if x >= _x:
          W = dist if dist < W else W
        else:
          E = dist if dist < E else E

    return [N, S, W, E]


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
      self.path = []
      self.printMessage('Dead, apples', self.apples)
      return

    self.pos[0] =  [x + dx, y + dy]
    self.prev = (dx, dy)

    # Save path of Snake
    self.path.append([x + dx, y + dy])

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
