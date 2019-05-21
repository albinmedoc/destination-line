# coding: UTF-8
import psycopg2
import random
from flask import Flask, flash, render_template, session
from os import urandom
from sys import argv
import User, Image
from Settings import SERVER_IP, SERVER_PORT, DEBUG_MODE, RANDOM_VIDEOS
from Database import Database

app = Flask(__name__)
app.secret_key = urandom(24)

@app.errorhandler(404)
def error_404(e):
        return render_template("404.html"), 404

@app.route("/")
def index():
        explore_albums = Image.get_new_albums()
        if(explore_albums is not None):
                if("username" in session):
                        following_albums = Image.get_new_following_albums()
                        if(following_albums is not None):
                                return render_template("index.html", explore_albums=explore_albums, following_albums=following_albums)
                return render_template("index.html", explore_albums=explore_albums)
        return render_template("index.html")

@app.route("/timeline")
def timeline():
        db = Database()
        cur = db.conn.cursor()
        cur.execute("select album.country, album.city, post.img_name, album.date_start, album.date_end from album join post on album.id = post.album where post.index=1")
        albums = cur.fetchall()
        print(albums)
        return render_template("timeline1.html", albums=albums)

@app.route("/info")
def about():
        video = random.choice(RANDOM_VIDEOS)
        print(video)
        return render_template("info.html", video=video)

if __name__ == "__main__":
        #Importera Blueprints
        app.register_blueprint(User.app)
        app.register_blueprint(Image.app)
        #Startar servern på olika adresser beroende på attribut
        if(len(argv) > 1 and argv[1].lower() == "server"):
                app.run(host = SERVER_IP, port = 80, debug = DEBUG_MODE, threaded = True)
        else:
                app.run(host = "localhost", port = SERVER_PORT, debug = False, threaded = True)