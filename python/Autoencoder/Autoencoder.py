from matplotlib.pyplot import imshow
import numpy as np
import cv2
from keras.layers import Input, Dense, Flatten, Reshape, Conv2D, MaxPooling2D, UpSampling2D
from keras.models import Model
from keras.preprocessing.image import img_to_array
from tensorflow.keras.models import Sequential
from keras.models import model_from_json
import matplotlib.pyplot as plt
from PIL import Image


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


def create_dense_ae():
    # Set Encoding dimension
    encoding_dim = 49

    # Encoder
    # 28, 28, 1 - scale of rows, columns, filters
    input_img = Input(shape=(480, 640, 1))
    # Reshape image
    flat_img = Flatten()(input_img)
    x = Dense(encoding_dim * 3, activation='relu')(flat_img)
    x = Dense(encoding_dim * 2, activation='relu')(x)
    encoded = Dense(encoding_dim, activation='linear')(x)

    # Decoder
    input_encoded = Input(shape=(encoding_dim,))
    x = Dense(encoding_dim*2, activation='relu')(input_encoded)
    x = Dense(encoding_dim*3, activation='relu')(x)
    flat_decoded = Dense(28*28, activation='sigmoid')(x)
    decoded = Reshape((28, 28, 1))(flat_decoded)

    encoder = Model(input_img, encoded, name="encoder")
    decoder = Model(input_encoded, decoded, name="decoder")
    autoencoder = Model(input_img, decoder(
        encoder(input_img)), name="autoencoder")
    return encoder, decoder, autoencoder


def create_deep_conv_ae():
    # Encoder
    # 28, 28, 1 - scale of rows, columns, filters
    input_img = Input(shape=(28, 28, 1))

    x = Conv2D(128, (7, 7), activation='relu', padding='same')(input_img)
    x = MaxPooling2D((2, 2), padding='same')(x)
    x = Conv2D(32, (2, 2), activation='relu', padding='same')(x)
    x = MaxPooling2D((2, 2), padding='same')(x)
    encoded = Conv2D(1, (7, 7), activation='relu', padding='same')(x)

    # At this moment we use (7, 7, 1) aka 49-scale

    input_encoded = Input(shape=(7, 7, 1))
    x = Conv2D(32, (7, 7), activation='relu', padding='same')(input_encoded)
    x = UpSampling2D((2, 2))(x)
    x = Conv2D(128, (2, 2), activation='relu', padding='same')(x)
    x = UpSampling2D((2, 2))(x)
    decoded = Conv2D(1, (7, 7), activation='sigmoid', padding='same')(x)

    # Models
    encoder = Model(input_img, encoded, name="encoder")
    decoder = Model(input_encoded, decoded, name="decoder")
    autoencoder = Model(input_img, decoder(
        encoder(input_img)), name="autoencoder")
    return encoder, decoder, autoencoder


def plot_digits(*args):
    args = [x.squeeze() for x in args]
    n = min([x.shape[0] for x in args])

    plt.figure(figsize=(2*n, 2*len(args)))
    for j in range(n):
        for i in range(len(args)):
            ax = plt.subplot(len(args), n, i*n + j + 1)
            plt.imshow(args[i][j])
            plt.gray()
            ax.get_xaxis().set_visible(False)
            ax.get_yaxis().set_visible(False)

    plt.show()


def save_img(img_array, fileName='image'):

    temp = np.reshape(img_array, (480, 640))

    img = Image.fromarray(np.uint8(temp * 255), 'L')
    img.save(f'{fileName}.png')
    img.show()


# Limiting to 256 size image as my laptop cannot handle larger images.
SIZE = 1
img_data = []

for i in range(SIZE):
    # Change 1 to 0 for Grey scale images
    img = cv2.imread('TestingData/image2.png', 1)
    img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    # img = cv2.resize(img, (640, 480))

    # Don't use a resizing because of already saved image in scale (640x480)

    # plt.imshow(img)
    # plt.show()

    img_data.append(img_to_array(img))

img_array = np.reshape(img_data, (len(img_data), 640, 480, 1))
img_array = img_array.astype('float32') / 255

# Create and compile model
encoder, decoder, autoencoder = create_deep_conv_ae()
autoencoder.compile(optimizer='adam', loss='binary_crossentropy')

encoder.summary()
decoder.summary()
autoencoder.summary()


# plt.imshow(img_array)
# plt.show()


# # Define Autoencoder model.

# model = Sequential()
# model.add(Conv2D(32, (3, 3), activation='relu',
#                  padding='same', input_shape=(SIZE, SIZE, 3)))
# model.add(MaxPooling2D((2, 2), padding='same'))
# model.add(Conv2D(8, (3, 3), activation='relu', padding='same'))
# model.add(MaxPooling2D((2, 2), padding='same'))
# model.add(Conv2D(8, (3, 3), activation='relu', padding='same'))


# model.add(MaxPooling2D((2, 2), padding='same'))

# model.add(Conv2D(8, (3, 3), activation='relu', padding='same'))
# model.add(UpSampling2D((2, 2)))
# model.add(Conv2D(8, (3, 3), activation='relu', padding='same'))
# model.add(UpSampling2D((2, 2)))
# model.add(Conv2D(32, (3, 3), activation='relu', padding='same'))
# model.add(UpSampling2D((2, 2)))
# model.add(Conv2D(3, (3, 3), activation='relu', padding='same'))

# model.compile(optimizer='adam', loss='mean_squared_error',
#               metrics=['accuracy'])
# model.summary()

# model.fit(img_array, img_array,
#           epochs=5000,  # 1000s of epochs needed for good results. Use GPU.
#           shuffle=True)  # Shuffle data for each epoch


# save(model, "Model")
# # model = load("Model")

# print("Output")
# pred = model.predict(img_array)  # Predict model on the same input array.

# # In reality, train on 1000s of input images and predict on images that the training
# # algorithm never saw.


# img2 = Image.fromarray(pred[0], 'RGB')
# img2.save("processed_img.jpg")


# imshow(pred[0].reshape(SIZE, SIZE, 3), cmap="gray")
# cv2.waitKey()
# # plot_digits(pred[0].reshape(SIZE, SIZE, 3))
