# Setup Instructions

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 2: Set Up Database

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL to create the tables

## Step 3: Configure Connection (if needed)

The connection string is already set in `config.py`. If you need to change it, edit the `DATABASE_URL` variable.

## Step 4: Run the Application

```bash
python app.py
```

The server will start on `http://localhost:5000`

## Step 5: Access the Website

1. Open your browser and go to `http://localhost:5000`
2. Create an account by clicking "Register"
3. Start adding dates!

## Making it Accessible on the Internet

To make your website accessible on the internet, you have several options:

### Option 1: Use ngrok (Quick Testing)
1. Download ngrok from https://ngrok.com
2. Run: `ngrok http 5000`
3. Use the provided URL to access your site

### Option 2: Deploy to a Cloud Service
- **Heroku**: Free tier available, easy Flask deployment
- **Railway**: Simple deployment with database support
- **Render**: Free tier with automatic deployments
- **PythonAnywhere**: Free tier for Python web apps

### Option 3: Use Your Own Server
- Set up a VPS (DigitalOcean, AWS, etc.)
- Install Python and dependencies
- Use a reverse proxy (nginx) with your domain
- Set up SSL with Let's Encrypt

## Notes

- Photos are stored in `static/images/` directory
- The app uses Flask sessions for authentication
- All dates are shared between users (you and your girlfriend can use the same account or create separate accounts)

