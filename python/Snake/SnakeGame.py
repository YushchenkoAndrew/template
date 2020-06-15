import time
import random
import Player
import ShowData
import Snake
import pygame
import neat
from neat.six_util import iteritems, itervalues


class SnakeGame:

    START_POINT = (420, 20)
    WIDTH = 1050
    HEIGHT = 640
    SPEED = 30

    STARVE_STEP = 100

    nets = []
    gen = []
    total = 0

    def __init__(self):
        pygame.init()

        self.screen = pygame.display.set_mode((self.WIDTH, self.HEIGHT))
        self.screen.fill((0, 0, 0))

        self.snakes = []
        self.players = []

        self.best_index = None
        self.show_all = False

        self.butt_show_all = pygame.Rect(50, 450, 100, 60)
        pygame.draw.rect(self.screen, [0, 0, 155], self.butt_show_all)

        self.showData = ShowData.ShowData(self.screen)
        self.showData.show_score(0)
        self.showData.show_max_score(0)
        self.showData.show_SPEED(self.SPEED)

        # Set FPS ???
        self.clock = pygame.time.Clock()

        self.create_basic_squares()
        self.create_grid(*self.START_POINT)

    def start_game(self):
        snake = Snake.Snake(self.screen, self.START_POINT)
        player = Player.Player(0, snake)
        snake.set_func(player.die, player.increse_score)

        self.snakes.append(snake)
        self.players.append(player)

    def eval_genomes(self, genomes, config):

        for i, g in genomes:
            # net = neat.nn.RecurrentNetwork.create(g, config)
            net = neat.nn.FeedForwardNetwork.create(g, config)
            self.nets.append(net)
            g.fitness = 0
            self.gen.append(g)

            snake = Snake.Snake(self.screen, self.START_POINT)
            player = Player.Player(i, snake)
            snake.set_func(player.die, player.increse_score)

            self.snakes.append(snake)
            self.players.append(player)

        # print(len(self.nets), " ", len(self.players))

        self.screen_update()

    def set_population(self, p):
        self.population = p
        self.showData.set_population(p)

    def create_basic_squares(self):
        pygame.draw.rect(self.screen, (255, 255, 255),
                         (*self.START_POINT, 600, 600), 1)
        pygame.draw.rect(self.screen, (255, 255, 255), (20, 20, 380, 600), 1)

    def create_grid(self, x, y):
        color = (180, 180, 180)

        for dx in range(1, 30):
            pygame.draw.line(self.screen, color,
                             (x + dx * 20, y), (x + dx * 20, y + 600))
            pygame.draw.line(self.screen, color,
                             (x, y + dx * 20), (x + 600, y + dx * 20))

    def screen_update(self):
        last_score = 0
        while True:
            self.clock.tick(self.SPEED)

            for event in pygame.event.get():
                if event.type == pygame.MOUSEBUTTONDOWN:
                    if self.butt_show_all.collidepoint(event.pos):
                        self.show_all = ~self.show_all

                if event.type == pygame.KEYDOWN:
                    for player in self.players:
                        player.check_key_press(event.key)
                        player.snake.STARVE_STEP = self.STARVE_STEP

                    if event.key == pygame.K_q:
                        pygame.quit()
                        return
                    if event.key == pygame.K_w:
                        if (self.SPEED < 500):
                            self.SPEED += 10
                        self.showData.show_SPEED(self.SPEED)
                        # print(f'\nSPEED: {self.SPEED}\n')
                    if event.key == pygame.K_s:
                        if (self.SPEED > 0):
                            self.SPEED -= 10
                        self.showData.show_SPEED(self.SPEED)
                        # print(f'\nSPEED: {self.SPEED}\n')

            for i, player in enumerate(self.players):
                if not player.died:
                    output = self.nets[i].activate(player.get_input_data())
                    player.neural_move(output)

                    temp = list(map(lambda g: g.fitness, self.gen))

                    if self.best_index is not None and i == self.best_index:
                        self.showData.show_net_out(
                            output, ["U", "D", "L", "R"])

                    # print(player.get_input_data())

                    if player.get_apple:
                        player.get_apple = False
                        self.gen[i].fitness += 25

                    if (player.snake.STARVE_STEP - player.snake.step_without_food) % 10:
                        self.gen[i].fitness += player.score * 0.2

                    player.snake.move(self.show_all or i == self.best_index)

                else:
                    # if self.players[i].hit_body:
                    #     self.gen[i].fitness -= 1000
                    if self.players[i].snake.step_without_food == 0:
                        self.gen[i].fitness -= 20000

                    last_score = max(self.players.pop(i).score, last_score)
                    # self.gen[i].fitness -= 5 * last_score
                    self.gen[i].fitness -= 3000

                    if i == self.best_index:
                        self.best_index = temp.index(max(temp))

                    self.snakes.pop(i)
                    self.nets.pop(i)
                    self.gen.pop(i)
                    pass

                if i % 30 == 0:
                    self.best_index = temp.index(max(temp))

            if len(self.snakes) == 0:
                self.total = max(self.total, last_score)

                self.showData.show_end_generation()

                best = None
                for g in itervalues(self.population.population):
                    if best is None or g.fitness > best.fitness:
                        best = g

                net = best.size()

                # print(
                #     f'Species -- {self.population.species.get_species_id(best.key)} Nodes -- {net[0]}, num of conn -- {net[1]}\n')

                self.showData.show_score(last_score)
                self.showData.show_max_score(self.total)

                # print(f'Score -- {last_score}')
                # print(f'Total -- {self.total}\n')
                return

            # Flip the display
            pygame.display.flip()


# snake = SnakeGame()
# snake.start_game()
# snake.screen_update()
