from SnakeGame import *

import pygame
import neat
import os

def run(checkPoint, config_file):
  # Load configuration.
  config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)

  # Load configuration.
  p = neat.Checkpointer.restore_checkpoint(checkPoint)

  # Add a stdout reporter to show progress in the terminal.
  p.add_reporter(neat.StdOutReporter(True))

  # Run generations.
  winner = p.run(eval_genomes, 1)
  return neat.nn.FeedForwardNetwork.create(winner, config)


def runCheckpoints(dirname, config_file):
  files = [f for f in os.listdir(dirname)]
  return [(f, run(f'{dirname}/{f}', config_file)) for f in files ]


def activateFunc(output):
  # North
  if output[0] > 0.5:
    return 'up'

  # South
  elif output[1] > 0.5:
    return 'down'

  # West
  elif output[2] > 0.5:
    return 'left'

  # East
  elif output[3] > 0.5:
    return 'right'



def eval_genomes(_genomes, config):
  net = []
  genomes = []
  games = []

  for j, (i, genome) in enumerate(_genomes):
    genome.fitness = 0
    n = neat.nn.FeedForwardNetwork.create(genome, config)
    net.append(n)
    genomes.append(genome)

    game = SnakeGame(j, (0, 0, 25, 25), None, 1, False, False)
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
      if curr <= prev:
        genomes[i].fitness += 0.5

      if apple == game.snake.pos[0]:
        genomes[i].fitness += 100

      # Check if Snake is going at the one place
      if game.snake.pos[0] in game.snake.path[:-1]:
        genomes[i].fitness -= 5

      if len(game.snake.path) > 625:
        game.run = False
