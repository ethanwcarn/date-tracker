-- Add notes_edited_by column to track who last edited the notes
ALTER TABLE dates ADD COLUMN IF NOT EXISTS notes_edited_by INTEGER REFERENCES users(id) ON DELETE SET NULL;

