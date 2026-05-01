/**
 * Ghana Trust Bank - Live Chat Widget with AI Representative
 * Works on both desktop and mobile
 * Syncs conversations with admin dashboard via Firebase
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get an OpenAI API key from https://platform.openai.com/api-keys
 * 2. Replace 'YOUR_OPENAI_API_KEY_HERE' below with your actual API key
 * 3. Or leave as-is to use fallback keyword-based responses
 * 
 * Features:
 * - GPT-3.5 powered AI responses for accurate banking information
 * - Maintains conversation context for natural dialogue
 * - Automatically falls back to keyword responses if API is unavailable
 * - Syncs all conversations to Firebase for admin monitoring
 * - Admin can take over from AI at any time
 */

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBC6abatrIxH9gFaXQx8Q4gDdu59dU1U8E",
    authDomain: "live-chat-61efd.firebaseapp.com",
    databaseURL: "https://live-chat-61efd-default-rtdb.firebaseio.com",
    projectId: "live-chat-61efd",
    storageBucket: "live-chat-61efd.firebasestorage.app",
    messagingSenderId: "1059519432349",
    appId: "1:1059519432349:web:a40c6fee6357651c6af674",
    measurementId: "G-W8CFYEYHJ4"
};

// Global variables
let database;
let chatRef;
let currentChatId = null;
let isChatOpen = false;
let isTyping = false;
let messageListener = null;
let conversationHistory = []; // Store conversation for AI context

// OpenAI API Configuration
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Ghana Trust Bank System Prompt for AI
const SYSTEM_PROMPT = `You are a helpful, professional banking assistant for Ghana Trust Bank, a leading bank in Ghana. You provide accurate information about banking products and services.

**About Ghana Trust Bank:**
- Established in 2026, regulated by Bank of Ghana
- 20+ branches nationwide including Accra, Kumasi, Takoradi, Tamale, Cape Coast, Sunyani, Ho
- 500,000+ customers, GH¢10B+ assets under management
- Member of Ghana Association of Banks

**Account Types:**

1. **Personal Checking Account**
   - GH¢0 minimum balance
   - Free Visa Debit Card
   - No monthly maintenance fees
   - Mobile banking access
   - Overdraft protection available
   - Requirements: Ghana Card, proof of address

2. **Personal Savings Account**
   - 5% Annual Percentage Yield (APY)
   - GH₵200 minimum opening deposit
   - No monthly fees with GH₵500 balance
   - Automatic savings tools
   - Free digital statements

3. **Student Account**
   - GH¢0 minimum balance
   - No monthly fees
   - Free student debit card
   - Requirements: Ghana Card, Student ID, proof of enrollment
   - Educational loans available

4. **Business Starter Account**
   - GH₵500 minimum deposit
   - Low transaction costs
   - Mobile merchant portal
   - Business debit card

5. **Business Premium Account**
   - GH¢50/month
   - Dedicated relationship manager
   - Advanced online banking
   - Priority support
   - Business analytics tools

**Loans & Credit:**
- Personal loans with quick approval
- Business loans (working capital, equipment financing)
- Educational loans for students
- Competitive interest rates
- Flexible repayment terms

**Digital Banking:**
- Mobile app (Android/iOS) with biometric login
- 24/7 online banking
- Mobile money integration (MTN, Vodafone, AirtelTigo)
- Cardless ATM withdrawals
- Real-time notifications
- Bill payments and transfers

**Contact Information:**
- Phone: 030 221 2222 / 024 123 4567
- Email: info@ghanatrustbank.com / support@ghanatrustbank.com
- Head Office: Ring Road Central, Accra
- Hours: Mon-Fri 8AM-5PM, Sat 9AM-1PM

**Security:**
- 256-bit SSL encryption
- Two-factor authentication
- Real-time fraud monitoring
- Never share PIN or password

**Instructions:**
- Be professional, friendly, and helpful
- Provide accurate, specific information
- For account opening, give clear step-by-step instructions
- If asked about interest rates, fees, or requirements, give exact numbers
- Always mention required documents when discussing account opening
- Encourage users to visit branches for final steps
- If you don't know something specific, suggest contacting customer service
- Format responses with clear headings and bullet points for readability`;


