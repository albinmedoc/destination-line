from flask import Blueprint, request, session, redirect, jsonify, flash, render_template
import bcrypt
from Database import Database
import os
from werkzeug.utils import secure_filename
from Settings import UPLOAD_FOLDER, ALLOWED_EXTENSIONS

app = Blueprint("user", __name__, template_folder="templates")


@app.route("/request/<incoming_request>", methods=["POST"])
def callback(incoming_request):
    if(incoming_request == "username_exists"):
        # Skickar tillbaks True/False beroende på om användarnamnet finns
        username = request.form.get("username")
        return jsonify(user_exists(username=username))
    elif(incoming_request == "email_exists"):
        # Skickar tillbaks True/False beroende på om användarnamnet finns
        email = request.form.get("email")
        return jsonify(user_exists(email=email))
    elif(incoming_request == "follow" and "username" in session):
        user_id = get_user_id(username=session["username"])
        target_id = get_user_id(username=request.form.get("target_name"))
        setup_follow(user_id, target_id)
        return jsonify(True)
    elif(incoming_request == "unfollow" and "username" in session):
        user_id = get_user_id(username=session["username"])
        target_id = get_user_id(username=request.form.get("target_name"))
        delete_follow(user_id, target_id)
        return jsonify(True)
    elif(incoming_request == "search"):
        search = request.form.get("search")
        return jsonify(destinations=get_countries(search), users=get_users(search))
    elif(incoming_request == "check_password"):
        password = request.form.get("password")
        return jsonify(check_password(password, username=session["username"]))
    elif (incoming_request == "change_settings"):
        return jsonify(change_settings(request.form))


@app.route("/profile")
@app.route("/profile/<username>")
def profile(username=None):
    # Kolla om användaren besöker sin egna profil, det kan göras i template
    if(username is None):
        # Kontrollerar om användaren är utloggad
        if("username" not in session):
            # Visar felmeddelande
            flash(u"You have to be logged in to visit your profile", 'error')
            # Hänvisar användaren till förstasidan
            return redirect("/")
        # Är användaren inloggad sätts variablen username till användarens användarnamn
        username = session["username"]
    # Kontrollerar om användaren existerar
    if(user_exists(username=username)):
        db = Database()
        cur = db.conn.cursor()
        cur.execute(
            "select username, firstname, lastname, biography, profile_img, background_img, id from person where username='{}'".format(username))
        user_info = cur.fetchone()
        # Kontrollerar så en rad hittades
        if(user_info is not None):
            following_count = get_following_count(username, cur)
            follower_count = get_follower_count(username, cur)
            # Hämtar följa personer
            cur.execute("select person.username, person.profile_img from follow join person on follow.following=person.id where follow.follower=%s", [
                        user_info[6]])
            followings = cur.fetchall()

            # Hämtar personer som följer
            cur.execute("select person.username, person.profile_img from follow join person on follow.follower=person.id where follow.following=%s", [
                        user_info[6]])
            followers = cur.fetchall()

            cur.execute(
                "select count(*) from album where owner=%s", [user_info[6]])
            album_count = cur.fetchone()

            cur.execute(
                "select album.id, album.country, album.city, post.img_name, album.date_start, album.date_end from (person join album on person.id=album.owner) join post on album.id = post.album where post.index=1 and person.username=%s order by album.date_start", [username])
            albums = cur.fetchall()

            if("username" in session):
                cur.execute("select * from follow where follower=%s and following=%s",
                            (get_user_id(username=session["username"]), get_user_id(username=username)))
                is_following = cur.fetchone() is not None
            else:
                is_following = False

            # Visar profilsidan med informationen hämtad från databasen
            return render_template("profile.html", user_info=user_info, album_count=album_count, followers=followers, followings=followings, albums=albums, is_following=is_following)
    # Kunde inte hitta information om användaren
    flash(u'Couldn´t find profile!', 'error')
    return redirect("/")


@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    # Kontrollerar så användarnamn och lösenord är ifyllda
    if(username.strip() and password.strip()):
        # Kontrollerar så användarnamnet och lösenorder matchar
        if(check_password(password, username=username)):
            # Visar ett vällkommstmeddelande
            flash(u'Welcome back!', 'success')
            # Gör så användaren förblir inloggad
            session.permanent = True
            session["username"] = username
            return jsonify(True)
    return jsonify(False)


@app.route("/logout")
def logout():
    # Rensa cookies och hänvisa till förstasidan
    session.clear()
    return redirect("/")


@app.route("/register", methods=["POST"])
def register():
    firstname = request.form.get("firstname")
    lastname = request.form.get("lastname")
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")
    password2 = request.form.get("password2")
    # Kollar så lössenorden matchar
    if(password == password2):
        # Om det gick att skapa användare
        if(create_user(firstname, lastname, username, email, password)):
            # Gör så användaren förblir inloggad
            session.permanent = True
            session["username"] = username
            flash(u'Welcome to Destination Line', 'success')
            return jsonify(True)
        else:
            return "Något gick fel"
    return "password stämmer inte överrens"

