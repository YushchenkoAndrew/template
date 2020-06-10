import pygame
import time


class Player:

    def __init__(self, i, snake):
        # print("Player create!")
        self.index = i
        self.score = 0
        self.snake = snake

    def check_key_press(self, key):
        if key == pygame.K_DOWN:
            self.snake.command = (0, 20)
        if key == pygame.K_UP:
            self.snake.command = (0, -20)
        if key == pygame.K_LEFT:
            self.snake.command = (-20, 0)
        if key == pygame.K_RIGHT:
            self.snake.command = (20, 0)

    def die(self):
        self.score = 0
        self.snake.game_restart()
        # time.sleep(1)
        # print("Player", self.index, self.score)
        # game_restart()
