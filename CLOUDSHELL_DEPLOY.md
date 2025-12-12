# CloudShell Deployment - Step by Step

## Current Situation

You've successfully:
- ✅ Unzipped the project (files are in current directory)
- ✅ Installed EB CLI

## Next Steps

### Step 1: Complete `eb init`

You're currently at the region selection prompt. **Type a number** (like `1` for us-east-1) and press Enter.

**Recommended: Type `1` and press Enter** (for us-east-1)

Then answer the remaining prompts:
- **Application name**: Press Enter (default: `date-tracker`)
- **Platform**: Select `Python`
- **Platform version**: Choose `Python 3.11` or `3.12`
- **SSH**: Type `y` (yes)
- **Keypair**: Type a name like `date-tracker-key` to create new, or select existing

### Step 2: Create Environment

After `eb init` completes, run:
```bash
eb create date-tracker-env
```

This takes 5-10 minutes. Wait for it to complete.

### Step 3: Set Environment Variables

Generate a secret key first:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Copy the output, then set environment variables:
```bash
eb setenv SECRET_KEY="paste-your-secret-key-here" DATABASE_URL="postgresql://postgres.nqfycffqsyjwaplcawvf:madison@aws-1-us-east-1.pooler.supabase.com:6543/postgres" FLASK_DEBUG="False"
```

### Step 4: Get Your URL

```bash
eb status
```

Or:
```bash
eb open
```

## Important Notes

- **You're already in the right directory** - no need to `cd` anywhere
- **When `eb init` asks for a number, type the number and press Enter**
- **Don't type commands while a prompt is waiting for input**

## If You Get Stuck

If `eb init` is still waiting, you can:
1. Press `Ctrl+C` to cancel
2. Run `eb init` again
3. This time, type `1` when asked for region

