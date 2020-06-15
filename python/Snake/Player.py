import pygame
import time
import math


class Player:

    def __init__(self, i, snake):
        # print("Player create!")
        self.index = i
        self.score = 0
        self.snake = snake

        self.died = False
        self.get_apple = False

    def check_key_press(self, key):
        if key == pygame.K_DOWN:
            self.snake.command = (0, 20)
        if key == pygame.K_UP:
            self.snake.command = (0, -20)
        if key == pygame.K_LEFT:
            self.snake.command = (-20, 0)
        if key == pygame.K_RIGHT:
            self.snake.command = (20, 0)

    def neural_move(self, ways=(-1, -1, -1, -1)):
        coord = self.snake.snake_list[0]

        if ways[0] > 0.8:
            self.snake.command = (0, -20)
            return
        if ways[1] > 0.8:
            self.snake.command = (0, 20)
            return
        if ways[2] > 0.8:
            self.snake.command = (-20, 0)
            return
        if ways[3] > 0.8:
            self.snake.command = (20, 0)
            return

    def choose_min(self, dist):
        if len(dist):
            return min(dist)
        else:
            return 600

    def dist_to_body(self, coord, x, y, z=1):
        dist = []
        last = -1
        ignore = True
        for i, body in enumerate(self.snake.snake_list[1:-1]):
            if (coord[x] - body[x]) * z >= 0 and coord[y] == body[y]:
                if last + 1 != i:
                    ignore = False

                if not ignore:
                    dist.append((coord[x] - body[x]) * z - 20)
                last = i
        return dist

    def get_input_data(self):
        coord = self.snake.snake_list[0]

        west = self.choose_min(self.dist_to_body(coord, 0, 1, -1))

        east = self.choose_min(self.dist_to_body(coord, 0, 1, 1))

        north = self.choose_min(self.dist_to_body(coord, 1, 0, -1))

        south = self.choose_min(self.dist_to_body(coord, 1, 0, 1))

        dist = math.sqrt(sum([(i - j - k) ** 2 for i, j,
                              k in zip(self.snake.apple_position, coord, self.snake.START_POINT)]))

        angle1 = (self.snake.apple_position[0] -
                  coord[0] - self.snake.START_POINT[0]) / dist

        angle2 = (self.snake.apple_position[1] -
                  coord[1] - self.snake.START_POINT[1]) / dist

        north *= not((coord[0], coord[1] - 20) in self.snake.snake_list[1:-1])
        south *= not((coord[0], coord[1] + 20) in self.snake.snake_list[1:-1])
        west *= not((coord[0] - 20, coord[1]) in self.snake.snake_list[1:-1])
        east *= not((coord[0] + 20, coord[1]) in self.snake.snake_list[1:-1])

        return (coord[0], 580 - coord[0], coord[1], 580 - coord[1], north, south, west, east, dist, angle1, angle2)

    def increse_score(self):
        self.score += 1
        self.get_apple = True

    def snake_distance(self):
        now = sum(
            [(i - j - k) ** 2 for i, j, k in zip(self.snake.apple_position, self.snake.snake_list[0], self.snake.START_POINT)])
        last = sum(
            [(i - j - k) ** 2 for i, j, k in zip(self.snake.apple_position, self.snake.snake_list[1], self.snake.START_POINT)])

        return now <= last

    def die(self):
        # self.score = 0
        # self.snake.game_restart()
        self.died = True
        self.hit_body = self.snake.snake_list[0] in self.snake.snake_list[1:-1]
        self.snake.game_end()
        # time.sleep(1)
        # print("Player", self.index, self.score)
        # game_restart()
