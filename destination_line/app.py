from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from config import Config

db = SQLAlchemy()
login = LoginManager()
bcrypt = Bcrypt()


def create_app(config_class=Config, create_db=False):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    login.init_app(app)
    login.login_view = "user.login"
    login.login_message = "You have to be logged in to visit that page!"
    login.login_message_category = "info"
    bcrypt.init_app(app)

    from .main.routes import bp_main
    from .album.routes import bp_album
    from .user.routes import bp_user

    app.register_blueprint(bp_main)
    app.register_blueprint(bp_album)
    app.register_blueprint(bp_user)

    if(create_db):
        with app.test_request_context():
            from destination_line.album import Album, Post
            from destination_line.user import User
            db.create_all()

    return app
