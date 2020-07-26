import Diffusion

diff = Diffusion.Diffusion()
while diff.epoch < 10000:
    diff.update()
    if diff.epoch % 50 == 0:
        print("Yep\n Epoch = ", diff.epoch)
        diff.save('Diffusion{0}'.format(diff.epoch))
