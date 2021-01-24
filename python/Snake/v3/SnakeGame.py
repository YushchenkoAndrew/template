from Snake import *
from Apple import *

import pygame

class SnakeGame:
  canvas = (0, 0, 500, 500)
  grid = None
  step = 10

  SPEED = 10
  run = True

  def __init__(self, canvas, screen, step = 20, showGrid = True):
    self.clock = pygame.time.Clock()

    self.canvas = canvas
    self.screen = screen
    self.showGrid = showGrid
    self.step = step
    self.grid = [i // step for i in canvas[2:]]

    self.printMessage('Initialize grid:', self.grid)

    self.snake = Snake([i // 2 for i in self.grid], step, self.grid)
    self.apple = Apple(self.grid, step)


  def printMessage(self, *message):
    print('\033[1;33;40mGame:\033[0m', *message)


  def listenToEvents(self, events):
    step = None

    for event in events:
      if (event.type == pygame.QUIT):
        self.run = False


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


  def draw(self, getDirection):
    while self.run:
      # Fill canvas with black
      pygame.draw.rect(self.screen, (0,) * 3, self.canvas)
      self.clock.tick(self.SPEED)

      # Event Handler
      events = pygame.event.get()
      self.listenToEvents(events)
      self.moveSnake(getDirection(events))

      # Draw
      self.drawGrid()
      self.snake.draw(self.screen, self.canvas[:2])
      self.apple.draw(self.screen, self.canvas[:2])

      # Check if it a game over
      if not self.snake.alive:
        break

      # Flip the display
      pygame.display.flip()

    self.printMessage('Game over')
