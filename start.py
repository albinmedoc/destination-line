# coding: UTF-8
import psycopg2
from flask import Flask, flash, session, render_template, request, url_for, redirect, jsonify
from os import urandom
from sys import argv
import User, Image, ajax_requests

DEBUG_MODE = True

app = Flask(__name__)
app.secret_key = urandom(24)

@app.route("/")
def index():
        flash(u'Welcome to Destination Line', 'success')
        flash(u'controll your information', 'error')
        flash(u'This website uses cookies', 'cookie')
        return render_template("index.html")

@app.route("/login", methods = ["POST"])
def login():
        username = request.form.get("username")
        password = request.form.get("password")
        
        
        if(username.strip() and password.strip()):
                if(User.check_password(password, username = username)):
                        session["username"] = username
                        return jsonify(True)
        return jsonify(False)

@app.route("/logout")
def logout():
        session.clear()
        return redirect("/")

@app.route("/register", methods = ["POST"])
def register():
        firstname = request.form.get("firstname")
        lastname = request.form.get("lastname")
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        password2 = request.form.get("password2")
        if(password == password2):
                if(User.create_user(firstname, lastname, username, email, password)):
                        session["username"] = username
                        return redirect("/")
                else:
                        return "Något gick fel"
        return "password stämmer inte överrens"

@app.route("/profile/<username>")
def profile(username):
        # Kolla om användaren besöker sin egna profil
        return render_template("profile.html")

@app.route("/timeline")
def timeline():
        return render_template("timeline.html")

if __name__ == "__main__":
        if(len(argv) > 1 and argv[1].lower() == "server"):
                ipaddress = "192.168.1.18"
        else:
                ipaddress = "localhost"
        #Importera routes från ajax_request.py
        app.register_blueprint(ajax_requests.app)
        app.register_blueprint(Image.app)
        
        app.run(host = ipaddress, port = 80, debug = DEBUG_MODE, threaded = True)
