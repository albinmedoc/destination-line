from flask_wtf import FlaskForm
from wtforms import StringField, DateField, SubmitField, MultipleFileField
from wtforms.widgets import HiddenInput
from wtforms.validators import DataRequired

class AlbumForm(FlaskForm):
    country = StringField("Country", validators=[DataRequired()])
    city = StringField("City", validators=[DataRequired()])
    period = StringField("Date period")
    date_start = DateField("Date start", widget=HiddenInput())
    date_end = DateField("Date end", widget=HiddenInput())
    images = MultipleFileField("Images", render_kw={"accept": "image/*"})
    submit = SubmitField("Create Album")