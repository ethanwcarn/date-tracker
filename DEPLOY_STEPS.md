# 🚀 Deploy Date Tracker to AWS - Step by Step

Follow these steps to get your app online so your girlfriend can see it!

## 📋 Before You Start

You'll need:
- ✅ AWS Account (sign up at https://aws.amazon.com - free tier available)
- ✅ Your project files ready
- ✅ About 15-20 minutes

---

## Step 1: Install AWS Tools

Open PowerShell and run:

```powershell
# Install AWS CLI (if not already installed)
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi
# Or use winget:
winget install Amazon.AWSCLI

# Install Elastic Beanstalk CLI
python -m pip install awsebcli
```

**Verify installation:**
```powershell
aws --version
eb --version
```

---

## Step 2: Configure AWS Credentials

1. **Get AWS Access Keys:**
   - Go to https://console.aws.amazon.com
   - Click your username (top right) → **Security credentials**
   - Scroll to **Access keys** → **Create access key**
   - Choose **Command Line Interface (CLI)**
   - Click **Create access key**
   - **IMPORTANT**: Download the CSV file or copy both keys immediately (you won't see them again!)

2. **Configure AWS CLI:**
   ```powershell
   aws configure
   ```
   
   Enter:
   - **AWS Access Key ID**: Paste from step 1
   - **AWS Secret Access Key**: Paste from step 1
   - **Default region**: `us-east-1` (or your preferred region)
   - **Default output format**: `json`

---

## Step 3: Navigate to Your Project

```powershell
cd "C:\Users\carn0\Downloads\Side Project"
```

---

## Step 4: Initialize Elastic Beanstalk

```powershell
eb init
```

**Answer the prompts:**

1. **Select a region**: Choose `us-east-1` (or your preferred region)
2. **Application name**: Press Enter for `date-tracker` (or type a custom name)
3. **Platform**: Select `Python`
4. **Platform version**: Choose `Python 3.11` or `3.12` (latest available)
5. **SSH**: Type `y` (yes - helpful for troubleshooting)
6. **Keypair**: 
   - If you have one, select it
   - If not, type a name like `date-tracker-key` to create a new one

This creates a `.elasticbeanstalk` folder with your configuration.

---

## Step 5: Create and Deploy Your Environment

```powershell
eb create date-tracker-env
```

**This will:**
- Create an EC2 instance
- Set up a load balancer
- Configure security groups
- Deploy your application

⏱️ **This takes 5-10 minutes. Be patient!**

You'll see output like:
```
Creating application version archive "app-1234567890".
Environment details for: date-tracker-env
  Application name: date-tracker
  Region: us-east-1
  Deployed Version: app-1234567890
  Environment ID: e-xxxxxxxxxx
  Platform: arn:aws:elasticbeanstalk:us-east-1::platform/Python 3.11 running on 64bit Amazon Linux 2/3.4.0
  Tier: WebServer-Standard-1.0
  CNAME: date-tracker-env.eba-xxxxx.us-east-1.elasticbeanstalk.com
  ...
```

---

## Step 6: Set Environment Variables

**Generate a secure secret key:**
```powershell
$secretKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
Write-Host "Your secret key: $secretKey"
```

**Copy the secret key**, then set environment variables:

```powershell
eb setenv SECRET_KEY="paste-your-secret-key-here" DATABASE_URL="postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres" FLASK_DEBUG="False"
```

**Note**: Replace `paste-your-secret-key-here` with the actual key from above.

---

## Step 7: Get Your Application URL

```powershell
eb status
```

Or simply open it:
```powershell
eb open
```

🎉 **Your app is now live!** The URL will look like:
`http://date-tracker-env.eba-xxxxx.us-east-1.elasticbeanstalk.com`

---

## Step 8: Test Your Application

1. Open the URL in your browser
2. Try registering a new account
3. Test adding a date
4. Check that photos upload correctly
5. Verify the calendar works

---

## 🎯 Share with Your Girlfriend!

Send her the URL from Step 7. She can now:
- Create her own account
- Add dates
- View the calendar
- Upload photos

---

## 📝 Updating Your Application

After making changes to your code:

```powershell
# If using Git (recommended):
git add .
git commit -m "Your update message"

# Deploy the changes
eb deploy
```

Wait 2-3 minutes for the update to complete.

---

## 🔧 Useful Commands

```powershell
eb status          # Check environment status
eb health          # Check application health
eb logs            # View application logs (helpful for debugging)
eb open            # Open application in browser
eb ssh             # SSH into the EC2 instance (for advanced troubleshooting)
eb terminate       # Delete environment (careful - this deletes everything!)
```

---

## 🐛 Troubleshooting

### Application Not Loading

1. **Check logs:**
   ```powershell
   eb logs
   ```
   Look for error messages.

2. **Check environment variables:**
   ```powershell
   eb printenv
   ```
   Verify `SECRET_KEY` and `DATABASE_URL` are set.

3. **Check health:**
   ```powershell
   eb health
   ```

### Common Issues

**502 Bad Gateway:**
- Application might be crashing
- Check logs: `eb logs`
- Verify environment variables are set correctly

**404 Not Found:**
- Check that all files are committed (if using Git)
- Verify static files are in the `static/` folder

**500 Internal Server Error:**
- Check application logs
- Verify database connection string is correct
- Check that `SECRET_KEY` is set

**Static Files Not Loading:**
- Verify all files in `static/` folder are committed
- Check logs for 404 errors on static files

### Get Help

If you're stuck:
1. Check logs: `eb logs`
2. Check health: `eb health`
3. See full deployment guide: `DEPLOYMENT.md`

---

## 💰 Cost Information

- **Free Tier**: First 12 months includes 750 hours/month of t2.micro or t3.micro
- **After Free Tier**: ~$15-30/month depending on instance size
- **Load Balancer**: ~$16/month (included in some tiers)

**To minimize costs:**
- Use t3.micro instance (free tier eligible)
- Terminate environment when not in use: `eb terminate`
- Recreate when needed: `eb create date-tracker-env`

---

## ✅ Success Checklist

- [ ] AWS account created
- [ ] AWS CLI and EB CLI installed
- [ ] AWS credentials configured
- [ ] Environment created and deployed
- [ ] Environment variables set
- [ ] Application accessible via URL
- [ ] Tested registration and login
- [ ] Tested adding dates
- [ ] Tested photo uploads
- [ ] Shared URL with girlfriend! 🎉

---

## 🎉 You're Done!

Your Date Tracker is now live on the internet! Share the URL with your girlfriend and enjoy tracking your dates together.

---

**Need more details?** See `DEPLOYMENT.md` for comprehensive deployment options including EC2 direct deployment.

