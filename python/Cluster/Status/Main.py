import time
import sys
import signal
import atexit
import random as rand
import RPi.GPIO as GPIO

# Initialize Pin (const)
LED = {"r": 18, "g": 16, "b": 12}

# Frequecy in Hz
FREQ = 500

STEP = 200.0

# Rainbow Colors
colorEffect = [
    {"r": 0xFF, "g": 0x00, "b": 0x00},
    {"r": 0xFF, "g": 0x7F, "b": 0x00},
    {"r": 0xFF, "g": 0xFF, "b": 0x00},
    {"r": 0x00, "g": 0xFF, "b": 0x00},
    {"r": 0x00, "g": 0x00, "b": 0xFF},
    {"r": 0x2E, "g": 0x2B, "b": 0x5F},
    {"r": 0x8B, "g": 0x00, "b": 0xFF},
]


def InitializeGPIO():
    # Initialize GPIO
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BOARD)
    for i in LED:
        GPIO.setup(LED[i], GPIO.OUT, initial=1)


def blink(ms, color):
    out = 0

    while True:
        GPIO.output(color, out)
        out ^= 1
        time.sleep(ms)


def setColor(r, g, b):
    color = {"r": r, "g": g, "b": b}

    while True:
        for k in color:
            delay = color[k] / 255.0 / FREQ

            GPIO.output(LED[k], 0)
            time.sleep(delay)
            GPIO.output(LED[k], 1)
            time.sleep(1.0 / FREQ - delay)


def rainbow(frequency):
    curr = 0
    next = 1

    color = {k: colorEffect[0][k] for k in colorEffect[0]}
    delta = {k: (colorEffect[next][k] - color[k]) / STEP for k in color}

    count = 1

    while True:
        color = {k: color[k] + delta[k] for k in color}
	count += 1

	if count + 1 >= STEP:
            curr = next
            next = (next + 1) % len(colorEffect)
            delta = {k: (colorEffect[next][k] - color[k]) / STEP for k in color}
	    count = 0


        for _ in range(frequency):
            for k in color:
                delay = color[k] / 255.0 / FREQ

                GPIO.output(LED[k], 0)
                time.sleep(delay)
                GPIO.output(LED[k], 1)
                time.sleep(1 / FREQ)


def main():
    print("~ Python script started")

    InitializeGPIO()

    command = sys.argv[1]
    param = sys.argv[2]

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
        rainbow(int(param) // 3)

    else:  # If no one is correct then exit
        # Reset all used GPIO
        GPIO.cleanup()


if __name__ == "__main__":
    main()
