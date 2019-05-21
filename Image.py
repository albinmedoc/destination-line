from flask import Blueprint, request, session, render_template, flash, redirect, json, send_from_directory
import os
from uuid import uuid4
from werkzeug.utils import secure_filename
from PIL import Image
from Database import Database
from datetime import datetime
from User import get_user_id, owns_album
from Settings import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, POST_LIMIT

app = Blueprint("image", __name__, template_folder="templates")


@app.route("/new/album", methods = ["GET", "POST"])
def upload():
        if(request.method == "GET"):
                if("username" not in session):
                        flash(u'You have to be logged in to visit this page', 'success')
                        return redirect("/")
                return render_template("edit_album.html")

        #Användaren laddar upp ett Album (POST)
        if(len(request.files) <= 0 or len(request.files) > POST_LIMIT):
                return False
        #Inkommande information
        country = request.form.get("country")
        city = request.form.get("city")
        date_start = datetime.strptime(request.form.get("date_start"), "%Y-%m-%d")
        date_end = datetime.strptime(request.form.get("date_end"), "%Y-%m-%d")
        db = Database()
        cur = db.conn.cursor()
        user_id = get_user_id(session["username"])
        cur.execute("insert into album(owner, published, country, city, date_start, date_end) values(%s, %s, %s, %s, %s, %s) returning id", (user_id, datetime.utcnow(), country, city, date_start, date_end))
        album_id = cur.fetchone()[0]
        for key in request.files:
                file = request.files[key]
                if(validate_image(file)):
                        if(not os.path.exists(UPLOAD_FOLDER)):
                                os.makedirs(UPLOAD_FOLDER)
                        #Laddar bild
                        img = crop_to_16_9(Image.open(file.stream))

                        #Sparar som WebP format
                        filename = str(uuid4()) + ".webp"
                        while os.path.isfile(os.path.join(UPLOAD_FOLDER, secure_filename(filename))):
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
        cur.execute("select album.id, album.city, album.country, person.firstname, person.lastname, post.img_name, person.username from ((album join post on album.id=post.album) join person on album.owner=person.id) where post.index=1 order by album.published desc limit %s", [limit])
        albums = cur.fetchall()
        return albums

def get_new_following_albums(limit=30, username=None):
        if(username is None):
                username = session["username"]
        db = Database()
        cur = db.conn.cursor()
        #Hämtar information om nyligen uppladade bilder från personer man följer
        cur.execute("select album.id, album.city, album.country, person.firstname, person.lastname, post.img_name, person.username from (((album join post on album.id=post.album) join person on album.owner=person.id) join follow on album.owner=follow.following) where follow.follower=(select id from person where username=%s) and post.index=1 order by album.published desc limit %s", (username.lower(), limit))
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

def crop_to_16_9(img):
        original_size = img.size
        if(original_size[0] * 9 == original_size[1] * 16):
                return img
        width = original_size[0]
        height = original_size[0] * 9 / 16
        upper = (original_size[1] - height) / 2
        box = (0, upper, width, upper + height)
        cropped_img = img.crop(box)
        return cropped_img

def crop_to_1_1(img):
        original_size = img.size
        if(original_size[0] * 1 == original_size[1] * 1):
                return img
        width = original_size[0]
        height = original_size[0] * 1
        upper = (original_size[1] - height) / 2
        box = (0, upper, width, upper + height)
        cropped_img = img.crop(box)
        return cropped_img

@app.route("/album/<album_id>")
def album(album_id):
        db = Database()
        cur = db.conn.cursor()
        #Hämtar information om album
        cur.execute("select album.country, album.city, album.date_start, album.date_end, person.firstname, person.lastname from album join person on album.owner=person.id where album.id={}".format(album_id))
        album_info = cur.fetchone()
        #Hämtar information om alla bilder
        cur.execute("select img_name, headline, description, index from post where album={} order by index asc".format(album_id))
        posts = cur.fetchall()        
        return render_template("album.html", posts=posts, album_info=album_info)

@app.route("/upload_profile_img", methods = ["POST"])
def upload_profile_img():
        if "username" not in session:
                print("Inte inloggad")
                return "Gick ej"
        print(request.file)
        if "file" not in request.file:
                print("2")
                return "Gick ej"
        db = Database()
        cur = db.conn.cursor()   
        profile_img = request.file["file"]  
        if profile_img == "":
                print("3")
                return "Gick ej"
        filename = str(uuid4()) + ".webp"
        while os.path.isfile(os.path.join(UPLOAD_FOLDER, secure_filename(filename))):
                filename = str(uuid4()) + ".webp"
        profile_img = crop_to_1_1(profile_img)
        profile_img.save(os.path.join(UPLOAD_FOLDER, secure_filename(filename))) 
        cur.execute("update person set profile_img=%s where username=%s", [secure_filename(filename), session["username"]])
        db.conn.commit()
        cur.close()
        return "Gick"


