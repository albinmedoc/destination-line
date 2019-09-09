def strip_filter(value):
    if value is not None and hasattr(value, 'strip'):
        return value.strip()
    return value

def make_lower(s):
    if isinstance(s, str):
        s = s.lower()
    return s