import time
import sys
import random as rand
import RPi.GPIO as GPIO

# Initialize Pin (const)
LED = {"r": 18, "g": 16, "b": 12}

# Frequecy in Hz
FREQ = 1000


def InitializeGPIO():
    # Initialize GPIO
    GPIO.setmode(GPIO.BOARD)
    for i in LED:
        GPIO.setup(LED[i], GPIO.OUT, initial=1)


def blink(ms, color):
    out = 0

    # FIXME: while True: loop
    for _ in range(100):
        GPIO.output(color, out)
        out ^= 1
        time.sleep(ms)


def setColor(r, g, b):
    color = {"r": r, "g": g, "b": b}

    # FIXME: while True: loop
    for _ in range(FREQ):
        for k in color:
            delay = color[k] / 255.0 / FREQ

            GPIO.output(LED[k], 0)
            time.sleep(delay)
            GPIO.output(LED[k], 1)
            time.sleep(1.0 / FREQ - delay)


def main():
    print("~ Python script started")

    InitializeGPIO()

    command = sys.argv[1]
    param = sys.argv[2]

    print("command = {0}".format(command))
    print("param = {0}".format(param))

    # Switch case statment
    if command in LED.keys():
        GPIO.output(LED[command], int(param))
        time.sleep(5)

    elif "blink" in command and (param in LED.keys() or param == "rand"):
        if param == "rand":
            param = rand.choice(list(LED.keys()))

        blink(float(command.split("-")[1]) / 1000, LED[param])

    elif "setColor" in command:
        setColor(
            int("0x" + param[0:2], 16),  # Red Value
            int("0x" + param[2:4], 16),  # Green Value
            int("0x" + param[4:], 16),  # Blue Value
        )

    elif "rainbow" in command:
        pass

    # time.sleep(5)

    # Reset all used GPIO
    GPIO.cleanup()


print("Yep")

if __name__ == "__main__":
    main()
