import socket
import owncloud
import json
import base64

LOCAL_HOST = '192.168.0.103'
USER = 'GrimReaper'
PASS = 'JKaKTV5stU4xbiz'

HOST = '192.168.0.103'
PORT = 13327


def convImageToJSON(path):
	data = {}
	with open(path, 'rb') as file:
		img = file.read()
	data['img'] = base64.encodebytes(img).decode("utf-8")
	
	return json.dumps(data)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

s.bind((HOST, PORT))
s.listen()

conn, addr = s.accept()

print('{0} connected to Server!'.format(addr))

print('Client:\t{0}'.format(conn.recv(1024)))

#oc = owncloud.Client('http://' + LOCAL_HOST + '/owncloud')
#oc.login(USER, PASS)
#
#oc.put_file('Test.bmp', '/home/pi/Test2.bmp')
#
#link_info = oc.share_file_with_link("Test.bmp")
#
#conn.send((link_info.get_link() + "/download").encode())

#conn.send(b'Send Data to Client')

#print('Client:\t{0}'.format(conn.recv(1024)))
conn.send(b'Testing Echo!')

#print(convImageToJSON('/home/pi/Test2.bmp'))
#conn.send(convImageToJSON('/home/pi/Test2.bmp').encode())
#conn.recv(1024)

#image = open("/home/pi/Test2.bmp", 'rb')
#data = image.read(1024)
#while(data):
#	conn.send(data)
#	print('Client:\t{0}'.format(conn.recv(1024)))
#	data = image.read(1024)
#
#image.close()

#print('Client:\t{0}'.format(conn.recv(1024)))
#conn.send(b'Send spell: Fireball')
#
#print('Client:\t{0}'.format(conn.recv(1024)))
#conn.send(b'Close')


print("Close conn")
conn.close()
s.close()
