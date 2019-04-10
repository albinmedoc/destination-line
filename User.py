import bcrypt
from start import conn

def create_user(firstname, lastname, username, email, password):
        ''' Skapar en ny användare '''
        if(firstname.strip() and lastname.strip() and username.strip() and email.strip() and password.strip()):
                if (not user_exists(username=username) and not user_exists(email=email)):
                        password = bcrypt.hashpw(password.encode("utf8"), bcrypt.gensalt(12)).decode("utf8").replace("'", '"')
                        cur = conn.cursor()
                        cur.execute("insert into person(firstname, lastname, username, email, password) values (%s, %s, %s, %s, %s)", (firstname, lastname, username, email, password))
                        #Kontrollera ifall det lyckades
                        cur.close()
                        conn.commit()
                        return True
                        #Sätt session ifall det lyckades
        return False
                
             
def user_exists(username=None, email=None):
        cur = conn.cursor()
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
        cur = conn.cursor()
        if(not username == None):
                cur.execute("select password from person where username='{}'".format(username))
        elif(not email == None):
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