import psycopg2
from sys import exit
#Hämtar databasuppgifter från Credentials.py
from Credentials import DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER


class Database():
    def __init__(self):
        #När classen initieras försöks en koppling till databasen att göras
        try:
            #Lyckades kopplingen att göras kan denna hämtas genom ".conn"
            self.conn = psycopg2.connect(dbname=DATABASE_NAME, user=DATABASE_USER, host=DATABASE_HOST, password=DATABASE_PASSWORD)
        except:
            #Gick det inte att ansluta till databasen stängs programmet av med ett meddelande
            exit("Couldn´t connect to database...")

    def __del__(self):
        #När classen inte längre används stängs kopplingen av
        self.conn.close()
