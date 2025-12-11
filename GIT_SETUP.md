# Git Repository Setup Guide

## Step 1: Install Git (if not installed)

### Option A: Download Git for Windows
1. Go to: https://git-scm.com/download/win
2. Download and install Git for Windows
3. During installation, choose "Git from the command line and also from 3rd-party software"
4. Restart your terminal/PowerShell after installation

### Option B: Check if Git is installed
```powershell
git --version
```

If it shows a version number, Git is installed!

## Step 2: Configure Git (First Time Only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Initialize Repository

```powershell
cd "C:\Users\carn0\Downloads\Side Project"
git init
```

## Step 4: Add All Files

```powershell
git add .
```

## Step 5: Make Initial Commit

```powershell
git commit -m "Initial commit: Date Tracker application"
```

## Step 6: Create GitHub Repository

1. Go to https://github.com
2. Sign in (or create account)
3. Click the **+** icon → **New repository**
4. Repository name: `date-tracker` (or your preferred name)
5. Description: "Personal date tracking website"
6. Choose **Private** (recommended for personal projects)
7. **DO NOT** initialize with README, .gitignore, or license
8. Click **Create repository**

## Step 7: Connect and Push

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/date-tracker.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

You'll be prompted for your GitHub username and password (use a Personal Access Token, not your password).

## Step 8: Create Personal Access Token (if needed)

If GitHub asks for a token:
1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Name it: "Date Tracker"
4. Select scopes: **repo** (full control of private repositories)
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

## Future Updates

After making changes:

```powershell
git add .
git commit -m "Description of your changes"
git push
```

## Create a Branch for Style Changes

To work on new styles without affecting main:

```powershell
# Create and switch to new branch
git checkout -b new-styles

# Make your changes, then commit
git add .
git commit -m "Add new Bootstrap styles"

# Push branch to GitHub
git push -u origin new-styles
```

Later, you can merge it back:
```powershell
git checkout main
git merge new-styles
git push
```

## Quick Reference Commands

```powershell
git status              # Check what files changed
git add .               # Stage all changes
git commit -m "message" # Save changes with message
git push                # Upload to GitHub
git pull                # Download from GitHub
git log                 # View commit history
git branch              # List branches
git checkout branch-name # Switch branches
```

