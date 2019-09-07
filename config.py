import os

class Config(object):
    CSRF_ENABLED = True
    SECRET_KEY = os.urandom(24)

    #Database
    SQLALCHEMY_DATABASE_URI = "sqlite:///site.db"

    # Count limit for images in an album
    POST_LIMIT = 50

    # Album count per infinity scroll request
    PER_PAGE = 10

    # List for random videos
    RANDOM_VIDEOS = ["bali", "greece", "newzealand"]

    # Info about destinationline team
    TEAM = [
        {
            "name": "Albin Médoc",
            "title": "Creator",
            "destinationline": "albinmedoc",
            "instagram": "albinmedoc",
            "tublr": None,
            "twitter": None,
        },
        {
            "name": "Daniel Subasic",
            "title": "Creator",
            "destinationline": "danielsubasic",
            "instagram": None,
            "tublr": None,
            "twitter": None,
        },
        {
            "name": "Anders Mantarro",
            "title": "Creator",
            "destinationline": "andersmantarro",
            "instagram": None,
            "tublr": None,
            "twitter": None,
        },
        {
            "name": "Hanna Bengtsson",
            "title": "Creator",
            "destinationline": "hannabengtsson",
            "instagram": "waterblessings",
            "tublr": None,
            "twitter": None,
        },
        {
            "name": "Elin Andersson",
            "title": "Creator",
            "destinationline": "elinandersson",
            "instagram": None,
            "tublr": None,
            "twitter": None,
        }
    ]
    