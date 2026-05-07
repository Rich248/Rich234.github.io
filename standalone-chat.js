// Standalone Chat Widget - No Dependencies
console.log('Standalone chat.js loading...');

// Global variables
let isChatOpen = false;

// Initialize chat widget
function initStandaloneChat() {
    console.log('Initializing standalone chat widget...');
    
    // Check if already exists
    if (document.getElementById('standaloneChatModal')) {
        console.log('Chat widget already exists');
        return;
    }
    
    // Create chat HTML
    const chatHTML = `
        <!-- Floating Chat Button -->
        <div id="standaloneChatButton" onclick="openStandaloneChat()" style="
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
            display: flex !important;
            align-items: center;
            gap: 0.5rem;
            z-index: 99999 !important;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            visibility: visible !important;
            opacity: 1 !important;
            border: none;
        ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Chat with Us</span>
        </div>

        <!-- Chat Modal -->
        <div id="standaloneChatModal" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100000;
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
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    background: linear-gradient(135deg, #1e40af, #3b82f6);
                    color: white;
                ">
                    <div>
                        <h3 style="margin: 0; font-size: 1rem;">Ghana Trust Bank</h3>
                        <span style="font-size: 0.75rem; opacity: 0.9;">Online Representative</span>
                    </div>
                    <button onclick="closeStandaloneChat()" style="
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
                <div id="standaloneChatMessages" style="
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
                            border-bottom-left-radius: 4px;
                        ">Hello! Welcome to Ghana Trust Bank. I'm your virtual banking assistant. How can I help you today?</div>
                    </div>
                </div>
                <div style="
                    padding: 1rem;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 0.5rem;
                    background: white;
                ">
                    <input type="text" id="standaloneChatInput" placeholder="Type your message..." onkeypress="handleStandaloneKeyPress(event)" style="
                        flex: 1;
                        padding: 0.75rem 1rem;
                        border: 1px solid #e2e8f0;
                        border-radius: 24px;
                        font-size: 0.9rem;
                        outline: none;
                    ">
                    <button onclick="sendStandaloneMessage()" style="
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
    `;
    
    // Insert chat widget
    const div = document.createElement('div');
    div.innerHTML = chatHTML;
    document.body.appendChild(div);
    
    // Verify the chat button was added
    const chatButton = document.getElementById('standaloneChatButton');
    if (chatButton) {
        console.log('✅ Standalone chat button successfully added to page');
        console.log('Chat button element:', chatButton);
        console.log('Button visible:', chatButton.offsetWidth > 0 && chatButton.offsetHeight > 0);
    } else {
        console.error('❌ Failed to add standalone chat button to page');
    }
    
    console.log('✅ Standalone chat widget initialized');
}

// Chat functions
function openStandaloneChat() {
    console.log('Opening standalone chat');
    document.getElementById('standaloneChatModal').style.display = 'flex';
    isChatOpen = true;
}

function closeStandaloneChat() {
    console.log('Closing standalone chat');
    document.getElementById('standaloneChatModal').style.display = 'none';
    isChatOpen = false;
}

function sendStandaloneMessage() {
    const input = document.getElementById('standaloneChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addStandaloneMessage(message, 'user');
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const responses = [
            "Thank you for your message! How can I assist you with your banking needs today?",
            "I'm here to help! What specific banking information do you need?",
            "Hello! I can help you with account opening, loans, and other banking services. What would you like to know?",
            "Thank you for reaching out to Ghana Trust Bank. How may I assist you today?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addStandaloneMessage(randomResponse, 'bot');
    }, 1000);
}

function handleStandaloneKeyPress(event) {
    if (event.key === 'Enter') {
        sendStandaloneMessage();
    }
}

function addStandaloneMessage(text, sender) {
    const messagesContainer = document.getElementById('standaloneChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'margin-bottom: 1rem; display: flex; flex-direction: column;';
    
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
                border-bottom-right-radius: 4px;
            ">${text}</div>
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
                border-bottom-left-radius: 4px;
            ">${text}</div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    console.log('DOM still loading, adding DOMContentLoaded listener');
    document.addEventListener('DOMContentLoaded', initStandaloneChat);
} else {
    console.log('DOM already loaded, initializing immediately');
    initStandaloneChat();
}

// Expose functions globally
window.openStandaloneChat = openStandaloneChat;
window.closeStandaloneChat = closeStandaloneChat;
window.sendStandaloneMessage = sendStandaloneMessage;
window.handleStandaloneKeyPress = handleStandaloneKeyPress;

console.log('Standalone chat.js loaded successfully');