# Skapa en ny användare


def create_user(firstname, lastname, username, email, password):
    ''' Skapar en ny användare '''
    # Kollar så input-värdena inte är tomma
    if(firstname.strip() and lastname.strip() and username.strip() and email.strip() and password.strip()):
        # Gör så för- och efternamn får första bokstaven versal och resten gemener
        firstname = firstname.capitalize()
        lastname = lastname.capitalize()
        # Gör alla bokstäver i username och email till gemener
        username = username.lower()
        email = email.lower()
        # Kollar så användarnamnet och emailen inte redan finns registrerat
        if (not user_exists(username=username) and not user_exists(email=email)):
            db = Database()
            # Hashar lösenordet
            password = bcrypt.hashpw(password.encode(
                "utf8"), bcrypt.gensalt(12)).decode("utf8").replace("'", '"')
            cur = db.conn.cursor()
            # Läger in rad i tabellen person
            cur.execute("insert into person(firstname, lastname, username, email, password) values (%s, %s, %s, %s, %s)",
                        (firstname, lastname, username, email, password))
            cur.close()
            db.conn.commit()
            return True
    return False

# Kolla om användare existerar


def user_exists(username=None, email=None, user_id=None):
    db = Database()
    cur = db.conn.cursor()
    # Om användarnamn är angivet
    if(not username == None):
        cur.execute("select * from person where username= %s",
                    [username.lower()])
    # Om email är angivet
    elif(not email == None):
        cur.execute("select * from person where email=%s", [email.lower()])
    # Om användarID är angivet
    elif(not user_id == None):
        cur.execute("select * from person where id = '{}'".format(user_id))
    else:
        return False
    row = cur.fetchone()
    cur.close()
    # Retunerar True ifall rad hittades, annars False
    return row is not None

# Kontrollera lösenord baserat på username eller email


def check_password(password, username=None, email=None, user_id=None):
    ''' Kontrollerar användares lösenord '''
    db = Database()
    cur = db.conn.cursor()
    # Om användarnamn är angivet och finns i databasen
    if(not username == None):
        cur.execute("select password from person where username=%s", [
                    username.lower()])
    # Om email är angivet och finns i databasen
    elif(not email == None):
        cur.execute("select password from person where email=%s",
                    [email.lower()])
    # Om användarID är angivet och finns i databasen
    elif(not user_id == None):
        cur.execute("select password from person where id='{}'".format(user_id))
    else:
        return False
    # Hämtar det hashade lösenordet från databasen
    hashpassword = cur.fetchone()
    if(hashpassword is not None):
        # Retunerar True/False beroende på om det stämmer överrens eller inte
        return bcrypt.checkpw(password.encode("utf8"), hashpassword[0].replace('"', "'").encode("utf8"))
    return False

# Hämta användarens id från username eller email


def get_user_id(username=None, email=None):
    db = Database()
    cur = db.conn.cursor()
    # Om användarnamn är angivet och finns i databasen
    if(not username == None and user_exists(username=username)):
        cur.execute("select id from person where username=%s",
                    [username.lower()])
    # Om email är angivet och finns i databasen
    elif(not email == None and user_exists(email=email)):
        cur.execute("select id from person where email=%s", [email.lower()])
    else:
        return None
    id = cur.fetchone()[0]
    cur.close()
    if(id is not None):
        return int(id)
    return None

# Kontrollerar om angiven användare äger angivet album


def owns_album(album_id, username=None, email=None, user_id=None):
    db = Database()
    cur = db.conn.cursor()
    if(username is not None):
        cur.execute("select exists(select * from album join person on album.owner=person.id where person.username=%s and album.id=%s)",
                    (username.lower(), album_id))
    elif(email is not None):
        cur.execute("select exists(select * from album join person on album.owner=person.id where person.email=%s and album.id=%s)",
                    (email.lower(), album_id))
    elif(user_id is not None):
        cur.execute(
            "select exists(select * from album where album.owner=%s and album.id=%s)", (user_id, album_id))
    else:
        return False
    return cur.fetchone()[0]


@app.route("/settings")
def settings():
    if("username" not in session):
        flash(u"You have to be logged in to visit settings page", 'error')
        return redirect("/")
    db = Database()
    cur = db.conn.cursor()
    username = session["username"]
    cur.execute("select username, firstname, lastname, biography, email, background_img, profile_img from person where username=%s", [
                username.lower()])
    profile_info = cur.fetchone()
    return render_template("settings.html", profile_info=profile_info)


