from SnakeGame import *

import pygame

WINDOW = (700, 700)
SIZE = (500, 500)
STEP = 20

game = None

def moveByPlayer(events):
  DIRECTION = { pygame.K_UP: "up", pygame.K_DOWN: "down", pygame.K_LEFT: "left", pygame.K_RIGHT: "right" }
  direction = None

  for event in events:
    if not direction:
      direction = DIRECTION.get(event.key if event.type == pygame.KEYDOWN else None, None)

  return direction

def main():
  screen = pygame.display.set_mode(WINDOW)
  global game
  game = SnakeGame(0, (10, 10, *SIZE), screen, STEP)
  draw()


def draw():
  while game.run:
    events = pygame.event.get()
    game.draw(events, moveByPlayer)




if __name__ == "__main__":
  # Initialize pygame
  pygame.init()
  main()
  pygame.quit()