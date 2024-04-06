from flask import Flask

app = Flask(__name__)

@app.route('/get_something')
def get_something():
    return "Something"

@app.route('/')
def get_something1():
    return "Something"