# coding: UTF-8
import psycopg2
from flask import Flask, flash, render_template
from os import urandom
from sys import argv
import User, Image
from Settings import SERVER_IP, SERVER_PORT, DEBUG_MODE

app = Flask(__name__)
app.secret_key = urandom(24)

@app.route("/")
def index():
        return render_template("index.html")

@app.route("/profile/<username>")
def profile(username):
        # Kolla om användaren besöker sin egna profil, skickar med användarens profil
        return render_template("profile.html")

@app.route("/timeline")
def timeline():
        return render_template("timeline.html")

@app.route("/info")
def about():
        return render_template("info.html")

if __name__ == "__main__":
        #Importera Blueprints
        app.register_blueprint(User.app)
        app.register_blueprint(Image.app)
        #Startar servern på olika adresser beroende på attribut
        if(len(argv) > 1 and argv[1].lower() == "server"):
                app.run(host = SERVER_IP, port = SERVER_PORT, debug = DEBUG_MODE, threaded = True)
        else:
                app.run(host = "localhost", port = SERVER_PORT, debug = DEBUG_MODE, threaded = True)