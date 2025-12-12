# Quick AWS Deployment Guide

This is a simplified step-by-step guide to deploy your Date Tracker to AWS Elastic Beanstalk (recommended - easiest option).

## Prerequisites

1. **AWS Account** - Sign up at https://aws.amazon.com
2. **AWS CLI** - Install from https://aws.amazon.com/cli/
3. **EB CLI** - Install with: `pip install awsebcli`

## Step-by-Step Deployment

### Step 1: Install EB CLI

Open PowerShell and run:
```powershell
python -m pip install awsebcli
```

### Step 2: Configure AWS CLI

```powershell
aws configure
```

You'll need:
- **AWS Access Key ID**: Get from AWS Console → IAM → Users → Your User → Security Credentials → Create Access Key
- **AWS Secret Access Key**: Same location as above
- **Default region**: `us-east-1` (or your preferred region)
- **Default output format**: `json`

### Step 3: Initialize Elastic Beanstalk

Navigate to your project directory:
```powershell
cd "C:\Users\carn0\Downloads\Side Project"
eb init
```

Follow the prompts:
- **Select a region**: Choose `us-east-1` (or your preferred region)
- **Application name**: `date-tracker` (or press Enter for default)
- **Platform**: Select `Python`
- **Platform version**: Choose `Python 3.11` or `3.12` (latest available)
- **SSH**: Type `y` (yes) - helpful for troubleshooting
- **Keypair**: Create a new keypair or select existing

This creates a `.elasticbeanstalk` folder with configuration.

### Step 4: Create Environment and Deploy

```powershell
eb create date-tracker-env
```

This will:
- Create an EC2 instance
- Set up load balancer
- Configure security groups
- Deploy your application

**⏱️ This takes 5-10 minutes. Be patient!**

### Step 5: Set Environment Variables

After the environment is created, set your configuration:

```powershell
# Generate a secure secret key first
$secretKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
Write-Host "Your secret key: $secretKey"
```

Then set the environment variables:
```powershell
eb setenv SECRET_KEY="paste-your-generated-secret-key-here" DATABASE_URL="postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres" FLASK_DEBUG="False"
```

### Step 6: Get Your Application URL

```powershell
eb status
```

Or simply:
```powershell
eb open
```

This will open your application in the browser! 🎉

### Step 7: Share the URL

The URL will look like: `http://date-tracker-env.eba-xxxxx.us-east-1.elasticbeanstalk.com`

Share this with your girlfriend!

## Updating Your Application

After making changes:

```powershell
# Commit your changes (if using Git)
git add .
git commit -m "Your update message"

# Deploy
eb deploy
```

## Useful Commands

```powershell
eb status          # Check environment status
eb health          # Check application health
eb logs            # View application logs
eb open            # Open application in browser
eb ssh             # SSH into the EC2 instance
eb terminate       # Delete environment (careful!)
```

## Troubleshooting

### Application Not Loading

1. Check logs:
   ```powershell
   eb logs
   ```

2. Check environment variables:
   ```powershell
   eb printenv
   ```

3. Check health:
   ```powershell
   eb health
   ```

### Static Files Not Loading

Elastic Beanstalk should handle this automatically, but if you have issues:
1. Check that all files in `static/` are committed to Git
2. Verify file permissions
3. Check logs for 404 errors

### Database Connection Issues

1. Verify `DATABASE_URL` is set correctly:
   ```powershell
   eb printenv
   ```

2. Check that your Supabase database allows connections from AWS IPs

### Common Issues

- **502 Bad Gateway**: Application might be crashing. Check logs with `eb logs`
- **404 Not Found**: Check that all files are committed and deployed
- **500 Internal Server Error**: Check application logs and environment variables

## Cost

- **Free Tier**: First 12 months includes 750 hours/month of t2.micro or t3.micro
- **After Free Tier**: ~$15-30/month depending on instance size
- **Load Balancer**: ~$16/month (included in some tiers)

## Next Steps (Optional)

1. **Custom Domain**: Configure a domain name in Route 53
2. **HTTPS**: Set up SSL certificate in AWS Certificate Manager
3. **Monitoring**: Set up CloudWatch alarms
4. **Backups**: Configure automated backups

## Alternative: EC2 Direct Deployment

If you prefer more control, see `DEPLOYMENT.md` for EC2 instructions. However, Elastic Beanstalk is recommended for easier management.

---

**Need Help?** Check the full deployment guide in `DEPLOYMENT.md` for more details.

