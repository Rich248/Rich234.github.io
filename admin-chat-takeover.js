/**
 * Ghana Trust Bank - Admin Chat Takeover Module
 * Allows admin representatives to take over AI conversations
 */

// Firebase Configuration (same as chat widget)
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
let adminDatabase;
let adminChatsRef;
let activeChats = {};
let currentAdminChatId = null;

// Initialize Admin Chat System
function initAdminChatSystem() {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        adminDatabase = firebase.database();
        adminChatsRef = adminDatabase.ref('chats');
        
        console.log('Admin chat system initialized');
        loadActiveChats();
        setupChatListener();
        
        return true;
    } catch (error) {
        console.error('Admin chat system initialization error:', error);
        return false;
    }
}

// Load active chats
function loadActiveChats() {
    adminChatsRef.on('value', (snapshot) => {
        const chats = snapshot.val();
        updateChatsList(chats);
    });
}

// Update chats list in admin dashboard
function updateChatsList(chats) {
    const chatsContainer = document.getElementById('adminChatsList');
    if (!chatsContainer) return;
    
    let html = '';
    
    for (const [chatId, chatData] of Object.entries(chats || {})) {
        if (chatData.metadata && chatData.metadata.status === 'active') {
            const lastActivity = new Date(chatData.metadata.lastActivity).toLocaleString();
            const isTakenOver = chatData.adminTakeover && chatData.adminTakeover.active;
            
            html += `
                <div class="chat-item ${currentAdminChatId === chatId ? 'active' : ''}" onclick="selectAdminChat('${chatId}')">
                    <div class="chat-info">
                        <h4>Chat ${chatId.substring(0, 8)}...</h4>
                        <p>Last active: ${lastActivity}</p>
                        <p>Status: ${isTakenOver ? 'Admin Active' : 'AI Active'}</p>
                    </div>
                    <div class="chat-actions">
                        ${!isTakenOver ? `
                            <button class="btn-takeover" onclick="takeoverChat('${chatId}', event)">Take Over</button>
                        ` : `
                            <button class="btn-release" onclick="releaseChat('${chatId}', event)">Release to AI</button>
                        `}
                    </div>
                </div>
            `;
        }
    }
    
    chatsContainer.innerHTML = html || '<p>No active chats</p>';
}

// Select admin chat
function selectAdminChat(chatId) {
    currentAdminChatId = chatId;
    loadChatMessages(chatId);
    updateChatsList({});
}

// Load chat messages
function loadChatMessages(chatId) {
    const messagesRef = adminDatabase.ref('chats/' + chatId + '/messages');
    messagesRef.on('value', (snapshot) => {
        const messages = snapshot.val();
        displayChatMessages(messages);
    });
}

// Display chat messages in admin view
function displayChatMessages(messages) {
    const messagesContainer = document.getElementById('adminChatMessages');
    if (!messagesContainer) return;
    
    let html = '';
    
    for (const [messageId, message] of Object.entries(messages || {})) {
        const time = new Date(message.timestamp).toLocaleTimeString();
        const senderClass = message.sender === 'user' ? 'user-message' : 'rep-message';
        const senderLabel = message.sender === 'user' ? 'User' : (message.isAI ? 'AI' : 'Admin');
        
        html += `
            <div class="message ${senderClass}">
                <div class="message-header">
                    <span class="sender">${senderLabel}</span>
                    <span class="time">${time}</span>
                </div>
                <div class="message-content">${message.text}</div>
            </div>
        `;
    }
    
    messagesContainer.innerHTML = html;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Take over chat
function takeoverChat(chatId, event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to take over this chat? The AI will stop responding.')) {
        // Update takeover status
        adminDatabase.ref('chats/' + chatId + '/adminTakeover').set({
            active: true,
            adminId: 'current_admin', // Replace with actual admin ID
            timestamp: Date.now()
        });
        
        // Send takeover message to user
        const takeoverMessage = {
            text: "Hello! I'm a human representative from Ghana Trust Bank. I'll be assisting you from now on.",
            sender: 'representative',
            timestamp: Date.now(),
            isAI: false
        };
        
        adminDatabase.ref('chats/' + chatId + '/messages').push(takeoverMessage);
        
        console.log('Admin took over chat:', chatId);
    }
}

// Release chat back to AI
function releaseChat(chatId, event) {
    event.stopPropagation();
    
    if (confirm('Release this chat back to the AI assistant?')) {
        // Update takeover status
        adminDatabase.ref('chats/' + chatId + '/adminTakeover').set({
            active: false,
            adminId: null,
            timestamp: Date.now()
        });
        
        // Send release message
        const releaseMessage = {
            text: "I'm transferring you back to our AI assistant. They will continue to help you with your banking needs.",
            sender: 'representative',
            timestamp: Date.now(),
            isAI: false
        };
        
        adminDatabase.ref('chats/' + chatId + '/messages').push(releaseMessage);
        
        console.log('Admin released chat:', chatId);
    }
}

