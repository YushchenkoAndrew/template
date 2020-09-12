from flask import Flask
app = Flask(__name__)

HOST = '0.0.0.0'
PORT = 18000


@app.route("/")
@app.route("/<name>")
def test(name=None):
    print(name)
    # print("Hello world")
    return "Hello world"


if __name__ == "__main__":
    app.run(host=HOST, port=PORT)
