# Troubleshooting Deployment Error

## The Issue

The environment was created successfully, but the application failed to deploy on the instance. We need to check the logs to see what went wrong.

## Step 1: Check Logs

In CloudShell, run:

```bash
eb logs
```

This will download the logs. Look for error messages, especially:
- Python import errors
- Missing dependencies
- Database connection errors
- Application startup errors

## Step 2: Check Specific Log Files

You can also check specific log files:

```bash
eb ssh
```

Then inside the instance:
```bash
sudo tail -100 /var/log/eb-engine.log
sudo tail -100 /var/log/eb-hooks.log
sudo tail -100 /var/log/web.stdout.log
```

Press `exit` to leave the SSH session.

## Common Issues and Fixes

### Issue 1: Missing Dependencies

If you see import errors, check `requirements.txt` includes all packages.

### Issue 2: Database Connection

If database connection fails, verify:
- `DATABASE_URL` environment variable is set
- Supabase allows connections from AWS IPs

### Issue 3: Application Startup Error

Check if `app.py` has any syntax errors or issues.

### Issue 4: Missing Environment Variables

Make sure you set:
- `SECRET_KEY`
- `DATABASE_URL`
- `FLASK_DEBUG=False`

## Step 3: Set Environment Variables (If Not Done)

If you haven't set environment variables yet:

```bash
# Generate secret key
python3 -c "import secrets; print(secrets.token_hex(32))"

# Set environment variables (replace with your secret key)
eb setenv SECRET_KEY="your-secret-key-here" DATABASE_URL="postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres" FLASK_DEBUG="False"
```

## Step 4: Check Application Health

```bash
eb health
```

## Step 5: View Recent Events

```bash
eb events
```

This shows recent events and may reveal the error.

## Quick Fix: Retry Deployment

Sometimes a retry works:

```bash
eb deploy
```

This will redeploy the current version.

## If All Else Fails

1. **Terminate and recreate:**
   ```bash
   eb terminate date-tracker-env
   # Wait for termination to complete
   eb create date-tracker-env
   ```

2. **Check requirements.txt** - Make sure all dependencies are listed

3. **Verify Procfile** - Should be: `web: gunicorn app:app`