// Ghana Trust Bank AI Knowledge Base
const bankKnowledge = {
    greeting: [
        "Hello! Welcome to Ghana Trust Bank. I'm your virtual banking assistant. How can I help you today?",
        "Hi there! I'm here to help with all your banking needs at Ghana Trust Bank. What can I assist you with?",
        "Welcome to Ghana Trust Bank! I'm your AI representative, ready to help with accounts, loans, and more. How may I help you?"
    ],
    
    farewell: [
        "Thank you for choosing Ghana Trust Bank. Have a wonderful day!",
        "It was my pleasure assisting you. Thank you for banking with Ghana Trust Bank!",
        "Feel free to reach out anytime. Ghana Trust Bank is always here for you!"
    ],
    
    default: [
        `I'm here to help with your Ghana Trust Bank questions! I can assist with:

• Opening accounts (Personal, Savings, Student, Business)
• Loan information and applications
• Digital banking (mobile app, online)
• Branch locations and contact details
• Rates, fees, and charges
• Security and fraud protection
• ATM and card services

What would you like to know about?`,

        `Welcome to Ghana Trust Bank! 💼

I can help you with detailed information about:
✓ Account opening (step-by-step guides)
✓ Student accounts (free, no minimum balance)
✓ Loans (personal, business, salary)
✓ Mobile banking setup
✓ Branches and ATMs near you
✓ Interest rates and fees

Please tell me what you're looking for, or type "help" to see options!`,

        `Hello! I'm your Ghana Trust Bank assistant. 🏦

Here are things I can help with:
📋 Open a new account
💰 Apply for loans
📱 Set up mobile banking
📍 Find branches and ATMs
💳 Card services and PIN issues
🔒 Security concerns

What can I help you with today?`
    ]
};