def change_settings(new_settings):
    db = Database()
    cur = db.conn.cursor()
    if("current_password" not in new_settings or not check_password(new_settings["current_password"], username=session["username"])):
        return False

    if("new_username" in new_settings and not user_exists(username=new_settings["new_username"])):
        cur.execute("update person set username=%s where username=%s", [
                    new_settings["new_username"], session["username"]])
        session["username"] = new_settings["new_username"]
    if("new_firstname" in new_settings):
        cur.execute("update person set firstname=%s where username=%s", [
                    new_settings["new_firstname"], session["username"]])
    if("new_lastname" in new_settings):
        cur.execute("update person set lastname=%s where username=%s", [
                    new_settings["new_lastname"], session["username"]])
    if("new_biography" in new_settings):
        cur.execute("update person set biography=%s where username=%s", [
                    new_settings["new_biography"], session["username"]])
    if("new_email" in new_settings and not user_exists(email=new_settings["new_email"])):
        cur.execute("update person set email=%s where username =%s", [
                    new_settings["new_email"], session["username"]])
    if("new_password" in new_settings):
        password = bcrypt.hashpw(new_settings["new_password"].encode(
            "utf8"), bcrypt.gensalt(12)).decode("utf8").replace("'", '"')
        cur.execute("update person set password=%s where username=%s", [
                    password, session["username"]])
    db.conn.commit()
    cur.close()
    flash(u'Your changes have been updated', 'success')
    return True


def setup_follow(user_id, target_id):
    db = Database()
    cur = db.conn.cursor()
    # Lägger till följnings-koppling mellan två personer
    cur.execute(
        "insert into follow(follower, following) values(%s, %s)", (user_id, target_id))
    db.conn.commit()


def delete_follow(user_id, target_id):
    db = Database()
    cur = db.conn.cursor()
    # LTar bort följnings-koppling mellan två personer
    cur.execute(
        "delete from follow where follower=%s and following=%s", (user_id, target_id))
    db.conn.commit()


def get_countries(search):
    db = Database()
    cur = db.conn.cursor()
    cur.execute("select album.id, album.owner, album.country, album.city, concat(person.firstname, ' ', person.lastname), post.img_name from ((album join post on album.id=post.album) join person on album.owner=person.id) where post.index=1 and (lower(country) LIKE lower('{}%') or lower(city) LIKE lower('{}%')) limit 5".format(search, search))
    search_results = cur.fetchall()
    return search_results


def get_users(search):
    db = Database()
    cur = db.conn.cursor()
    cur.execute("select id, username, firstname, lastname, profile_img from person where lower(username) LIKE lower('{}%') or lower(firstname) LIKE lower('{}%') or lower(lastname) LIKE lower('{}%') limit 5".format(search, search, search))
    search_results = cur.fetchall()
    return search_results


@app.route("/delete_account")
def delete_user(user_id=None):
    db = Database()
    cur = db.conn.cursor()
    user_id = get_user_id(username=session["username"])
    # Hämtar användarID ifall username är angivet

    # Hämtar alla filnamn för uppladdade bilder från användaren
    cur.execute(
        "select post.img_name from album join post on album.id=post.album where album.owner=%s", [user_id])
    filenames = cur.fetchall()
    # Loopar igenom alla filnamn och raderar dem
    for filename in filenames:
        if(os.path.isfile(os.path.join(UPLOAD_FOLDER, secure_filename(filename[0])))):
            os.remove(os.path.join(UPLOAD_FOLDER,
                                   secure_filename(filename[0])))

    # Raderar allt sparat om användaren från databasen
    cur.execute("delete from follow where follower=%s", [user_id])
    cur.execute("delete from follow where following=%s", [user_id])
    cur.execute(
        "delete from post where album in (select id from album where owner=%s)", [user_id])
    cur.execute("delete from album where owner=%s", [user_id])
    cur.execute("delete from person where id=%s", [user_id])
    db.conn.commit()
    session.clear()
    flash(u'Your account has been deleted', 'success')
    return redirect("/")

# Hämtar antalet användare som användaren följer


def get_following_count(username, cur):
    cur.execute(
        "select * from follow join person on follow.follower=person.id where person.username=%s", [username.lower()])
    following = cur.fetchall()
    return len(following)

# Hämtar antalet användare som följer användaren


def get_follower_count(username, cur):
    cur.execute(
        "select * from follow join person on follow.following=person.id where person.username=%s", [username.lower()])
    followers = cur.fetchall()
    return len(followers)


def get_creators():
    daniel = ("Daniel Subasic", "97danne97", "#", "#")
    albin = ("Albin Médoc", "albinmedoc", "#", "#")
    anders = ("Anders Mantarro", "anders mantarro", "#", "#")
    hanna = ("Hanna Bengtsson", "hannaidabengtsson", "https://www.instagram.com/waterblessings/?hl=sv",
             "https://www.facebook.com/hanna.bengtsson.779")
    elin = ("Elin Andersson", "elinandersson", "#", "#")

    creators = (daniel, albin, anders, hanna, elin)
    return creators
