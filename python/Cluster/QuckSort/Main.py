from mpi4py import MPI
import time
import RPi.GPIO as GPIO
import random as rand

# Initialize parallel process
comm = MPI.COMM_WORLD
rank = comm.Get_rank()
size = comm.Get_size()
name = MPI.Get_processor_name()

# Initialize Pin (const)
LED = {'r' : 18, 'g' : 16, 'b' : 12}

# Initialize GPIO
GPIO.setmode(GPIO.BOARD)
for i in LED:
	GPIO.setup(LED[i], GPIO.OUT, initial=1)

print("{0} \t rank - {1} \t size - {2}".format(name, rank, size))


# Generated Array size
LEN = 40


# Start mode
GPIO.output(LED['r'], 0)
time.sleep(1)


# Main functions

def ScatterData(array):
	if rank == 0:
		print('Generated random array:\n{0}\n'.format(array))
	
		pivot = array[rand.randrange(LEN)]		

		# Divide array
		data = [[], []]
	
		for i in array:
			if i < pivot:
				data[0].append(i)
			else:
				data[1].append(i)
	else:
		data = None

	return comm.scatter(data, root=0)

def GatherData(data):
	data = comm.gather(data, root=0)

	if rank == 0:
		if data[0][0] < data[1][0]:
			result = data[0]
			result.extend(data[1])
		else:
			result = data[1]
			result.extend(data[0])

		print('Sorted array :\t', result)


def showColor(color):
	def showRGB(index):
		for i in LED:
			GPIO.output(LED[i], 1)
		GPIO.output(LED[index], 0)

	# Set color with time division in ms
	timeScale = {i : color[i] / 255  for i in color}
	pause = 0.001

	for  k in color.keys():
		if color[k]:
			showRGB(k)
		time.sleep(pause)

	#print(timeScale)

# Source:	https://en.wikipedia.org/wiki/Quicksort

def QuickSort(array, lo, hi):
	def partition(array, lo, hi):
		pivot = array[hi]
		i = lo

		for j in range(lo, hi):
			if array[j] < pivot:
				array[i], array[j] = array[j], array[i]
				i += 1

		array[i], array[hi] = array[hi], array[i]
		return i

	if lo < hi:
		p = partition(array, lo, hi)
		QuickSort(array, lo, p - 1)
		QuickSort(array, p + 1, hi)
		
		# Sorting visualization 
		start = time.time()

		while time.time() - start < 1:
			showColor({'r' : 250, 'g' : 0,  'b' : 250})
		
		


# Program operations

data = ScatterData([rand.randrange(-LEN, LEN) for i in range(LEN)])
print('{0} \t get \t {1}'.format(name, data))

QuickSort(data, 0, len(data) - 1)
print('{0} \t sorted array \t {1}'.format(name, data))


# Sorting Complete
showColor({'r' : 0, 'g' : 200, 'b' : 0})
time.sleep(1)

# Show final result
GatherData(data)


# Reset all used GPIO
time.sleep(2)
GPIO.cleanup()







