from flask import Blueprint, request, session, redirect, jsonify
import bcrypt
from Database import Databse

app = Blueprint("user", __name__, template_folder="templates")

@app.route("/request/<incomming_request>", methods = ["POST"])
def callback(incomming_request):
        if(incomming_request == "username_exists"):
                username = request.form.get("username")
                return jsonify(user_exists(username=username))
        elif(incomming_request == "email_exists"):
                email = request.form.get("email")
        return jsonify(user_exists(email=email))

@app.route("/login", methods = ["POST"])
def login():
        username = request.form.get("username")
        password = request.form.get("password")
        if(username.strip() and password.strip()):
                if(check_password(password, username = username)):
                        session.permanent = True
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
                if(create_user(firstname, lastname, username, email, password)):
                        session["username"] = username
                        return redirect("/")
                else:
                        return "Något gick fel"
        return "password stämmer inte överrens"

def create_user(firstname, lastname, username, email, password):
        ''' Skapar en ny användare '''
        if(firstname.strip() and lastname.strip() and username.strip() and email.strip() and password.strip()):
                if (not user_exists(username=username) and not user_exists(email=email)):
                        db = Databse()
                        password = bcrypt.hashpw(password.encode("utf8"), bcrypt.gensalt(12)).decode("utf8").replace("'", '"')
                        cur = db.conn.cursor()
                        cur.execute("insert into person(firstname, lastname, username, email, password) values (%s, %s, %s, %s, %s)", (firstname, lastname, username, email, password))
                        cur.close()
                        db.conn.commit()
                        return True
        return False
             
def user_exists(username=None, email=None):
        db = Databse()
        cur = db.conn.cursor()
        if(not username == None):
                cur.execute("select * from person where username = '{}'".format(username))
        elif(not email == None):
                cur.execute("select * from person where email = '{}'".format(email))
        else:
                return False
        row = cur.fetchone()
        cur.close()
        return row is not None


def check_password(password, username = None, email = None):
        ''' Kontrollerar användares lösenord '''
        db = Databse()
        cur = db.conn.cursor()
        if(not username == None and user_exists(username=username)):
                cur.execute("select password from person where username='{}'".format(username))
        elif(not email == None and user_exists(email=email)):
                cur.execute("select password from person where email='{}'".format(email))
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