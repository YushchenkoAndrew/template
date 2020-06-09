import turtle


class ShowData:

    data = turtle.Turtle()
    player = 0
    style = ('Courier', 20, 'italic')

    def __init__(self, player, set_property):
        set_property(self.data)
        print("Show Data!!")

        self.player = player

    def show_score(self, text=''):
        self.data.clear()
        self.data.color("white")
        self.data.up()
        self.data.goto((-325, 260))
        self.data.down()
        self.data.write(f'Score: {self.player.score}',
                        font=self.style, align='center')

    def show_death(self):
        self.data.up()
        self.data.color("red")
        self.data.goto((-325, 220))
        self.data.down()
        self.data.write("YOU DIED", font=self.style, align='center')
