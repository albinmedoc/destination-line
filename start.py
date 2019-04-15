# coding: UTF-8
import psycopg2
from flask import Flask, flash, render_template
from os import urandom
from sys import argv
import User, Image

SERVER_IP = "192.168.1.18"

DEBUG_MODE = True

app = Flask(__name__)
app.secret_key = urandom(24)

@app.route("/")
def index():
        return render_template("index.html")

@app.route("/profile/<username>")
def profile(username):
        # Kolla om användaren besöker sin egna profil
        return render_template("profile.html")

@app.route("/timeline")
def timeline():
        return render_template("timeline.html")

@app.route("/about")
def about():
        return render_template("about.html")

if __name__ == "__main__":
        #Importera Blueprints
        app.register_blueprint(User.app)
        app.register_blueprint(Image.app)
        #Startar servern på olika adresser beroende på attribut
        if(len(argv) > 1 and argv[1].lower() == "server"):
                app.run(host = SERVER_IP, port = 80, debug = DEBUG_MODE, threaded = True)
        else:
                app.run(host = "localhost", port = 80, debug = DEBUG_MODE, threaded = True)