from flask_wtf import FlaskForm
from .utils import strip_filter

class Form(FlaskForm):
    class Meta:
        def bind_field(self, form, unbound_field, options):
            filters = unbound_field.kwargs.get("filters", [])
            filters.append(strip_filter)
            return unbound_field.bind(form=form, filters=filters, **options)
