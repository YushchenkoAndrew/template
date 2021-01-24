from SnakeGame import *

import pygame


def moveByPlayer(events):
  DIRECTION = { pygame.K_UP: "up", pygame.K_DOWN: "down", pygame.K_LEFT: "left", pygame.K_RIGHT: "right" }
  direction = None

  for event in events:
    if not direction:
      direction = DIRECTION.get(event.key if event.type == pygame.KEYDOWN else None, None)

  return direction

def main():
  screen = pygame.display.set_mode((700, 700))
  game = SnakeGame((10, 50, 500, 500), screen, 20)
  game.draw(moveByPlayer)


if __name__ == "__main__":
  # Initialize pygame
  pygame.init()
  main()
  pygame.quit()