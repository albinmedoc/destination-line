from flask import Blueprint, request, session, render_template

app = Blueprint("upload", __name__, template_folder="templates")

@app.route("/upload", methods = ["GET", "POST"])
def upload():
    if(request.method == "GET"):
        if("username" not in session):
                return "<h1>Du måste vara inloggad</h1>"
        return render_template("create_album.html")
    for file in request.files:
        print("hejsan")