// Banking response templates - COMPREHENSIVE ACCURATE RESPONSES
const bankingResponses = {
    account: {
        keywords: ['account', 'open account', 'new account', 'create account'],
        responses: [
            `**How to Open an Account at Ghana Trust Bank - Complete Guide**

**STEP 1: Choose Your Account Type**
We offer 5 account types:
• Personal Checking - GH¢0 minimum, no fees, daily transactions
• Personal Savings - GH₵200 minimum, 5% yearly interest
• Student Account - GH¢0 minimum, no fees, need student ID
• Business Starter - GH₵500 minimum, for small businesses
• Business Premium - GH₵2,000 minimum, GH¢50/month, full features

**STEP 2: Gather Required Documents**
For ALL accounts you need:
✓ Valid Ghana Card (original + photocopy)
✓ Proof of address (utility bill, rent receipt, or employer letter)
✓ One passport-sized photograph
✓ Opening deposit cash

For Business accounts, also need:
✓ Business registration certificate
✓ TIN certificate
✓ Company documents (for limited companies)

**STEP 3: Visit Any Branch**
Locations: Accra Central, Ring Road, Kumasi, Takoradi, Tamale, Cape Coast, Sunyani, Ho
Hours: Monday-Friday 8AM-5PM, Saturday 9AM-1PM

**STEP 4: Complete Process (15-20 minutes)**
1. Request account opening form
2. Fill in your details
3. Submit documents
4. Make opening deposit
5. Get account number instantly
6. Receive debit card same day

**Call 030 221 2222 for help finding a branch!**`
        ]
    },
    
    checking: {
        keywords: ['checking', 'current account', 'debit card'],
        responses: [
            `**Personal Checking Account - Full Details**

**ACCOUNT FEATURES:**
• Minimum Balance: GH¢0 (no minimum!)
• Monthly Fee: FREE forever
• Debit Card: FREE Visa card issued same day
• Transactions: Unlimited withdrawals and deposits
• Overdraft: Available on request (subject to approval)
• Mobile Banking: Free 24/7 access

**DOCUMENTS NEEDED:**
1. Ghana Card (must be valid and current)
2. Proof of address - any of these:
   • ECG/NWSC water bill (last 3 months)
   • Tenancy agreement
   • Employer confirmation letter
   • Bank statement from another bank
3. One passport photo
4. Opening deposit: Any amount (can be GH¢1!)

**HOW TO OPEN:**
Step 1: Walk into any Ghana Trust Bank branch
Step 2: Tell customer service: "I want to open a Personal Checking Account"
Step 3: Fill the account opening form with:
   - Full name (as on Ghana Card)
   - Date of birth
   - Nationality
   - Home address
   - Phone number and email
   - Occupation/employer
   - Next of kin details
   - Your signature

Step 4: Submit documents and deposit
Step 5: Receive instantly:
   ✓ Account number
   ✓ ATM card
   ✓ PIN number
   ✓ Mobile banking setup

**Questions? Call 030 221 2222**`
        ]
    },
    
    savings: {
        keywords: ['savings', 'save money', 'interest rate', 'apy'],
        responses: [
            `**Personal Savings Account - Earn 5% Interest!**

**ACCOUNT DETAILS:**
• Interest Rate: 5% per year (paid quarterly)
• Opening Deposit: GH₵200 minimum
• Monthly Fee: FREE if balance stays above GH₵500
                GH¢5 only if below GH₵500
• Interest Payments: March, June, September, December

**HOW MUCH YOU CAN EARN:**
• GH₵1,000 saved = GH¢50 interest per year
• GH₵5,000 saved = GH¢250 interest per year
• GH₵10,000 saved = GH¢500 interest per year

**DOCUMENTS NEEDED:**
✓ Ghana Card (original + photocopy)
✓ Proof of address (utility bill or rent receipt)
✓ One passport photo
✓ GH₵200 or more for opening

**OPENING PROCESS:**
1. Visit any branch with documents
2. Request "Savings Account Opening Form"
3. Fill in:
   - Personal details
   - Source of funds
   - Expected monthly deposits
   - Next of kin
4. Submit form with GH₵200+ deposit
5. Account opened immediately!

**AUTOMATIC SAVINGS:**
Set up standing order from your checking account to automatically save every month!

**Start saving today - visit any branch!**`
        ]
    },
    
    student: {
        keywords: ['student', 'student account', 'school account', 'university account'],
        responses: [
            `**Student Account - FREE Banking for Students!**

**WHO CAN OPEN:**
Any student at a recognized Ghanaian institution:
• Universities (UG, KNUST, UCC, UDS, etc.)
• Polytechnics/Technical schools
• Nursing/midwifery colleges
• Teacher training colleges
• Senior High Schools

**YOU PAY NOTHING:**
✓ GH¢0 minimum balance required
✓ No monthly fees ever
✓ Free Visa debit card
✓ Free mobile banking
✓ Free ATM withdrawals at GTB ATMs
✓ Free statements

**DOCUMENTS REQUIRED:**
1. Ghana Card or valid Passport
2. Current Student ID Card (must be valid)
3. Proof of enrollment - any of:
   • Admission letter
   • School certificate
   • Current school fees receipt
4. One passport-sized photo
5. Proof of address (can use school hostel address)

**STEP-BY-STEP OPENING:**

**Step 1:** Visit any Ghana Trust Bank branch

**Step 2:** Ask for "Student Account Opening Form" at Customer Service

**Step 3:** Fill the form with:
   - Full name (as on Ghana Card)
   - Student ID number
   - Institution name
   - Program/course of study
   - Year of study
   - Contact info (phone, email)
   - Home address OR hostel address
   - Next of kin (parent/guardian name and phone)

**Step 4:** Submit with your documents:
   - Completed form
   - Ghana Card (original + copy)
   - Student ID (original + copy)
   - Admission letter/certificate
   - Passport photo

**Step 5:** Make deposit: **GH¢0 required** (Yes, you can open with ZERO!)

**Step 6:** Processing takes 5-10 minutes

**Step 7:** Receive same day:
   ✓ Account number
   ✓ Free debit card (printed instantly)
   ✓ PIN for your card
   ✓ Mobile banking activated

**EXTRA BENEFITS:**
• Access to student loans
• Special student rewards and discounts
• Career and financial literacy workshops

**Questions? Ask me anything!**`
        ]
    },
    
    business: {
        keywords: ['business', 'company', 'merchant', 'enterprise', 'business account'],
        responses: [
            `**Business Banking at Ghana Trust Bank**

**TWO BUSINESS ACCOUNT OPTIONS:**

**OPTION 1: Business Starter**
Best for: Small businesses, sole proprietors, startups

Features:
• Opening: GH₵500 minimum
• Monthly fee: GH¢10
• Free business debit card
• Mobile merchant portal
• Basic online banking
• Transaction alerts
• Low-cost transactions

**OPTION 2: Business Premium**
Best for: Established SMEs, growing companies

Features:
• Opening: GH₵2,000 minimum
• Monthly fee: GH¢50
• Dedicated relationship manager
• Advanced online banking
• Priority phone support
• Business analytics dashboard
• Preferential loan rates
• Bulk payment processing
• Business lounge access

**DOCUMENTS BY BUSINESS TYPE:**

**Sole Proprietorship:**
□ Owner's Ghana Card
□ Business name registration (RGD)
□ TIN certificate
□ Proof of business address
□ 2 passport photos

**Partnership:**
□ All partners' Ghana Cards
□ Partnership agreement
□ Business registration
□ TIN certificate
□ Proof of address
□ 2 photos per partner

**Limited Company:**
□ Certificate of Incorporation
□ Company Regulations
□ Form 3 & 4 from RGD
□ TIN certificate
□ Directors' Ghana Cards
□ Proof of registered office
□ 2 photos per signatory
□ Board resolution

**OPENING PROCESS:**
1. Schedule appointment or walk in
2. Meet Business Banking Officer
3. Complete application
4. Submit documents
5. Wait 1-2 days for approval
6. Make opening deposit
7. Account activated

**Call 030 221 2222 to speak with a Business Officer!**`
        ]
    },
    
    loans: {
        keywords: ['loan', 'borrow', 'credit', 'mortgage', 'personal loan', 'business loan'],
        responses: [
            `**Loan Products at Ghana Trust Bank**

**PERSONAL LOANS:**

**1. Personal Loan (General)**
• Amount: GH₵1,000 - GH₵100,000
• Duration: 6 months to 5 years
• Interest: 18-25% per year
• Requirements:
  ✓ GTB account (6+ months old)
  ✓ Valid Ghana Card
  ✓ Proof of income (payslips, bank statements)
  ✓ 2 guarantors with GTB accounts
• Approval: 3-5 business days

**2. Salary Loan (Fastest)**
• For salaried workers only
• Amount: Up to 6 months gross salary
• Repayment: Monthly deduction from salary
• No collateral if employer partners with GTB
• Approval: 24-48 hours

**3. Emergency Loan**
• Amount: GH₵500 - GH₵5,000
• Quick same-day approval
• Short repayment (1-6 months)

**BUSINESS LOANS:**

**1. Working Capital Loan**
• For daily operations, inventory, salaries
• Amount: GH₵10,000 - GH₵500,000
• Flexible repayment up to 3 years

**2. Equipment/Machinery Loan**
• Purchase vehicles, equipment, tools
• Amount: Up to GH₵1,000,000
• Duration: Up to 7 years
• Equipment serves as collateral

**3. Trade Finance**
• Import/export financing
• Letters of credit
• Invoice discounting

**HOW TO APPLY:**
Step 1: Visit any branch
Step 2: Request loan application form
Step 3: Submit with:
   - Completed form
   - Ghana Card copy
   - Income proof
   - Bank statements (6 months)
   - Employment letter
Step 4: Credit assessment
Step 5: Approval and disbursement

**Apply today - call 030 221 2222!**`
        ]
    },
    
    mobile: {
        keywords: ['mobile', 'app', 'online banking', 'digital', 'internet banking'],
        responses: [
            `**Ghana Trust Bank Digital Banking**

**MOBILE APP FEATURES:**

**Account Management:**
✓ Check balances instantly
✓ View transaction history
✓ Download statements (PDF)
✓ Multiple account view

**Payments & Transfers:**
✓ Transfer to GTB accounts - FREE
✓ Transfer to other banks in Ghana
✓ Mobile Money (MTN, Vodafone, AirtelTigo)
✓ Pay bills (ECG, GWCL, DSTV, school fees)
✓ Buy airtime and data
✓ Schedule future payments

**Security:**
✓ Fingerprint or Face ID login
✓ PIN protection
✓ Instant SMS/email alerts
✓ Remote card blocking
✓ Fraud detection

**Special Features:**
✓ Cardless ATM withdrawal
✓ QR code payments
✓ Savings goal tracker
✓ Spending analytics

**HOW TO SETUP:**

**Step 1: Download**
• Android: Google Play Store
• iPhone: App Store
• Search: "Ghana Trust Bank"

**Step 2: Register**
• Open app → Click "New User"
• Enter your account number
• Create username and password
• Set security questions
• Verify with SMS code

**Step 3: Start Banking!**
All features available immediately

**ALTERNATIVE: USSD Banking**
Dial *789# for basic services without internet!

**NEED HELP?** Call 030 221 2222 or visit any branch**`
        ]
    },
    
    branch: {
        keywords: ['branch', 'location', 'office', 'atm', 'near me', 'find us'],
        responses: [
            `**Ghana Trust Bank Branch Locations**

**ACCRA REGION:**
• Accra Central - High Street, near High Court
• Ring Road Central - Opposite DSTV
• Accra Mall - Ground floor
• East Legon - Lagos Avenue
• Tema - Community 1
• Spintex Road
• Madina
• Achimota

**OTHER REGIONS:**
• Kumasi (Adum, Ahodwo)
• Takoradi - Market Circle
• Tamale - Central Business District
• Cape Coast - Pedu Junction
• Sunyani - Main commercial area
• Ho - Near lorry station
• Obuasi
• Sekondi

**50+ ATMs available at all branches and major locations!**

**Find nearest branch:**
📱 Use our mobile app
🌐 www.ghanatrustbank.com/branches
📞 Call 030 221 2222

**Hours:** Mon-Fri 8AM-5PM, Sat 9AM-1PM`
        ]
    },
    
    contact: {
        keywords: ['contact', 'phone', 'email', 'call', 'reach', 'support', 'help'],
        responses: [
            `**Contact Ghana Trust Bank**

**PHONE:**
📞 Main: 030 221 2222
📞 Toll-free: 0800 123 456
📞 Mobile/WhatsApp: 024 123 4567

**EMAIL:**
✉️ info@ghanatrustbank.com
✉️ support@ghanatrustbank.com
✉️ complaints@ghanatrustbank.com

**ADDRESS:**
🏢 Head Office
Ring Road Central
Opposite DSTV Office
Accra, Ghana

**HOURS:**
🕐 Mon-Fri: 8:00 AM - 5:00 PM
🕐 Saturday: 9:00 AM - 1:00 PM
🕐 Sunday: Closed

**ONLINE:**
💬 Live chat on website & app
📱 Facebook: GhanaTrustBank
📱 Twitter: @GhanaTrustBank

**EMERGENCY (24/7):**
🚨 Lost card: 030 221 2222`
        ]
    },
    
    rates: {
        keywords: ['rate', 'interest', 'fee', 'charge', 'cost', 'price'],
        responses: [
            `**Ghana Trust Bank Rates & Fees**

**INTEREST RATES:**
• Savings Account: 5% per year
• Fixed Deposits: 12-15% (depending on term)
• Loans: 18-25% per year

**ACCOUNT FEES:**
• Personal Checking: FREE (no monthly fee)
• Personal Savings: FREE if balance above GH₵500
                     GH¢5/month if below GH₵500
• Student Account: FREE forever
• Business Starter: GH¢10/month
• Business Premium: GH¢50/month

**TRANSACTION FEES:**
• GTB ATM withdrawals: FREE
• Other bank ATM: GH¢3 per withdrawal
• GTB to GTB transfer: FREE
• Other bank transfer: GH¢1-5
• Mobile Money: Standard network charges

**CARD FEES:**
• Debit Card: FREE (first card)
• Card replacement: GH¢25
• Pin reset: FREE

For detailed fee schedule, visit any branch!`
        ]
    },
    
    security: {
        keywords: ['security', 'safe', 'protect', 'fraud', 'scam', 'password', 'pin', 'hack'],
        responses: [
            `**Security at Ghana Trust Bank**

**PROTECTION FEATURES:**
✓ 256-bit SSL encryption (bank-level security)
✓ Two-factor authentication (2FA)
✓ Biometric login (fingerprint/face ID)
✓ Real-time fraud monitoring 24/7
✓ Automatic session timeout
✓ Instant SMS/email alerts for all transactions
✓ Card blocking via mobile app

**KEEP YOUR ACCOUNT SAFE:**
🔒 NEVER share your PIN with anyone
🔒 NEVER share your password
🔒 Use strong, unique passwords
🔒 Don't use public WiFi for banking
🔒 Always log out after banking
🔒 Report lost/stolen cards immediately

**SCAM WARNING:**
⚠️ Ghana Trust Bank will NEVER:
• Call asking for your full password
• Email asking for your PIN
• Send links to "verify" your account
• Ask you to transfer money to "secure" it

**IF YOU SUSPECT FRAUD:**
📞 Call 030 221 2222 immediately
📧 Email: fraud@ghanatrustbank.com
🔒 Block your card in the mobile app`
        ]
    },
    
    investment: {
        keywords: ['invest', 'investment', 'wealth', 'retirement', 'portfolio', 'fixed deposit'],
        responses: [
            `**Investment Services at Ghana Trust Bank**

**FIXED DEPOSIT ACCOUNTS:**
• Terms: 3 months to 5 years
• Rates: 12-15% per year
• Minimum: GH₵1,000
• Interest paid at maturity or quarterly

**TREASURY PRODUCTS:**
• Treasury Bills (91-day, 182-day, 1-year)
• Government Bonds
• Competitive market rates
• Low risk investments

**WEALTH MANAGEMENT:**
• Personalized investment advice
• Portfolio management
• Retirement planning
• Education savings plans
• Estate planning

**REQUIREMENTS:**
✓ Valid Ghana Card
✓ Source of funds declaration
✓ Minimum investment amount
✓ Completed investment form

**RETURNS EXAMPLE:**
GH₵10,000 in Fixed Deposit (1 year at 15%):
= GH¢1,500 interest earned

**Speak with an Investment Advisor:**
Call 030 221 2222 or visit any branch`
        ]
    },
    
    transfer: {
        keywords: ['transfer', 'send money', 'wire', 'remittance', 'international', 'swift'],
        responses: [
            `**Transfer Services at Ghana Trust Bank**

**LOCAL TRANSFERS (Ghana):**
✓ GTB to GTB: FREE, instant
✓ To other banks: GH¢1-5 fee, same day
✓ Mobile Money: MTN, Vodafone, AirtelTigo
✓ Maximum: GH₵50,000 per day

**INTERNATIONAL TRANSFERS:**
✓ SWIFT transfers worldwide
✓ Western Union (receive from abroad)
✓ MoneyGram services
✓ Processing: 1-3 business days

**HOW TO TRANSFER:**

**Via Mobile App:**
1. Login to GTB app
2. Select "Transfer"
3. Choose recipient bank
4. Enter account number and amount
5. Confirm with PIN
6. Done! Instant confirmation

**Via USSD:**
Dial *789# and follow prompts

**At Branch:**
Bring recipient details and valid ID

**DOCUMENTS FOR LARGE TRANSFERS:**
• Source of funds proof
• Purpose of transfer
• Recipient identification

**Questions? Call 030 221 2222**`
        ]
    },
    
    atm: {
        keywords: ['atm', 'cash', 'withdrawal', 'card', 'pin'],
        responses: [
            `**ATM Services at Ghana Trust Bank**

**ATM LOCATIONS:**
• 50+ ATMs nationwide
• At all branch locations
• Major shopping malls
• Universities (UG, KNUST, UCC)
• Hospitals and bus terminals

**ATM SERVICES:**
✓ Cash withdrawals (GH¢20 - GH¢2,000 per day)
✓ Balance inquiries
✓ Mini statements (last 5 transactions)
✓ PIN change
✓ Cardless withdrawal (via mobile app)

**ATM FEES:**
• GTB ATM: FREE
• Other bank ATM: GH¢3 per withdrawal
• International ATM: GH¢15 + 1% of amount

**DAILY LIMITS:**
• Standard: GH¢2,000
• Premium: GH¢5,000
• Business: GH¢10,000

**CARDLESS WITHDRAWAL:**
1. Generate code in mobile app
2. Go to any GTB ATM
3. Select "Cardless Withdrawal"
4. Enter code and amount
5. Collect cash!

**LOST CARD?**
Block immediately:
📱 Mobile app → Card Services → Block Card
📞 Call 030 221 2222 (24/7)`
        ]
    },
    
    about: {
        keywords: ['about', 'history', 'who are you', 'ghanatrust', 'trust bank'],
        responses: [
            `**About Ghana Trust Bank**

**PROFILE:**
🏦 Established: 2026
👥 Customers: 500,000+
🏛️ Branches: 20+ nationwide
💰 Assets: GH¢10 billion+
📍 Headquarters: Accra, Ghana

**REGULATION:**
✓ Licensed by Bank of Ghana
✓ Member of Ghana Association of Banks
✓ Regulated by Securities & Exchange Commission

**OUR MISSION:**
Empowering Ghanaians with modern, accessible, and secure banking solutions to build wealth and achieve financial goals.

**AWARDS:**
• Best Customer Service Bank 2025
• Most Innovative Digital Bank 2025
• Fastest Growing Bank in Ghana 2026

**CONTACT:**
📞 030 221 2222
🌐 www.ghanatrustbank.com

**Thank you for choosing Ghana Trust Bank!**`
        ]
    }
};

