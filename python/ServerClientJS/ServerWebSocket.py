import logging
from websocket_server import WebsocketServer
import base64
import sane
from PIL import Image

HOST = '192.168.0.103'
PORT = 13327

FILE_NAME = "Test.bmp"

def scanDoc():
	var = sane.init()

	devices = var.get_devices()
	print("Devices: " + devices)

	# Open first device
	dev = sane.open(devices[0][0])

	# Start a scan and get and PIL.Image object
	dev.start()
	im = dev.snap()
	im.save(FILE_NAME)
	dev.close()

def new_client(client, server):
	print("Client {0} Connected".format(client.get('address')))

def message_received( client, server, message):
	server.send_message_to_all(message)
	print("Client:\t", message)
	if (message == 'Scan'):
		print("Ok!!")

		#scanDoc()

		with open(FILE_NAME, 'rb') as file:
			img = file.read()
		data = base64.encodebytes(img).decode("utf-8")

		server.send_message_to_all(data)

server = WebsocketServer(PORT, host=HOST)
server.set_fn_new_client(new_client)

server.set_fn_message_received(message_received)

server.run_forever()
