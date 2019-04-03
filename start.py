from flask import Flask, session, render_template, request, url_for, redirect
from os import urandom

DEBUG_MODE = True
IP_ADDRESS = "localhost"

app = Flask(__name__)
app.secret_key = urandom(24)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/timeline")
def timeline():
    return render_template("timeline.html")

if __name__ == "__main__":
    app.run(host= IP_ADDRESS, port=80, debug=DEBUG_MODE)
