from PIL import Image, ImageDraw


class Diffusion:
    curr = []
    next = []

    height = 200
    width = 200

    epoch = 0

    diffusion = {'A': 1, 'B': 0.5}
    feed = 0.0749
    kill = 0.0625

    weight = [
        [0.05, 0.2, 0.05],
        [0.2,  -1,   0.2],
        [0.05, 0.2, 0.05],
    ]

    def __init__(self):

        for i in range(self.height):
            self.curr.append([])
            self.next.append([])

            for j in range(self.width):
                self.curr[i].append({'A': 1, 'B': 0})
                self.next[i].append({'A': 1, 'B': 0})

        self.addChemical(self.width // 2, self.height // 2, 10)

    def addChemical(self, x, y, range_=10):
        for i in range(-range_, range_):
            for j in range(-range_, range_):
                self.curr[y + i][x + j]['B'] = 1

    def update(self):
        for i in range(1, self.height - 1):
            for j in range(1, self.width - 1):

                a = self.curr[i][j]['A']
                b = self.curr[i][j]['B']

                laplace = self.LaplacianFunc(j, i)

                self.next[i][j]['A'] = a + \
                    (self.diffusion['A'] * laplace['A'] -
                     a * b * b + self.feed * (1 - a))
                self.next[i][j]['B'] = b + \
                    (self.diffusion['B'] * laplace['B'] + a * b *
                     b - (self.kill + self.feed) * b)

        # Swap
        self.next, self.curr = self.curr, self.next
        self.epoch += 1

    def LaplacianFunc(self, x, y):
        result = {'A': 0, 'B': 0}

        for i in range(-1, 2):
            for j in range(-1, 2):
                result['A'] += self.curr[i + y][j + x]['A'] * \
                    self.weight[i + 1][j + 1]
                result['B'] += self.curr[i + y][j + x]['B'] * \
                    self.weight[i + 1][j + 1]

        return result

    def save(self, name='Diffusion'):
        img = Image.new('RGB', (self.width, self.height))

        pixels = []

        for i in range(self.height):
            for j in range(self.width):
                a = self.curr[i][j]['A']
                b = self.curr[i][j]['B']
                color = round((a - b) * 255)

                pixels.append((color, color, color))
        img.putdata(pixels)
        img.save(name + '.png')
