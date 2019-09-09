import os
from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from flask import current_app
from destination_line.app import db

class Post(db.Model):
    __tablename__ = "post"
    index = Column(Integer, primary_key=True)
    filename = Column(Text)
    headline = Column(String(60))
    description = Column(String(2500))
    album_id = Column(Integer, ForeignKey("album.id"), primary_key=True)
    album = relationship("Album", back_populates="posts")

    def delete(self):
        filename = self.filename
        #Kollar om filen finns med filnamnet specifierat i posten
        if(os.path.isfile(os.path.join(current_app.root_path, "static/album_img", filename))):
            os.remove(os.path.join(current_app.root_path, "static/album_img", filename))
        
        db.session.delete(self)
        db.session.commit()