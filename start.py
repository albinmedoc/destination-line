from flask import Flask, session, render_template, request, url_for, redirect
from os import urandom

DEBUG_MODE = True
IP_ADDRESS = "localhost"

app = Flask(__name__)
app.secret_key = urandom(24)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods = ["POST"])
def login():
    username = request.args.get("username")
    password = request.args.get("password")
    
    # Kontrollerar så alla fält är ifyllda
    if(username.strip() and password.strip()):
        print("Giltligt")

@app.route("/register", methods = ["POST"])
def register():
    firstname = request.form.get("firstname")
    lastname = request.form.get("lastname")
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")

    # Kontrollerar så alla fält är ifyllda
    if(firstname.strip() and lastname.strip() and username.strip() and email.strip() and password.strip()):
        print("Giltligt")

@app.route("/timeline")
def timeline():
    return render_template("timeline.html")

if __name__ == "__main__":
    app.run(host= IP_ADDRESS, port=80, debug=DEBUG_MODE, threaded=True)
