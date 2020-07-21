from mpi4py import MPI

comm = MPI.COMM_WORLD
rank = comm.Get_rank()
name = MPI.Get_processor_name()
size = comm.Get_size()

print('name = {0}   rank = {1}  size = {2}'.format(name, rank, size))

#assert comm.size == 2

if rank % 2 == 0:
	data = {'a': 7, 'b': 3.14}
	comm.send(data, dest=1, tag=11)
	print('Send - 0')
	data = comm.recv(source=1, tag=22)
	print('data[0] = ', data)
elif rank % 2 == 1:
	data = comm.recv(source=0, tag=11)
	print('data[1] = ', data)
	data2 = 'Ok'
	comm.send(data2, dest=0, tag=22)
	print('Send - 1')
