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
MAX = 10**10


# Start mode
GPIO.output(LED['r'], 0)
time.sleep(1)


# Main functions

# array  --  Unsorted array of data
# range_ --  Range of array, have start and end
def ScatterData(array, range_):
	if rank == 0:
		print('Generated random array:\n{0}\n'.format(array))
	
		step = len(range_) // size
		index = iter(range(range_.start, range_.stop, step))

		# Don't start from range_.start
		next(index)
		pivot = [next(index) for i in range(size - 1)]

		# Show divided range
		print("Divided range -- {0} \n".format(pivot))
		
		# Add MAX value for add data into last list in data
		pivot.append(MAX)

		# Divide array
		data = [[] for i in range(size)]

		for i in array:
			for j in range(len(pivot)):
				if i < pivot[j]:
					data[j].append(i)
					break
	else:
		data = None

	return comm.scatter(data, root=0)

def GatherData(data):
	data = comm.gather(data, root=0)
	

	if rank == 0:
		result = []
		for i in data:
			result.extend(i)
	
		print('Sorted array :\t', result)
		time.sleep(2)


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

data = ScatterData([rand.randrange(-LEN, LEN) for i in range(LEN)], range(-LEN, LEN))
print('{0} \t get \t {1}'.format(name, data))

QuickSort(data, 0, len(data) - 1)
print('{0} \t sorted array \t {1}'.format(name, data))


# Sorting Complete
showColor({'r' : 0, 'g' : 200, 'b' : 0})
time.sleep(1)

# Show final result
GatherData(data)

# Wait for end progrogram
comm.bcast("End program", root=0)

# Reset all used GPIO
GPIO.cleanup()







