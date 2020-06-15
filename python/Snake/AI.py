from __future__ import print_function
import neat
import SnakeGame


def eval_genomes(genomes, config):
    for genome_id, genome in genomes:
        genome.fitness = 4.0
        net = neat.nn.FeedForwardNetwork.create(genome, config)
        for xi, xo in zip(xor_inputs, xor_outputs):
            output = net.activate(xi)
            genome.fitness -= (output[0] - xo[0]) ** 2


def run(config_file, game):
    # Load configuration.
    config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)

    # Create the population, which is the top-level object for a NEAT run.
    # p = neat.Population(config)

    p = neat.Checkpointer.restore_checkpoint('neat-checkpoint-950')
    # p = neat.Checkpointer.restore_checkpoint('neat-checkpoint-11868')

    # Add a stdout reporter to show progress in the terminal.
    # p.add_reporter(neat.StdOutReporter(False))
    # stats = neat.StatisticsReporter()
    # p.add_reporter(stats)
    p.add_reporter(neat.Checkpointer(500))

    game.set_population(p)

    # Run for up to 300 generations.
    winner = p.run(game.eval_genomes, 5000)

    # winner.save("Test.txt")
    # winner.write_config(config, "Test.txt")

    # Display the winning genome.
    print('\nBest genome:\n{!s}'.format(winner))

    # # Show output of the most fit genome against training data.
    # p = neat.Checkpointer.restore_checkpoint('neat-checkpoint')
    # p.run(game.eval_genomes, 10)


game = SnakeGame.SnakeGame()
# game.screen_update()


if __name__ == '__main__':
    # Determine path to configuration file. This path manipulation is
    # here so that the script will run successfully regardless of the
    # current working directory.
    config_path = "./config-feedforward.txt"
    run(config_path, game)
