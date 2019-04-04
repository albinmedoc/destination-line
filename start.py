import psycopg2, User
from flask import Flask, session, render_template, request, url_for, redirect
from os import urandom
from sys import exit
try:
        conn = psycopg2.connect(dbname="destinationline", user="pi", host="destinationline.ml", password="DestinationLine")
except:
        exit("Could not connect to database...")

DEBUG_MODE = True
IP_ADDRESS = "localhost"

app = Flask(__name__)
app.secret_key = urandom(24)

@app.route("/")
def index():
        return render_template("index.html")

@app.route("/login", methods = ["POST"])
def login():
        username = request.form.get("username")
        password = request.form.get("password")
        
        # Kontrollerar så alla fält är ifyllda
        if(username.strip() and password.strip()):
                if(User.check_password(password, username = username)):
                        return "<h1>Inloggad</h1>"
                return "<h1>Fel inloggningsuppgifter</h1>"
        return "<h1>Fyll i alla fälten</h1>"

@app.route("/register", methods = ["POST"])
def register():
        firstname = request.form.get("firstname")
        lastname = request.form.get("lastname")
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        password2 = request.form.get("password2")
        if(password == password2):
                User.create_user(firstname, lastname, username, email, password)

@app.route("/profile/<username>")
def profile(username):
        # Kolla om användaren besöker sin egna profil
        return render_template("profile.html")

@app.route("/timeline")
def timeline():
        return render_template("timeline.html")

if __name__ == "__main__":
        app.run(host = IP_ADDRESS, port = 80, debug = DEBUG_MODE, threaded = True)
        conn.close()
