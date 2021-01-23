import turtle
import time
import random
import Player
import ShowData
import Snake


class SnakeGame:

    screens = []
    players = []
    snakes = []

    border = turtle.Turtle()
    turtle.delay(0)

    WIDTH = 850
    HEIGHT = 650
    SPEED = 0

    def __init__(self):
        self.screen = turtle.getscreen()
        self.screen.setup(width=self.WIDTH, height=self.HEIGHT)
        turtle.bgcolor("black")

        self.data = ShowData.ShowData(self.set_Property)

        for i in range(1):
            player = Player.Player(i)
            self.players.append(player)
            snake = Snake.Snake(player, self.data, self.set_Property)
            self.snakes.append(snake)

            snake.set_func(self.draw_filled_rect,
                           self.draw_rect, self.border_rebuild)
            player.set_window(self.screen, snake.set_command)

        self.data.set_player(self.players[0])

        self.set_Property(self.border)

        self.create_basic_squares(self.border)
        self.create_grid(turtle.Turtle())

        self.initialize_new_game()

    def initialize_new_game(self):
        for snake in self.snakes:
            snake.game_restart()
        self.data.show_score()

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

    def screen_update(self):
        while True:
            for snake in self.snakes:
                snake.move()
            self.screen.update()

            time.sleep(0.1)


snake = SnakeGame()
snake.screen_update()

time.sleep(1)
