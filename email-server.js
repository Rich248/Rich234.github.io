const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Add size limit

// Validate required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('ERROR: EMAIL_USER and EMAIL_PASS environment variables are required');
    process.exit(1);
}

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
        console.error('Email service configuration error:', error.message);
    } else {
        console.log('Email service ready');
    }
});

// Email validation helper
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, html } = req.body;
        
        // Validate required fields
        if (!to || !subject || !html) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: to, subject, html' 
            });
        }

        // Validate email format
        if (!isValidEmail(to)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid recipient email format' 
            });
        }

        // Validate subject and html are strings and not empty
        if (typeof subject !== 'string' || subject.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Subject must be a non-empty string' 
            });
        }

        if (typeof html !== 'string' || html.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'HTML content must be a non-empty string' 
            });
        }
        
        const mailOptions = {
            from: process.env.EMAIL_USER, // Use environment variable
            to: to,
            subject: subject,
            html: html
        };

        const result = await transporter.sendMail(mailOptions);
        
        res.status(200).json({ 
            success: true, 
            messageId: result.messageId
        });
    } catch (error) {
        console.error('Email sending error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send email. Please try again later.' 
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('=== NODEMAILER EMAIL SERVER STARTED ===');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Email endpoint: POST http://localhost:${PORT}/send-email`);
    console.log(`Health check: GET http://localhost:${PORT}/health`);
    console.log('Ready to send emails via Gmail');
});
