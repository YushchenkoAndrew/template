import time
import random
import Player
import ShowData
import Snake
import pygame
import neat


class SnakeGame:

    START_POINT = (420, 20)
    WIDTH = 1050
    HEIGHT = 640
    SPEED = 30

    STARVE_STEP = 1000

    nets = []
    gen = []
    total = 0

    def __init__(self):
        pygame.init()

        self.screen = pygame.display.set_mode((self.WIDTH, self.HEIGHT))
        self.screen.fill((0, 0, 0))

        self.snakes = []
        self.players = []

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
                if event.type == pygame.KEYDOWN:
                    for player in self.players:
                        player.check_key_press(event.key)
                        player.snake.STARVE_STEP = self.STARVE_STEP

                    if event.key == pygame.K_d:
                        self.STARVE_STEP += 2000
                        print(
                            f'\nSTARVE_STEP: {self.STARVE_STEP}\n')
                    if event.key == pygame.K_a:
                        self.STARVE_STEP -= 2000
                        print(
                            f'\nSTARVE_STEP: {self.STARVE_STEP}\n')

                    if event.key == pygame.K_q:
                        pygame.quit()
                        return
                    if event.key == pygame.K_w:
                        self.SPEED += 10
                        print(f'\nSPEED: {self.SPEED}\n')
                    if event.key == pygame.K_s:
                        self.SPEED -= 10
                        print(f'\nSPEED: {self.SPEED}\n')

            for i, player in enumerate(self.players):
                if not player.died:
                    player.neural_move(
                        self.nets[i].activate(player.get_input_data()))

                    # print(player.get_input_data())

                    if player.get_apple:
                        player.get_apple = False
                        if player.score < 25:
                            self.gen[i].fitness += player.score
                        else:
                            self.gen[i].fitness += 25

                    if player.snake_distance():
                        self.gen[i].fitness += 0.8
                        # print("+1")
                    else:
                        self.gen[i].fitness -= 0.2
                        # print("-1")

                    if (player.snake.STARVE_STEP - player.snake.step_without_food) % 20:
                        self.gen[i].fitness += 0.2

                    player.snake.move()

                else:
                    if self.players[i].hit_body:
                        self.gen[i].fitness -= 100

                    last_score = max(self.players.pop(i).score, last_score)
                    # self.gen[i].fitness -= 5 * last_score
                    self.gen[i].fitness -= 100

                    self.snakes.pop(i)
                    self.nets.pop(i)
                    self.gen.pop(i)
                    pass

            if len(self.snakes) == 0:
                self.total = max(self.total, last_score)
                print(f'Score -- {last_score}')
                print(f'Total -- {self.total}\n')
                return

            # Flip the display
            pygame.display.flip()


# snake = SnakeGame()
# snake.start_game()
# snake.screen_update()
