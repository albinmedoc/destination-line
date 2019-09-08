from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import Email, DataRequired, EqualTo, ValidationError
from destination_line.user import User
from destination_line.app import bcrypt

class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Login")

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if(not user):
            raise ValidationError("That username does not exist.")
    
    def validate_password(self, password):
        user = User.query.filter_by(username=self.username.data).first()
        if(user and not bcrypt.check_password_hash(user.password, password.data)):
            raise ValidationError("That password doesn´t match the username.")


class RegisterForm(FlaskForm):
    firstname = StringField("Firstname", validators=[DataRequired()])
    lastname = StringField("Lastname", validators=[DataRequired()])
    username = StringField("Username", validators=[DataRequired()])
    email = StringField("Email", validators=[Email(), DataRequired()])
    password = PasswordField("Password", validators=[DataRequired(), EqualTo("confirm_password")])
    confirm_password = PasswordField("Confirm password", validators=[DataRequired()])
    submit = SubmitField("Register")

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if(user):
            raise ValidationError("That username is already taken.")
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if(user):
            raise ValidationError("That email is already taken.")
        