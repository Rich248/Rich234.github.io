// Clean Account Opening Form Validation
class AccountFormValidator {
    constructor() {
        this.form = document.getElementById('accountForm');
        this.currentStep = 1;
        this.formData = {};
        this.initializeValidation();
    }

    initializeValidation() {
        if (!this.form) return;

        // Phone number formatting
        this.setupPhoneFormatting();
        
        // Ghana Card formatting
        this.setupGhanaCardFormatting();
        
        // Digital address formatting
        this.setupDigitalAddressFormatting();
        
        // Form submission
        this.setupFormSubmission();
    }

    setupPhoneFormatting() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;

        phoneInput.setAttribute('maxlength', '15');
        phoneInput.setAttribute('placeholder', '+233 XXXXXXXXX');

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Remove existing +233 or 233
            if (value.startsWith('233')) {
                value = value.slice(3);
            }
            
            // Remove leading 0
            if (value.startsWith('0') && value.length > 1) {
                value = value.slice(1);
            }
            
            // Limit to 9 digits
            if (value.length > 9) {
                value = value.slice(0, 9);
            }
            
            e.target.value = value.length > 0 ? '+233 ' + value : '';
        });

        phoneInput.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            let cleanData = pastedData.replace(/\D/g, '');
            
            if (cleanData.startsWith('233')) cleanData = cleanData.slice(3);
            if (cleanData.startsWith('0')) cleanData = cleanData.slice(1);
            cleanData = cleanData.slice(0, 9);
            
            e.target.value = cleanData.length > 0 ? '+233 ' + cleanData : '';
        });
    }

    setupGhanaCardFormatting() {
        const ghanaCardInput = document.getElementById('ghanaCard');
        if (!ghanaCardInput) return;

        ghanaCardInput.setAttribute('placeholder', 'GHA-XXXXXXX-X');
        ghanaCardInput.setAttribute('maxlength', '14');

        ghanaCardInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase().replace(/[^GHA0-9]/g, '');
            
            // Add dashes at correct positions
            if (value.length >= 4 && value.length <= 10) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else if (value.length >= 11) {
                value = value.slice(0, 3) + '-' + value.slice(3, 10) + '-' + value.slice(10, 11);
            }
            
            e.target.value = value;
        });
    }

    setupDigitalAddressFormatting() {
        const digitalAddressInput = document.getElementById('digitalAddress');
        if (!digitalAddressInput) return;

        digitalAddressInput.setAttribute('placeholder', 'GA-XXX-XXXX');
        digitalAddressInput.setAttribute('maxlength', '11');

        digitalAddressInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            
            if (value.length >= 3 && value.length <= 6) {
                value = value.slice(0, 2) + '-' + value.slice(2);
            } else if (value.length >= 7) {
                value = value.slice(0, 2) + '-' + value.slice(2, 5) + '-' + value.slice(5, 9);
            }
            
            e.target.value = value;
        });
    }

    setupFormSubmission() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateAllSteps()) {
                    this.submitForm();
                }
            });
        }
        
        // Setup account type selection
        this.setupAccountTypeSelection();
    }

    setupAccountTypeSelection() {
        // Initialize account selection
        window.selectedAccountType = null;
        
        // Initially disable proceed button
        const proceedBtn = document.getElementById('proceedToDetailsBtn');
        if (proceedBtn) {
            proceedBtn.disabled = true;
            proceedBtn.style.opacity = '0.6';
            proceedBtn.style.cursor = 'not-allowed';
        }
    }

    selectAccountType(accountType) {
        // Remove selected class from all options
        const accountOptions = document.querySelectorAll('.account-option');
        accountOptions.forEach(option => option.classList.remove('selected'));
        
        // Add selected class to chosen option
        const selectedOption = document.querySelector(`[data-account="${accountType}"]`);
        selectedOption.classList.add('selected');
        
        // Store selected account type
        window.selectedAccountType = accountType;
        this.formData.accountType = accountType;
        
        // Show selection summary
        this.showAccountSelectionSummary(accountType);
        
        // Enable proceed button
        const proceedBtn = document.getElementById('proceedToDetailsBtn');
        if (proceedBtn) {
            proceedBtn.disabled = false;
            proceedBtn.style.opacity = '1';
            proceedBtn.style.cursor = 'pointer';
        }
        
        // Scroll to summary
        const summary = document.getElementById('selectedAccountSummary');
        if (summary) {
            summary.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showAccountSelectionSummary(accountType) {
        const summaryDiv = document.getElementById('selectedAccountSummary');
        const accountText = document.getElementById('selectedAccountText');
        const featuresDiv = document.getElementById('selectedAccountFeatures');
        
        const accountDetails = {
            checking: {
                name: 'Personal Checking Account',
                features: [
                    'No minimum balance requirement',
                    'Free mobile banking app',
                    'Mobile money integration',
                    'Free debit card included'
                ]
            },
            savings: {
                name: 'Personal Savings Account', 
                features: [
                    '15% annual interest rate',
                    'No monthly maintenance fees',
                    'Automatic savings options',
                    'Quarterly interest payments'
                ]
            },
            business: {
                name: 'Business Banking Account',
                features: [
                    'Business credit card facility',
                    'Payroll management services',
                    'Merchant payment processing',
                    'Dedicated relationship manager'
                ]
            }
        };
        
        const details = accountDetails[accountType];
        
        accountText.textContent = `You have selected: ${details.name}`;
        
        featuresDiv.innerHTML = details.features.map(feature => `
            <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>${feature}</span>
            </div>
        `).join('');
        
        summaryDiv.style.display = 'block';
    }

    showAccountSelectionFeedback(accountType) {
        // Remove existing feedback
        const existingFeedback = document.querySelector('.selection-feedback');
        if (existingFeedback) existingFeedback.remove();
        
        // Create feedback message
        const feedback = document.createElement('div');
        feedback.className = 'selection-feedback';
        
        const messages = {
            checking: 'Checking Account selected - Perfect for everyday banking!',
            savings: 'Savings Account selected - Great for growing your money!',
            business: 'Business Account selected - Ideal for your business needs!'
        };
        
        feedback.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                text-align: center;
                animation: slideDown 0.3s ease;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            ">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span style="font-weight: 600;">${messages[accountType]}</span>
                </div>
            </div>
        `;
        
        // Insert feedback after the account types container
        const accountTypesContainer = document.querySelector('.account-types');
        if (accountTypesContainer) {
            accountTypesContainer.parentNode.insertBefore(feedback, accountTypesContainer.nextSibling);
        }
    }

    validateStep(step) {
        const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!stepElement) return false;

        // Special validation for account type selection (step 2)
        if (step === 2) {
            const selectedCard = document.querySelector('.account-type-card.selected');
            if (!selectedCard) {
                this.showAccountTypeError();
                return false;
            }
        }

        const requiredFields = stepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showAccountTypeError() {
        // Remove existing error
        const existingError = document.querySelector('.account-selection-error');
        if (existingError) existingError.remove();
        
        // Create error message
        const error = document.createElement('div');
        error.className = 'account-selection-error';
        
        error.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                text-align: center;
                animation: slideDown 0.3s ease;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            ">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span style="font-weight: 600;">Please select an account type to continue</span>
                </div>
            </div>
        `;
        
        // Insert error after the account types container
        const accountTypesContainer = document.querySelector('.account-types');
        if (accountTypesContainer) {
            accountTypesContainer.parentNode.insertBefore(error, accountTypesContainer.nextSibling);
        }
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (error.parentNode) {
                error.remove();
            }
        }, 3000);
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Validation rules
        switch(field.type) {
            case 'text':
                if (!value) {
                    errorMessage = 'This field is required';
                    isValid = false;
                } else if (field.id === 'firstName' || field.id === 'lastName') {
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters';
                        isValid = false;
                    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                        errorMessage = 'Name can only contain letters and spaces';
                        isValid = false;
                    }
                } else if (field.id === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errorMessage = 'Please enter a valid email address';
                        isValid = false;
                    }
                } else if (field.id === 'street') {
                    if (value.length < 5) {
                        errorMessage = 'Please enter a complete street address';
                        isValid = false;
                    }
                } else if (field.id === 'city') {
                    if (value.length < 2) {
                        errorMessage = 'Please enter a valid city name';
                        isValid = false;
                    }
                }
                break;

            case 'tel':
                const phoneRegex = /^\+233\s?\d{9}$/;
                if (!phoneRegex.test(value)) {
                    errorMessage = 'Please enter a valid Ghana phone number (+233 XXXXXXXXX)';
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'date':
                if (!value) {
                    errorMessage = 'Please select your date of birth';
                    isValid = false;
                } else {
                    const dob = new Date(value);
                    const today = new Date();
                    const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
                    if (age < 18) {
                        errorMessage = 'You must be at least 18 years old';
                        isValid = false;
                    }
                }
                break;

            case 'select-one':
                if (!value) {
                    errorMessage = 'Please select an option';
                    isValid = false;
                }
                break;
        }

        // Special validations for specific fields
        if (field.id === 'ghanaCard') {
            const ghanaCardRegex = /^GHA-\d{7}-\d{1}$/;
            if (!ghanaCardRegex.test(value)) {
                errorMessage = 'Please enter a valid Ghana Card number (GHA-XXXXXXX-X)';
                isValid = false;
            }
        }

        if (field.id === 'digitalAddress') {
            const digitalAddressRegex = /^[A-Z]{2}-\d{3}-\d{4}$/;
            if (!digitalAddressRegex.test(value)) {
                errorMessage = 'Please enter a valid digital address (XX-000-0000)';
                isValid = false;
            }
        }

        // Show error if invalid
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }

    validateAllSteps() {
        let isValid = true;
        
        for (let step = 1; step <= 5; step++) {
            if (!this.validateStep(step)) {
                isValid = false;
                this.showStep(step);
                break;
            }
        }
        
        return isValid;
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(formStep => {
            formStep.classList.remove('active');
        });
        
        // Remove active class from all step indicators
        document.querySelectorAll('.step').forEach(stepIndicator => {
            stepIndicator.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const currentIndicatorElement = document.querySelector(`.step[data-step="${step}"]`);
        
        if (currentStepElement) currentStepElement.classList.add('active');
        if (currentIndicatorElement) currentIndicatorElement.classList.add('active');
        
        // Mark completed steps
        for (let i = 1; i < step; i++) {
            const completedIndicator = document.querySelector(`.step[data-step="${i}"]`);
            if (completedIndicator) completedIndicator.classList.add('completed');
        }
        
        this.currentStep = step;
    }

    nextStep(step) {
        if (this.validateStep(this.currentStep)) {
            this.showStep(step);
        }
    }

    previousStep(step) {
        this.showStep(step);
    }

    submitForm() {
        // Collect form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        this.showSuccessMessage();
        
        // Here you would normally send data to server
        console.log('Form submitted successfully:', data);
    }

    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                margin: 2rem 0;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            ">
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Account Created Successfully! </h3>
                <p style="margin-bottom: 1.5rem;">Your GhanaTrust Bank account has been created successfully.</p>
                <p style="margin-bottom: 1.5rem;">Account Number: GTB${Math.floor(Math.random() * 9000000000) + 1000000000}</p>
                <button onclick="window.location.href='index.html'" style="
                    background: white;
                    color: #10b981;
            </div>
            
            <div class="account-info" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div style="background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px;">
                    <div style="opacity: 0.8; font-size: 0.875rem; margin-bottom: 0.25rem;">Account Type</div>
                    <div style="font-weight: 600;">${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px;">
                    <div style="opacity: 0.8; font-size: 0.875rem; margin-bottom: 0.25rem;">Status</div>
                    <div style="font-weight: 600; color: #86efac;">Active</div>
                </div>
            </div>
        </div>
        
        <div class="next-steps" style="
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 12px;
            margin-top: 2rem;
        ">
            <h3 style="margin-bottom: 1rem;">What's Next?</h3>
            <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <span style="font-size: 1.5rem;">📱</span>
                    <span>Download our mobile banking app</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <span style="font-size: 1.5rem;">💳</span>
                    <span>Your debit card will arrive in 3-5 business days</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 1.5rem;">🏦</span>
                    <span>Visit any branch to complete in-person verification</span>
                </div>
            </div>
        </div>
        
        <div class="action-buttons" style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
            <button onclick="window.location.href='index.html'" style="
                background: white;
                color: #10b981;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Back to Home</button>
            <button onclick="window.print()" style="
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid white;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Print Details</button>
        </div>
    </div>
`;
}

// Initialize validator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
window.accountValidator = new AccountFormValidator();
    window.accountValidator = new AccountFormValidator();
    
    // Setup file upload handlers
    setupFileUploadHandlers();
    
    // Make functions globally available for onclick handlers
    window.nextStep = (step) => window.accountValidator.nextStep(step);
    window.previousStep = (step) => window.accountValidator.previousStep(step);
    window.goToHome = () => {
        if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
            window.location.href = 'index.html';
        }
    };
});

function setupFileUploadHandlers() {
    // ID Document Upload
    const idUpload = document.getElementById('idUpload');
    if (idUpload) {
        idUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileUpload(file, 'idUpload');
            }
        });
    }
}

function handleFileUpload(file, uploadId) {
    // Show upload status
    showUploadStatus(uploadId, file.name, file.size);
    
    // Simulate file processing
    simulateFileProcessing(uploadId, file);
}

function showUploadStatus(uploadId, fileName, fileSize) {
    const uploadBox = document.getElementById(uploadId).closest('.upload-box');
    
    // Create status display
    const statusDiv = document.createElement('div');
    statusDiv.className = 'upload-status';
    statusDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            animation: slideDown 0.3s ease;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        ">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                    <path d="M9 12h6"/>
                    <path d="M9 16h6"/>
                </svg>
                <div>
                    <div style="font-weight: 600;">File Uploaded Successfully!</div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">${fileName}</div>
                    <div style="font-size: 0.75rem; opacity: 0.8;">${formatFileSize(fileSize)}</div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing status and add new one
    const existingStatus = uploadBox.querySelector('.upload-status');
    if (existingStatus) existingStatus.remove();
    
    uploadBox.appendChild(statusDiv);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const m = k * 1024;
    const g = m * 1024;
    
    if (bytes < k) return bytes + ' Bytes';
    if (bytes < m) return (bytes / k).toFixed(1) + ' KB';
    if (bytes < g) return (bytes / m).toFixed(1) + ' MB';
    return (bytes / g).toFixed(1) + ' GB';
}

function simulateFileProcessing(uploadId, file) {
    // Store file data for form submission
    window.uploadedFiles = window.uploadedFiles || {};
    window.uploadedFiles[uploadId] = file;
    
    // Start ID authenticity verification
    startIdVerification(uploadId, file);
}

function startIdVerification(uploadId, file) {
    const verificationSteps = document.querySelectorAll('.verification-step');
    
    // Step 1: Check ID authenticity
    checkIdAuthenticity(file, uploadId);
    
    // Step 2: Start verification process
    setTimeout(() => {
        updateVerificationStep(1, 'processing', 'Checking ID authenticity...');
    }, 500);
    
    // Step 3: Verify document details
    setTimeout(() => {
        verifyDocumentDetails(file, uploadId);
    }, 2000);
    
    // Step 4: Complete verification
    setTimeout(() => {
        completeVerification(uploadId);
    }, 4000);
}

function checkIdAuthenticity(file, uploadId) {
    // Simulate ID authenticity checks
    const authenticityChecks = [
        'Checking Ghana Card database...',
        'Verifying document format...',
        'Validating security features...',
        'Checking biometric data...'
    ];
    
    let checkIndex = 0;
    const checkInterval = setInterval(() => {
        if (checkIndex < authenticityChecks.length) {
            updateVerificationStep(0, 'processing', authenticityChecks[checkIndex]);
            checkIndex++;
        } else {
            clearInterval(checkInterval);
            updateVerificationStep(0, 'verified', 'ID authenticity confirmed!');
        }
    }, 800);
}

function verifyDocumentDetails(file, uploadId) {
    // Simulate document verification
    const verifications = [
        'Document type: Ghana Card',
        'Issue date: Valid',
        'Expiry date: Valid',
        'Security features: Verified'
    ];
    
    updateVerificationStep(1, 'processing', 'Verifying document details...');
    
    setTimeout(() => {
        updateVerificationStep(1, 'verified', 'Document verified successfully!');
        showVerificationDetails(verifications);
    }, 1500);
}

function showVerificationDetails(details) {
    const verificationProcess = document.querySelector('.verification-process');
    if (!verificationProcess) return;
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'verification-details';
    detailsDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            animation: slideDown 0.3s ease;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        ">
            <h4 style="margin-bottom: 0.5rem; font-weight: 600;">✅ Verification Results:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${details.map(detail => `
                    <li style="padding: 0.25rem 0; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        ${detail}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    verificationProcess.appendChild(detailsDiv);
}

function updateVerificationStep(stepIndex, status, message) {
    const verificationSteps = document.querySelectorAll('.verification-step');
    if (verificationSteps[stepIndex]) {
        const stepContent = verificationSteps[stepIndex].querySelector('.step-content');
        const statusElement = stepContent.querySelector('.verification-status, .upload-status');
        
        if (statusElement) {
            const statusIcon = statusElement.querySelector('.status-icon');
            const statusText = statusElement.querySelector('.status-text');
            
            // Update status
            statusIcon.textContent = status;
            statusText.textContent = message;
            
            // Update styling based on status
            if (status === 'processing') {
                statusElement.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                statusElement.style.animation = 'pulse 1s ease infinite';
            } else if (status === 'verified') {
                statusElement.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                statusElement.style.animation = 'none';
                
                // Update step icon
                const stepIcon = verificationSteps[stepIndex].querySelector('.step-icon');
                stepIcon.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                stepIcon.innerHTML = '✓';
            }
        }
    }
}

function completeVerification(uploadId) {
    // Show final verification complete message
    const verificationProcess = document.querySelector('.verification-process');
    if (verificationProcess) {
        const completeDiv = document.createElement('div');
        completeDiv.className = 'verification-complete';
        completeDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1.5rem;
                border-radius: 8px;
                margin-top: 1rem;
                text-align: center;
                animation: slideDown 0.3s ease;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            ">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem;">
                    <path d="M22 11.08V12a10 10 0 1 1 0-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">✅ Verification Complete!</h3>
                <p style="margin: 0; opacity: 0.9;">Your ID has been successfully verified and authenticated.</p>
            </div>
        `;
        
        verificationProcess.appendChild(completeDiv);
    }
    
    // Enable next button after verification
    const nextButton = document.querySelector('.form-step[data-step="3"] .btn-primary');
    if (nextButton) {
        nextButton.disabled = false;
        nextButton.style.opacity = '1';
        nextButton.style.cursor = 'pointer';
    }
}

function updateVerificationStatus(uploadId, status) {
    if (uploadId === 'idUpload') {
        const verificationStatus = document.getElementById('verificationStatus');
        if (verificationStatus) {
            const statusIcon = verificationStatus.querySelector('.status-icon');
            const statusText = verificationStatus.querySelector('.status-text');
            
            if (status === 'verified') {
                statusIcon.textContent = 'verified';
                statusText.textContent = 'Document verified successfully!';
                verificationStatus.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            }
        }
    }
}

// Also initialize immediately for faster loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.accountValidator = new AccountFormValidator();
    });
} else {
    window.accountValidator = new AccountFormValidator();
}