// Initialize Firebase
function initChatFirebase() {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        database = firebase.database();
        console.log('Chat Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Generate or retrieve chat session ID
function getChatSessionId() {
    let sessionId = localStorage.getItem('gtbChatSessionId');
    if (!sessionId) {
        sessionId = 'gtb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('gtbChatSessionId', sessionId);
    }
    return sessionId;
}

// AI Response Generator using OpenAI GPT API
async function generateAIResponse(userMessage) {
    // Check if API key is configured (not placeholder)
    const isKeyConfigured = OPENAI_API_KEY && 
                           !OPENAI_API_KEY.includes('YOUR_OPENAI_API_KEY_HERE') &&
                           OPENAI_API_KEY.startsWith('sk-');
    
    if (!isKeyConfigured) {
        console.log('OpenAI API key not properly configured, using fallback responses');
        return generateFallbackResponse(userMessage);
    }
    
    console.log('Calling OpenAI API...');
    
    try {
        // Add user message to conversation history
        conversationHistory.push({ role: 'user', content: userMessage });
        
        // Keep only last 10 messages for context
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }
        
        // Prepare messages array with system prompt and conversation history
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory
        ];
        
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                top_p: 0.9
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenAI API Error:', response.status, errorData);
            throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Unexpected API response format:', data);
            throw new Error('Invalid API response format');
        }
        
        const aiResponse = data.choices[0].message.content.trim();
        console.log('OpenAI response received:', aiResponse.substring(0, 50) + '...');
        
        // Add AI response to conversation history
        conversationHistory.push({ role: 'assistant', content: aiResponse });
        
        return aiResponse;
        
    } catch (error) {
        console.error('OpenAI API error:', error);
        console.log('Falling back to keyword-based responses');
        // Fallback to keyword-based responses if API fails
        return generateFallbackResponse(userMessage);
    }
}

