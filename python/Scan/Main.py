import sane
from PIL import Image

var = sane.init()

devices = var.get_devices()
print("Devices: " + devices)

# Open first device
dev = sane.open(devices[0][0])

# Start a scan and get and PIL.Image object
dev.start()
im = dev.snap()
im.save("Test.png")
