#!/bin/bash
# Quick deployment script for Elastic Beanstalk

echo "🚀 Deploying Date Tracker to AWS Elastic Beanstalk..."

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI not found. Installing..."
    pip install awsebcli
fi

# Check if initialized
if [ ! -d ".elasticbeanstalk" ]; then
    echo "📦 Initializing Elastic Beanstalk..."
    eb init
fi

# Deploy
echo "📤 Deploying application..."
eb deploy

echo "✅ Deployment complete!"
echo "🌐 Your app URL:"
eb status | grep "CNAME"


