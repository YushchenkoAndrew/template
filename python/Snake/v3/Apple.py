import pygame
import random

class Apple:
  pos = (0, 0)
  step = 20
  grid = []


  def __init__(self, index, grid, step, log):
    self.grid = grid
    self.step = step
    self.index = index
    self.log = log
    self.setPos()

    self.printMessage('Initialize pos:', self.pos)


  def printMessage(self, *message):
    if self.log:
      print(f'\033[1;31;40mApple[{self.index}]:\033[0m', *message)


  def setPos(self, notAllowed = []):
    while True:
      self.pos = [random.randrange(i) for i in self.grid]

      if not(self.pos in notAllowed):
        break

    self.printMessage('Set new pos:', self.pos)


  def draw(self, screen, offset):
    [dx, dy] = offset
    [x, y] = [i * self.step + 1 for i in self.pos]
    pygame.draw.rect(screen, (255, 0, 0), (x + dx, y + dy, self.step - 1, self.step - 1))
