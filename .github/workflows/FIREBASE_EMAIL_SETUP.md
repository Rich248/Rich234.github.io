# Firebase Cloud Functions Email Setup Guide

This guide will help you set up Firebase Cloud Functions with Nodemailer to send emails to ANY recipient.

## What Was Changed

1. **Replaced SendGrid with Nodemailer** - More flexible, works with any SMTP provider
2. **Created 3 Cloud Functions:**
   - `sendOTP` - Sends OTP emails for login verification
   - `sendEmail` - Generic email sender for any purpose
   - `sendWelcomeEmail` - Auto-triggered when new user registers

## Setup Steps

### Step 1: Install Firebase CLI (if not installed)

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Install Dependencies

Navigate to the functions folder and install dependencies:

```bash
cd functions
npm install
```

### Step 4: Configure Your Email Provider

You have several options for sending emails:

#### Option A: Gmail (Free, 500 emails/day limit)

1. Go to https://myaccount.google.com/apppasswords
2. Generate an App Password (NOT your regular Gmail password)
3. Set Firebase config:

```bash
firebase functions:config:set email.user="your-email@gmail.com" email.pass="your-app-password"
```

#### Option B: SendGrid SMTP (Free 100 emails/day)

1. Sign up at https://sendgrid.com
2. Create an API Key
3. Set Firebase config:

```bash
firebase functions:config:set email.user="apikey" email.pass="SG.your-api-key" smtp.host="smtp.sendgrid.net" smtp.port="587"
```

#### Option C: Mailgun (Free 5000 emails/month for 3 months)

1. Sign up at https://mailgun.com
2. Get your SMTP credentials
3. Set Firebase config:

```bash
firebase functions:config:set email.user="postmaster@yourdomain.com" email.pass="your-mailgun-password" smtp.host="smtp.mailgun.org" smtp.port="587"
```

#### Option D: Outlook/Hotmail

```bash
firebase functions:config:set email.user="your-email@outlook.com" email.pass="your-password" smtp.host="smtp-mail.outlook.com" smtp.port="587"
```

### Step 5: Deploy the Functions

```bash
firebase deploy --only functions
```

### Step 6: Update Frontend Code

After deploying, Firebase will give you function URLs. Update your `customer-login.html` to use the Firebase Function instead of EmailJS:

**OLD (EmailJS):**
```javascript
await emailjs.send("service_1ow5j0n", "template_mkc3bvg", {...});
```

**NEW (Firebase Function):**
```javascript
// Initialize Firebase in your HTML
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-functions-compat.js"></script>

// In your JavaScript
const functions = firebase.functions();
const sendOTP = functions.httpsCallable('sendOTP');

// Call the function
const result = await sendOTP({
    to_email: userEmail,
    to_name: userFirstName,
    otp_code: generatedOTP
});
```

## Testing Your Setup

You can test the deployed function using curl:

```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/sendOTP \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "to_email": "test@example.com",
      "to_name": "Test User",
      "otp_code": "123456"
    }
  }'
```

## Troubleshooting

### "Failed to send email" errors

1. Check Firebase Function logs:
   ```bash
   firebase functions:log
   ```

2. Verify email credentials are set correctly:
   ```bash
   firebase functions:config:get
   ```

3. For Gmail: Make sure you're using an App Password, not your regular password

4. Check if "Less secure app access" is enabled for your Gmail account

### CORS errors in browser

The Firebase Functions are configured to handle CORS automatically when called via the Firebase SDK. If you're making direct HTTP calls, you may need to add CORS headers.

## Security Notes

- Never commit email credentials to Git
- Firebase config is encrypted and stored securely
- The functions validate the `to_email` field is present
- Consider adding rate limiting for production use

## Cost

Firebase Cloud Functions:
 - Free tier: 2 million invocations/month
 - $0.40 per million invocations after that

Email Providers:
 - Gmail: Free (500/day limit)
 - SendGrid: Free (100/day)
 - Mailgun: Free tier available

## Support

If you need help, check:
1. Firebase Console > Functions > Logs
2. Your email provider's SMTP settings
3. Firebase documentation: https://firebase.google.com/docs/functions

---

**Next Steps:**
1. Choose your email provider
2. Set the Firebase config with your credentials
3. Deploy the functions
4. Update your frontend to call Firebase Functions instead of EmailJS
5. Test sending an OTP email to yourself

The key benefit: You can now send emails to ANY recipient, not just a hardcoded email address!
