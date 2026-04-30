require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER || 'cwesyrizy49957@gmail.com',
        pass: process.env.EMAIL_PASS || 'yinjonmrvymodibs'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// API endpoint to send confirmation email
app.post('/api/send-email', async (req, res) => {
    try {
        const { email, firstName, lastName, accountType, applicationDate } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const mailOptions = {
            from: 'cwesyrizy49957@gmail.com',
            to: email,
            subject: 'Account Application Confirmation - GhanaTrust Bank',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                    <!-- Header with gradient -->
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 60px; height: 60px; margin-bottom: 15px;">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">GhanaTrust Bank</h1>
                        <p style="color: #dbeafe; margin: 15px 0 0 0; font-size: 16px;">Account Application Confirmation</p>
                    </div>
                    
                    <!-- Main content -->
                    <div style="background: #f8fafc; padding: 40px 30px; border: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
                        <h2 style="color: #1e40af; margin-top: 0; font-size: 24px;">Dear ${firstName} ${lastName},</h2>
                        <p style="color: #64748b; line-height: 1.8; font-size: 16px; margin: 20px 0;">Thank you for choosing GhanaTrust Bank! We have received your account application and are excited to welcome you to our banking family.</p>
                        
                        <!-- Application Details Card -->
                        <div style="background: white; padding: 25px; border-left: 4px solid #3b82f6; margin: 25px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Application Details
                            </h3>
                            <p style="margin: 10px 0; color: #475569; font-size: 15px;"><strong>Application Date:</strong> ${applicationDate}</p>
                            <p style="margin: 10px 0; color: #475569; font-size: 15px;"><strong>Account Type:</strong> ${accountType}</p>
                            <p style="margin: 10px 0; color: #475569; font-size: 15px;"><strong>Email:</strong> ${email}</p>
                        </div>
                        
                        <p style="color: #64748b; line-height: 1.8; font-size: 16px; margin: 20px 0;">Your application is currently being processed. Our dedicated team will review your documents and contact you within 24-48 hours.</p>
                        
                        <!-- Timeline Card -->
                        <div style="background: #dbeafe; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #bfdbfe;">
                            <h3 style="color: #1e40af; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                What happens next?
                            </h3>
                            <ul style="color: #475569; margin: 0; padding-left: 20px; font-size: 15px;">
                                <li style="margin: 12px 0; line-height: 1.6;">Document verification</li>
                                <li style="margin: 12px 0; line-height: 1.6;">Application review</li>
                                <li style="margin: 12px 0; line-height: 1.6;">Account approval</li>
                                <li style="margin: 12px 0; line-height: 1.6;">Account activation notification</li>
                            </ul>
                        </div>
                        
                        <p style="color: #64748b; line-height: 1.8; font-size: 16px; margin: 20px 0;">If you have any questions, please contact our support team:</p>
                        
                        <!-- Contact Information -->
                        <div style="background: white; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <div style="margin: 15px 0; display: flex; align-items: center; gap: 15px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px; flex-shrink: 0;">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <div>
                                    <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Phone:</strong></p>
                                    <a href="tel:+233302212222" style="color: #3b82f6; text-decoration: none; font-size: 16px; font-weight: 600;">030 221 2222</a>
                                </div>
                            </div>
                            <div style="margin: 15px 0; display: flex; align-items: center; gap: 15px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px; flex-shrink: 0;">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                <div>
                                    <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Email:</strong></p>
                                    <a href="cwesyrizy49957@gmail.com" style="color: #3b82f6; text-decoration: none; font-size: 16px; font-weight: 600;">support@ghanatrustbank.com</a>
                                </div>
                            </div>
                            <div style="margin: 15px 0; display: flex; align-items: center; gap: 15px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px; flex-shrink: 0;">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <div>
                                    <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Address:</strong></p>
                                    <p style="margin: 5px 0 0 0; color: #475569; font-size: 16px;">Ring Road Central, Accra, Ghana</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 14px; margin: 0;">&copy; 2026 GhanaTrust Bank. All rights reserved.</p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">Bank of Ghana regulated. Member of Ghana Association of Banks.</p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${email}`);
        console.log(`Message ID: ${info.messageId}`);
        
        res.json({ 
            success: true, 
            message: 'Confirmation email sent successfully'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email',
            error: error.message 
        });
    }
});

// API endpoint to send OTP email
app.post('/api/send-otp', async (req, res) => {
    try {
        const { email, firstName, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const mailOptions = {
            from: 'cwesyrizy49957@gmail.com',
            to: email,
            subject: 'Your Login OTP - GhanaTrust Bank',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                    <!-- Header with gradient -->
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 60px; height: 60px; margin-bottom: 15px;">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">GhanaTrust Bank</h1>
                        <p style="color: #dbeafe; margin: 15px 0 0 0; font-size: 16px;">One-Time Password (OTP)</p>
                    </div>
                    
                    <!-- Main content -->
                    <div style="background: #f8fafc; padding: 40px 30px; border: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
                        <h2 style="color: #1e40af; margin-top: 0; font-size: 24px;">Dear ${firstName || 'Valued Customer'},</h2>
                        <p style="color: #64748b; line-height: 1.8; font-size: 16px; margin: 20px 0;">We received a login request for your account. Please use the following One-Time Password (OTP) to complete your authentication:</p>
                        
                        <!-- OTP Display Card -->
                        <div style="background: white; padding: 30px; border-left: 4px solid #3b82f6; margin: 25px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px; font-weight: 600;">YOUR OTP CODE</p>
                            <p style="margin: 0; color: #1e40af; font-size: 36px; font-weight: 700; letter-spacing: 8px;">${otp}</p>
                        </div>
                        
                        <p style="color: #64748b; line-height: 1.8; font-size: 16px; margin: 20px 0;">This OTP will expire in <strong>10 minutes</strong>. For your security, please do not share this code with anyone.</p>
                        
                        <!-- Security Notice -->
                        <div style="background: #fef3c7; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #fcd34d;">
                            <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#92400e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                Security Notice
                            </h3>
                            <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 15px;">
                                <li style="margin: 10px 0; line-height: 1.6;">If you did not request this login, please ignore this email</li>
                                <li style="margin: 10px 0; line-height: 1.6;">Never share your OTP with anyone, including bank staff</li>
                                <li style="margin: 10px 0; line-height: 1.6;">GhanaTrust Bank will never ask for your OTP via phone or email</li>
                            </ul>
                        </div>
                        
                        <p style="color: #64748b; line-height: 1.8; font-size: 16px; margin: 20px 0;">If you have any concerns about your account security, please contact our support team immediately:</p>
                        
                        <!-- Contact Information -->
                        <div style="background: white; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <div style="margin: 15px 0; display: flex; align-items: center; gap: 15px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px; flex-shrink: 0;">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <div>
                                    <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Phone:</strong></p>
                                    <a href="tel:+233302212222" style="color: #3b82f6; text-decoration: none; font-size: 16px; font-weight: 600;">030 221 2222</a>
                                </div>
                            </div>
                            <div style="margin: 15px 0; display: flex; align-items: center; gap: 15px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px; flex-shrink: 0;">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                <div>
                                    <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Email:</strong></p>
                                    <a href="mailto:support@ghanatrustbank.com" style="color: #3b82f6; text-decoration: none; font-size: 16px; font-weight: 600;">support@ghanatrustbank.com</a>
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 14px; margin: 0;">&copy; 2026 GhanaTrust Bank. All rights reserved.</p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">Bank of Ghana regulated. Member of Ghana Association of Banks.</p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to: ${email}`);
        console.log(`Message ID: ${info.messageId}`);
        
        res.json({ 
            success: true, 
            message: 'OTP email sent successfully'
        });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send OTP email',
            error: error.message 
        });
    }
});

