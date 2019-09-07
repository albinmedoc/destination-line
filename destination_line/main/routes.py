from flask import Blueprint, render_template, session, current_app, g
import random
from destination_line.user import LoginForm, RegisterForm

bp_main = Blueprint("main", __name__)

@bp_main.before_request
def add_forms():
    # Lägg till formulär i global variabel
    g.login_form = LoginForm()
    g.register_form = RegisterForm()

@bp_main.errorhandler(404)
def error_404(e):
    #Visar 404-sidan
    return render_template("404.html"), 404

@bp_main.route("/")
def index():
    return render_template("index.html")

@bp_main.route("/info")
def about():
    #Hämat en random video
    video = random.choice(current_app.config["RANDOM_VIDEOS"])
    #Visar info sidan
    return render_template("info.html", video=video)