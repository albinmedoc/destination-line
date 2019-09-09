import secrets
import os
from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship, backref
from flask import current_app
from flask_login import UserMixin
from destination_line.app import db, login
from destination_line.album.utils import crop_to_1_1, crop_to_16_9

followers = db.Table("followers",
                     Column("follower_id", Integer, ForeignKey("person.id")),
                     Column("followed_id", Integer, ForeignKey("person.id"))
                     )

@login.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    __tablename__ = "person"
    id = Column(Integer, primary_key=True)
    firstname = Column(String(30), nullable=True)
    lastname = Column(String(50), nullable=True)
    username = Column(String(30), unique=True, nullable=True)
    email = Column(String(50), unique=True, nullable=True)
    password = Column(String(60), nullable=False)
    profile_img = Column(Text)
    background_img = Column(Text)
    biography = Column(String(100))
    albums = relationship("Album", back_populates="publisher")
    followed = relationship(
        "User", secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=backref("followers", lazy="dynamic"), lazy="dynamic")
    
    def delete(self):
        # Radera Album
        for album in self.albums:
            album.delete()

        # Radera profilbild och bakgrundsbild
        self.delete_profile_img()
        self.delete_background_img()

        db.session.delete(self)
        db.session.commit()
    
    def get_follower_count(self):
        return len(self.followers)

    def get_following_count(self):
        return len(self.followed)

    def set_profile_img(self, img):
        # Ta bort gammal profilbild
        self.delete_profile_img()

        # Plats vart bild ska sparas
        location = os.path.join(current_app.root_path, "static/profile_img")

        # Beskär bilden så den blir kvadratisk
        img = crop_to_1_1(img)

        # Kontrollerar ifall mappen där bilder ska sparas existeras
        if(not os.path.exists(location)):
            # Skapa mappen ifall den inte existerar
            os.makedirs(location)

        # Generarar unikt filnamn för profilbilden
        filename = secrets.token_hex(8) + ".png"
        while os.path.isfile(os.path.join(location, filename)):
            filename = secrets.token_hex(8) + ".png"

        # Sparar bilden
        img.save(os.path.join(location, filename))

        # Uppdaterar profile_img kolumnen till filnamnet bilden fick
        self.profile_img = filename
        db.session.commit()
    
    def delete_profile_img(self):
        if(self.profile_img):
            if(os.path.isfile(os.path.join(current_app.root_path, "static/profile_img", self.profile_img))):
                os.remove(os.path.join(current_app.root_path, "static/profile_img", self.profile_img))
            self.profile_img = None
            db.session.commit()

    def set_background_img(self, img):
        # Ta bort gammal bakgrundsbild
        self.delete_background_img()

        # Plats vart bild ska sparas
        location = os.path.join(current_app.root_path, "static/background_img")

        # Beskär bilden så den blir 16:9 format
        img = crop_to_16_9(img)

        # Kontrollerar ifall mappen där bilder ska sparas existeras
        if(not os.path.exists(location)):
            # Skapa mappen ifall den inte existerar
            os.makedirs(location)

        # Generarar unikt filnamn för profilbilden
        filename = secrets.token_hex(8) + ".png"
        while os.path.isfile(os.path.join(location, filename)):
            filename = secrets.token_hex(8) + ".png"

        # Sparar bilden
        img.save(os.path.join(location, filename))

        # Uppdaterar background_img kolumnen till filnamnet bilden fick
        self.background_img = filename
        db.session.commit()

    def delete_background_img(self):
        if(self.background_img):
            if(os.path.isfile(os.path.join(current_app.root_path, "static/background_img", self.background_img))):
                os.remove(os.path.join(current_app.root_path, "static/background_img", self.background_img))
            self.background_img = None
            db.session.commit()

    def convert_to_json(self):
        temp = {}
        temp["firstname"] = self.firstname
        temp["lastname"] = self.lastname
        temp["username"] = self.username
        temp["email"] = self.email
        temp["profile_img"] = self.profile_img
        return temp
