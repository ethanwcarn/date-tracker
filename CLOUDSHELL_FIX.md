# Fix for CloudShell Deployment Error

## The Problem

The error is:
```
Invalid option specification (Namespace: 'aws:elasticbeanstalk:container:python', OptionName: 'StaticFiles'): Unknown configuration setting.
```

This is because the `.ebextensions/02_static_files.config` file uses an old configuration that doesn't work with Python 3.12 on Amazon Linux 2023.

## The Fix

You need to edit or remove the problematic configuration file in CloudShell.

### Option 1: Edit the File (Recommended)

In CloudShell, run:
```bash
nano .ebextensions/02_static_files.config
```

Replace the contents with:
```
# Static files are automatically served by Flask
# No additional configuration needed for Python 3.12 on Amazon Linux 2023
```

Save and exit:
- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

### Option 2: Delete the File

If you prefer, just delete it:
```bash
rm .ebextensions/02_static_files.config
```

### Then Try Again

After fixing the file, run:
```bash
eb create date-tracker-env
```

## Alternative: Create a New ZIP

If editing in CloudShell is difficult, you can:

1. **On your local computer**, I've already fixed the file
2. **Create a new ZIP** (excluding unnecessary files):
   ```powershell
   cd "C:\Users\carn0\Downloads\Side Project"
   # Create a clean ZIP without the material-dashboard folder
   Compress-Archive -Path app.py,config.py,Procfile,requirements.txt,templates,static,.ebextensions,database -DestinationPath date-tracker-clean.zip -Force
   ```
3. **Upload the new ZIP** to CloudShell
4. **Extract and deploy**:
   ```bash
   unzip -o date-tracker-clean.zip
   eb create date-tracker-env
   ```

## What I Fixed

I've updated `.ebextensions/02_static_files.config` on your local machine to remove the invalid `StaticFiles` configuration. Flask automatically serves static files from the `static/` folder, so no special configuration is needed.

