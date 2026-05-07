/**
 * Ghana Trust Bank - Simple Live Chat Widget
 * Basic working version without complex dependencies
 */

// Global variables
let isChatOpen = false;

// Initialize chat widget
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
}

// Chat functions
function openChat() {
    document.getElementById('gtbChatModal').style.display = 'flex';
    isChatOpen = true;
}

function closeChat() {
    document.getElementById('gtbChatModal').style.display = 'none';
    isChatOpen = false;
}

function sendChatMessage() {
    const input = document.getElementById('gtbChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
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
        addMessage(randomResponse, 'bot');
    }, 1000);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('gtbChatMessages');
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
            ">${text}</div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
