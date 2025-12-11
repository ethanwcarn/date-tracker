# Quick Start Deployment Guide

## Fastest Way: Elastic Beanstalk (5 minutes)

### 1. Install EB CLI
```bash
pip install awsebcli
```

### 2. Initialize (First Time Only)
```bash
eb init
```
- Select your region
- Choose Python platform
- Application name: `date-tracker`

### 3. Create Environment
```bash
eb create date-tracker-env
```

### 4. Set Environment Variables
```bash
# Generate a secret key first
openssl rand -hex 32

# Then set it (replace with your generated key)
eb setenv SECRET_KEY="your-generated-secret-key-here"
eb setenv DATABASE_URL="postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
eb setenv FLASK_DEBUG="False"
```

### 5. Get Your URL
```bash
eb status
```
Or use: `eb open`

### 6. Future Deployments
```bash
eb deploy
```

That's it! Your app should be live in ~5-10 minutes.

## Troubleshooting

**App not loading?**
```bash
eb logs
```

**Need to SSH in?**
```bash
eb ssh
```

**Check status?**
```bash
eb health
```

## Important Notes

1. **SECRET_KEY**: Must be set! Generate with `openssl rand -hex 32`
2. **Database**: Your Supabase connection should work from AWS
3. **Static Files**: Should be served automatically
4. **Uploads**: Directory will be created automatically

## Cost

- **Free Tier**: First 12 months free (t3.micro)
- **After Free Tier**: ~$15-30/month
- **Load Balancer**: Included in Elastic Beanstalk


