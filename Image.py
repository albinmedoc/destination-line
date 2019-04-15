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
                return render_template("create_album.html")
        
        country = request.form.get("country")
        city = request.form.get("city")
        date_start = datetime.strptime(request.form.get("date_start"), "%Y-%m-%d")
        date_end = datetime.strptime(request.form.get("date_end"), "%Y-%m-%d")
        user_id = get_user_id(session["username"])
        #Fixa så man kollar om filer och information skickades med
        db = Database()
        cur = db.conn.cursor()
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
                        cur.execute("insert into post(album, index, img_name, text) values(%s, 1, %s, %s)", (album_id, filename, "This is Destination Lines first image."))
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
        cur.execute("select post.img_name from album join post on album.id=post.album where album.id={}".format(album_id))
        img_urls = cur.fetchall()
        for img_url in img_urls:
                print(img_url)
        return "<h1>Du äger albumet</h1>"


@app.route("/image/<image_id>", methods = ["GET"])
def uploaded_images(image_id):
    return send_from_directory(UPLOAD_FOLDER, image_id)


#Kollar så filen inte är tom och har rätt filendelse.
def validate_image(file):
        if(file.filename != ""):
                if(file and '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
                        return True
        return False