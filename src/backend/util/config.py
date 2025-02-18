import os
import datetime
import dotenv

dotenv.load_dotenv()

class Config:
    Gemini_API_KEY = os.getenv('GEMINI_API_KEY')
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'local')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=24)
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
