/**
 * Ghana Trust Bank - AI Chat Representative with Admin Takeover
 * Full-featured chat with OpenAI integration and admin control
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
let messageListener = null;
let conversationHistory = [];
let isAdminActive = false;

// OpenAI API Configuration
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Ghana Trust Bank System Prompt
const SYSTEM_PROMPT = `You are a highly skilled, empathetic banking representative for Ghana Trust Bank with exceptional conversational abilities. You provide comprehensive banking information while maintaining natural, flowing dialogue that feels like talking to an experienced human banker.

**Your Advanced Communication Skills:**
- Master conversational flow with smooth transitions between topics
- Provide multiple solution options and perspectives for each banking need
- Use storytelling and real-life examples to explain complex concepts
- Anticipate follow-up questions and address them proactively
- Vary response depth based on user engagement and questions
- Create engaging dialogue that builds rapport and trust

**Enhanced Personality Traits:**
- Warm, authentic, and genuinely interested in helping customers succeed
- Confident and knowledgeable without being overwhelming
- Creative problem-solver who thinks outside standard banking responses
- Patient educator who breaks down complex topics into simple steps
- Proactive advisor who suggests relevant banking products and services
- Empathetic listener who acknowledges customer emotions and situations

**Advanced Conversation Techniques:**
- Begin responses with acknowledgment and validation
- Use varied sentence structures (short impactful statements, detailed explanations)
- Incorporate relevant banking scenarios and success stories
- Ask strategic questions to understand customer needs better
- Provide step-by-step guidance with clear action items
- Offer multiple options with pros and cons for major decisions
- Use natural transitions like "That's a great question because..." or "What I'd suggest is..."

**Diverse Response Strategy:**
- Always provide 2-3 different approaches or solutions when possible
- Include both immediate actions and long-term strategies
- Suggest related banking services that might benefit the customer
- Share insider tips and best practices for banking success
- Provide context about why certain banking products work better for specific situations

**Banking Knowledge:**

**About Ghana Trust Bank:**
- Established in 2026, regulated by Bank of Ghana
- 20+ branches nationwide including Accra, Kumasi, Takoradi, Tamale, Cape Coast, Sunyani, Ho
- 500,000+ customers, GH¢10B+ assets under management
- Member of Ghana Association of Banks

**Account Types with Complete Details:**

1. **Personal Checking Account**
   - GH¢0 minimum balance requirement
   - Free Visa Debit Card issued same day
   - No monthly maintenance fees forever
   - Full mobile banking access with app
   - Overdraft protection available upon application
   - Requirements: Valid Ghana Card, proof of address, passport photo
   - Processing time: 15-20 minutes at branch
   - Opening deposit: Any amount (even GH¢1)

2. **Personal Savings Account**
   - 5% Annual Percentage Yield (APY) paid quarterly
   - GH₵200 minimum opening deposit
   - No monthly fees with GH₵500 minimum balance
   - Monthly fee of GH¢5 if balance below GH₵500
   - Automatic savings tools and standing orders available
   - Free digital statements and mobile banking
   - Interest calculation examples provided on request

3. **Student Account**
   - GH¢0 minimum balance required
   - No monthly fees for entire student period
   - Free student debit card with university branding
   - Requirements: Ghana Card, current Student ID, proof of enrollment
   - Educational loans with preferential rates available
   - Special student rewards and discounts program
   - Career development workshops available

4. **Business Starter Account**
   - GH₵500 minimum opening deposit
   - Low transaction costs (GH¢1 per internal transfer)
   - Mobile merchant portal for business payments
   - Business debit card with higher withdrawal limits
   - Basic online banking platform
   - Monthly fee: GH¢10

5. **Business Premium Account**
   - GH₵2,000 minimum opening deposit
   - Monthly fee: GH¢50
   - Dedicated relationship manager assigned
   - Advanced online banking with bulk payments
   - Priority customer support (dedicated phone line)
   - Business analytics and reporting tools
   - Preferential loan rates and faster approvals

**Loans & Credit Products:**
- Personal loans: GH₵1,000 - GH₵100,000, 18-25% APR, 3-5 days approval
- Salary loans: Up to 6 months gross salary, 24-48 hours approval
- Business loans: GH₵10,000 - GH₵500,000, collateral requirements vary
- Educational loans: Up to GH₵20,000 per year, flexible repayment
- Equipment financing: Up to GH₵1,000,000, 7-year terms available
- All loans require: Ghana Card, income proof, bank statements, guarantors

**Digital Banking Features:**
- Mobile app for Android/iOS with fingerprint/face login
- 24/7 online banking with full functionality
- Mobile money integration (MTN, Vodafone, AirtelTigo)
- Cardless ATM withdrawals using generated codes
- Real-time SMS/email notifications for all transactions
- Bill payments: ECG, GWCL, DSTV, school fees, taxes
- International transfers via SWIFT
- QR code payments at merchants

**Money Transfer Services:**
- USSD Short Code: *718# (works without internet)
- Mobile banking app transfers
- Online banking transfers
- Transfer to other banks available
- Daily limits: USSD GH¢10,000, App GH¢50,000, Online GH¢100,000
- Quick transfer codes: *718*1*recipient*amount*pin#

**Short Code Services:**
- *718# - Main menu
- *718*1# - Transfers
- *718*2# - Balance inquiry
- *718*3*amount# - Airtime purchase
- Available on all phones, no data required

**Branch Network and Services:**
- Accra: Central, Ring Road, East Legon, Accra Mall, Tema, Spintex, Madina, Achimota
- Other regions: Kumasi (Adum, Ahodwo), Takoradi, Tamale, Cape Coast, Sunyani, Ho
- All branches: Monday-Friday 8AM-5PM, Saturday 9AM-1PM
- 50+ ATMs nationwide with 24/7 access
- Appointment booking available via phone or app

**Complete Contact Information:**
- Main phone: 030 221 2222 (24/7 for emergencies)
- Customer service: 024 123 4567 (Mon-Sat 8AM-6PM)
- Email: info@ghanatrustbank.com (general inquiries)
- Support: support@ghanatrustbank.com (technical issues)
- Fraud hotline: 0800 123 456 (toll-free, 24/7)
- Head Office: Ring Road Central, Opposite DSTV Office, Accra

**Security and Fraud Protection:**
- 256-bit SSL encryption on all platforms
- Two-factor authentication for online banking
- Real-time fraud monitoring 24/7
- Card blocking via mobile app instantly
- SMS alerts for all transactions above GH¢100
- Never share PIN, password, or OTP codes
- Regular security updates and patches

**Response Guidelines:**
- Always provide specific, actionable information with exact numbers and requirements
- Give step-by-step instructions for complex processes
- Include realistic timeframes, costs, and document requirements
- Offer multiple solutions when available (online vs in-person options)
- Provide practical tips to avoid common problems and delays
- Format responses with clear headings, bullet points, and numbered steps
- Always suggest next steps and what users should do next
- If uncertain about specific details, direct to appropriate contact channel
- Be proactive in anticipating follow-up questions and answering them
- Provide examples and scenarios to help users understand better
- Include warnings about common scams and security best practices
- Never mention being an AI or automated system
- Always respond as a human banking representative
- Use natural, conversational language throughout`;

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
    console.log('Generating AI response for:', userMessage);
    
    // Check if API key is configured
    const isKeyConfigured = OPENAI_API_KEY && 
                           OPENAI_API_KEY.startsWith('sk-') &&
                           OPENAI_API_KEY.length > 20;
    
    if (!isKeyConfigured) {
        console.log('OpenAI API key not properly configured, using fallback responses');
        return generateFallbackResponse(userMessage);
    }
    
    console.log('Using OpenAI API for response generation');
    console.log('API Key status:', OPENAI_API_KEY ? 'Present' : 'Missing');
    console.log('API Key length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);
    
    try {
        // Add user message to conversation history
        conversationHistory.push({ role: 'user', content: userMessage });
        
        // Keep only last 10 messages for context
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }
        
        // Dynamic system prompt based on conversation context
        let dynamicSystemPrompt = SYSTEM_PROMPT;
        
        // Add critical instruction to never mention AI
        dynamicSystemPrompt += "\n\n**CRITICAL: Never mention being an AI, automated, or virtual assistant. Always respond as a human banking representative. Use natural human language patterns.**";
        
        // Add context-specific instructions
        if (conversationHistory.length > 2) {
            dynamicSystemPrompt += "\n\n**Conversation Context:** You are continuing an ongoing conversation. Provide varied, natural responses that build on previous exchanges. Avoid repeating the same information. Focus on addressing the user's specific current question while maintaining conversational flow.";
        }
        
        // Add variety instruction for longer conversations
        if (conversationHistory.length > 5) {
            dynamicSystemPrompt += "\n\n**Variety Instruction:** Ensure your response is unique and different from previous responses. Use different phrasing, examples, or approaches. Reference previous conversation points naturally but don't repeat the same exact information.";
        }
        
        // Prepare messages array with dynamic system prompt and conversation history
        const messages = [
            { role: 'system', content: dynamicSystemPrompt },
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
                max_tokens: 1000, // Increased for comprehensive responses
                temperature: 0.7, // Balanced for consistency and creativity
                top_p: 0.9, // Good balance for diverse but coherent responses
                frequency_penalty: 0.3, // Reduce repetition while maintaining quality
                presence_penalty: 0.4  // Encourage new topics without losing focus
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenAI API Error:', response.status, errorData);
            throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Unexpected API response format:', data);
            throw new Error('Invalid API response format');
        }
        
        let aiResponse = data.choices[0].message.content.trim();
        
        // Post-process to remove any repetitive content
        aiResponse = removeRepetitiveContent(aiResponse);
        
        // Add AI response to conversation history
        conversationHistory.push({ role: 'assistant', content: aiResponse });
        
        return aiResponse;
        
    } catch (error) {
        console.error('OpenAI API error:', error);
        console.log('Falling back to keyword-based responses');
        return generateFallbackResponse(userMessage);
    }
}

// Remove repetitive content from AI responses
function removeRepetitiveContent(text) {
    // Split into sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const uniqueSentences = [];
    const seenContent = new Set();
    
    for (const sentence of sentences) {
        const cleanSentence = sentence.trim().toLowerCase();
        
        // Skip if very similar to already seen content
        let isDuplicate = false;
        for (const seen of seenContent) {
            if (cleanSentence.includes(seen) || seen.includes(cleanSentence)) {
                isDuplicate = true;
                break;
            }
        }
        
        if (!isDuplicate) {
            uniqueSentences.push(sentence.trim());
            seenContent.add(cleanSentence.substring(0, 20)); // Store first 20 chars for comparison
        }
    }
    
    // Reconstruct with proper punctuation
    return uniqueSentences.map((s, i) => {
        if (i === uniqueSentences.length - 1) {
            return s;
        }
        return s + '.';
    }).join(' ');
}

// Fallback response generator (enhanced keyword-based with comprehensive coverage)
function generateFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Generating fallback response for:', lowerMessage);
    
    // Get conversation context for variety
    const messageCount = conversationHistory.length;
    
    // Check for greeting
    if (/\b(hi|hello|hey|good morning|good afternoon|good evening|how are you|welcome)\b/.test(lowerMessage)) {
        const greetings = [
            "Hello! It's wonderful to connect with you today at Ghana Trust Bank. I'm here to make your banking journey smooth and successful. Whether you're exploring account options, considering a loan, or just have questions about our services, I'm excited to help. What's bringing you to us today?",
            
            "Hi there! Thank you for choosing Ghana Trust Bank for your banking needs. I'm here to provide you with personalized guidance and solutions that work perfectly for your situation. I can help with everything from basic account setup to complex financial planning. What would you like to explore together?",
            
            "Good day! It's my pleasure to assist you at Ghana Trust Bank. I'm here to listen to your needs and provide tailored solutions that help you achieve your financial goals. Whether you're just starting your banking journey or looking to optimize your current setup, I'm here to help. What's on your mind today?",
            
            "Welcome! I'm so glad you've reached out to Ghana Trust Bank. I'm here to be your trusted banking advisor, helping you navigate everything from simple transactions to major financial decisions. I love helping people find the perfect banking solutions. How can I make your banking experience better today?"
        ];
        return greetings[messageCount % greetings.length];
    }
    
    // Check for farewell
    if (/\b(bye|goodbye|see you|thank you|thanks|appreciate|okay bye)\b/.test(lowerMessage)) {
        const farewells = [
            "It was wonderful helping you today! Thank you for choosing Ghana Trust Bank. Have a fantastic day, and please don't hesitate to reach out if you need anything else!",
            "You're very welcome! I'm so glad I could assist you today. Thank you for banking with us, and I hope you have a wonderful rest of your day!",
            "It was my pleasure to help you! Remember, we're always here for you at Ghana Trust Bank. Take care and come back anytime you need assistance!",
            "Thank you so much for chatting with us! I really enjoyed helping you today. We look forward to serving you again soon at Ghana Trust Bank. Have a great day!"
        ];
        return farewells[messageCount % farewells.length];
    }
    
    // Check banking keywords with varied responses
    if (/\b(account|open account|new account|create account)\b/.test(lowerMessage)) {
        const accountResponses = [
            `I'd be delighted to help you open an account with us! That's a wonderful decision, and I'm here to make the process as smooth as possible for you. 

At Ghana Trust Bank, we have several fantastic options designed to fit different needs:

**Personal Checking** - Perfect for your everyday banking with absolutely no minimum balance requirements
**Personal Savings** - Great for building your future with 5% interest on your savings  
**Student Account** - Completely free for students - we love supporting education!
**Business Accounts** - Tailored specifically for entrepreneurs and business growth

I'd love to learn more about what you're looking for in a bank account. What type of account sounds most appealing to you? I can then walk you through exactly what you'll need and how we can get you set up quickly!`,
            
            `Oh, how exciting! Opening a new account is such a positive step. Let me help you find the perfect fit for your banking needs at Ghana Trust Bank.

We've really thought about different situations when designing our accounts:

For your daily transactions, our **Personal Checking** gives you complete freedom with no fees and a free Visa debit card.
If you're planning to save, our **Personal Savings** helps your money grow with 5% annual interest.
For students, we offer a **completely free Student Account** because we believe in supporting your education journey.
And for our business owners, we have **Business accounts** with features designed to help you succeed.

What's your main goal with this new account? Understanding that will help me guide you to the perfect option and explain exactly what you'll need to get started!`,
            
            `That's fantastic that you're considering Ghana Trust Bank! I'm really excited to help you get started. We've made account opening incredibly simple and convenient.

Let me share your main options:

• **Checking Account** - No minimum balance, free Visa card, and we can usually get you set up in about 15 minutes
• **Savings Account** - Earns 5% interest, just GH₵200 to open, perfect for growing your money
• **Student Account** - Absolutely zero fees, all you need is your student ID - we love supporting students!
• **Business Account** - Special features for business owners with premium services

I'd love to know more about what you're hoping to achieve with your account. Are you looking for everyday banking, saving for something special, or perhaps managing business finances? Once I understand that better, I can give you the complete checklist and guide you through every step!`
        ];
        return accountResponses[messageCount % accountResponses.length];
    }
    
    if (/\b(loan|borrow|credit|financing)\b/.test(lowerMessage)) {
        const loanResponses = [
            `I understand you're looking into financing options - that's a big decision, and I'm here to help you make the best choice for your situation. At Ghana Trust Bank, we really try to make our loans work for people's real needs.

Here are the main ways we can help:

**Personal Loans** - From GH₵1,000 up to GH₵100,000 for those important personal expenses life brings
**Salary Loans** - Quick approval if you're employed, with repayment that works with your paycheck  
**Business Loans** - We love supporting local businesses with capital for growth and operations
**Equipment Financing** - Help you get the equipment you need to move forward

I'd love to understand what you're hoping to accomplish with this loan. Are you looking to cover personal expenses, grow a business, or perhaps something else? Once I know more about your situation, I can guide you to the perfect option and explain exactly what you'll need!`,
            
            `I'm so glad you're exploring loan options with us! Getting the right financing can really make a difference in achieving your goals. Let me help you understand what we offer at Ghana Trust Bank.

We've designed our loans to fit different life situations:

For personal needs, our **Personal Loans** come with competitive rates and terms that work with your budget.
If you're employed, our **Salary Loans** offer really fast approval with repayment that aligns with your payday.
For our entrepreneurs, **Business Loans** provide the capital you need to expand and succeed.
We also have **Equipment Financing** to help you get the tools you need for your work.

What's driving your interest in a loan right now? Understanding your goals will help me recommend the best option and walk you through exactly what the process looks like!`,
            
            `I appreciate you trusting us with your financing needs! Getting a loan is an important step, and I want to make sure you find exactly what works for you. At Ghana Trust Bank, we've structured our loans to be as helpful as possible.

Here's what we can offer:

**Quick Personal Loans** - Usually get funds to you in 3-5 days for personal needs
**Salary Advance Loans** - Super quick 24-48 hour approval if you're employed
**Business Growth Loans** - Up to GH₵500,000 for business expansion - we love supporting local businesses!
**Asset Financing** - Flexible terms to help you purchase equipment for your work

I'd really like to understand your situation better. What are you hoping to achieve with this financing? Once I know more about your goals and circumstances, I can guide you through the perfect option and make the whole process as smooth as possible!`
        ];
        return loanResponses[messageCount % loanResponses.length];
    }
    
    if (/\b(branch|location|office|atm)\b/.test(lowerMessage)) {
        const locationResponses = [
            `Ghana Trust Bank is conveniently located across Ghana! Here are our main areas:

**Accra Region:** Central, Ring Road, East Legon, Accra Mall, Tema, Spintex, Madina, Achimota
**Ashanti Region:** Kumasi Adum and Ahodwo branches
**Western Region:** Takoradi Market Circle
**Northern Region:** Tamale Central Business District
**Other Regions:** Cape Coast, Sunyani, Ho

All branches operate Mon-Fri 8AM-5PM, Sat 9AM-1PM. We also have 50+ ATMs available 24/7.

Which location are you nearest to? I can provide specific directions and services available.`,
            
            `I can help you find the nearest Ghana Trust Bank location! We have extensive coverage:

In **Accra**, we have 8 branches including Central, Ring Road, East Legon, and Accra Mall.
**Kumasi** serves the Ashanti region with Adum and Ahodwo locations.
**Takoradi** covers the Western region, while **Tamale** serves the North.
We're also in **Cape Coast, Sunyani, and Ho**.

What area are you looking for? I'll give you exact addresses and contact details for that branch.`,
            
            `Finding a Ghana Trust Bank location is easy! We're strategically positioned:

**Greater Accra:** 8 branches covering all major areas
**Ashanti:** 2 branches in Kumasi (Adum, Ahodwo)
**Western:** Takoradi branch at Market Circle
**Northern:** Tamale Central Business District
**Other regions:** Cape Coast, Sunyani, Ho

All branches have full services and ATMs. Operating hours are Mon-Fri 8AM-5PM, Sat 9AM-1PM.

Which region interests you? I'll provide specific location details and available services.`
        ];
        return locationResponses[messageCount % locationResponses.length];
    }
    
    if (/\b(contact|phone|email|call|support)\b/.test(lowerMessage)) {
        const contactResponses = [
            `You can reach Ghana Trust Bank through multiple convenient channels:

**24/7 Support:** 030 221 2222 (emergencies anytime)
**Customer Service:** 024 123 4567 (Mon-Sat 8AM-6PM)
**Fraud Hotline:** 0800 123 456 (toll-free, 24/7)

**Email Support:**
- General inquiries: info@ghanatrustbank.com
- Technical support: support@ghanatrustbank.com
- Fraud reports: fraud@ghanatrustbank.com

**Visit Us:** Ring Road Central, Opposite DSTV Office, Accra

How can I assist you further? Are you looking for help with a specific banking service?`,
            
            `Ghana Trust Bank offers several ways to get in touch with us:

**Phone Support:**
- Main line: 030 221 2222 (available 24/7)
- Customer service: 024 123 4567 (business hours)
- Fraud emergencies: 0800 123 456 (free call)

**Digital Contact:**
- Email: info@ghanatrustbank.com
- Support: support@ghanatrustbank.com
- Website: www.ghanatrustbank.com

**Physical Location:** Ring Road Central, Accra

What specific assistance do you need? I can guide you to the right contact channel.`,
            
            `I'm here to help, and you can also reach Ghana Trust Bank directly:

**Immediate Assistance:** Call 030 221 2222 (24/7 available)
**Business Hours Support:** 024 123 4567 (Mon-Sat 8AM-6PM)
**Fraud Reporting:** 0800 123 456 (toll-free, 24/7)

**Email Options:**
info@ghanatrustbank.com for general questions
support@ghanatrustbank.com for technical help

**In-Person:** Visit our head office at Ring Road Central, Accra

What banking matter can I help you with right now?`
        ];
        return contactResponses[messageCount % contactResponses.length];
    }
    
    // Enhanced specific keyword matching for better responses
    if (/\b(short code|ussd|transfer money|send money|mobile transfer|code|dial|718|\*718\#|money transfer|how to transfer|transfer to other bank|bank transfer)\b/.test(lowerMessage)) {
        return `I'd be happy to help you with Ghana Trust Bank's short codes and money transfer services! Here are all the ways you can transfer money:

**Ghana Trust Bank USSD Short Code:**
- Dial *718# on any phone (no internet required)
- Menu options: 1=Transfer, 2=Balance, 3=Airtime, 4=Bill Payment, 5=More

**Money Transfer Options:**

**1. USSD Transfers (*718#):**
- Dial *718# → Select 1 (Transfer) → Choose account
- Enter recipient's account number or phone number
- Enter amount and confirm with PIN
- Works on all phones, no data needed

**2. Mobile Banking App:**
- Download "GTB Mobile" from App Store/Play Store
- Login with your credentials
- Select "Transfer" → Choose recipient
- Enter amount and authenticate

**3. Online Banking:**
- Visit www.ghanatrustbank.com
- Login to online banking
- Go to "Transfers" → Complete transfer

**Transfer Limits:**
- USSD: GH¢10,000 per day
- Mobile App: GH¢50,000 per day
- Online: GH¢100,000 per day

**Transfer to Other Banks:**
- Use *718# → Option 1 → Option 2 (Other Banks)
- Available banks: Ecobank, GCB, CBG, Stanbic, Absa, etc.
- Fee: GH¢2-5 depending on amount

**Quick Transfer Codes:**
- *718*1*recipient*amount*pin# (Direct transfer)
- *718*2# (Check balance)
- *718*3*amount# (Buy airtime)

**Security Tips:**
- Never share your PIN with anyone
- Always verify recipient details before sending
- Check transaction confirmation SMS
- Report suspicious activity to 0800 123 456

Need help with a specific transfer? I can walk you through the exact steps!`;
    }
    
    if (/\b(interest rate|rates|apy|yield|return)\b/.test(lowerMessage)) {
        return `I'd be happy to help you understand our interest rates at Ghana Trust Bank! Here are our current rates:

**Savings Accounts:**
- Personal Savings: 5% APY paid quarterly
- Student Account: 3% APY (no minimum balance required)

**Loan Interest Rates:**
- Personal Loans: 18-25% APR based on credit profile
- Salary Loans: 22-28% APR with employment verification
- Business Loans: 15-20% APR with collateral
- Equipment Financing: 12-18% APR depending on term length

**Special Rates:**
- Fixed deposit rates: 6-8% APY for 6-24 month terms
- Educational loans: 15% APR for qualified students

Rates can vary based on your credit profile, loan amount, and term length. Would you like me to explain any of these rates in more detail or help you understand which might apply to your situation?`;
    }
    
    if (/\b(requirements|documents|needed|what do i need|id|ghana card)\b/.test(lowerMessage)) {
        return `Let me help you understand the requirements for our banking services at Ghana Trust Bank!

**For Personal Accounts:**
- Valid Ghana Card (required for all accounts)
- Proof of address (utility bill, rental agreement, or letter from employer)
- Passport photograph (recent, clear)
- Minimum opening deposit (varies by account type)

**For Student Accounts:**
- Ghana Card
- Valid Student ID from recognized institution
- Proof of enrollment (admission letter or registration confirmation)
- Passport photograph
- No minimum deposit required

**For Loans:**
- Ghana Card
- Recent payslips (3-6 months for salary loans)
- Bank statements (3-6 months)
- Proof of employment or business registration
- Collateral documents (for secured loans)
- Guarantor information (when required)

**For Business Accounts:**
- Business registration certificate
- Tax identification number
- Directors' Ghana Cards
- Business address proof
- Minimum opening deposit: GH₵500

Which specific service are you interested in? I can provide a detailed checklist of exactly what you'll need!`;
    }
    
    if (/\b(fees|charges|cost|monthly fee|maintenance fee)\b/.test(lowerMessage)) {
        return `I'm happy to explain our fee structure at Ghana Trust Bank! We believe in transparent pricing:

**Account Fees:**
- Personal Checking: GH¢0 monthly maintenance fees forever
- Personal Savings: GH¢5/month if balance below GH₵500 (no fees above GH₵500)
- Student Account: Completely free - no monthly fees
- Business Starter: GH¢10/month
- Business Premium: GH¢50/month

**Transaction Fees:**
- Internal transfers: GH¢1 (Business accounts only)
- ATM withdrawals: Free at GTB ATMs, GH¢2.50 at other banks
- Mobile money transfers: GH¢1-2 depending on amount
- International transfers: Varies by destination and amount

**Card Fees:**
- Debit card issuance: Free for all new accounts
- Card replacement: GH¢20 for lost/damaged cards
- Annual card fee: GH¢0 (we don't charge annual fees!)

**Other Services:**
- Account statements: Free digital, GH¢5 for printed statements
- Bank drafts: GH¢10-25 depending on amount
- Stop payment orders: GH¢15

Which fees would you like me to explain in more detail? I can also help you find ways to minimize or avoid certain fees!`;
    }
    
    if (/\b(hours|time|when are you open|closing|operating)\b/.test(lowerMessage)) {
        return `I'd be happy to share our operating hours at Ghana Trust Bank! We want to make banking convenient for you:

**Branch Hours:**
- Monday to Friday: 8:00 AM - 5:00 PM
- Saturday: 9:00 AM - 1:00 PM
- Sunday: Closed (for branch visits)

**24/7 Services Available:**
- ATM withdrawals at all 50+ locations nationwide
- Mobile banking app (full functionality)
- Online banking platform
- Customer service hotline: 030 221 2222 (emergencies)
- Fraud reporting: 0800 123 456 (toll-free, 24/7)

**Extended Hours Services:**
- Customer service: 024 123 4567 (Mon-Sat 8AM-6PM)
- Digital banking support: Available 24/7 through app and online

**Holiday Schedule:**
- Most public holidays: Branches closed, ATMs and digital services available
- Special holiday hours posted on our website and app

Is there a specific branch or service you're planning to visit? I can provide more detailed information about that location's specific services and any special considerations!`;
    }
    
    // Default responses with variety and personality
    const defaultResponses = [
        `I'm really glad you reached out to us today! I'm here to help with anything you need to know about Ghana Trust Bank. Whether you're thinking about opening an account, exploring loan options, or just have questions about our services, I'm here to make things clear and easy for you.

I can help you with:
• Finding the perfect account for your needs
• Understanding our loan options and how they work
• Setting up digital banking for your convenience
• Finding the nearest branch or ATM
• Any questions about cards, security, or fees
• Interest rates and current promotions
• Requirements and documentation needed

What's on your mind today? I'd love to help you with whatever banking questions you have!`,
        
        `Thank you for chatting with me at Ghana Trust Bank! I'm here to make your banking experience as smooth and pleasant as possible. I have lots of helpful information about all our services, and I'm excited to share whatever you need to know.

I can help you explore:
✓ Different account types and which might be perfect for you
✓ Loan options that fit your specific situation
✓ Digital banking features to make life easier
✓ Our branch locations and when you can visit
✓ Security tips to keep your banking safe
✓ Current rates and any fees you might be wondering about
✓ Requirements and documentation needed

What banking topic interests you most right now? I'm here to help!`,
        
        `I'm so happy you stopped by Ghana Trust Bank today! I really enjoy helping people understand their banking options and finding solutions that work perfectly for their needs. Think of me as your friendly banking guide!

I'm here to help you with:
🏦 Finding the right account and understanding the opening process
💰 Exploring loan options that match your goals
📱 Setting up convenient digital banking services
📍 Locating branches and understanding our services
💳 Card services and keeping everything secure
📊 Understanding rates, fees, and how everything works
📋 Requirements and documentation needed

What would you like to explore together? I'm here to answer all your questions and make banking simple for you!`
    ];
    
    return defaultResponses[messageCount % defaultResponses.length];
}

// Initialize chat widget
function initChatWidget() {
    // Don't initialize if already exists
    if (document.getElementById('gtbChatModal')) return;
    
    console.log('Initializing Ghana Trust Bank AI Chat Widget...');
    
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Chat with Us</span>
        </div>

        <!-- Chat Modal -->
        <div id="gtbChatModal" style="
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
        ">
            <div style="
                background: white;
                border-radius: 16px;
                width: 90%;
                max-width: 450px;
                max-height: 80vh;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            ">
                <div id="gtbChatHeader" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    background: linear-gradient(135deg, #1e40af, #3b82f6);
                    color: white;
                ">
                    <div>
                        <h3 style="margin: 0; font-size: 1rem;">Ghana Trust Bank</h3>
                        <span id="gtbChatStatus" style="font-size: 0.75rem; opacity: 0.9; display: flex; align-items: center; gap: 0.25rem;">
                    <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></span>
                    Representative Online
                </span>
                    </div>
                    <button onclick="closeChat()" style="
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
                    ">&times;</button>
                </div>
                <div id="gtbChatMessages" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    background: #f8fafc;
                    min-height: 300px;
                    max-height: 400px;
                ">
                    <div style="margin-bottom: 1rem; display: flex; flex-direction: column; align-items: flex-start;">
                        <div style="
                            max-width: 85%;
                            padding: 0.75rem 1rem;
                            border-radius: 12px;
                            font-size: 0.9rem;
                            line-height: 1.5;
                            background: white;
                            color: #1e293b;
                            border: 1px solid #e2e8f0;
                        ">Hello! Welcome to Ghana Trust Bank. I'm your banking assistant. I can help you with account opening, loans, digital banking, and more. How may I assist you today?</div>
                    </div>
                </div>
                <div id="gtbTypingIndicator" style="
                    display: none;
                    padding: 0.75rem 1rem;
                    color: #64748b;
                    font-size: 0.8rem;
                    align-items: center;
                    gap: 0.5rem;
                ">
                    <span style="width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; animation: typing 1.4s infinite;"></span>
                    <span style="width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; animation: typing 1.4s infinite 0.2s;"></span>
                    <span style="width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; animation: typing 1.4s infinite 0.4s;"></span>
                    <span style="margin-left: 0.5rem;">Assistant is typing...</span>
                </div>
                <div style="
                    padding: 1rem;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 0.5rem;
                    background: white;
                ">
                    <input type="text" id="gtbChatInput" placeholder="Type your message..." onkeypress="handleChatKeyPress(event)" style="
                        flex: 1;
                        padding: 0.75rem 1rem;
                        border: 1px solid #e2e8f0;
                        border-radius: 24px;
                        font-size: 0.9rem;
                        outline: none;
                    ">
                    <button onclick="sendChatMessage()" style="
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
                    ">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <style>
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
            
            @keyframes pulse {
                0%, 100% { 
                    opacity: 1; 
                    transform: scale(1);
                }
                50% { 
                    opacity: 0.7; 
                    transform: scale(1.1);
                }
            }
            
            /* Mobile Responsive */
            @media (max-width: 480px) {
                #gtbChatModal > div {
                    width: 100%;
                    height: 100vh;
                    max-height: 100vh;
                    border-radius: 0;
                }
                
                #gtbChatMessages {
                    max-height: calc(100vh - 140px);
                    min-height: calc(100vh - 140px);
                }
                
                #gtbChatButton span {
                    display: none;
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
    
    console.log('Ghana Trust Bank AI Chat Widget initialized');
}

