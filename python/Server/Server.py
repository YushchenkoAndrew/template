import datetime
import time
import socket
import pickle
import zlib
import cv2
import numpy as np

HOST = '192.168.0.101'
PORT = 13327

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

faceCascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

s.bind((HOST, PORT))
s.listen()
conn, addr = s.accept()
f = open("Data.txt", 'w')
f.write("Connected by ")
f.write(str(addr))
f.write("\n")
f.close()

#f = open("Data.txt", 'a')
#f.write(str(datetime.datetime.now()))
#f.write("\n")

ValueMax = 2

cv2.startWindowThread()
cv2.namedWindow('Video')

while True:
	gray = []
	#print("Start")
	while True:
		data = conn.recv(4096)
		if data == b'END':
			conn.send(b'Ok')
			#print("Reciving is Finished!!")
			break
	
		temp = zlib.decompress(pickle.loads(data))
		gray.append(list(temp))
		conn.send(b'Ok')
	
	gray = (np.array(gray)).astype(np.uint8)

	width, height = gray.shape

	gray = cv2.resize(gray, (height * ValueMax, width * ValueMax), interpolation = cv2.INTER_AREA)
	
	faces = faceCascade.detectMultiScale(
		gray,
		scaleFactor=1.1,
		minNeighbors=5,
		minSize=(30, 30))
	
	grayBGR = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

	for (x, y, w, h) in faces:
		cv2.rectangle(grayBGR, (x, y), (x + w, y + h), (0, 255, 0), 2)


	cv2.imshow("Video", grayBGR)


	data = conn.recv(4096)
	conn.send(b'OK')
	if (data == b'END'):
		break

cv2.imwrite('image.png', grayBGR)



print("END")
#f.write(str(strData))
#f.close()

conn.close()
s.close()

time.sleep(1)