// Fallback response generator (keyword-based)
function generateFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greeting
    if (/\b(hi|hello|hey|good morning|good afternoon|good evening|how are you|welcome)\b/.test(lowerMessage)) {
        return getRandomResponse(bankKnowledge.greeting);
    }
    
    // Check for farewell
    if (/\b(bye|goodbye|see you|thank you|thanks|appreciate|okay bye)\b/.test(lowerMessage)) {
        return getRandomResponse(bankKnowledge.farewell);
    }
    
    // Check banking keywords
    for (const category in bankingResponses) {
        const categoryData = bankingResponses[category];
        for (const keyword of categoryData.keywords) {
            if (lowerMessage.includes(keyword)) {
                return getRandomResponse(categoryData.responses);
            }
        }
    }
    
    // Default response
    return getRandomResponse(bankKnowledge.default);
}

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Open chat widget
function openChat() {
    const modal = document.getElementById('gtbChatModal');
    if (modal) {
        modal.classList.add('active');
        isChatOpen = true;
        
        // Initialize Firebase if not already done
        if (!database) {
            initChatFirebase();
        }
        
        // Setup chat session
        currentChatId = getChatSessionId();
        chatRef = database.ref('chats/' + currentChatId + '/messages');
        
        // Listen for admin responses
        if (messageListener) {
            chatRef.off('child_added', messageListener);
        }
        
        messageListener = chatRef.on('child_added', (snapshot) => {
            const message = snapshot.val();
            if (message && message.sender === 'representative' && !message.isAI) {
                // Only show admin messages (not AI messages)
                addMessageToUI(message.text, 'representative', formatTime(message.timestamp));
            }
        });
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('gtbChatInput');
            if (input) input.focus();
        }, 100);
    }
}

