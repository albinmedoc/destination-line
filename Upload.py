from flask import Blueprint, request, session, render_template, json
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(["pdf", "png", "jpg", "jpeg"])

app = Blueprint("upload", __name__, template_folder="templates")

@app.route("/upload", methods = ["GET", "POST"])
def upload():
        if(request.method == "GET"):
                if("username" not in session):
                        return "<h1>Du måste vara inloggad</h1>"
                return render_template("create_album.html")
        
        for key in request.files:
                file = request.files[key]
                if(validate_image(file)):
                        directory = os.path.join(os.path.abspath(os.curdir) + "/images")
                        if(not os.path.exists(directory)):
                                print("Images folder don´t exist. Creating one..")
                                os.makedirs(directory)
                        path = os.path.join(directory, secure_filename(file.filename))
                        print("Image saved to: " + path)
                        file.save(path)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

#Kollar så filen inte är tom och har rätt filendelse.
def validate_image(file):
        if(file.filename != ""):
                if(file and '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
                        return True
        return False