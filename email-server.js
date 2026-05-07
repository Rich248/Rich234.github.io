const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Gmail transporter setup with environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Test the transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.log('Error connecting to Gmail:', error);
    } else {
        console.log('Gmail server is ready to send emails');
    }
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    try {
        console.log('=== EMAIL REQUEST RECEIVED ===');
        console.log('To:', req.body.to);
        console.log('Subject:', req.body.subject);
        console.log('Body length:', req.body.html ? req.body.html.length : 0);
        
        const { to, subject, html } = req.body;
        
        if (!to || !subject || !html) {
            return res.json({ success: false, error: 'Missing required fields: to, subject, html' });
        }
        
        const mailOptions = {
            from: 'GhanaTrust Bank <' + process.env.GMAIL_USER + '>',
            to: to,
            subject: subject,
            html: html
        };

        console.log('Sending email...');
        const result = await transporter.sendMail(mailOptions);
        
        console.log('=== EMAIL SENT SUCCESSFULLY ===');
        console.log('Message ID:', result.messageId);
        console.log('Response:', result.response);
        
        res.json({ 
            success: true, 
            messageId: result.messageId,
            response: result.response
        });
    } catch (error) {
        console.error('=== EMAIL SEND ERROR ===');
        console.error('Error:', error);
        res.json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Nodemailer Email Service'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('=== NODEMAILER EMAIL SERVER STARTED ===');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Email endpoint: http://localhost:3000/send-email');
    console.log('Health check: http://localhost:3000/health');
    console.log('Ready to send emails via Gmail');
});
