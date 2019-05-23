from flask import Blueprint, request, session, render_template, flash, redirect, jsonify, send_from_directory
import os
from uuid import uuid4
from werkzeug.utils import secure_filename
from PIL import Image
from Database import Database
from datetime import datetime
from User import get_user_id, owns_album
from Settings import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, POST_LIMIT

app = Blueprint("image", __name__, template_folder="templates")

@app.route("/request/infinite_albums", methods = ["POST"])
def infinite_albums():
        limit = 1 #Begränsning på hur många album som skickas vid scrollning
        offset = int(request.form.get("get_albums")) #Vilken rad i tabellen som SQL-query startar på
        flow_type = int(request.form.get("flow_type")) #Follow-flöde eller explore-flöde
        if flow_type == 1:
                return jsonify(get_albums=get_new_albums(limit, offset))
        elif flow_type == 2:
                return jsonify(get_albums=get_new_following_albums(limit, offset))


@app.route("/new/album", methods = ["GET", "POST"])
def upload():
        if(request.method == "GET"):
                if("username" not in session):
                        flash(u'You have to be logged in to visit this page', 'error')
                        return redirect("/")
                return render_template("edit_album.html")

        #Användaren laddar upp ett Album (POST)
        if(len(request.files) <= 0 or len(request.files) > POST_LIMIT):
                return jsonify(False), 413, {"ContentType":"application/json"}
        #Inkommande information
        country = request.form.get("country")
        city = request.form.get("city")
        date_start = datetime.strptime(request.form.get("date_start"), "%Y-%m-%d")
        date_end = datetime.strptime(request.form.get("date_end"), "%Y-%m-%d")
        db = Database()
        cur = db.conn.cursor()
        #Hämtar user_id från användarnamn
        user_id = get_user_id(session["username"])
        cur.execute("insert into album(owner, published, country, city, date_start, date_end) values(%s, %s, %s, %s, %s, %s) returning id", (user_id, datetime.utcnow(), country, city, date_start, date_end))
        album_id = cur.fetchone()[0]
        for key in request.files:
                file = request.files[key]
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
        flash(u'Your album has been uploaded!', 'success')
        return jsonify(album_id), 200, {"ContentType":"application/json"}

@app.route("/edit/album/<int:album_id>", methods = ["GET"])
def edit_album(album_id):
        if("username" not in session):
                flash(u'You have to be logged in to visit this page', 'error')
                return redirect("/")
        if(not owns_album(album_id, username=session["username"])):
                flash(u'You don´t own this album or it doesn´t exists!', 'error')
                return redirect("/")
        db = Database()
        cur = db.conn.cursor()
        #Hämtar information om album
        cur.execute("select country, city, date_start, date_end, id from album where id=%s", (album_id,))
        album_info = cur.fetchone()
        #Hämtar information om alla bilder
        cur.execute("select img_name, headline, description from post where album=%s order by index asc", (album_id,))
        posts = cur.fetchall()
        return render_template("edit_album.html", album_info=album_info, posts=posts)

def get_new_albums(limit=4, offset=None):
        db = Database()
        cur = db.conn.cursor()
        #Hämtar information om nyligen uppladade bilder
        cur.execute("select album.id, album.city, album.country, person.firstname, person.lastname, post.img_name, person.username from ((album join post on album.id=post.album) join person on album.owner=person.id) where post.index=1 order by album.published desc limit %s offset %s", (limit, offset))
        albums = cur.fetchall()
        return albums

def get_new_following_albums(limit=4, offset=None, username=None):
        if(username is None):
                username = session["username"]
        db = Database()
        cur = db.conn.cursor()
        #Hämtar information om nyligen uppladade bilder från personer man följer
        cur.execute("select album.id, album.city, album.country, person.firstname, person.lastname, post.img_name, person.username from (((album join post on album.id=post.album) join person on album.owner=person.id) join follow on album.owner=follow.following) where follow.follower=(select id from person where username=%s) and post.index=1 order by album.published desc limit %s offset %s", (username.lower(), limit, offset))
        albums = cur.fetchall()
        return albums


@app.route("/image/<image_id>", methods = ["GET"])
def uploaded_images(image_id):
    return send_from_directory(UPLOAD_FOLDER, image_id)


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
        if(original_size[0] < original_size[1]):
                box = (0, 0, original_size[0], original_size[0])
        else:
                box = (0, 0, original_size[1], original_size[1])
        cropped_img = img.crop(box)
        return cropped_img

@app.route("/album/<album_id>")
def album(album_id):
        db = Database()
        cur = db.conn.cursor()
        user_id = get_user_id(username=session["username"])
        #Hämtar information om album
        cur.execute("select album.country, album.city, album.date_start, album.date_end, person.firstname, person.lastname, album.owner from album join person on album.owner=person.id where album.id={}".format(album_id))
        album_info = cur.fetchone()
        #Hämtar information om alla bilder
        cur.execute("select img_name, headline, description, index from post where album={} order by index asc".format(album_id))
        posts = cur.fetchall()        
        return render_template("album.html", posts=posts, album_info=album_info, album_id=album_id, user_id=user_id)

@app.route("/upload_profile_img", methods = ["POST"])
def upload_profile_img():
        if "username" not in session:
                #Användaren är inte inloggad
                return jsonify(False)
        if "file" not in request.files:
                #Bild skickades ej med
                return jsonify(False)

        db = Database()
        cur = db.conn.cursor()

        #Lägger bilder i en variabel
        profile_img = request.files["file"]

        #Genererar ett namn för bilden, är namnet upptaget görs detta tills ett ledigt är funnet
        filename = str(uuid4()) + ".webp"
        while os.path.isfile(os.path.join(UPLOAD_FOLDER, secure_filename(filename))):
                filename = str(uuid4()) + ".webp"

        #Kontrollerar ifall mappen där bilder ska sparas existeras
        if(not os.path.exists(UPLOAD_FOLDER)):
                #Skapa mappen ifall den inte existerar
                os.makedirs(UPLOAD_FOLDER)

        #Beskär bilden så den blir kvadratisk
        profile_img = crop_to_1_1(Image.open(profile_img.stream))
        
        #Sparar bilden
        profile_img.save(os.path.join(UPLOAD_FOLDER, secure_filename(filename)))
        
        #Uppdaterar profile_img till filnamnet bilden fick
        cur.execute("update person set profile_img=%s where username=%s", [secure_filename(filename), session["username"]])
        db.conn.commit()
        cur.close()
        return jsonify(True), 200, {'ContentType':'application/json'}

@app.route("/delete/album/<album_id>", methods = ["GET"])
def delete_album(album_id):
        db = Database()
        cur = db.conn.cursor()
        user_id = get_user_id(username=session["username"])
        if owns_album(album_id, user_id=user_id):
                cur.execute("delete from post where album in (select id from album where id=%s)", [album_id])
                cur.execute("delete from album where id=%s", [album_id])
        db.conn.commit()
        flash(u'Your album was deleted!', 'success')
        return redirect("/")