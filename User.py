from flask import Blueprint, request, session, redirect, jsonify, flash, render_template
import bcrypt
from Database import Database
import os

app = Blueprint("user", __name__, template_folder="templates")

@app.route("/request/<incoming_request>", methods = ["POST"])
def callback(incoming_request):
        if(incoming_request == "username_exists"):
                #Skickar tillbaks True/False beroende på om användarnamnet finns
                username = request.form.get("username")
                return jsonify(user_exists(username=username))
        elif(incoming_request == "email_exists"):
                #Skickar tillbaks True/False beroende på om användarnamnet finns
                email = request.form.get("email")
                return jsonify(user_exists(email=email))
        elif(incoming_request == "follow" and "username" in session):
                user_id = get_user_id(username=session["username"])
                target_id = get_user_id(username=request.form.get("target_name"))
                setup_follow(user_id, target_id)
                return jsonify(True)
        elif(incoming_request == "search"):
                search = request.form.get("search")
                return jsonify(countries=get_countries(search), users=get_users(search))
        return jsonify(False)

@app.route("/profile")
@app.route("/profile/<username>")
def profile(username=None):
        # Kolla om användaren besöker sin egna profil, det kan göras i template
        if(username is None):
                #Kontrollerar om användaren är utloggad
                if("username" not in session):
                        #Visar felmeddelande
                        flash(u"You have to be logged in to visit your profile", 'error')
                        #Hänvisar användaren till förstasidan
                        return redirect("/")
                #Är användaren inloggad sätts variablen username till användarens användarnamn
                username = session["username"]
        #Kontrollerar om användaren existerar
        if(user_exists(username=username)):
                db = Database()
                cur = db.conn.cursor()
                cur.execute("select username, firstname, lastname, biography, background, id from person where username='{}'".format(username))
                user_info = cur.fetchone()
                #Kontrollerar så en rad hittades
                if(user_info is not None):
                        cur.execute("select * from follow join person on follow.follower=person.id where person.username=%s", [username])
                        following = cur.fetchall()
                        following_count = len(following)

                        cur.execute("select * from follow join person on follow.following=person.id where person.username=%s", [username])
                        followers = cur.fetchall()
                        follower_count = len(followers)

                        cur.execute("select count(*) from album where owner=%s", [user_info[5]])
                        album_count = cur.fetchone()
                        
                        #Visar profilsidan med informationen hämtad från databasen
                        return render_template("profile.html", user_info=user_info, album_count=album_count, following_count=following_count, follower_count=follower_count)
        #Kunde inte hitta information om användaren
        return "Could not find profile"

@app.route("/login", methods = ["POST"])
def login():
        username = request.form.get("username")
        password = request.form.get("password")
        #Kontrollerar så användarnamn och lösenord är ifyllda
        if(username.strip() and password.strip()):
                #Kontrollerar så användarnamnet och lösenorder matchar
                if(check_password(password, username = username)):
                        #Visar ett vällkommstmeddelande
                        flash(u'Welcome back!', 'success')
                        #Gör så användaren förblir inloggad
                        session.permanent = True
                        session["username"] = username
                        return jsonify(True)
        return jsonify(False)

@app.route("/logout")
def logout():
        #Rensa cookies och hänvisa till förstasidan
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
        #Kollar så lössenorden matchar
        if(password == password2):
                #Om det gick att skapa användare
                if(create_user(firstname, lastname, username, email, password)):
                        #Gör så användaren förblir inloggad
                        session.permanent = True
                        session["username"] = username
                        flash(u'Welcome to Destination Line', 'success')
                        return redirect("/")
                else:
                        return "Något gick fel"
        return "password stämmer inte överrens"

#Skapa en ny användare
def create_user(firstname, lastname, username, email, password):
        ''' Skapar en ny användare '''
        #Kollar så input-värdena inte är tomma
        if(firstname.strip() and lastname.strip() and username.strip() and email.strip() and password.strip()):
                #Kollar så användarnamnet och emailen inte redan finns registrerat
                if (not user_exists(username=username) and not user_exists(email=email)):
                        db = Database()
                        #Hashar lösenordet
                        password = bcrypt.hashpw(password.encode("utf8"), bcrypt.gensalt(12)).decode("utf8").replace("'", '"')
                        cur = db.conn.cursor()
                        #Läger in rad i tabellen person
                        cur.execute("insert into person(firstname, lastname, username, email, password) values (%s, %s, %s, %s, %s)", (firstname, lastname, username, email, password))
                        cur.close()
                        db.conn.commit()
                        return True
        return False

#Kolla om användare existerar             
def user_exists(username=None, email=None, user_id=None):
        db = Database()
        cur = db.conn.cursor()
        #Om användarnamn är angivet
        if(not username == None):
                cur.execute("select * from person where username = '{}'".format(username))
        #Om email är angivet
        elif(not email == None):
                cur.execute("select * from person where email = '{}'".format(email))
        #Om användarID är angivet
        elif(not user_id == None):
                cur.execute("select * from person where id = '{}'".format(user_id))
        else:
                return False
        row = cur.fetchone()
        cur.close()
        #Retunerar True ifall rad hittades, annars False
        return row is not None

