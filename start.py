# coding: UTF-8
import psycopg2
import random
from flask import Flask, flash, render_template, session
from os import urandom
from sys import argv
import User
import Image
from Settings import SERVER_IP, SERVER_PORT, DEBUG_MODE, RANDOM_VIDEOS
from Database import Database


app = Flask(__name__)
app.secret_key = urandom(24)


@app.errorhandler(404)
def error_404(e):
    #Visar 404-sidan
    return render_template("404.html"), 404

@app.route("/")
def index():
    # Hämta senaste bilder
    explore_albums = Image.get_new_albums()
    if(explore_albums is not None):
        # Om användaren är inloggad, visa senaste bilder och bilder från följda användare
        if("username" in session):
            # Hämta bilder från följda användare
            following_albums = Image.get_new_following_albums()
            return render_template("index.html", explore_albums=explore_albums, following_albums=following_albums)
        # Är användaren inte inloggad visa endast senaste bilder
        return render_template("index.html", explore_albums=explore_albums)
    return render_template("index.html")

@app.route("/info")
def about():
    #Hämat en random video
    video = random.choice(RANDOM_VIDEOS)
    #Visar info sidan
    return render_template("info.html", video=video, creators=User.get_creators())

if __name__ == "__main__":
    # Importera Blueprints
    app.register_blueprint(User.app)
    app.register_blueprint(Image.app)
    # Startar servern på olika adresser beroende på attribut
    if(len(argv) > 1 and argv[1].lower() == "server"):
        app.run(host=SERVER_IP, port=80, debug=DEBUG_MODE, threaded=True)
    else:
        app.run(host="localhost", port=SERVER_PORT, debug=DEBUG_MODE, threaded=True)