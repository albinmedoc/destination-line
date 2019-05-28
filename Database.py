import psycopg2
from sys import exit
from Credentials import DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER


class Database():

    def __init__(self):
        try:
            self.conn = psycopg2.connect(
                dbname=DATABASE_NAME, user=DATABASE_USER, host=DATABASE_HOST, password=DATABASE_PASSWORD)
        except:
            exit("Couldn´t connect to database...")

    def __del__(self):
        self.conn.close()
