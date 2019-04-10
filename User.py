import bcrypt
from start import conn

def create_user(firstname, lastname, username, email, password):
        ''' Skapar en ny användare '''
        if(firstname.strip() and lastname.strip() and username.strip() and email.strip() and password.strip()):
                cur = conn.cursor()
                if (validate_username(username) and validate_email(email)):
                        password = bcrypt.hashpw(password.encode("utf8"), bcrypt.gensalt(12)).decode("utf8").replace("'", '"')
                        cur.execute("insert into person(firstname, lastname, username, email, password) values (%s, %s, %s, %s, %s)", (firstname, lastname, username, email, password))
                        #Kontrollera ifall det lyckades
                        cur.close()
                        conn.commit()
                        return True
                        #Sätt session ifall det lyckades
        return False
                
             
def validate_username(username):
        cur = conn.cursor()
        cur.execute("select * from person where username = '{}'".format(username))
        validates = cur.fetchone()
        print(validates)
        if validates == None:
                return True



def validate_email(email):
        cur = conn.cursor()
        cur.execute("select * from person where email = '{}'".format(email))
        validates = cur.fetchone()
        print(validates)
        if validates == None:
                return True
    


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