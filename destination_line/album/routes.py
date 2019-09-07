import secrets
import os
from sqlalchemy import or_
from flask import Blueprint, render_template, flash, redirect, url_for, request, jsonify, current_app
from flask_login import current_user, login_required
from PIL import Image
from destination_line.user import User
from destination_line.album import Album, Post, AlbumForm
from destination_line.album.utils import crop_to_16_9
from destination_line.app import db

bp_album = Blueprint("album", __name__)

@bp_album.route("/new/album", methods=["GET", "POST"])
@bp_album.route("/edit/album/<int:album_id>", methods=["GET", "POST"])
@login_required
def manage_album(album_id=None):
    form = AlbumForm()
    # --- GET method ---
    if(request.method == "GET"):
        # /edit/album
        if(album_id):
            # Hämtar album
            album = Album.query.filter_by(id=album_id).first()
            # Kollar om album existerar
            if(not album):
                flash(u"The album was not found.")
                return redirect(url_for("main.index"))

            # Kollar om användaren äger albummet
            if(album not in current_user.albums):
                flash(u"You don't own this album and can´t edit it.")
                return redirect(url_for("main.index"))
            return render_template("manage_album.html", form=form, album=album)
        # /new/album
        return render_template("manage_album.html", form=form)
    
    # --- POST method ---
    if(not form.validate_on_submit()):
        return jsonify(False), 400, {"ContentType": "application/json"}

    # /edit/album
    if(album_id):
        # Hämtar album
        album = Album.query.filter_by(id=album_id).first()
        # Kollar om album existerar och om användaren äger albummet
        if(not album or album not in current_user.albums):
            return jsonify(False), 403, {"ContentType": "application/json"}
        
        # Raderar nuvarande poster
        for post in album.posts:
            post.delete()
    # /new/album
    else:
        album = Album(publisher=current_user, country=form.country.data, city=form.city.data,
                    date_start=form.date_start.data, date_end=form.date_end.data)
        db.session.add(album)

    # Plats vart bilder ska sparas
    location = os.path.join(current_app.root_path, "static/album_img")

    # Kontrollerar ifall mappen där bilder ska sparas existeras
    if(not os.path.exists(location)):
        # Skapa mappen ifall den inte existerar
        os.makedirs(location)

    for key in request.files:
        file = request.files[key]
        # Laddar bild
        img = crop_to_16_9(Image.open(file.stream))

        # Generera unikt filnamn
        filename = secrets.token_hex(8) + ".png"
        while os.path.isfile(os.path.join(location, filename)):
            filename = secrets.token_hex(8) + ".png"

        # Sparar som WebP format
        img.save(os.path.join(location, filename))

        # index för bildens ordning i albumet || post1 blir index 1
        index = key[4:]
        # Bildens rubrik
        headline = request.form.get("headline" + index)
        # Bildens beskrivning
        description = request.form.get("description" + index)

        # Skapa Post objekt
        post = Post(album=album, filename=filename, headline=headline, description=description, index=index)
        db.session.add(post)
        db.session.commit()
    return jsonify(album.id), 200, {"ContentType": "application/json"}   

@bp_album.route("/album/<int:album_id>")
def visit_album(album_id):
    # Hämtar album
    album = Album.query.filter_by(id=album_id).first()
    # Kollar om album existerar
    if(not album):
        flash(u"The album was not found.")
        return redirect(url_for("main.index"))
    return render_template("album.html", album=album)

@login_required
@bp_album.route("/delete/album/<int:album_id>")
def delete_album(album_id):
    # Hämtar album
    album = Album.query.filter_by(id=album_id).first()
    # Kollar om album existerar
    if(not album):
        flash(u"The album was not found.")

    # Kollar om användaren äger albummet
    elif(album not in current_user.albums):
        flash(u"You don't own this album and can´t delete it.")
    
    # Albumet finns och användaren äger det
    else:
        album.delete()
        flash(u'Your album was deleted!', 'success')
    
    return redirect(url_for("main.index"))

@bp_album.route("/load_albums", methods=["POST"])
def load_albums():
    follow = request.values.get("follow", default="false").lower() in ["true", "1"]
    page = request.values.get("page", default=1, type=int)
    albums = Album.query.order_by(Album.published.desc())
    if(follow):
        if(not current_user.is_authenticated):
            return jsonify(False), 403, {"ContentType": "application/json"}
        albums = albums.join(Album.publisher).filter(User.id.in_(p.id for p in current_user.followed))
    albums = albums.paginate(page, current_app.config["PER_PAGE"], False)
    # Gör om albummen till json format
    data = []
    for album in albums.items:
        data.append(album.convert_to_json())
    return jsonify(data)

@bp_album.route("/search/albums", methods=["POST"])
def search_albums():
    search = request.values.get("search")
    if(not search):
        return jsonify(False), 400, {"ContentType": "application/json"}
    search = search + "%"
    results = Album.query.filter(or_(Album.country.ilike(search), Album.city.ilike(search))).limit(5).all()
    if(not results):
        return jsonify(False), 204, {"ContentType": "application/json"}
    # Gör om albummen till json format
    data = []
    for album in results:
        data.append(album.convert_to_json())
    return jsonify(data)