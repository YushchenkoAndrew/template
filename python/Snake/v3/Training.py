from SnakeGame import *

import pygame
import neat
import os

WINDOW = (1400, 700)
SIZE = (125, 125)
STEP = 5
POS = []

(N, M) = (50, 5)

screen = None

def moveByPlayer(events):
  DIRECTION = { pygame.K_UP: 'up', pygame.K_DOWN: 'down', pygame.K_LEFT: 'left', pygame.K_RIGHT: 'right' }
  direction = None

  for event in events:
    if not direction:
      direction = DIRECTION.get(event.key if event.type == pygame.KEYDOWN else None, None)

  return direction

def main(config_file):
  definePos()

  # Load configuration.
  config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)
  # Create the population, which is the top-level object for a NEAT run.
  p = neat.Population(config)

  # Add a stdout reporter to show progress in the terminal.
  p.add_reporter(neat.StdOutReporter(True))
  stats = neat.StatisticsReporter()
  p.add_reporter(stats)
  p.add_reporter(neat.Checkpointer(20))

  # Run generations.
  winner = p.run(eval_genomes, 1000)


def definePos():
  [W, H] = SIZE
  for i in range(N):
    x = i * (W + 10)

    for j in range(M):
      y = j * (H + 10)

      POS.append([x, y])


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

    game = SnakeGame(j, (*POS[j % len(_genomes)], *SIZE), screen, STEP, False, False)
    game.snake.path = []
    games.append(game)

  run = True

  while run:
    run = False
    events = pygame.event.get()

    for i, game in enumerate(games):
      if not game.run:
        if not game.GameOver:
          genomes[i].fitness -= 1000
          game.clean()
          game.GameOver = True
        continue

      run = run or game.run

      apple = game.apple.pos
      curr = [a - b for a, b in zip(game.snake.pos[0], apple)]

      direction = activateFunc(net[i].activate([*curr, *game.snake.getDistanceToObstacle()]))
      game.draw(events, lambda x: direction)

      # Get distance to Apple
      curr = sum([i * i for i in curr])
      prev = sum([(b - a) * (b - a) for a, b in zip(game.snake.pos[1], game.apple.pos)])

      # Check if snake go closer, then award if
      if curr <= prev:
        genomes[i].fitness += 0.5
      else:
        genomes[i].fitness -= 0.2

      if apple == game.snake.pos[0]:
        genomes[i].fitness += 100

      # Check if Snake is going at the one place
      if game.snake.pos[0] in game.snake.path[:-1]:
        genomes[i].fitness -= 5

      if len(game.snake.path) > 625:
        game.run = False



if __name__ == '__main__':
  # Initialize pygame
  pygame.init()
  screen = pygame.display.set_mode(WINDOW)
  local_dir = os.path.dirname(__file__)
  config_path = os.path.join(local_dir, 'config-feedforward.txt')
  print(config_path)

  main(config_path)

  pygame.quit()