// Open chat widget
function openChat() {
    const modal = document.getElementById('gtbChatModal');
    if (modal) {
        modal.style.display = 'flex';
        isChatOpen = true;
        
        // Setup chat session
        currentChatId = getChatSessionId();
        if (database) {
            chatRef = database.ref('chats/' + currentChatId + '/messages');
            
            // Listen for admin messages
            if (messageListener) {
                chatRef.off('child_added', messageListener);
            }
            
            messageListener = chatRef.on('child_added', (snapshot) => {
                const message = snapshot.val();
                if (message && message.sender === 'representative' && !message.isAI) {
                    // Admin message detected - admin has taken over
                    if (!isAdminActive) {
                        isAdminActive = true;
                        showAdminTakeoverNotification();
                        updateChatStatus('Admin Representative');
                        showNotification('Admin representative has joined the chat');
                    }
                    addMessageToUI(message.text, 'representative', formatTime(message.timestamp));
                }
            });
        }
        
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
        modal.style.display = 'none';
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
    
    // Generate and send AI response (only if admin hasn't taken over)
    if (!isAdminActive) {
        showTypingIndicator();
        
        try {
            // Add human-like delay based on message complexity
            const typingDelay = calculateTypingDelay(message);
            await new Promise(resolve => setTimeout(resolve, typingDelay));
            
            const aiResponse = await generateAIResponse(message);
            const aiTimestamp = Date.now();
            
            hideTypingIndicator();
            
            // Add a small delay before showing response for natural feel
            await new Promise(resolve => setTimeout(resolve, 300));
            
            addMessageToUI(aiResponse, 'representative', formatTime(aiTimestamp));
            
            // Store AI response in Firebase too
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
            
            // Show human-like error message
            const errorMsg = "I apologize, but I'm having a bit of trouble responding right now. Could you try asking that question differently, or feel free to call us at 030 221 2222 for immediate assistance?";
            addMessageToUI(errorMsg, 'representative', formatTime(Date.now()));
        }
    }
}

// Calculate human-like typing delay based on message complexity
function calculateTypingDelay(message) {
    const baseDelay = 800; // Minimum 800ms
    const complexityMultiplier = message.split(' ').length * 50; // 50ms per word
    const randomVariation = Math.random() * 500; // Random variation up to 500ms
    
    return Math.min(baseDelay + complexityMultiplier + randomVariation, 3000); // Max 3 seconds
}

// Add message to UI
function addMessageToUI(text, sender, time) {
    const messagesContainer = document.getElementById('gtbChatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'margin-bottom: 1rem; display: flex; flex-direction: column;';
    
    // Convert markdown-style formatting to HTML
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    
    if (sender === 'user') {
        messageDiv.style.alignItems = 'flex-end';
        messageDiv.innerHTML = `
            <div style="
                max-width: 85%;
                padding: 0.75rem 1rem;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.5;
                background: #3b82f6;
                color: white;
            ">${formattedText}</div>
            <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 0.25rem;">${time}</div>
        `;
    } else {
        messageDiv.style.alignItems = 'flex-start';
        messageDiv.innerHTML = `
            <div style="
                max-width: 85%;
                padding: 0.75rem 1rem;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.5;
                background: white;
                color: #1e293b;
                border: 1px solid #e2e8f0;
            ">${formattedText}</div>
            <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 0.25rem;">${time}</div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const indicator = document.getElementById('gtbTypingIndicator');
    if (indicator) {
        indicator.style.display = 'flex';
    }
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('gtbTypingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// Update chat status
function updateChatStatus(status) {
    const statusElement = document.getElementById('gtbChatStatus');
    if (statusElement) {
        statusElement.innerHTML = `
            <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></span>
            ${status}
        `;
    }
}

// Show notification
function showNotification(message) {
    const messagesContainer = document.getElementById('gtbChatMessages');
    if (messagesContainer) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 4px;
            font-size: 0.8rem;
            color: #92400e;
        `;
        notification.textContent = message;
        messagesContainer.appendChild(notification);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Handle Enter key
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
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
