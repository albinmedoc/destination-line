from flask import Blueprint, request, session, redirect, jsonify, flash, render_template
import bcrypt
from Database import Database

app = Blueprint("user", __name__, template_folder="templates")

@app.route("/request/<incomming_request>", methods = ["POST"])
def callback(incomming_request):
        if(incomming_request == "username_exists"):
                #Skickar tillbaks True/False beroende på om användarnamnet finns
                username = request.form.get("username")
                return jsonify(user_exists(username=username))
        elif(incomming_request == "email_exists"):
                #Skickar tillbaks True/False beroende på om användarnamnet finns
                email = request.form.get("email")
                return jsonify(user_exists(email=email))
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
                cur.execute("select username, firstname, lastname, biography, background from person where username='{}'".format(username))
                user_info = cur.fetchone()
                #Kontrollerar så en rad hittades
                if(user_info is not None):
                        #Visar profilsidan med informationen hämtad från databasen
                   return render_template("profile.html", user_info=user_info)
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
        if(not username == None and user_exists(username=username)):
                cur.execute("select password from person where username='{}'".format(username))
        #Om email är angivet och finns i databasen
        elif(not email == None and user_exists(email=email)):
                cur.execute("select password from person where email='{}'".format(email))
        #Om användarID är angivet och finns i databasen
        elif(not user_id == None and user_exists(user_id=user_id)):
                cur.execute("select password from person where id='{}'".format(user_id))
        else:
                #Användaren hittades inte
                return False

        #Hämtar det hashade lösenordet från databasen
        hashpassword = cur.fetchone()[0].replace('"', "'").encode("utf8")
        cur.close()
        if(hashpassword is not None):
                #Retunerar True/False beroende på om det stämmer överrens eller inte
                return bcrypt.checkpw(password.encode("utf8"), hashpassword)
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
        #Om användarnamn eller email eller användarID är angivet
        if(username != None or email != None or user_id != None):
                #Hämtar id för ägaren över albummet
                cur.execute("select owner from album where id='{}'".format(int(album_id)))
                owner_id = cur.fetchone()[0]
                #Om ingen ägare hittades eller albummet inte finns
                if(owner_id is None):
                        return False
                owner_id = int(owner_id)
                #Om användarID är angivet och finns i databasen
                if(not user_id == None and user_exists(user_id=user_id)):
                        #Retunerar True ifall användarID stämmer överrens med albummets ägare
                        return int(user_id) == owner_id
                elif(not username == None and user_exists(username=username)):
                        return int(get_user_id(username=username)) == owner_id
                #Om email är angivet och finns i databasen
                elif(not email == None and user_exists(email=email)):
                        return int(get_user_id(email=email)) == owner_id
        return False

@app.route("/settings")
def settings():
        return render_template("settings.html")