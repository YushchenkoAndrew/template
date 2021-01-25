from SnakeGame import *
from AI import activateFunc

import pygame
import neat
import os

WINDOW = (1400, 700)
SIZE = (125, 125)
STEP = 5
POS = []

(N, M) = (50, 5)

screen = None

def main(config_file):
  global screen
  screen = pygame.display.set_mode(WINDOW)
  definePos()

  # Load configuration.
  config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)
  # Create the population, which is the top-level object for a NEAT run.
  # p = neat.Population(config)
  p = neat.Checkpointer.restore_checkpoint('neat-checkpoint-1099')

  # Add a stdout reporter to show progress in the terminal.
  p.add_reporter(neat.StdOutReporter(True))
  stats = neat.StatisticsReporter()
  p.add_reporter(stats)
  p.add_reporter(neat.Checkpointer(20))

  # Run generations.
  winner = p.run(eval_genomes, 5000)


def definePos():
  [W, H] = SIZE
  for i in range(N):
    x = i * (W + 10)

    for j in range(M):
      y = j * (H + 10)

      POS.append([x, y])


def eval_genomes(_genomes, config):
  net = []
  genomes = []
  games = []

  for j, (i, genome) in enumerate(_genomes):
    genome.fitness = -1000
    n = neat.nn.FeedForwardNetwork.create(genome, config)
    net.append(n)
    genomes.append(genome)

    game = SnakeGame(j, (*POS[j % len(_genomes)], *SIZE), screen, STEP, False, False)
    game.SPEED = 500
    game.snake.path = []
    games.append(game)

  run = True

  while run:
    run = False
    events = pygame.event.get()

    for i, game in enumerate(games):
      if not game.run:
        game.clean()
        continue

      run = run or game.run

      apple = game.apple.pos
      prev = [(a - b) for a, b in zip(game.snake.pos[0], apple)]

      direction = activateFunc(net[i].activate([*prev, *game.snake.getDistanceToObstacle()]))
      game.draw(events, lambda x: direction)

      # Get distance to Apple
      prev = sum([i * i for i in prev])
      curr = sum([(b - a) * (b - a) for a, b in zip(game.snake.pos[0], apple)])

      # Check if snake go closer, then award if
      # if curr <= prev:
        # genomes[i].fitness += 0.5
      # else:
        # genomes[i].fitness -= 0.5

      if apple == game.snake.pos[0]:
        genomes[i].fitness += 10

      # Check if Snake is going at the one place
      if game.snake.pos[0] in game.snake.path[:-1]:
        genomes[i].fitness -= 5

      if len(game.snake.path) > 625:
        game.run = False



if __name__ == '__main__':
  # Initialize pygame
  pygame.init()
  main('config-feedforward.txt')
  pygame.quit()
