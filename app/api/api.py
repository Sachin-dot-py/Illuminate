from flask import Flask

app = Flask(__name__)

@app.route('/get_something')
def get_something():
    return "Something"
