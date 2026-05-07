const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Gmail transporter setup with credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Email service configuration error');
    } else {
        console.log('Email service ready');
    }
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, html } = req.body;
        
        if (!to || !subject || !html) {
            return res.json({ success: false, error: 'Missing required fields' });
        }
        
        const mailOptions = {
            from: 'GhanaTrust Bank <cwesyrizy49957@gmail.com>',
            to: to,
            subject: subject,
            html: html
        };

        const result = await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            messageId: result.messageId
        });
    } catch (error) {
        res.json({ 
            success: false, 
            error: 'Email service unavailable' 
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log('=== NODEMAILER EMAIL SERVER STARTED ===');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Email endpoint: http://localhost:3000/send-email');
    console.log('Health check: http://localhost:3000/health');
    console.log('Ready to send emails via Gmail');
});