// API endpoint to send custom email (for admin messaging)
app.post('/api/send-custom-email', async (req, res) => {
    try {
        const { to, subject, body } = req.body;

        if (!to || !subject || !body) {
            return res.status(400).json({ success: false, message: 'To, subject, and body are required' });
        }

        const mailOptions = {
            from: 'cwesyrizy49957@gmail.com',
            to: to,
            subject: subject,
            text: body,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">GhanaTrust Bank</h1>
                    </div>
                    <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
                        <h2 style="color: #1e40af; margin-top: 0; font-size: 20px;">${subject}</h2>
                        <div style="color: #64748b; line-height: 1.8; font-size: 15px; white-space: pre-wrap;">${body.replace(/\n/g, '<br>')}</div>
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 13px; margin: 0;">&copy; 2026 GhanaTrust Bank. All rights reserved.</p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">Bank of Ghana regulated. Member of Ghana Association of Banks.</p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Custom email sent to: ${to}`);
        console.log(`Message ID: ${info.messageId}`);
        
        res.json({ 
            success: true, 
            message: 'Email sent successfully'
        });
    } catch (error) {
        console.error('Error sending custom email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email',
            error: error.message 
        });
    }
});

// API endpoint for user to send email to admin
app.post('/api/send-to-admin', async (req, res) => {
    try {
        const { from, firstName, lastName, subject, body, accountNumber } = req.body;

        if (!from || !subject || !body) {
            return res.status(400).json({ success: false, message: 'From, subject, and body are required' });
        }

        const mailOptions = {
            from: 'cwesyrizy49957@gmail.com',
            to: 'cwesyrizy49957@gmail.com', // Admin email
            replyTo: from,
            subject: `[User Support] ${subject}`,
            text: `From: ${firstName} ${lastName} <${from}>\nAccount: ${accountNumber}\n\nMessage:\n${body}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                    <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">GhanaTrust Bank - User Support</h1>
                    </div>
                    <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
                        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0; color: #1e40af; font-weight: 600;">Sender Information</p>
                            <p style="margin: 5px 0 0 0; color: #475569; font-size: 14px;">
                                <strong>Name:</strong> ${firstName} ${lastName}<br>
                                <strong>Email:</strong> ${from}<br>
                                <strong>Account:</strong> ${accountNumber}
                            </p>
                        </div>
                        <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">${subject}</h2>
                        <div style="color: #334155; line-height: 1.8; font-size: 15px; white-space: pre-wrap; background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">${body.replace(/\n/g, '<br>')}</div>
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 13px; margin: 0;">Reply directly to this email to respond to the user.</p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">&copy; 2026 GhanaTrust Bank. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Support email from ${from} sent to admin`);
        console.log(`Message ID: ${info.messageId}`);
        
        res.json({ 
            success: true, 
            message: 'Message sent to admin successfully'
        });
    } catch (error) {
        console.error('Error sending to admin:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message',
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Verify transporter connection on startup
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email transporter verification error:', error);
        console.log('Email User:', process.env.EMAIL_USER || 'cwesyrizy49957@gmail.com');
        console.log('Email Pass set:', process.env.EMAIL_PASS ? 'Yes' : 'No (using fallback)');
    } else {
        console.log('Email server is ready to send messages');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
