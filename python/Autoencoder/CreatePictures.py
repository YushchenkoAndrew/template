import cv2


video = cv2.VideoCapture(0)


video.set(3, 640)
video.set(4, 480)

print("Starting...")

for i in range(500):
    ret, frame = video.read()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    cv2.imwrite(f'image{i}.png', gray)
    cv2.imshow("testing...", gray)


video.release()
cv2.destroyAllWindows()
