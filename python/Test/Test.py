######################################
#	PROGRAM NAME: - TestProgram
#	DISCRIPTION:  - Just print Hello world to see does compilator work OK
#	DATE: 20.02.20
#	AUTOR: Andrew Yushchenko
#####################################
#!/usr/bin/python3

import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(3, GPIO.OUT)
GPIO.setwarnings(False)

state = True

while 1:
	GPIO.output(3, state)
	print('Hello world! - ', time.strftime("%d/%m/%Y   %H:%M:%S", time.localtime()))
	time.sleep(1)
	state = not state
