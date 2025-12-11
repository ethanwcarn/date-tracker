# Date Tracker Website

A personal website for tracking dates with your partner.

## Features

- User authentication (login/registration)
- Dashboard with future and past dates
- Filter dates by name, location, rating, and date
- Full CRUD operations for dates
- Photo uploads for each date
- Calendar view
- Live counter of total dates

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up the database schema in Supabase (run `database/schema.sql`)

3. Update the connection string in `config.py` if needed

4. Run the Flask server:
```bash
python app.py
```

5. Open `http://localhost:5000` in your browser

## Project Structure

- `app.py` - Flask backend server
- `config.py` - Configuration and database connection
- `database/schema.sql` - Database schema
- `static/` - CSS, JavaScript, and uploaded images
- `templates/` - HTML templates
- `uploads/` - Directory for uploaded photos

