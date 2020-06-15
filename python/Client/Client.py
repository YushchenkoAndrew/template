import socket
import time
import cv2
import pickle
import zlib
import datetime

HOST = '192.168.0.101'
PORT = 13327

video = cv2.VideoCapture(0)


video.set(3, 50)
video.set(4, 50)



s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))

for i in range(5800):
    ret, frame = video.read()
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    for array in gray:
        s.send(pickle.dumps(zlib.compress(bytes(array))))
        
        Echo = s.recv(1024)
    s.send(b'END')
    Echo = s.recv(1024)

    if i == 100:
        s.send(b'END')
        break
    else:
        s.send(b'Again')

    Echo = s.recv(1024)



s.sendall(b'')
s.close()

video.release()
cv2.destroyAllWindows()
