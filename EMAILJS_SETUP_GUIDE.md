# EmailJS Setup Guide for GhanaTrust Bank

This guide explains how to set up real email delivery using EmailJS - a simpler alternative that doesn't require Firebase CLI or backend servers.

## What is EmailJS?

EmailJS allows you to send emails directly from the browser without needing a backend server. It's perfect for this use case.

## Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Click **Sign Up** (free account available)
3. Sign up with your email or Google account
4. Verify your email address

## Step 2: Add an Email Service

1. After logging in, go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended - uses OAuth)
   - **Outlook/Hotmail**
   - **Yahoo Mail**
   - Or any custom SMTP server
4. Follow the authentication steps for your provider
5. Once connected, you'll see a **Service ID** - copy this

## Step 3: Create an Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Fill in the template details:
   - **Template Name**: Account Opening Confirmation
   - **Subject**: Welcome to GhanaTrust Bank - Application Received
   - **From Name**: GhanaTrust Bank
   - **To Email**: {{to_email}} (this is a variable)
   - **Reply To**: noreply@ghanatrustbank.com

4. In the **Content** section, use this HTML template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to GhanaTrust Bank</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: #1e40af; padding: 40px 30px; text-align: center;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                    <td style="text-align: center;">
                        <div style="display: inline-block; width: 50px; height: 50px; background: #ffffff; border-radius: 8px; line-height: 50px; text-align: center; margin-bottom: 15px; font-size: 28px;">🏦</div>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; font-family: Georgia, 'Times New Roman', serif;">GhanaTrust Bank</h1>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 14px;">Your Trusted Financial Partner</p>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Welcome, {{to_name}}! 👋</h2>
            <p style="color: #64748b; line-height: 1.7; margin: 0 0 25px 0; font-size: 15px;">
                Thank you for choosing GhanaTrust Bank. We're excited to inform you that we have successfully received your <strong>{{account_type}}</strong> application.
            </p>

            <!-- Reference Box -->
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 5px solid #1e40af; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Reference Number</p>
                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #1e40af; letter-spacing: 1px;">{{reference_number}}</p>
            </div>

            <!-- Application Details -->
            <div style="background: #f8fafc; border-radius: 8px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Application Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 40%;">Account Type</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">{{account_type}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Branch</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">{{branch}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Application Date</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">{{application_date}}</td>
                    </tr>
                </table>
            </div>

            <p style="color: #64748b; line-height: 1.7; margin: 0 0 25px 0; font-size: 15px;">
                Our dedicated verification team will review your application within <strong>24 hours</strong>. You will receive another email notification once your account has been approved and is ready for use.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(30, 64, 175, 0.2);">
                    Track Your Application
                </a>
            </div>

            <p style="color: #64748b; line-height: 1.7; margin: 0; font-size: 14px;">
                If you have any questions or need assistance, please don't hesitate to contact our customer service team at <strong>030 221 2222</strong> or email us at <strong>support@ghanatrustbank.com</strong>.
            </p>
        </div>

        <!-- Footer -->
        <div style="background: #1e293b; padding: 30px; text-align: center;">
            <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 13px;">
                © 2026 Ghana Trust Bank. All rights reserved.
            </p>
            <p style="color: #64748b; margin: 0; font-size: 12px;">
                Bank of Ghana regulated • Member of Ghana Association of Banks
            </p>
            <div style="margin-top: 20px;">
                <a href="#" style="color: #94a3b8; text-decoration: none; margin: 0 10px; font-size: 13px;">Privacy Policy</a>
                <a href="#" style="color: #94a3b8; text-decoration: none; margin: 0 10px; font-size: 13px;">Terms of Service</a>
                <a href="#" style="color: #94a3b8; text-decoration: none; margin: 0 10px; font-size: 13px;">Contact Us</a>
            </div>
        </div>
    </div>
</body>
</html>
```

5. Click **Save**
6. You'll see a **Template ID** - copy this

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in EmailJS dashboard
2. Copy your **Public Key** (also called API Key)

## Step 5: Update account-opening-new.html

Open `account-opening-new.html` and replace the placeholder values:

1. Find line 819:
   ```javascript
   emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
   ```
   Replace `YOUR_EMAILJS_PUBLIC_KEY` with your actual public key

2. Find line 1046:
   ```javascript
   await emailjs.send("YOUR_EMAILJS_SERVICE_ID", "YOUR_EMAILJS_TEMPLATE_ID", {
   ```
   Replace:
   - `YOUR_EMAILJS_SERVICE_ID` with your Service ID from Step 2
   - `YOUR_EMAILJS_TEMPLATE_ID` with your Template ID from Step 3

## Step 6: Test Email Delivery

1. Open your website in a browser
2. Fill out the account opening form
3. Submit the application
4. Check your email inbox (and spam folder)
5. You should receive a welcome email from GhanaTrust Bank

## Troubleshooting

**Email not sending:**
- Check browser console (F12) for errors
- Verify your Service ID, Template ID, and Public Key are correct
- Make sure your email service is connected in EmailJS
- Check EmailJS dashboard for any error logs

**Template variables not working:**
- Ensure variable names in template match exactly: `{{to_email}}`, `{{to_name}}`, etc.
- Check the template is using the correct variable syntax

**Rate limits:**
- Free EmailJS account: 200 emails/month
- If you need more, upgrade to a paid plan

## Cost

- EmailJS Free Tier: 200 emails/month
- No backend server required
- No Firebase CLI needed
- Total: $0 for typical usage

## Files Modified

- `account-opening-new.html` - Added EmailJS SDK and email sending logic

## Next Steps

After setup, every time a user submits the account opening form, they will automatically receive a real email confirmation to their actual email address.

## Security Note

EmailJS is secure for this use case because:
- Your email credentials are stored on EmailJS servers, not in your code
- Only the public key is exposed in the browser
- Emails are sent through EmailJS's secure servers
