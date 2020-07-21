from mpi4py import MPI
import RPi.GPIO as GPIO
import time

# Initialize parallel process
comm = MPI.COMM_WORLD
rank = comm.Get_rank()
name = MPI.Get_processor_name()
size = comm.Get_size()

print('name = {0}   rank = {1}  size = {2}'.format(name, rank, size))


# Initialize GPIO
RED = 18
GREEN = 16
BLUE = 12

GPIO.setmode(GPIO.BOARD)
GPIO.setup(RED, GPIO.OUT, initial=1)
GPIO.setup(GREEN, GPIO.OUT, initial=1)
GPIO.setup(BLUE, GPIO.OUT, initial=1)

GPIO.output(RED, 0)
time.sleep(3)


if rank % 2 == 0:
	data = {'a': 7, 'b': 3.14}
	comm.send(data, dest=1, tag=11)
	print('Send - 0')

	GPIO.output(RED, 1)
	GPIO.output(BLUE, 0)
	time.sleep(3)

	data = comm.recv(source=1, tag=22)
	print('data[0] = ', data)
	
	GPIO.output(BLUE, 1)	
	GPIO.output(GREEN, 0)

elif rank % 2 == 1:
	data = comm.recv(source=0, tag=11)
	print('data[1] = ', data)

	GPIO.output(RED, 1)
	GPIO.output(GREEN, 0)
	time.sleep(3)

	data2 = 'Ok'
	comm.send(data2, dest=0, tag=22)
	print('Send - 1')
	
	GPIO.output(GREEN, 1)
	GPIO.output(BLUE, 0)

time.sleep(3)
GPIO.cleanup()

