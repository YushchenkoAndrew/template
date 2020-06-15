from keras.datasets import mnist
import numpy as np
from keras.layers import Input, Dense, Flatten, Reshape
from keras.models import Model
from keras.models import model_from_json
import seaborn as sns
import matplotlib.pyplot as plt
import cv2


def create_dense_ae():
    # Set Encoding dimension
    encoding_dim = 49

    # Encoder
    # 28, 28, 1 - scale of rows, columns, filters
    input_img = Input(shape=(28, 28, 1))
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


(x_train, y_train), (x_test, y_test) = mnist.load_data()

x_train = x_train.astype('float32') / 255
x_test = x_test.astype('float32') / 255
x_train = np.reshape(x_train, (len(x_train), 28, 28, 1))
x_test = np.reshape(x_test,  (len(x_test),  28, 28, 1))

# Create and compile model
encoder, decoder, autoencoder = create_dense_ae()
autoencoder.compile(optimizer='adam', loss='binary_crossentropy')

autoencoder.summary()

# # Studing Autoencoder
autoencoder.fit(x_train, x_train, epochs=100, batch_size=256,
                shuffle=True, validation_data=(x_test, x_test))


def save(model, fileName):
    # serialize model to JSON
    model_json = model.to_json()
    with open(f"{fileName}.json", "w") as json_file:
        json_file.write(model_json)
    # serialize weights to HDF5
    model.save_weights(f"{fileName}.h5")
    print("Saved model to disk")


save(encoder, "Encoder")
save(decoder, "Decoder")
save(autoencoder, "Autoencoder")


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


encoder = load("Encoder")
decoder = load("Decoder")
autoencoder = load("Autoencoder")

# Testing autoencoder
n = 20

imgs = x_test[:n]
encoded_imgs = encoder.predict(imgs, batch_size=n)

# Decoding
decoded_imgs = decoder.predict(encoded_imgs, batch_size=n)

plot_digits(imgs, decoded_imgs)
