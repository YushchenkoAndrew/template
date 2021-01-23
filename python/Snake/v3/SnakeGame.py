from Snake import *
from Apple import *

import pygame

class SnakeGame:
  canvas = (0, 0, 500, 500)
  window = (1000, 500)
  grid = None
  step = 10

  SPEED = 10
  run = True

  def __init__(self, canvas, window, step = 20, showGrid = True):
    # Initialize pygame
    pygame.init()

    self.screen = pygame.display.set_mode(window)
    self.clock = pygame.time.Clock()

    self.canvas = canvas
    self.window = window
    self.showGrid = showGrid
    self.step = step
    self.grid = [i // step for i in canvas[2:]]

    print("Initialize grid:", self.grid)

    self.snake = Snake([i // 2 for i in self.grid], step)
    self.apple = Apple(self.grid, step)


  def listenToEvents(self, events):
    direction = { pygame.K_UP: "up", pygame.K_DOWN: "down", pygame.K_LEFT: "left", pygame.K_RIGHT: "right" }
    step = None

    for event in events:
      if (event.type == pygame.QUIT):
        self.run = False

      if not (step):
        step = direction.get(event.key if event.type == pygame.KEYDOWN else None, None)

    self.snake.move(step, self.apple.getPos(), self.apple.setPos)



  def drawGrid(self):
    color = (150,) * 3
    [x, y, w, h] = self.canvas


    for i in range(self.grid[1]):
      dy = self.step * i

      for j in range(1, self.grid[0]):
        dx = self.step * j

        pygame.draw.line(self.screen, color, (x + dx, y), (x + dx, y + h - 1))
        pygame.draw.line(self.screen, color, (x, y + dy), (x + w - 1, y + dy))

    pygame.draw.rect(self.screen, (255,) * 3, (x, y, w, h), 1)

  def draw(self):
    while self.run:
      self.screen.fill((0,) * 3)
      self.clock.tick(self.SPEED)
      self.listenToEvents(pygame.event.get())

      # Draw
      self.drawGrid()
      self.snake.draw(self.screen, self.canvas[:2])
      self.apple.draw(self.screen, self.canvas[:2])

      # Flip the display
      pygame.display.flip()
    pygame.quit()