#Kontrollera lösenord baserat på username eller email
def check_password(password, username = None, email = None, user_id=None):
        ''' Kontrollerar användares lösenord '''
        db = Database()
        cur = db.conn.cursor()
        #Om användarnamn är angivet och finns i databasen
        if(not username == None):
                cur.execute("select password from person where username='{}'".format(username))
        #Om email är angivet och finns i databasen
        elif(not email == None):
                cur.execute("select password from person where email='{}'".format(email))
        #Om användarID är angivet och finns i databasen
        elif(not user_id == None):
                cur.execute("select password from person where id='{}'".format(user_id))
        else:
                return False
        #Hämtar det hashade lösenordet från databasen
        hashpassword = cur.fetchone()
        if(hashpassword is not None):
                #Retunerar True/False beroende på om det stämmer överrens eller inte
                return bcrypt.checkpw(password.encode("utf8"), hashpassword[0].replace('"', "'").encode("utf8"))
        return False

#Hämta användarens id från username eller email
def get_user_id(username=None, email=None):
        db = Database()
        cur = db.conn.cursor()
        #Om användarnamn är angivet och finns i databasen
        if(not username == None and user_exists(username=username)):
                cur.execute("select id from person where username='{}'".format(username))
        #Om email är angivet och finns i databasen
        elif(not email == None and user_exists(email=email)):
                cur.execute("select id from person where email='{}'".format(email))
        else:
                return None
        id = cur.fetchone()[0]
        cur.close()
        if(id is not None):
                return int(id)
        return None

#Kontrollerar om angiven användare äger angivet album
def owns_album(album_id, username=None, email=None, user_id=None):
        db = Database()
        cur = db.conn.cursor()
        if(username is not None):
                cur.execute("select exists(select * from album join person on album.owner=person.id where person.username=%s and album.id=%s)", (username, album_id))
        elif(email is not None):
                cur.execute("select exists(select * from album join person on album.owner=person.id where person.email=%s and album.id=%s)", (email, album_id))
        elif(user_id is not None):
                cur.execute("select exists(select * from album where album.owner=%s and album.id=%s)", (user_id, album_id))
        else:
                return False
        return cur.fetchone()[0]

@app.route("/settings")
def settings():
        return render_template("settings.html")
        
def setup_follow(user_id, target_id):
        db = Database()
        cur = db.conn.cursor()
        #Lägger till följnings-koppling mellan två personer
        cur.execute("insert into follow(follower, following) values(%s, %s)", (user_id, target_id))
        db.conn.commit()

def get_countries(search):
        db = Database()
        cur = db.conn.cursor()
        cur.execute("select album.id, album.owner, country, city, concat(firstname,' ', lastname) from album join person on album.owner=person.id where country LIKE '{}%' or city LIKE '{}%'".format(search,search))
        search_results = cur.fetchall()
        print(search)
        print(search_results)
        return search_results

def get_users(search):
        db = Database()
        cur = db.conn.cursor()
        cur.execute("select id, username, firstname, lastname from person where username LIKE '{}%' or firstname LIKE '{}%' or lastname LIKE '{}%'".format(search,search,search))
        search_results = cur.fetchall()
        print(search)
        print(search_results)
        return search_results

@app.route("/test/<username>")
def delete_user(user_id=None, username=None):
        db = Database()
        cur = db.conn.cursor()
        if(username is not None):
                user_id = get_user_id(username=username)

        
        cur.execute("select post.img_name from album join post on album.id=post.album where album.owner=%s", [user_id])
        images= cur.fetchall()
        print(images)
        for image in images:
                if(os.path.exists("images/" + image[0])):
                        os.remove("images/" + image[0])
        
        cur.execute("delete from follow where follower=%s", [user_id])
        cur.execute("delete from follow where following=%s", [user_id])
        cur.execute("delete from post where album in (select id from album where owner=%s)", [user_id])
        cur.execute("delete from album where owner=%s", [user_id])
        cur.execute("delete from person where id=%s", [user_id])

        db.conn.commit()
        cur.close()
        return "id:" + str(user_id) + " username:" + username

@app.route("/update_user_information_form", methods=['POST'])
def settings_update():
        db = Database()
        cur = db.conn.cursor()
        change_username= request.form.get ('username')
        change_firstname= request.form.get ('firstname')
        change_lastname= request.form.get ('lastname')
        change_biography= request.form.get ('biography')
        change_email= request.form.get ('email')
        change_password= request.form.get ('password')
        cur.execute("update person(firstname, lastname, username, email, password) values (%s, %s, %s, %s, %s)", (change_firstname, change_lastname, change_username, change_biography, change_email, change_password))
        cur.close()
        db.conn.commit()
        return redirect("/")
