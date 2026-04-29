# Real Email Setup Guide for GhanaTrust Bank

This guide explains how to set up real email delivery using Firebase Cloud Functions and SendGrid.

## Prerequisites

1. **Node.js** - Already installed (v24.15.0)
2. **Firebase CLI** - Need to install manually
3. **SendGrid Account** - Free tier available at https://sendgrid.com/

## Step 1: Install Firebase CLI

**Method A: Using npm (Recommended if PowerShell allows)**

1. Open Command Prompt (cmd) as Administrator (not PowerShell)
2. Run:
   ```
   npm install -g firebase-tools
   ```
3. Verify installation:
   ```
   firebase --version
   ```

**Method B: Manual Installer (if Method A fails)**

1. Download the Firebase CLI installer from: https://firebase.google.com/docs/cli#windows
2. Run the installer with administrator privileges
3. **Important:** After installation, RESTART your terminal/command prompt
4. Verify:
   ```
   firebase --version
   ```

**Method C: Using npx (No installation required)**

1. Use npx to run Firebase without installing:
   ```
   npx firebase-tools@latest --version
   ```
2. If this works, you can use `npx firebase-tools` instead of `firebase` in all commands

**Method D: Manual PATH Addition (if installer didn't add to PATH)**

1. Find where Firebase CLI was installed (usually: `C:\Users\YourUsername\AppData\Roaming\npm`)
2. Open System Properties → Environment Variables
3. Edit "Path" under User variables
4. Add the path to Firebase CLI
5. Restart terminal and try `firebase --version`

**Troubleshooting:**
- If you see "firebase is not recognized", try restarting your terminal
- Try using Command Prompt (cmd) instead of PowerShell
- Make sure you ran the installer as Administrator

## Step 2: Login to Firebase

1. Open a terminal in your project directory
2. Run:
   ```
   firebase login
   ```
3. This will open a browser window - log in with your Google account
4. Grant Firebase CLI permissions

## Step 3: Initialize Cloud Functions

1. In your project directory (banking-website), run:
   ```
   firebase init functions
   ```
2. When prompted:
   - Select: **Use an existing project**
   - Select your project: **live-chat-61efd**
   - Language: **JavaScript**
   - ESLint: **No**
   - Install dependencies: **Yes**

3. When asked to overwrite existing `functions/index.js`, select **No** (we already created it)

## Step 4: Install SendGrid Dependency

1. Navigate to the functions folder:
   ```
   cd functions
   ```
2. Install SendGrid:
   ```
   npm install @sendgrid/mail
   ```
3. Go back to project root:
   ```
   cd ..
   ```

## Step 5: Set Up SendGrid

1. Create a free SendGrid account at https://signup.sendgrid.com/
2. After signup, go to Settings → API Keys
3. Create a new API Key with "Mail Send" permissions
4. Copy the API Key (you'll only see it once!)

## Step 6: Configure SendGrid in Firebase

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **live-chat-61efd**
3. Go to **Functions** → **Settings** → **Environment Variables**
4. Add a new variable:
   - Name: `SENDGRID_API_KEY`
   - Value: (paste your SendGrid API Key)
5. Click **Save**

## Step 7: Verify Sender in SendGrid

1. In SendGrid, go to **Settings** → **Sender Authentication**
2. Click **Create Sender**
3. Add your domain or email (e.g., noreply@ghanatrustbank.com)
4. Complete the verification process (DNS records)
5. Once verified, update the `from` email in `functions/index.js` line 12

## Step 8: Deploy Cloud Functions

1. In your project directory, run:
   ```
   firebase deploy --only functions
   ```
2. Wait for deployment to complete
3. You'll see a URL where your functions are deployed

## Step 9: Test Email Delivery

1. Fill out the account opening form on your website
2. Submit the application
3. Check your email inbox (and spam folder)
4. You should receive a welcome email from GhanaTrust Bank

## Troubleshooting

**Email not sending:**
- Check Firebase Functions logs: `firebase functions:log`
- Verify SendGrid API key is correct
- Check sender is verified in SendGrid
- Check Firebase Console → Functions for errors

**Deployment errors:**
- Ensure you're on the Blaze plan (free tier for Cloud Functions)
- Check billing is enabled in Firebase Console

**PowerShell script errors:**
- Run PowerShell as Administrator
- Or use Command Prompt (cmd) instead of PowerShell

## Files Created

- `functions/package.json` - Dependencies for Cloud Functions
- `functions/index.js` - Email sending logic
- This guide file

## Cost

- Firebase Cloud Functions: Free tier includes 125,000 invocations/month
- SendGrid: Free tier includes 100 emails/day
- Total: $0 for typical usage

## Next Steps

After setup, every time a user submits an account opening form, they will automatically receive a real email confirmation.
