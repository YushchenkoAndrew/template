import turtle
import time
import random


class SnakeGame:

    SCREEN = 0
    snake = turtle.Turtle()
    snake_list = [(10, 5), (30, 5), (50, 5), (70, 5), (90, 5), (110, 5),
                  (130, 5), (150, 5), (170, 5), (190, 5), (210, 5), (230, 5)]

    apple = turtle.Turtle()
    border = turtle.Turtle()

    stop = False

    WIDTH = 850
    HEIGHT = 650
    SPEED = 0

    command = (-20, 0)

    prevComm = (0, 0)

    def __init__(self):
        self.SCREEN = turtle.getscreen()
        self.SCREEN.setup(width=self.WIDTH, height=self.HEIGHT)
        turtle.bgcolor("black")

        self.SCREEN.onkey(self.snakeUp, "Up")
        self.SCREEN.onkey(self.snakeDown, "Down")
        self.SCREEN.onkey(self.snakeLeft, "Left")
        self.SCREEN.onkey(self.snakeRight, "Right")
        self.SCREEN.listen()

        self.set_Property(self.snake)
        self.snake.penup()
        turtle.delay(0)
        self.snake.goto(10, 5)

        self.set_Property(self.apple)
        self.draw_apple()

        self.create_basic_squares(self.border)
        self.create_grid(turtle.Turtle())
        self.draw_snake()

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
        self.set_Property(t)
        t.color("white", "white")
        t.penup()
        t.goto(-210, 305)
        t.pendown()

        self.draw_rect(t, (600, 600))

        t.penup()
        t.goto(-400, 305)
        t.pendown()

        self.draw_rect(t, (160, 600))
        self.border.up()

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

    def update(self, dx=0, dy=0):
        temp = (dx + self.snake_list[0][0], dy + self.snake_list[0][1])

        if (temp != self.snake_list[1]):
            self.snake_list.insert(0, temp)
            self.walls()
            self.prevComm = self.command
        else:
            self.command = self.prevComm
            self.update(*self.command)

    def eat_apple(self):

        if len([i for i, j in zip(self.snake_list[0], self.apple.position()) if abs(i - j) < 1]) == 2:
            self.draw_apple()
            return True
        return False

    def walls(self):
        if ([i for i, j, k in zip(self.snake_list[0], (-230, 325), (390, -295)) if i == j or i == k] or self.snake_list[0] in self.snake_list[1:-1]):
            # self.stop = True
            print("Stop!!")


# TODO: Complite method for rebuilding walls in more performance way


    def border_rebuild(self, coord):

        wall = [i for i, j, k in zip(
            self.snake_list[-1], (-210, 315), (370, -275)) if i == j or i == k]
        if (wall):
            print(wall)
            wall = wall[0]

            self.border.goto(*coord)

            if (wall == -210 or wall == 370):
                self.border.setheading(270)

            if (wall == -275):
                self.border.setheading(270)
                self.border.fd(20)
                self.border.setheading(180)

            self.border.down()
            self.border.fd(20)
            self.border.up()

    def snakeUp(self):
        self.command = (0, 20)

    def snakeDown(self):
        self.command = (0, -20)

    def snakeLeft(self):
        self.command = (-20, 0)

    def snakeRight(self):
        self.command = (20, 0)

    def get_pixel_map(self):
        return turtle.getcanvas()

    def move(self):
        self.update(*self.command)
        self.draw_snake()

    def screen_update(self):
        while True:
            self.move()
            self.SCREEN.update()
            if self.stop:
                break
            time.sleep(0.1)


test = SnakeGame()
test.screen_update()

time.sleep(1)
