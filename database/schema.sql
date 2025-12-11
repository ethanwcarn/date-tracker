-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS dates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create dates table
CREATE TABLE dates (
    id SERIAL PRIMARY KEY,
    activity_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_day DATE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    notes_edited_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create photos table
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    date_id INTEGER REFERENCES dates(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_dates_date_day ON dates(date_day);
CREATE INDEX idx_dates_created_by ON dates(created_by);
CREATE INDEX idx_photos_date_id ON photos(date_id);

