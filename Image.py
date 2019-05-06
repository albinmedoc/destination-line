from flask import Blueprint, request, session, render_template, json, send_from_directory
import os
from uuid import uuid4
from werkzeug.utils import secure_filename
from PIL import Image
from Database import Database
from datetime import datetime
from User import get_user_id, owns_album

app = Blueprint("image", __name__, template_folder="templates")

ALLOWED_EXTENSIONS = set(["png", "jpg", "jpeg", "webp"])

UPLOAD_FOLDER = os.path.join(os.path.abspath(os.curdir) + "/images")


@app.route("/new/album", methods = ["GET", "POST"])
def upload():
        if(request.method == "GET"):
                if("username" not in session):
                        return "<h1>Du måste vara inloggad</h1>"
                return render_template("edit_album.html")
        #Inkommande information
        country = request.form.get("country")
        city = request.form.get("city")
        date_start = datetime.strptime(request.form.get("date_start"), "%Y-%m-%d")
        date_end = datetime.strptime(request.form.get("date_end"), "%Y-%m-%d")

        #Fixa så man kollar om filer och information skickades med
        db = Database()
        cur = db.conn.cursor()
        user_id = get_user_id(session["username"])
        cur.execute("insert into album(owner, published, country, city, date_start, date_end) values(%s, %s, %s, %s, %s, %s) returning id", (user_id, datetime.utcnow(), country, city, date_start, date_end))
        album_id = cur.fetchone()[0]
        for key in request.files:
                file = request.files[key]
                if(validate_image(file)):
                        if(not os.path.exists(UPLOAD_FOLDER)):
                                print("Images folder don´t exist. Creating one..")
                                os.makedirs(UPLOAD_FOLDER)
                        #Laddar bild
                        img = Image.open(file.stream)
                        #Sparar som WebP format
                        filename = str(uuid4()) + ".webp"
                        while os.path.isfile(filename):
                                filename = str(uuid4()) + ".webp"
                        img.save(os.path.join(UPLOAD_FOLDER, secure_filename(filename)))
                        #index för bildens ordning i albumet || post1 blir index 1
                        index = key[-1]
                        #Bildens rubrik
                        headline = request.form.get("headline" + index)
                        #Bildens beskrivning
                        description = request.form.get("description" + index)
                        #Ladda upp till databas
                        cur.execute("insert into post(album, index, img_name, headline, description) values(%s, %s, %s, %s, %s)", (album_id, index, filename, headline, description))
        db.conn.commit()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route("/edit/album/<int:album_id>", methods = ["GET"])
def edit_album(album_id):
        if("username" not in session):
                return "<h1>Du måste vara inloggad</h1>"
        if(not owns_album(album_id, username=session["username"])):
                return "<h1>Du äger inte albumet eller så finns det inte</h1>"
        db = Database()
        cur = db.conn.cursor()
        #Hämtar information om album
        cur.execute("select country, city, date_start, date_end from album where id={}".format(album_id))
        album_info = cur.fetchone()
        #Hämtar information om alla bilder
        cur.execute("select img_name, headline, description from post where album={} order by index asc".format(album_id))
        posts = cur.fetchall()
        return render_template("edit_album.html", album_info=album_info, posts=posts)

def get_new_albums(limit=30):
        db = Database()
        cur = db.conn.cursor()
        #Hämtar information om nyligen uppladade bilder
        cur.execute("select album.city, album.country, person.firstname, person.lastname, post.img_name, person.username, album.id from ((album join post on album.id=post.album) join person on album.owner=person.id) where post.index=1 order by album.published desc limit %s", [limit])
        albums = cur.fetchall()
        return albums

def get_new_following_albums(limit=30, username=None):
        if(username is None):
                username = session["username"]
        db = Database()
        cur = db.conn.cursor()
        #Hämtar information om nyligen uppladade bilder från personer man följer
        cur.execute("select album.city, album.country, person.firstname, person.lastname, post.img_name, person.username from (((album join post on album.id=post.album) join person on album.owner=person.id) join follow on album.owner=follow.following) where follow.follower=(select id from person where username=%s) and post.index=1 order by album.published desc limit %s", (username, limit))
        albums = cur.fetchall()
        return albums


@app.route("/image/<image_id>", methods = ["GET"])
def uploaded_images(image_id):
    return send_from_directory(UPLOAD_FOLDER, image_id)


#Kollar så filen inte är tom och har rätt filendelse.
def validate_image(file):
        if(file.filename != ""):
                if(file and '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
                        return True
        return False

@app.route("/album/<album_id>")
def album(album_id):
        db = Database()
        cur = db.conn.cursor()
        #Hämtar information om album
        cur.execute("select country, city, date_start, date_end from album where id={}".format(album_id))
        album_info = cur.fetchone()
        #Hämtar information om alla bilder
        cur.execute("select img_name, headline, description from post where album={} order by index asc".format(album_id))
        posts = cur.fetchall()        
        return render_template("album.html", posts=posts, album_info=album_info)