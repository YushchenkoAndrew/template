import turtle
import time
import random
import Player
import ShowData
import Snake


class SnakeGame:

    SCREEN = 0
    player = 0
    data = 0
    snake = 0

    border = turtle.Turtle()
    turtle.delay(0)

    WIDTH = 850
    HEIGHT = 650
    SPEED = 0

    def __init__(self, player):
        self.SCREEN = turtle.getscreen()
        self.SCREEN.setup(width=self.WIDTH, height=self.HEIGHT)
        turtle.bgcolor("black")

        self.data = ShowData.ShowData(player, self.set_Property)
        self.snake = Snake.Snake(player, self.data, self.set_Property)

        self.snake.set_func(self.draw_filled_rect,
                            self.draw_rect, self.border_rebuild)

        self.player = player
        player.set_window(self.SCREEN, self.set_command)

        self.set_Property(self.border)

        self.create_basic_squares(self.border)
        self.create_grid(turtle.Turtle())
        self.initialize_new_game()

    def initialize_new_game(self):
        self.snake.initialize_new_game()
        self.data.show_score()

    def game_restart(self):
        self.snake.game_restart()
        self.initialize_new_game()

    def set_Property(self, t):
        t.speed(self.SPEED)
        t.shape("circle")
        t.shapesize(0.001, 0.001)

    def draw_rect(self, t, dim=(10, 10)):
        for i in range(4):
            step = dim[0]
            if i % 2 != 0:
                step = dim[1]
            t.fd(step)

            t.rt(90)

    def draw_filled_rect(self, t, coord, color):
        t.fillcolor(color)
        t.penup()
        t.goto(*coord)
        t.pendown()

        t.begin_fill()
        self.draw_rect(t, (20, 20))
        t.end_fill()

    def create_basic_squares(self, t):
        t.color("white", "white")
        t.penup()
        t.goto(-210, 305)
        t.pendown()

        self.draw_rect(t, (600, 600))

        t.penup()
        t.goto(-400, 305)
        t.pendown()

        self.draw_rect(t, (160, 600))

    def create_grid(self, t):
        self.set_Property(t)
        t.penup()
        t.goto(-210, 305)
        t.color("gray")

        for j in range(2):
            for i in range(29):
                direct = (-1) ** (i + j)

                t.fd(20)
                t.pendown()
                t.rt(90 * direct)
                t.fd(600)
                t.penup()
                t.lt(90 * direct)

            t.fd(20)
            t.lt(90)

    def border_rebuild(self, coord):

        wall = [i for i, j, k in zip(
            coord, (-210, 305), (370, -275)) if i == j or i == k]
        if (wall):
            self.border.penup()
            self.border.goto(-210, 305)
            self.border.pendown()

            self.draw_rect(self.border, (600, 600))

    def set_command(self, coord):
        self.snake.set_command(coord)

    def screen_update(self):
        while True:
            self.snake.move()
            self.SCREEN.update()

            time.sleep(0.1)


snake = SnakeGame(Player.Player())
snake.screen_update()

time.sleep(1)
