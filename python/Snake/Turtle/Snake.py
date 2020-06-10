import turtle
import random
import Player


class Snake:

    def __init__(self, player, data, set_Property):
        self.snake = turtle.Turtle()
        self.apple = turtle.Turtle()

        self.player = player
        self.data = data

        set_Property(self.snake)
        set_Property(self.apple)

    def set_func(self, draw_filled_rect, draw_rect, border_rebuild):
        self.draw_filled_rect = draw_filled_rect
        self.draw_rect = draw_rect
        self.border_rebuild = border_rebuild

    def initialize_new_game(self):
        self.draw_apple()
        self.draw_snake()

    def game_restart(self):
        self.snake.clear()
        self.apple.clear()
        self.snake_list = [(10, 5), (30, 5), (50, 5), (50, 5)]
        self.command = (-20, 0)
        self.initialize_new_game()

    def rand_apple(self):
        coord = (random.randrange(30) * 20 - 210,
                 305 - random.randrange(30) * 20)

        if coord in self.snake_list:
            coord = self.rand_apple()

        return coord

    def draw_apple(self):
        self.apple.color("red")

        self.draw_filled_rect(self.apple, self.rand_apple(), "red")

    def draw_snake(self):
        self.snake.pendown()

        self.snake.color("gray")

        self.draw_filled_rect(self.snake, self.snake_list[0], "white")

        # Delete tail
        if not self.eat_apple():
            coord = self.snake_list.pop(-1)
            self.draw_filled_rect(self.snake, coord, "black")
            self.border_rebuild(coord)

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

        if len([i for i, j in zip(self.snake_list[0], self.apple.position()) if abs(i - j) < 1]) == 2:
            self.draw_apple()
            self.player.score += 1
            self.data.show_score()
            return True
        return False

    def walls(self):
        if ([i for i, j, k in zip(self.snake_list[0], (-230, 325), (390, -295)) if i == j or i == k] or self.snake_list[0] in self.snake_list[1:-1]):
            self.data.show_death()
            self.player.die(self.game_restart)
            # print("Stop!!")

    def set_command(self, coord):
        self.command = coord

    def move(self):
        self.update(*self.command)
        self.draw_snake()
