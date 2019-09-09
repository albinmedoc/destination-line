from sqlalchemy import or_
from flask import Blueprint, request, redirect, render_template, flash, url_for, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from PIL import Image
from destination_line.user import User, LoginForm, RegisterForm
from destination_line.app import bcrypt, db

bp_user = Blueprint("user", __name__)

@bp_user.route("/upload_profile_img", methods=["POST"])
@login_required
def upload_profile_img():
    img = Image.open(request.files["file"].stream)
    current_user.set_profile_img(img)
    flash(u"Your profile image has been changed!")
    return jsonify(True), 200, {"ContentType": "application/json"}   

@bp_user.route("/upload_background_img", methods=["POST"])
@login_required
def upload_background_img():
    img = Image.open(request.files["file"].stream)
    current_user.set_background_img(img)
    flash(u"Your background image has been changed!")
    return jsonify(True), 200, {"ContentType": "application/json"}   


@bp_user.route("/profile")
@bp_user.route("/profile/<username>")
def profile(username=None):
    # Kolla om användaren vill besöka sin egna profil
    if(username is None):
        # Kontrollerar om användaren är utloggad
        if(not current_user.is_authenticated):
            # Visar felmeddelande
            flash(u"Please login to visit your own profile", 'error')
            # Hänvisar användaren till förstasidan
            return redirect(url_for("main.index"))
        # Är användaren inloggad sätts variablen user till användaren
        user = current_user
    else:
        # Hämtar användaren från det specifierade användarnamnet
        user = User.query.filter_by(username=username).first()
        if(not user):
            # Användaren hittades inte
            flash(u'This user does not exist in our database :/', 'error')
            return redirect(url_for("main.index"))
    return render_template("profile.html", user=user)


@bp_user.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if(form.validate_on_submit()):
        user = User.query.filter_by(username=form.username.data).first()
        login_user(user, remember=True)
        next_page = request.args.get("next")
        return redirect(next_page) if next_page else redirect(url_for("main.index"))
    return render_template("login_register.html", form=form, login=True)


@bp_user.route("/logout")
def logout():
    # Logga ut användare och hänvisa till förstasidan
    logout_user()
    return redirect(url_for("main.index"))


@bp_user.route("/register", methods=["GET", "POST"])
def register():
    form = RegisterForm()
    if(form.validate_on_submit()):
        hashed_password = bcrypt.generate_password_hash(
            form.password.data).decode("utf-8")
        user = User(firstname=form.firstname.data,
                    lastname=form.lastname.data, username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        login_user(user, remember=True)
        flash(u'Welcome to Destination Line', 'success')
        return redirect(url_for("main.index"))
    return render_template("login_register.html", form=form, login=False)

@bp_user.route("/delete_account")
@login_required
def delete_account():
    current_user.delete()
    logout_user()
    flash(u'Your account has been deleted', 'success')
    return redirect(url_for("main.index"))

@bp_user.route("/settings")
@login_required
def settings():
    return render_template("settings.html")

@bp_user.route("/follow/<int:user_id>")
@login_required
def follow(user_id):
    followed = User.query.get(user_id)
    if(not followed):
        flash(u"User not found", "danger")
        return redirect(url_for("main.index"))
    if(followed not in current_user.followed):
        current_user.followed.append(followed)
        db.session.commit()
        flash(u"You are now following " + followed.firstname + " " + followed.lastname + ".", "success")
    else:
        flash(u"You was already following " + followed.firstname + " " + followed.lastname + ".", "success")
    return redirect(url_for("user.profile", username=followed.username))

@bp_user.route("/unfollow/<int:user_id>")
@login_required
def unfollow(user_id):
    followed = User.query.get(user_id)
    if(not followed):
        flash(u"User not found", "danger")
        return redirect(url_for("main.index"))
    if(followed in current_user.followed):
        current_user.followed.remove(followed)
        db.session.commit()
        flash(u"You are no longer following " + followed.firstname + " " + followed.lastname + ".", "success")
    else:
        flash(u"You was not following " + followed.firstname + " " + followed.lastname + ".", "success")
    return redirect(url_for("user.profile", username=followed.username))

@bp_user.route("/search/users", methods=["POST", "GET"])
def search_users():
    search = request.values.get("search")
    if(not search):
        return jsonify(False), 400, {"ContentType": "application/json"}
    search = search + "%"
    results = User.query.filter(or_(User.firstname.ilike(search), User.lastname.ilike(search), User.username.ilike(search), User.email.ilike(search))).limit(5).all()
    if(not results):
        return jsonify(False), 204, {"ContentType": "application/json"}
    # Gör om användarna till json format
    data = []
    for user in results:
        data.append(user.convert_to_json())
    return jsonify(data)
    