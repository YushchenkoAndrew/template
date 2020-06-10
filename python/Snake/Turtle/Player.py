import time


class Player:

    def __init__(self, i):
        print("Player create!")
        self.index = i
        self.score = 0

    def set_window(self, screen, move_func):
        self.SCREEN = screen
        self.move_func = move_func
        self.set_key_press()

    def set_key_press(self):
        self.SCREEN.onkey(self.press_up, "Up")
        self.SCREEN.onkey(self.press_left, "Left")

        self.SCREEN.onkey(self.press_down, "Down")
        self.SCREEN.onkey(self.press_right, "Right")
        self.SCREEN.listen()

    def press_up(self):
        self.move_func((0, 20))

    def press_down(self):
        self.move_func((0, -20))

    def press_left(self):
        self.move_func((-20, 0))

    def press_right(self):
        self.move_func((20, 0))

    def die(self, game_restart):
        self.score = 0
        # time.sleep(1)
        print("Player", self.index, self.score)
        game_restart()
