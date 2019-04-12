from flask import Blueprint, request, session, render_template, json

ALLOWED_EXTENSIONS = set(["pdf", "png", "jpg", "jpeg"])

app = Blueprint("upload", __name__, template_folder="templates")

@app.route("/upload", methods = ["GET", "POST"])
def upload():
        if(request.method == "GET"):
                if("username" not in session):
                        return "<h1>Du måste vara inloggad</h1>"
                return render_template("create_album.html")
        for file in request.files:
                #Kolla så filendelsen stämmer (jpg, png, mm)
                if(validate_image(request.files[file])):
                        print(request.files[file].filename)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

def validate_image(file):
        if(file.filename != ""):
                if(file and '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
                        return True
        return False

