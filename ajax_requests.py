from flask import Blueprint, request, jsonify
import User

app = Blueprint("ajax", __name__, template_folder="templates")

@app.route("/request", methods = ["POST"])
def callback():
    incomming_request = request.form.get("request")
    if(incomming_request == "username_exists"):
        username = request.form.get("username")
        return jsonify(User.user_exists(username=username))
    elif(incomming_request == "email_exists"):
        email = request.form.get("email")
        return jsonify(User.user_exists(email=email))
    return "Inga värden"