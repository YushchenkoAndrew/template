from SnakeGame import *
from AI import *

import pygame

WINDOW = (700, 700)
SIZE = (500, 500)
STEP = 20

DIR = './neat-checkpoint'
CONFIG = './config-feedforward.txt'

def moveByPlayer(events):
  DIRECTION = { pygame.K_UP: "up", pygame.K_DOWN: "down", pygame.K_LEFT: "left", pygame.K_RIGHT: "right" }
  direction = None

  for event in events:
    if not direction:
      direction = DIRECTION.get(event.key if event.type == pygame.KEYDOWN else None, None)

  return direction

def main():
  nets = runCheckpoints(DIR, CONFIG)
  screen = pygame.display.set_mode(WINDOW)

  for (f, net) in nets:
    game = SnakeGame(0, (10, 10, *SIZE), screen, STEP)

    print("LOAD ", f)
    draw(game, net)


def draw(game, net):
  while game.run:
    events = pygame.event.get()
    # Moving Snake by Player
    # game.draw(events, moveByPlayer)

    # Moving Snake by AI
    curr = [(a - b) for a, b in zip(game.snake.pos[0], game.apple.pos)]
    direction = activateFunc(net.activate([*curr, *game.snake.getDistanceToObstacle()]))
    game.draw(events, lambda x: direction)




if __name__ == "__main__":
  # Initialize pygame
  pygame.init()
  main()
  pygame.quit()