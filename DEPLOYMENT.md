# AWS Deployment Guide

This guide covers deploying the Date Tracker application to AWS using Elastic Beanstalk (recommended) or EC2.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured (`aws configure`)
3. EB CLI installed (for Elastic Beanstalk): `pip install awsebcli`
4. Git installed (for version control)

## Option 1: Elastic Beanstalk Deployment (Recommended - Easier)

Elastic Beanstalk automatically handles load balancing, auto-scaling, and application health monitoring.

### Step 1: Install EB CLI

```bash
pip install awsebcli
```

### Step 2: Initialize Elastic Beanstalk

In your project directory:

```bash
eb init
```

Follow the prompts:
- **Select a region**: Choose your preferred AWS region (e.g., us-east-1)
- **Application name**: `date-tracker` (or your preferred name)
- **Platform**: Python
- **Platform version**: Python 3.11 or 3.12 (latest available)
- **SSH**: Yes (recommended for troubleshooting)
- **Keypair**: Create new or select existing

### Step 3: Create Environment

```bash
eb create date-tracker-env
```

This will:
- Create an EC2 instance
- Set up load balancer
- Configure security groups
- Deploy your application

**Note**: This takes about 5-10 minutes.

### Step 4: Configure Environment Variables

Set your sensitive configuration:

```bash
eb setenv SECRET_KEY="your-very-secure-secret-key-here-generate-with-openssl-rand-hex-32"
eb setenv DATABASE_URL="postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
eb setenv FLASK_DEBUG="False"
```

Generate a secure secret key:
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Step 5: Deploy Updates

After making changes:

```bash
git add .
git commit -m "Your commit message"
eb deploy
```

### Step 6: Get Your Application URL

```bash
eb status
```

Or visit the AWS Console → Elastic Beanstalk → Your Environment → URL

### Step 7: View Logs

```bash
eb logs
```

### Useful EB Commands

```bash
eb status          # Check environment status
eb health          # Check application health
eb logs            # View logs
eb ssh             # SSH into the instance
eb open            # Open application in browser
eb terminate       # Delete environment (careful!)
```

## Option 2: EC2 Deployment (More Control)

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. **Name**: `date-tracker-server`
3. **AMI**: Amazon Linux 2023 or Ubuntu 22.04 LTS
4. **Instance Type**: t3.micro (free tier) or t3.small
5. **Key Pair**: Create new or select existing
6. **Security Group**: 
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
   - Allow SSH (port 22) from your IP
7. **Launch Instance**

### Step 2: Connect to EC2 Instance

```bash
# Replace with your key file and instance IP
ssh -i your-key.pem ec2-user@your-instance-ip
```

### Step 3: Install Dependencies

**For Amazon Linux:**
```bash
sudo yum update -y
sudo yum install -y python3 python3-pip git
pip3 install --user gunicorn
```

**For Ubuntu:**
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git nginx
pip3 install --user gunicorn
```

### Step 4: Clone Your Application

```bash
# Option A: Clone from Git repository
git clone https://github.com/yourusername/date-tracker.git
cd date-tracker

# Option B: Upload files using SCP
# From your local machine:
# scp -i your-key.pem -r /path/to/project ec2-user@your-instance-ip:/home/ec2-user/
```

### Step 5: Set Up Python Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 6: Configure Environment Variables

```bash
nano .env
```

Add:
```
SECRET_KEY=your-very-secure-secret-key-here
DATABASE_URL=postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres
FLASK_DEBUG=False
```

### Step 7: Create Systemd Service (Amazon Linux/Ubuntu)

```bash
sudo nano /etc/systemd/system/date-tracker.service
```

Add:
```ini
[Unit]
Description=Date Tracker Gunicorn Application
After=network.target

[Service]
User=ec2-user
Group=ec2-user
WorkingDirectory=/home/ec2-user/date-tracker
Environment="PATH=/home/ec2-user/date-tracker/venv/bin"
ExecStart=/home/ec2-user/date-tracker/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:8000 app:app

[Install]
WantedBy=multi-user.target
```

Start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable date-tracker
sudo systemctl start date-tracker
sudo systemctl status date-tracker
```

### Step 8: Set Up Nginx Reverse Proxy (Ubuntu)

```bash
sudo nano /etc/nginx/sites-available/date-tracker
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Or use EC2 public IP

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /home/ec2-user/date-tracker/static;
    }
}
```

Enable and start:
```bash
sudo ln -s /etc/nginx/sites-available/date-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Post-Deployment Checklist

- [ ] Application is accessible via URL
- [ ] Database connection is working
- [ ] Static files (CSS, JS, images) are loading
- [ ] File uploads are working (check uploads/ directory permissions)
- [ ] Environment variables are set correctly
- [ ] SSL certificate is installed (if using domain)
- [ ] Logs are being monitored
- [ ] Backups are configured (if needed)

## Troubleshooting

### Application Not Starting

```bash
# Check logs
eb logs                    # Elastic Beanstalk
sudo journalctl -u date-tracker -f  # EC2 systemd
tail -f /var/log/nginx/error.log   # Nginx errors
```

### Database Connection Issues

- Verify DATABASE_URL environment variable is set
- Check security group allows outbound connections
- Verify Supabase connection string is correct

### Static Files Not Loading

- Check file permissions: `chmod -R 755 static/`
- Verify nginx configuration includes static file serving
- Check application logs for 404 errors

### File Upload Issues

```bash
# Create uploads directory with proper permissions
mkdir -p uploads static/images
chmod -R 755 uploads static/images
```

## Updating the Application

**Elastic Beanstalk:**
```bash
git add .
git commit -m "Update message"
eb deploy
```

**EC2:**
```bash
# SSH into instance
git pull origin main  # If using Git
# Or upload new files via SCP

# Restart service
sudo systemctl restart date-tracker
```

## Security Recommendations

1. **Never commit `.env` file** - Use environment variables
2. **Use strong SECRET_KEY** - Generate with `openssl rand -hex 32`
3. **Enable HTTPS** - Use Let's Encrypt or AWS Certificate Manager
4. **Restrict SSH access** - Only allow from your IP
5. **Regular updates** - Keep system and dependencies updated
6. **Monitor logs** - Set up CloudWatch or log monitoring

## Cost Estimation

- **Elastic Beanstalk**: ~$15-30/month (t3.micro instance + load balancer)
- **EC2 Direct**: ~$10-15/month (t3.micro instance only)
- **Domain**: ~$10-15/year (optional)
- **SSL Certificate**: Free with Let's Encrypt

## Next Steps

1. Set up a custom domain (optional)
2. Configure CloudWatch for monitoring
3. Set up automated backups
4. Configure auto-scaling (if needed)
5. Set up CI/CD pipeline (optional)