// Send admin message
function sendAdminMessage() {
    const input = document.getElementById('adminChatInput');
    const message = input.value.trim();
    
    if (!message || !currentAdminChatId) return;
    
    const messageData = {
        text: message,
        sender: 'representative',
        timestamp: Date.now(),
        isAI: false
    };
    
    adminDatabase.ref('chats/' + currentAdminChatId + '/messages').push(messageData);
    
    // Update last activity
    adminDatabase.ref('chats/' + currentAdminChatId + '/metadata/lastActivity').set(Date.now());
    
    input.value = '';
}

// Setup chat listener
function setupChatListener() {
    // Listen for new messages in current chat
    if (currentAdminChatId) {
        const messagesRef = adminDatabase.ref('chats/' + currentAdminChatId + '/messages');
        messagesRef.on('child_added', (snapshot) => {
            const message = snapshot.val();
            // Auto-scroll to new messages
            setTimeout(() => {
                const messagesContainer = document.getElementById('adminChatMessages');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 100);
        });
    }
}

// Admin Chat HTML Template
function getAdminChatHTML() {
    return `
        <div class="admin-chat-container">
            <div class="admin-chat-sidebar">
                <h3>Active Chats</h3>
                <div id="adminChatsList" class="chats-list">
                    <p>Loading chats...</p>
                </div>
            </div>
            
            <div class="admin-chat-main">
                <div class="chat-header">
                    <h3 id="currentChatTitle">Select a chat to view</h3>
                </div>
                
                <div id="adminChatMessages" class="admin-messages">
                    <p class="no-chat-selected">Select a chat from the sidebar to view messages</p>
                </div>
                
                <div class="admin-input-area">
                    <input type="text" id="adminChatInput" placeholder="Type your message..." onkeypress="handleAdminKeyPress(event)">
                    <button onclick="sendAdminMessage()">Send</button>
                </div>
            </div>
        </div>
        
        <style>
            .admin-chat-container {
                display: flex;
                height: 600px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
                margin: 20px 0;
            }
            
            .admin-chat-sidebar {
                width: 300px;
                background: #f8fafc;
                border-right: 1px solid #e2e8f0;
                overflow-y: auto;
            }
            
            .admin-chat-sidebar h3 {
                padding: 1rem;
                margin: 0;
                background: #3b82f6;
                color: white;
            }
            
            .chats-list {
                max-height: 550px;
                overflow-y: auto;
            }
            
            .chat-item {
                padding: 1rem;
                border-bottom: 1px solid #e2e8f0;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .chat-item:hover {
                background: #e2e8f0;
            }
            
            .chat-item.active {
                background: #3b82f6;
                color: white;
            }
            
            .chat-info h4 {
                margin: 0 0 0.5rem 0;
                font-size: 0.9rem;
            }
            
            .chat-info p {
                margin: 0.25rem 0;
                font-size: 0.8rem;
                opacity: 0.8;
            }
            
            .chat-actions {
                margin-top: 0.5rem;
            }
            
            .btn-takeover, .btn-release {
                padding: 0.25rem 0.5rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
            }
            
            .btn-takeover {
                background: #10b981;
                color: white;
            }
            
            .btn-release {
                background: #f59e0b;
                color: white;
            }
            
            .admin-chat-main {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            
            .chat-header {
                padding: 1rem;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .chat-header h3 {
                margin: 0;
                color: #1e293b;
            }
            
            .admin-messages {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                background: white;
            }
            
            .message {
                margin-bottom: 1rem;
                padding: 0.75rem;
                border-radius: 8px;
            }
            
            .user-message {
                background: #e2e8f0;
                margin-left: 2rem;
            }
            
            .rep-message {
                background: #dbeafe;
                margin-right: 2rem;
            }
            
            .message-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
                font-size: 0.8rem;
            }
            
            .sender {
                font-weight: 600;
                color: #1e293b;
            }
            
            .time {
                color: #64748b;
            }
            
            .message-content {
                line-height: 1.4;
            }
            
            .admin-input-area {
                padding: 1rem;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 0.5rem;
                background: #f8fafc;
            }
            
            .admin-input-area input {
                flex: 1;
                padding: 0.5rem;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
            }
            
            .admin-input-area button {
                padding: 0.5rem 1rem;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .no-chat-selected {
                text-align: center;
                color: #64748b;
                padding: 2rem;
            }
        </style>
    `;
}

// Handle admin Enter key
function handleAdminKeyPress(event) {
    if (event.key === 'Enter') {
        sendAdminMessage();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminChatSystem);
} else {
    initAdminChatSystem();
}

// Expose functions globally
window.initAdminChatSystem = initAdminChatSystem;
window.takeoverChat = takeoverChat;
window.releaseChat = releaseChat;
window.sendAdminMessage = sendAdminMessage;
window.handleAdminKeyPress = handleAdminKeyPress;
window.selectAdminChat = selectAdminChat;
