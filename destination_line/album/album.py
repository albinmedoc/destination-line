from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from destination_line.app import db

class Album(db.Model):
    __tablename__ = "album"
    id = Column(Integer, primary_key=True)
    publisher_id = Column(Integer, ForeignKey("person.id"))
    publisher = relationship("User", back_populates="albums")
    published = Column(DateTime, default=datetime.utcnow)
    country = Column(String(50))
    city = Column(String(60))
    date_start = Column(Date)
    date_end = Column(Date)
    posts = relationship("Post", back_populates="album")

    def get_preview_img(self):
        for post in self.posts:
            if(post.index == 0):
                return post.filename
        return None

    def delete(self):
        #Loopar igenom alla poster i album
        for post in self.posts:
            post.delete()
        
        db.session.remove(self)
        db.session.commit()

    def convert_to_json(self):
        temp = {}
        temp["id"] = self.id
        temp["country"] = self.country
        temp["city"] = self.city
        temp["firstname"] = self.publisher.firstname
        temp["lastname"] = self.publisher.lastname
        temp["username"] = self.publisher.username
        temp["preview_img"] = self.get_preview_img()
        return temp
