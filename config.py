import os
from dotenv import load_dotenv

load_dotenv()

# Database connection string (using connection pooling for IPv6 compatibility)
# Get from environment variable or use default
DATABASE_URL = os.environ.get('DATABASE_URL', "postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres")

# Direct connection URL (port 5432) - use this for migrations if needed
DIRECT_URL = os.environ.get('DIRECT_URL', "postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:5432/postgres")

# Flask configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production-please-update')
UPLOAD_FOLDER = 'uploads'
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Production settings
DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

