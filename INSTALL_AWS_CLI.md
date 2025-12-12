# Install AWS CLI on Windows

## Option 1: Using MSI Installer (Recommended - Easiest)

1. **Download AWS CLI:**
   - Go to: https://awscli.amazonaws.com/AWSCLIV2.msi
   - Or search "AWS CLI Windows MSI" in your browser

2. **Run the installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - Click "Next" through all prompts
   - Click "Install" (may require admin privileges)

3. **Verify installation:**
   - Close and reopen PowerShell
   - Run: `aws --version`
   - You should see something like: `aws-cli/2.x.x Python/3.x.x Windows/10`

## Option 2: Using winget (Windows Package Manager)

If you have winget installed:

```powershell
winget install Amazon.AWSCLI
```

Then close and reopen PowerShell, then verify:
```powershell
aws --version
```

## Option 3: Using Chocolatey

If you have Chocolatey installed:

```powershell
choco install awscli
```

Then close and reopen PowerShell, then verify:
```powershell
aws --version
```

## After Installation

1. **Close and reopen PowerShell** (important - so PATH updates)
2. **Verify it works:**
   ```powershell
   aws --version
   ```
3. **Configure AWS:**
   ```powershell
   aws configure
   ```

## Troubleshooting

### Still getting "aws is not recognized"

1. **Check if it's installed:**
   - Look in: `C:\Program Files\Amazon\AWSCLIV2\`
   - If it exists, it's installed but not in PATH

2. **Add to PATH manually:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to "Advanced" tab → "Environment Variables"
   - Under "System variables", find "Path" → "Edit"
   - Click "New" → Add: `C:\Program Files\Amazon\AWSCLIV2\`
   - Click OK on all dialogs
   - Close and reopen PowerShell

3. **Or restart your computer** (PATH updates on restart)

### Alternative: Use Full Path

If you can't get PATH working, you can use the full path:

```powershell
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" --version
```

But it's better to fix the PATH issue.

