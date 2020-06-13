import pygame
import random
import Player


class Snake:

    RED = (255, 0, 0)
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)
    GRAY = (180, 180, 180)

    prevComm = (-20, 0)

    STARVE_STEP = 3000

    command = (-20, 0)

    def __init__(self, screen, point):

        self.screen = screen
        self.START_POINT = point

        pygame.draw.rect(self.screen, (255, 255, 255),
                         (*self.START_POINT, 600, 600), 1)

        self.snake_list = [(160, 160), (180, 160), (200, 160),
                           (220, 160)]

        self.step_without_food = self.STARVE_STEP

        self.draw_apple()
        self.draw_snake()

    def game_restart(self):
        self.snake_list.pop(0)
        for snake in self.snake_list:
            self.delete_shape(snake)

        pygame.draw.rect(self.screen, (255, 255, 255),
                         (*self.START_POINT, 600, 600), 1)

        self.snake_list = [(160, 160), (180, 160), (200, 160),
                           (220, 160), (240, 160), (260, 160)]
        self.command = (-20, 0)

        self.delete_shape(self.apple_position, False)
        self.draw_apple()

    def game_end(self):
        self.snake_list.pop(0)
        for snake in self.snake_list:
            self.delete_shape(snake)

        self.snake_list = []

        pygame.draw.rect(self.screen, (255, 255, 255),
                         (*self.START_POINT, 600, 600), 1)

        self.delete_shape(self.apple_position, False)

    def rand_apple(self):
        coord = (random.randrange(30) * 20, random.randrange(30) * 20)

        if coord in self.snake_list:
            coord = self.rand_apple()
            return self.apple_position

        self.apple_position = [i + j for i, j in zip(coord, self.START_POINT)]

        return self.apple_position

    def rebuild_grid(self, coord):
        pygame.draw.line(self.screen, self.GRAY, coord,
                         (coord[0] + 20, coord[1]))
        pygame.draw.line(self.screen, self.GRAY, coord,
                         (coord[0], coord[1] + 20))

    def draw_apple(self):
        pygame.draw.rect(self.screen, self.RED, (*self.rand_apple(), 20, 20))

    def delete_shape(self, coord, change=True):
        if change:
            temp = [i + j for i,
                    j in zip(coord, self.START_POINT)]
        else:
            temp = coord

        pygame.draw.rect(self.screen, self.BLACK, (*temp, 20, 20))
        self.rebuild_grid(temp)

    def draw_snake(self):

        temp = [i + j for i, j in zip(self.snake_list[0], self.START_POINT)]

        pygame.draw.rect(self.screen, self.WHITE, (*temp, 20, 20))
        self.rebuild_grid(temp)

        # Delete tail
        if not self.eat_apple():
            self.delete_shape(self.snake_list.pop(-1))

            if [i for i in self.snake_list[-1] if i <= 20 or i >= 560]:
                pygame.draw.rect(self.screen, (255, 255, 255),
                                 (*self.START_POINT, 600, 600), 1)

    def update(self, dx=0, dy=0, end_update=False):
        temp = (dx + self.snake_list[0][0], dy + self.snake_list[0][1])

        if (temp != self.snake_list[1] or end_update):
            self.snake_list.insert(0, temp)
            self.walls()
            self.prevComm = self.command
        else:
            self.command = self.prevComm
            self.update(*self.command, True)

    def eat_apple(self):

        if len([i for i, j, k in zip(self.snake_list[0], self.apple_position, self.START_POINT) if abs(i - j + k) < 1]) == 2:
            self.draw_apple()
            if len(self.snake_list) < 10:
                self.step_without_food = self.STARVE_STEP
            else:
                self.step_without_food = self.STARVE_STEP * \
                    len(self.snake_list) * 0.1
            self.increse_score()
            # self.player.score += 1
            # self.data.show_score()
            return True
        return False

    def walls(self):
        if ([i for i in self.snake_list[0] if i < 0 or i > 580] or self.snake_list[0] in self.snake_list[1:-1] or self.step_without_food <= 0):
            # self.data.show_death()
            self.die()
            # print("Stop!!")

    def set_func(self, die, apple):
        self.die = die
        self.increse_score = apple

    def move(self):
        self.step_without_food -= 1
        self.update(*self.command)
        if len(self.snake_list):
            self.draw_snake()
