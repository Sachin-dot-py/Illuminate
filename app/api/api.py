from flask import Flask

app = Flask(__name__)


@app.route('/get_schedule')
def get_schedule():
    return "Something"

@app.route('/get_profs')
def get_profs():
    return "Something"