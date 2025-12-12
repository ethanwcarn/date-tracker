from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_from_directory
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
import os
from config import DATABASE_URL, SECRET_KEY, UPLOAD_FOLDER, MAX_CONTENT_LENGTH, ALLOWED_EXTENSIONS

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
CORS(app)

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('static/images', exist_ok=True)

def get_db_connection():
    """Get database connection"""
    return psycopg2.connect(DATABASE_URL)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def require_login(f):
    """Decorator to require login"""
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# Routes
@app.route('/')
def index():
    """Landing page"""
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    if not first_name or not last_name:
        return jsonify({'error': 'First name and last name are required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if username exists
        cur.execute('SELECT id FROM users WHERE username = %s', (username,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'Username already exists'}), 400
        
        # Create user
        password_hash = generate_password_hash(password)
        cur.execute(
            'INSERT INTO users (username, password_hash, first_name, last_name) VALUES (%s, %s, %s, %s) RETURNING id',
            (username, password_hash, first_name, last_name)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        session['user_id'] = user_id
        session['username'] = username
        session['first_name'] = first_name
        session['last_name'] = last_name
        
        return jsonify({'message': 'Registration successful', 'user_id': user_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('SELECT id, username, password_hash, first_name, last_name FROM users WHERE username = %s', (username,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        session['user_id'] = user['id']
        session['username'] = user['username']
        session['first_name'] = user.get('first_name')
        session['last_name'] = user.get('last_name')
        
        return jsonify({
            'message': 'Login successful', 
            'user_id': user['id'],
            'first_name': user.get('first_name'),
            'last_name': user.get('last_name')
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/user', methods=['GET'])
@require_login
def get_user():
    """Get current user info"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT id, username, first_name, last_name FROM users WHERE id = %s', (session['user_id'],))
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if user:
            return jsonify({
                'user_id': user['id'],
                'username': user['username'],
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name'),
                'has_name': bool(user.get('first_name') and user.get('last_name'))
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile', methods=['PUT'])
@require_login
def update_user_profile():
    """Update user profile (first name, last name)"""
    user_id = session['user_id']
    data = request.get_json()
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    
    if not first_name or not last_name:
        return jsonify({'error': 'First name and last name are required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(
            'UPDATE users SET first_name = %s, last_name = %s WHERE id = %s RETURNING id, first_name, last_name',
            (first_name, last_name, user_id)
        )
        user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if user:
            session['first_name'] = user['first_name']
            session['last_name'] = user['last_name']
            return jsonify({
                'message': 'Profile updated successfully',
                'first_name': user['first_name'],
                'last_name': user['last_name']
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/dashboard')
def dashboard():
    """Dashboard page"""
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('dashboard.html')

@app.route('/calendar')
def calendar():
    """Calendar page"""
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('calendar.html')

@app.route('/api/dates', methods=['GET'])
@require_login
def get_dates():
    """Get all dates with optional filters"""
    user_id = session['user_id']
    activity_name = request.args.get('activity_name', '')
    location = request.args.get('location', '')
    rating = request.args.get('rating', '')
    date_day = request.args.get('date_day', '')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        query = '''SELECT d.*, 
                   COALESCE(NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''), u.username) as created_by_name,
                   COALESCE(NULLIF(TRIM(CONCAT(u2.first_name, ' ', u2.last_name)), ''), u2.username) as notes_edited_by_name
                   FROM dates d 
                   JOIN users u ON d.created_by = u.id 
                   LEFT JOIN users u2 ON d.notes_edited_by = u2.id 
                   WHERE 1=1'''
        params = []
        
        if activity_name:
            query += ' AND LOWER(d.activity_name) LIKE LOWER(%s)'
            params.append(f'%{activity_name}%')
        if location:
            query += ' AND LOWER(d.location) LIKE LOWER(%s)'
            params.append(f'%{location}%')
        if rating:
            query += ' AND d.rating = %s'
            params.append(int(rating))
        if date_day:
            query += ' AND d.date_day = %s'
            params.append(date_day)
        
        query += ' ORDER BY d.date_day DESC'
        
        cur.execute(query, params)
        dates = cur.fetchall()
        cur.close()
        conn.close()
        
        # Convert to list of dicts
        dates_list = [dict(date) for date in dates]
        
        # Get photos for each date
        for date in dates_list:
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute('SELECT id, filename, filepath FROM photos WHERE date_id = %s', (date['id'],))
            date['photos'] = [dict(photo) for photo in cur.fetchall()]
            cur.close()
            conn.close()
        
        return jsonify(dates_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dates/count', methods=['GET'])
@require_login
def get_dates_count():
    """Get total count of dates"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT COUNT(*) FROM dates')
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return jsonify({'count': count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dates', methods=['POST'])
@require_login
def create_date():
    """Create a new date"""
    user_id = session['user_id']
    data = request.get_json()
    
    activity_name = data.get('activity_name')
    location = data.get('location')
    date_day = data.get('date_day')
    rating = data.get('rating')
    notes = data.get('notes', '')
    
    if not activity_name or not location or not date_day:
        return jsonify({'error': 'Activity name, location, and date are required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # If notes are provided, set notes_edited_by to the creator
        notes_edited_by = user_id if notes and notes.strip() else None
        
        cur.execute(
            '''INSERT INTO dates (activity_name, location, date_day, rating, notes, created_by, notes_edited_by)
               VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *''',
            (activity_name, location, date_day, rating, notes, user_id, notes_edited_by)
        )
        new_date = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify(dict(new_date)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dates/<int:date_id>', methods=['GET'])
@require_login
def get_date(date_id):
    """Get a specific date with photos"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(
            '''SELECT d.*, 
               COALESCE(NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''), u.username) as created_by_name,
               COALESCE(NULLIF(TRIM(CONCAT(u2.first_name, ' ', u2.last_name)), ''), u2.username) as notes_edited_by_name
               FROM dates d 
               JOIN users u ON d.created_by = u.id 
               LEFT JOIN users u2 ON d.notes_edited_by = u2.id 
               WHERE d.id = %s''',
            (date_id,)
        )
        date = cur.fetchone()
        
        if not date:
            cur.close()
            conn.close()
            return jsonify({'error': 'Date not found'}), 404
        
        # Get photos
        cur.execute('SELECT id, filename, filepath FROM photos WHERE date_id = %s', (date_id,))
        photos = cur.fetchall()
        
        date_dict = dict(date)
        date_dict['photos'] = [dict(photo) for photo in photos]
        
        cur.close()
        conn.close()
        
        return jsonify(date_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dates/<int:date_id>', methods=['PUT'])
@require_login
def update_date(date_id):
    """Update a date"""
    user_id = session['user_id']
    data = request.get_json()
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if date exists
        cur.execute('SELECT created_by FROM dates WHERE id = %s', (date_id,))
        date = cur.fetchone()
        
        if not date:
            cur.close()
            conn.close()
            return jsonify({'error': 'Date not found'}), 404
        
        # Update date - always update all provided fields
        update_fields = []
        params = []
        
        # Always update these fields if provided
        if 'activity_name' in data:
            update_fields.append('activity_name = %s')
            params.append(data['activity_name'])
        if 'location' in data:
            update_fields.append('location = %s')
            params.append(data['location'])
        if 'date_day' in data:
            update_fields.append('date_day = %s')
            params.append(data['date_day'])
        if 'rating' in data:
            # Handle None/null rating
            update_fields.append('rating = %s')
            params.append(data['rating'] if data['rating'] is not None else None)
        if 'notes' in data:
            update_fields.append('notes = %s')
            params.append(data['notes'] if data['notes'] is not None else '')
            # Track who edited the notes
            update_fields.append('notes_edited_by = %s')
            params.append(user_id)
        
        if not update_fields:
            cur.close()
            conn.close()
            return jsonify({'error': 'No fields to update'}), 400
        
        update_fields.append('updated_at = CURRENT_TIMESTAMP')
        params.append(date_id)
        
        query = f'UPDATE dates SET {", ".join(update_fields)} WHERE id = %s RETURNING *'
        cur.execute(query, params)
        updated_date = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify(dict(updated_date)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dates/<int:date_id>', methods=['DELETE'])
@require_login
def delete_date(date_id):
    """Delete a date"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if date exists
        cur.execute('SELECT id FROM dates WHERE id = %s', (date_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'Date not found'}), 404
        
        # Delete date (photos will be deleted via CASCADE)
        cur.execute('DELETE FROM dates WHERE id = %s', (date_id,))
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'message': 'Date deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dates/<int:date_id>/photos', methods=['POST'])
@require_login
def upload_photo(date_id):
    """Upload a photo for a date"""
    user_id = session['user_id']
    
    if 'photo' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['photo']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    try:
        # Check if date exists
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT id FROM dates WHERE id = %s', (date_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'Date not found'}), 404
        
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filename = timestamp + filename
        filepath = os.path.join('static/images', filename)
        file.save(filepath)
        
        # Save to database (store relative path for serving)
        db_filepath = f'static/images/{filename}'
        cur.execute(
            'INSERT INTO photos (date_id, filename, filepath, uploaded_by) VALUES (%s, %s, %s, %s) RETURNING id',
            (date_id, file.filename, db_filepath, user_id)
        )
        photo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'id': photo_id,
            'filename': file.filename,
            'filepath': filepath
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/static/images/<filename>')
def uploaded_file(filename):
    """Serve uploaded images"""
    return send_from_directory('static/images', filename)

if __name__ == '__main__':
    # Enable debug mode for development to auto-reload templates
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

