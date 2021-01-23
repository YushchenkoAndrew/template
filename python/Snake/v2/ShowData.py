import pygame
from neat.six_util import itervalues, iterkeys


class ShowData:

    RED = (255, 0, 0)
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)
    GRAY = (180, 180, 180)

    def __init__(self, screen):
        self.screen = screen
        pygame.font.init()

        self.font = pygame.font.SysFont('Courier', 30)

        self.screen.blit(self.font.render(
            "Score:", False, self.WHITE), (80, 40))

        self.screen.blit(self.font.render(
            "Max Score:", False, self.WHITE), (30, 80))

        self.screen.blit(self.font.render(
            "SPEED:", False, self.WHITE), (200, 60))

    def show_data(self, data, coord, color=(255,)*3, font=None):
        if font is None:
            font = self.font

        self.clear(coord)
        self.screen.blit(font.render(
            f'{data}', False, color), coord[:2])

    def show_score(self, score):
        self.show_data(score, (160, 40, 40, 30))

    def show_max_score(self, score):
        self.show_data(score, (160, 80, 40, 30))

    def show_net_out(self, output, text=None):
        for i, value in enumerate(output):
            center = (350, 450 + i * 30)

            if value > 1:
                value = 1

            pygame.draw.circle(
                self.screen, [255 * value, ] * 3, center, 10)

            pygame.draw.circle(
                self.screen, self.WHITE, center, 10, 1)

            if text is not None:
                self.show_data(
                    text[i], (center[0] + 20, center[1] - 10, 0, 0))

    def clear(self, coord):
        pygame.draw.rect(self.screen, self.BLACK,
                         coord)

    def show_SPEED(self, speed):
        self.show_data(speed, (300, 60, 40, 30))

    def set_population(self, p):
        self.p = p

    def show_end_generation(self):
        config = self.p.config
        population = self.p.population
        species_set = self.p.species
        generation = self.p.generation

        font = pygame.font.SysFont('Courier', 25)

        ng = len(population)
        ns = len(species_set.species)

        self.show_data('   ****** Running generation {0} ******   '.format(
            generation), (30, 120, 350, 30), self.RED, font)

        sids = list(iterkeys(species_set.species))
        sids.sort()
        self.show_data(
            "   ID    age   size   fitness   adj fit   stag", (30, 170, 200, 30), font=font)
        self.show_data(
            "  =================================", (30, 190, 300, 30), font=font)

        self.clear((30, 220, 300, 200))

        for i, sid in list(enumerate(sids))[:8]:
            s = species_set.species[sid]
            a = self.p.generation - s.created
            n = len(s.members)
            f = "--" if s.fitness is None else "{:.1f}".format(s.fitness)
            af = "--" if s.adjusted_fitness is None else "{:.3f}".format(
                s.adjusted_fitness)
            st = self.p.generation - s.last_improved

            self.show_data(" {: >4}   {: >3}  {: >4}     {: >7}  {: >7}  {: >4}".format(
                sid, a, n, f, af, st), (30, 220 + 20 * i, 0, 0), font=font)

        # elapsed = time.time() - self.generation_start_time
        # self.generation_times.append(elapsed)
        # self.generation_times = self.generation_times[-10:]
        # average = sum(self.generation_times) / len(self.generation_times)
        # print('Total extinctions: {0:d}'.format(self.num_extinctions))
        # if len(self.generation_times) > 1:
        #     print("Generation time: {0:.3f} sec ({1:.3f} average)".format(
        #         elapsed, average))
        # else:
        #     print("Generation time: {0:.3f} sec".format(elapsed))
