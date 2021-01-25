from Snake import *
from Apple import *

import pygame

class SnakeGame:
  canvas = (0, 0, 500, 500)
  grid = None
  step = 10

  SPEED = 20
  run = True

  def __init__(self, index, canvas, screen, step = 20, showGrid = True, log = True):
    self.clock = pygame.time.Clock()

    self.canvas = canvas
    self.screen = screen
    self.showGrid = showGrid
    self.step = step
    self.index = index
    self.log = log
    self.grid = [i // step for i in canvas[2:]]

    self.printMessage('Initialize grid:', self.grid)

    self.snake = Snake(index, [i // 2 for i in self.grid], step, self.grid, 3, log)
    self.apple = Apple(index, self.grid, step, log)


  def printMessage(self, *message):
    if self.log:
      print(f'\033[1;33;40mGame[{self.index}]:\033[0m', *message)


  def listenToEvents(self, events):
    step = None

    for event in events:
      if (event.type == pygame.QUIT):
        self.run = False
      elif event.type == pygame.KEYDOWN:

        if event.key == pygame.K_w:
          self.SPEED += 10
          self.printMessage('Speed:', self.SPEED)

        elif event.key == pygame.K_s:
          self.SPEED -= 10 if self.SPEED - 10 > 0 else 0
          self.printMessage('Speed:', self.SPEED)


  def moveSnake(self, direction):
    self.snake.move(direction, self.apple.pos, self.apple.setPos)


  def drawGrid(self):
    color = (150,) * 3
    [x, y, w, h] = self.canvas

    if self.showGrid:
      for i in range(self.grid[1]):
        dy = self.step * i

        for j in range(1, self.grid[0]):
          dx = self.step * j

          pygame.draw.line(self.screen, color, (x + dx, y), (x + dx, y + h - 1))
          pygame.draw.line(self.screen, color, (x, y + dy), (x + w - 1, y + dy))

    pygame.draw.rect(self.screen, (255,) * 3, (x, y, w, h), 1)


  def clean(self):
    # Fill canvas with black
    if self.screen:
      pygame.draw.rect(self.screen, (0,) * 3, self.canvas)

  def draw(self, events, getDirection):
    if not self.run:
      if self.screen:
        pygame.draw.rect(self.screen, (0,) * 3, self.canvas)
      return

    self.clean()
    self.clock.tick(self.SPEED)

    # Event Handler
    # events = pygame.event.get()
    self.listenToEvents(events)
    self.moveSnake(getDirection(events))

    # Draw
    if self.screen:
      self.drawGrid()
      self.snake.draw(self.screen, self.canvas[:2])
      self.apple.draw(self.screen, self.canvas[:2])

    # Check if it a game over
    if not self.snake.alive:
      self.run = False

    # Flip the display
    if self.screen:
      pygame.display.flip()
