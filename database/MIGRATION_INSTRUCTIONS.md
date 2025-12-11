# Database Migration Instructions

To add the `notes_edited_by` tracking feature, you need to run a migration on your Supabase database.

## Option 1: Run the migration SQL (Recommended)

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run this SQL:

```sql
ALTER TABLE dates ADD COLUMN IF NOT EXISTS notes_edited_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
```

## Option 2: Re-run the full schema (WARNING: This will delete all data)

If you don't have important data yet, you can re-run the updated `schema.sql` file which now includes the `notes_edited_by` column.

**⚠️ WARNING: This will delete all existing dates, photos, and users!**

## What this does:

- Adds a `notes_edited_by` column to track who last edited the notes on each date
- When someone edits notes, their user ID is stored
- The frontend will display "Notes edited by USERNAME" when notes have been edited
- The frontend will display "Added by USERNAME" for who created each date

