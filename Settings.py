import os

#Host to run server
SERVER_IP = "192.168.1.18"
SERVER_PORT = 8080

#Run server in debug-mode (True/False)
DEBUG_MODE = True

#Path to folder where uploaded images will be stored
UPLOAD_FOLDER = os.path.join(os.path.abspath(os.curdir) + "/images")

#Allowed extensions for uploaded images
ALLOWED_EXTENSIONS = set(["png", "jpg", "jpeg", "webp"])

#Count limit for images in an album
POST_LIMIT = 50

#List for random videos
RANDOM_VIDEOS = ["bali", "greece", "newzealand"]