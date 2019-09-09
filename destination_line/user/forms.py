from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import Email, DataRequired, EqualTo, Length, ValidationError
from flask_login import current_user
from destination_line.main.form import Form, make_lower
from destination_line.user import User
from destination_line.app import bcrypt

class LoginForm(Form):
    username = StringField("Username", validators=[DataRequired(), Length(max=30)], filters=[make_lower])
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


class RegisterForm(Form):
    firstname = StringField("Firstname", validators=[DataRequired(), Length(max=30)])
    lastname = StringField("Lastname", validators=[DataRequired(), Length(max=50)])
    username = StringField("Username", validators=[DataRequired(), Length(max=30)], filters=[make_lower])
    email = StringField("Email", validators=[Email(), DataRequired(), Length(max=50)], filters=[make_lower])
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

class SettingsForm(Form):
    firstname = StringField("Firstname", validators=[DataRequired(), Length(max=30)])
    lastname = StringField("Lastname", validators=[DataRequired(), Length(max=50)])
    username = StringField("Username", validators=[DataRequired(), Length(max=30)], filters=[make_lower])
    email = StringField("Email", validators=[Email(), DataRequired(), Length(max=50)], filters=[make_lower])
    new_password = PasswordField("New password", validators=[EqualTo("confirm_password")])
    confirm_new_password = PasswordField("Confirm new password")
    old_password = PasswordField("Current password", validators=[DataRequired()])
    biography = StringField("Biography", validators=[Length(max=100)])
    submit = SubmitField("Save")

    def validate(self):
        if(not current_user.is_authenticated):
            raise ValidationError("You have to be logged in to make changes to your settings.")

    def validate_username(self, username):
        if(not username.data == current_user.username):
            user = User.query.filter_by(username=username.data).first()
            if(user):
                raise ValidationError("That username is already taken.")
        