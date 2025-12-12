# Deploy Without Installing AWS CLI

Since you can't install software on this computer, here are your options:

## Option 1: AWS CloudShell (Recommended - No Installation Needed!)

AWS CloudShell is a browser-based terminal that has AWS CLI and EB CLI pre-installed!

### Steps:

1. **Go to AWS Console:**
   - Visit: https://console.aws.amazon.com
   - Log in to your AWS account

2. **Open CloudShell:**
   - Click the CloudShell icon (terminal icon) in the top navigation bar
   - It's usually next to your username/region selector
   - First time: Wait 1-2 minutes for it to initialize

3. **Upload Your Project:**
   - In CloudShell, click the "Actions" menu (three dots) → "Upload file"
   - Or use the upload icon
   - Upload your project as a ZIP file:
     - In PowerShell on your computer:
     ```powershell
     cd "C:\Users\carn0\Downloads\Side Project"
     Compress-Archive -Path * -DestinationPath date-tracker.zip -Force
     ```
     - Then upload `date-tracker.zip` via CloudShell

4. **Extract and Deploy:**
   ```bash
   unzip date-tracker.zip
   cd date-tracker
   pip3 install awsebcli
   eb init
   eb create date-tracker-env
   ```

5. **Set Environment Variables:**
   ```bash
   eb setenv SECRET_KEY="your-secret-key" DATABASE_URL="postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres" FLASK_DEBUG="False"
   ```

6. **Get Your URL:**
   ```bash
   eb status
   ```

**Pros:**
- ✅ No installation needed
- ✅ Works from any browser
- ✅ AWS CLI and tools pre-installed
- ✅ Free to use

**Cons:**
- ⚠️ Need to upload files each time
- ⚠️ Session times out after inactivity

---

## Option 2: Use Another Device

If you have access to another computer (laptop, friend's computer, etc.):

1. **On the other device:**
   - Install AWS CLI and EB CLI
   - Clone your Git repository: `git clone https://github.com/ethanwcarn/date-tracker.git`
   - Follow the normal deployment steps from `DEPLOY_STEPS.md`

2. **Or transfer files:**
   - Copy your project folder to a USB drive
   - Transfer to the other device
   - Deploy from there

**Pros:**
- ✅ Full control
- ✅ Can update easily later

**Cons:**
- ⚠️ Need access to another device

---

## Option 3: Manual Deployment via AWS Console

You can deploy directly through the AWS Console, but it's more complex:

### Steps:

1. **Create Application Archive:**
   ```powershell
   cd "C:\Users\carn0\Downloads\Side Project"
   Compress-Archive -Path * -DestinationPath date-tracker.zip -Force
   ```

2. **Go to Elastic Beanstalk Console:**
   - Visit: https://console.aws.amazon.com/elasticbeanstalk
   - Click "Create Application"

3. **Configure Application:**
   - **Application name**: `date-tracker`
   - **Platform**: Python
   - **Platform version**: Python 3.11 or 3.12
   - **Application code**: Upload your `date-tracker.zip` file

4. **Configure Environment:**
   - **Environment name**: `date-tracker-env`
   - **Domain**: Auto-generated
   - **Description**: (optional)

5. **Configure More Options:**
   - **Instance type**: t3.micro (free tier)
   - **Capacity**: 1 instance
   - **Environment variables**: Add:
     - `SECRET_KEY`: (generate a secure key)
     - `DATABASE_URL`: `postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres`
     - `FLASK_DEBUG`: `False`

6. **Create Environment:**
   - Review settings
   - Click "Create environment"
   - Wait 5-10 minutes

7. **Get Your URL:**
   - Once created, the URL will be shown in the environment dashboard

**Pros:**
- ✅ No CLI needed
- ✅ All done in browser

**Cons:**
- ⚠️ More complex
- ⚠️ Harder to update later
- ⚠️ Need to manually upload ZIP each time

---

## Option 4: Use a Portable/Portable Version

Unfortunately, AWS CLI doesn't have a true portable version that works well on Windows without installation.

---

## Recommendation

**Use Option 1 (AWS CloudShell)** - It's the easiest and requires no installation!

### Quick CloudShell Steps:

1. Go to https://console.aws.amazon.com
2. Click CloudShell icon (terminal icon in top bar)
3. Wait for it to initialize
4. Upload your project ZIP file
5. Run:
   ```bash
   unzip date-tracker.zip
   cd date-tracker
   pip3 install awsebcli
   eb init
   eb create date-tracker-env
   eb setenv SECRET_KEY="..." DATABASE_URL="..." FLASK_DEBUG="False"
   eb status
   ```

---

## After Deployment

Once deployed, you can:
- Access your app via the URL (no CLI needed)
- Update via CloudShell when needed
- Or use AWS Console to upload new versions

---

## Need Help?

If CloudShell doesn't work or you prefer another option, let me know which approach you'd like to try!

