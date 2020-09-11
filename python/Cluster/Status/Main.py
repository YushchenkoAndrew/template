import time
import psutil
import RPi.GPIO as GPIO

# Initialize Pin (const)
LED = {"r": 18, "g": 16, "b": 12}


def reset():
    for i in LED:
        GPIO.output(LED[i], 1)


def main():
    # Initialize GPIO
    GPIO.setmode(GPIO.BOARD)
    for i in LED:
        GPIO.setup(LED[i], GPIO.OUT, initial=1)

    pwm = GPIO.PWM(LED["g"], 100)
    pwm.start(99)
    prev = "g"

    try:
        while 1:
            cpu_status = psutil.cpu_percent()
            print("CPU = {0}".format(cpu_status), end="\r")

            if cpu_status < 30 and not prev == "g":
                pwm.stop()
                reset()

                pwm = GPIO.PWM(LED["g"], 100)
                pwm.start(99)
                prev = "g"
            elif cpu_status > 30 and cpu_status < 60 and not prev == "b":
                pwm.stop()
                reset()

                pwm = GPIO.PWM(LED["b"], 100)
                pwm.start(99)
                prev = "b"
            elif cpu_status > 60 and not prev == "r":
                pwm.stop()
                reset()

                pwm = GPIO.PWM(LED["b"], 100)
                pwm.start(99)
                prev = "r"

            time.sleep(2)

    except KeyboardInterrupt:
        pass

    # pwm.stop()
    # pwm2.stop()

    # Reset all used GPIO
    GPIO.cleanup()


if __name__ == "__main__":
    main()
