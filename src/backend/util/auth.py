import bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

def generate_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


def token_required(fn):
    @jwt_required()
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_jwt_identity()
        return fn(*args, token=token, **kwargs)  
    return wrapper
