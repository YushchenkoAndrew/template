import time
import random
import Player
import ShowData
import Snake
import pygame


class SnakeGame:

    START_POINT = (420, 20)
    WIDTH = 1050
    HEIGHT = 640
    SPEED = 0

    POPULATION = 1

    def __init__(self):
        pygame.init()

        self.screen = pygame.display.set_mode((self.WIDTH, self.HEIGHT))
        self.screen.fill((0, 0, 0))

        self.snakes = []
        self.players = []

        for _ in range(self.POPULATION):
            snake = Snake.Snake(self.screen, self.START_POINT)
            player = Player.Player(0, snake)
            snake.set_die_func(player.die)

            self.snakes.append(snake)
            self.players.append(player)

        # Set FPS ???
        self.clock = pygame.time.Clock()

        self.create_basic_squares()
        self.create_grid(*self.START_POINT)

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
        while True:
            self.clock.tick(10)

            # self.player.check_key_press()

            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    for player in self.players:
                        player.check_key_press(event.key)

                    if event.key == pygame.K_q:
                        pygame.quit()
                        return

            for snake in self.snakes:
                snake.move()

            # Flip the display
            pygame.display.flip()


snake = SnakeGame()
snake.screen_update()
