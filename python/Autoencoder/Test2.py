from matplotlib.pyplot import imshow
import numpy as np
import cv2
from keras.preprocessing.image import img_to_array
from tensorflow.keras.layers import Conv2D, MaxPooling2D, UpSampling2D
from tensorflow.keras.models import Sequential
from PIL import Image
from tensorflow.keras.models import model_from_json


def save(model, fileName):
    # serialize model to JSON
    model_json = model.to_json()
    with open(f"{fileName}.json", "w") as json_file:
        json_file.write(model_json)
    # serialize weights to HDF5
    model.save_weights(f"{fileName}.h5")
    print("Saved model to disk")


def load(fileName):
    # load json and create model
    json_file = open(f'{fileName}.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    # load weights into new model
    loaded_model.load_weights(f"{fileName}.h5")
    print("Loaded model from disk")

    return loaded_model


# Limiting to 256 size image as my laptop cannot handle larger images.
SIZE = 256
img_data = []

# Change 1 to 0 for Grey scale images
img = cv2.imread('TestingData/image2.png', 1)
# Changing BGR to RGB to show images in true colors
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img = cv2.resize(img, (SIZE, SIZE))
img_data.append(img_to_array(img))

img_array = np.reshape(img_data, (len(img_data), SIZE, SIZE, 3))
img_array = img_array.astype('float32') / 255.


img_data2 = []  # Second image to be provided as ground truth.

# Change 1 to 0 for Grey scale images
img2 = cv2.imread('TestingData/image94.png', 1)
# Changing BGR to RGB to show images in true colors
img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
img2 = cv2.resize(img2, (SIZE, SIZE))
img_data2.append(img_to_array(img2))

img_array2 = np.reshape(img_data2, (len(img_data2), SIZE, SIZE, 3))
img_array2 = img_array2.astype('float32') / 255.

# Define Autoencoder model.

# model = Sequential()
# model.add(Conv2D(128, (7, 7), activation='relu',
#                  padding='same', input_shape=(SIZE, SIZE, 3)))
# model.add(MaxPooling2D((2, 2), padding='same'))
# model.add(Conv2D(64, (7, 7), activation='relu', padding='same'))
# model.add(MaxPooling2D((2, 2), padding='same'))
# model.add(Conv2D(32, (7, 7), activation='relu', padding='same'))


# model.add(MaxPooling2D((2, 2), padding='same'))

# model.add(Conv2D(32, (7, 7), activation='relu', padding='same'))
# model.add(UpSampling2D((2, 2)))
# model.add(Conv2D(64, (7, 7), activation='relu', padding='same'))
# model.add(UpSampling2D((2, 2)))
# model.add(Conv2D(128, (7, 7), activation='relu', padding='same'))
# model.add(UpSampling2D((2, 2)))
# model.add(Conv2D(3, (7, 7), activation='relu', padding='same'))

model = load("Test2")

model.compile(optimizer='adam', loss='mean_squared_error',
              metrics=['accuracy'])
model.summary()


model.fit(img_array, img_array,
          epochs=500,  # 1000s of epochs needed for good results. Use GPU.
          shuffle=True)  # Shuffle data for each epoch

save(model, "Test2")

model = load("Test2")

print("Output")
pred = model.predict(img_array)  # Predict model on the same input array.

# In reality, train on 1000s of input images and predict on images that the training
# algorithm never saw.

# imshow(pred[0].reshape(SIZE, SIZE, 3), cmap="gray")

print(pred.shape)

temp = np.reshape(pred[0], (SIZE, SIZE, -1))

img2 = Image.fromarray(np.uint8(temp * 255), 'RGB')
img2.save("processed_img.jpg")


pred = model.predict(img_array2)  # Predict model on the same input array.

# In reality, train on 1000s of input images and predict on images that the training
# algorithm never saw.

# imshow(pred[0].reshape(SIZE, SIZE, 3), cmap="gray")

print(pred.shape)

temp = np.reshape(pred[0], (SIZE, SIZE, -1))

img2 = Image.fromarray(np.uint8(temp * 255), 'RGB')
img2.save("processed_img1.jpg")