// Close chat widget
function closeChat() {
    const modal = document.getElementById('gtbChatModal');
    if (modal) {
        modal.classList.remove('active');
        isChatOpen = false;
    }
}

// Send message
async function sendChatMessage() {
    const input = document.getElementById('gtbChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    const timestamp = Date.now();
    addMessageToUI(message, 'user', formatTime(timestamp));
    input.value = '';
    
    // Send to Firebase for admin visibility
    if (database && chatRef) {
        chatRef.push({
            text: message,
            sender: 'user',
            timestamp: timestamp,
            isAI: false
        });
        
        // Store conversation metadata
        database.ref('chats/' + currentChatId + '/metadata').set({
            lastActivity: timestamp,
            status: 'active',
            platform: 'web',
            url: window.location.href
        });
    }
    
    // Generate and send AI response
    showTypingIndicator();
    
    try {
        // Call AI API (works with both OpenAI and fallback)
        const aiResponse = await generateAIResponse(message);
        const aiTimestamp = Date.now();
        
        hideTypingIndicator();
        addMessageToUI(aiResponse, 'representative', formatTime(aiTimestamp));
        
        // Store AI response in Firebase too (so admin can see full conversation)
        if (database && chatRef) {
            chatRef.push({
                text: aiResponse,
                sender: 'representative',
                timestamp: aiTimestamp,
                isAI: true
            });
        }
    } catch (error) {
        hideTypingIndicator();
        console.error('Error generating AI response:', error);
        
        // Show error message
        const errorMsg = "I'm sorry, I'm having trouble responding right now. Please try again or contact our support at 030 221 2222.";
        addMessageToUI(errorMsg, 'representative', formatTime(Date.now()));
    }
}

// Add message to UI
function addMessageToUI(text, sender, time) {
    const messagesContainer = document.getElementById('gtbChatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `gtb-chat-message ${sender}`;
    
    // Convert markdown-style formatting to HTML
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `
        <div class="gtb-message-bubble">${formattedText}</div>
        <div class="gtb-message-time">${time}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const indicator = document.getElementById('gtbTypingIndicator');
    if (indicator) {
        indicator.classList.add('active');
    }
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('gtbTypingIndicator');
    if (indicator) {
        indicator.classList.remove('active');
    }
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Handle Enter key
async function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        await sendChatMessage();
    }
}

// Initialize chat widget when DOM is loaded
function initChatWidget() {
    // Don't initialize if already exists
    if (document.getElementById('gtbChatModal')) return;
    
    // Create chat HTML
    const chatHTML = `
        <!-- Floating Chat Button -->
        <div id="gtbChatButton" onclick="openChat()" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(30, 58, 138, 0.4);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 9999;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
        ">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span id="gtbChatButtonText">Chat with Us</span>
        </div>

        <!-- Chat Modal -->
        <div id="gtbChatModal" class="gtb-chat-modal">
            <div class="gtb-chat-content">
                <div class="gtb-chat-header">
                    <div class="gtb-chat-header-info">
                        <div class="gtb-chat-avatar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div>
                            <h3>Ghana Trust Bank</h3>
                            <span class="gtb-chat-status">● Online Representative</span>
                        </div>
                    </div>
                    <button class="gtb-close-chat" onclick="closeChat()">&times;</button>
                </div>
                <div class="gtb-chat-messages" id="gtbChatMessages">
                    <div class="gtb-chat-message representative">
                        <div class="gtb-message-bubble">Hello! Welcome to Ghana Trust Bank. I'm your virtual banking assistant. How can I help you today? 💼</div>
                        <div class="gtb-message-time">${formatTime(Date.now())}</div>
                    </div>
                </div>
                <div class="gtb-typing-indicator" id="gtbTypingIndicator">
                    <span></span>
                    <span></span>
                    <span></span>
                    Representative is typing...
                </div>
                <div class="gtb-chat-input-area">
                    <input type="text" id="gtbChatInput" placeholder="Type your message..." onkeypress="handleChatKeyPress(event)">
                    <button onclick="(async () => await sendChatMessage())()" class="gtb-send-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <style>
            /* Chat Modal Styles */
            .gtb-chat-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', sans-serif;
            }

            .gtb-chat-modal.active {
                display: flex;
            }

            .gtb-chat-content {
                background: white;
                border-radius: 16px;
                width: 90%;
                max-width: 450px;
                max-height: 80vh;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .gtb-chat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.25rem;
                background: linear-gradient(135deg, #1e40af, #3b82f6);
                color: white;
            }

            .gtb-chat-header-info {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .gtb-chat-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .gtb-chat-header h3 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
            }

            .gtb-chat-status {
                font-size: 0.75rem;
                opacity: 0.9;
                color: #86efac;
            }

            .gtb-close-chat {
                background: none;
                border: none;
                font-size: 1.75rem;
                cursor: pointer;
                color: white;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            }

            .gtb-close-chat:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .gtb-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
                background: #f8fafc;
                min-height: 300px;
                max-height: 400px;
            }

            .gtb-chat-message {
                margin-bottom: 1rem;
                display: flex;
                flex-direction: column;
                animation: gtbMessageSlide 0.3s ease;
            }

            @keyframes gtbMessageSlide {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .gtb-chat-message.user {
                align-items: flex-end;
            }

            .gtb-chat-message.representative {
                align-items: flex-start;
            }

            .gtb-message-bubble {
                max-width: 85%;
                padding: 0.75rem 1rem;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.5;
                word-wrap: break-word;
            }

            .gtb-chat-message.user .gtb-message-bubble {
                background: #3b82f6;
                color: white;
                border-bottom-right-radius: 4px;
            }

            .gtb-chat-message.representative .gtb-message-bubble {
                background: white;
                color: #1e293b;
                border: 1px solid #e2e8f0;
                border-bottom-left-radius: 4px;
            }

            .gtb-message-time {
                font-size: 0.7rem;
                color: #94a3b8;
                margin-top: 0.25rem;
            }

            .gtb-typing-indicator {
                display: none;
                padding: 0.75rem 1rem;
                background: #f8fafc;
                color: #64748b;
                font-size: 0.8rem;
                align-items: center;
                gap: 0.5rem;
            }

            .gtb-typing-indicator.active {
                display: flex;
            }

            .gtb-typing-indicator span {
                width: 6px;
                height: 6px;
                background: #3b82f6;
                border-radius: 50%;
                animation: gtbTypingBounce 1.4s infinite ease-in-out both;
            }

            .gtb-typing-indicator span:nth-child(1) {
                animation-delay: -0.32s;
            }

            .gtb-typing-indicator span:nth-child(2) {
                animation-delay: -0.16s;
            }

            @keyframes gtbTypingBounce {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }

            .gtb-chat-input-area {
                padding: 1rem;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 0.5rem;
                background: white;
            }

            .gtb-chat-input-area input {
                flex: 1;
                padding: 0.75rem 1rem;
                border: 1px solid #e2e8f0;
                border-radius: 24px;
                font-size: 0.9rem;
                outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            .gtb-chat-input-area input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .gtb-send-btn {
                width: 44px;
                height: 44px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s, transform 0.2s;
            }

            .gtb-send-btn:hover {
                background: #2563eb;
                transform: scale(1.05);
            }

            .gtb-send-btn:active {
                transform: scale(0.95);
            }

            /* Mobile Responsive Styles */
            @media (max-width: 480px) {
                .gtb-chat-content {
                    width: 100%;
                    height: 100%;
                    max-height: 100vh;
                    border-radius: 0;
                    position: fixed;
                    top: 0;
                    left: 0;
                }

                .gtb-chat-messages {
                    max-height: calc(100vh - 150px);
                    min-height: calc(100vh - 150px);
                }

                #gtbChatButton {
                    bottom: 15px;
                    right: 15px;
                    padding: 0.75rem 1rem;
                }

                #gtbChatButtonText {
                    display: none;
                }
            }

            @media (min-width: 481px) and (max-width: 768px) {
                .gtb-chat-content {
                    width: 95%;
                    max-width: 400px;
                }
            }

            /* Hover effects for desktop */
            @media (hover: hover) {
                #gtbChatButton:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(30, 58, 138, 0.5);
                }
            }

            /* Reduced motion preference */
            @media (prefers-reduced-motion: reduce) {
                .gtb-chat-message,
                #gtbChatButton,
                .gtb-send-btn,
                .gtb-typing-indicator span {
                    animation: none;
                    transition: none;
                }
            }
        </style>
    `;
    
    // Insert chat widget
    const div = document.createElement('div');
    div.innerHTML = chatHTML;
    document.body.appendChild(div);
    
    // Initialize Firebase
    initChatFirebase();
    
    console.log('Ghana Trust Bank Chat Widget initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatWidget);
} else {
    initChatWidget();
}

// Expose functions globally
window.openChat = openChat;
window.closeChat = closeChat;
window.sendChatMessage = sendChatMessage;
window.handleChatKeyPress = handleChatKeyPress;
