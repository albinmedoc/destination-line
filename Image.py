from flask import Blueprint, request, session, render_template, json, send_from_directory
import os
from uuid import uuid4
from werkzeug.utils import secure_filename
from PIL import Image

app = Blueprint("image", __name__, template_folder="templates")

ALLOWED_EXTENSIONS = set(["pdf", "png", "jpg", "jpeg"])

UPLOAD_FOLDER = os.path.join(os.path.abspath(os.curdir) + "/images")


@app.route("/upload", methods = ["GET", "POST"])
def upload():
        if(request.method == "GET"):
                if("username" not in session):
                        return "<h1>Du måste vara inloggad</h1>"
                return render_template("create_album.html")
        
        print(request.form.get("country"))
        print(request.form.get("city"))
        print(request.form.get("date_start"))
        print(request.form.get("date_end"))
        for key in request.files:
                file = request.files[key]
                if(validate_image(file)):
                        if(not os.path.exists(UPLOAD_FOLDER)):
                                print("Images folder don´t exist. Creating one..")
                                os.makedirs(UPLOAD_FOLDER)
                        #Laddar bild
                        img = Image.open(file.stream)
                        #Sparar som WebP format
                        filename = str(uuid4())
                        while os.path.isfile(filename + ".webp"):
                                filename = str(uuid4())
                        img.save(os.path.join(UPLOAD_FOLDER, secure_filename(filename + ".webp")))

        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route("/image/<image_id>", methods = ["GET"])
def uploaded_images(image_id):
    return send_from_directory(UPLOAD_FOLDER, image_id)


#Kollar så filen inte är tom och har rätt filendelse.
def validate_image(file):
        if(file.filename != ""):
                if(file and '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
                        return True
        return False