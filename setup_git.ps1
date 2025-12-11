# PowerShell script to set up Git repository
# Run this after installing Git

Write-Host "Setting up Git repository for Date Tracker..." -ForegroundColor Cyan

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit
}

# Navigate to project directory
$projectPath = "C:\Users\carn0\Downloads\Side Project"
Set-Location $projectPath

# Initialize repository (if not already initialized)
if (-not (Test-Path ".git")) {
    Write-Host ""
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "Repository initialized" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Git repository already initialized" -ForegroundColor Green
}

# Check if .gitignore exists
if (Test-Path ".gitignore") {
    Write-Host ".gitignore found" -ForegroundColor Green
} else {
    Write-Host ".gitignore not found" -ForegroundColor Yellow
}

# Show status
Write-Host ""
Write-Host "Current repository status:" -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review the files to be committed (above)" -ForegroundColor White
Write-Host "2. Run: git add ." -ForegroundColor Yellow
Write-Host "3. Run: git commit -m 'Initial commit: Date Tracker application'" -ForegroundColor Yellow
Write-Host "4. Create a repository on GitHub" -ForegroundColor Yellow
Write-Host "5. Run: git remote add origin https://github.com/YOUR_USERNAME/date-tracker.git" -ForegroundColor Yellow
Write-Host "6. Run: git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "See GIT_SETUP.md for detailed instructions!" -ForegroundColor Cyan
