// Account Opening JavaScript
let currentStep = 1;
let selectedAccountType = '';

// Navigation functions
function nextStep(step) {
    if (validateCurrentStep()) {
        if (step === 4) {
            populateReviewSection();
        }
        showStep(step);
    }
}

function previousStep(step) {
    showStep(step);
}

// Email validation function
function validateEmail(email) {
    const value = email.trim();
    
    // Check if email is empty
    if (!value) {
        return { valid: false, message: 'Please enter your email address.' };
    }
    
    // Check for @ symbol
    if (!value.includes('@')) {
        return { valid: false, message: 'Email must contain an @ symbol (e.g., user@gmail.com).' };
    }
    
    // Check for domain part after @
    const parts = value.split('@');
    if (parts.length < 2) {
        return { valid: false, message: 'Email must have a domain after @.' };
    }
    
    if (parts[1] === '') {
        return { valid: false, message: 'Email must have a domain after @ (e.g., user@gmail.com).' };
    }
    
    // Check for domain extension (dot)
    const domain = parts[1];
    if (!domain.includes('.')) {
        return { valid: false, message: 'Email must have a domain extension with a dot (e.g., .com, .org).' };
    }
    
    // Check for complete extension after dot
    const domainParts = domain.split('.');
    if (domainParts.length < 2) {
        return { valid: false, message: 'Email must have a complete domain extension (e.g., .com).' };
    }
    
    // Check if extension is empty
    if (domainParts[1].trim() === '') {
        return { valid: false, message: 'Domain extension cannot be empty (e.g., user@gmail.com).' };
    }
    
    // Check if extension is too short (at least 2 characters)
    if (domainParts[1].length < 2) {
        return { valid: false, message: 'Domain extension must be at least 2 characters (e.g., .com, .org).' };
    }
    
    // Check for local part (before @) - should not be empty
    if (parts[0] === '') {
        return { valid: false, message: 'Email must have text before @ symbol.' };
    }
    
    // Final regex validation for overall format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return { valid: false, message: 'Please enter a valid email address (e.g., user@gmail.com).' };
    }
    
    return { valid: true, message: '' };
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(formStep => {
        formStep.classList.remove('active');
    });
    
    // Remove active class from all step indicators
    document.querySelectorAll('.step').forEach(stepIndicator => {
        stepIndicator.classList.remove('active');
    });
    
    // Show current step
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
    
    // Mark completed steps
    for (let i = 1; i < step; i++) {
        document.querySelector(`.step[data-step="${i}"]`).classList.add('completed');
    }
    
    currentStep = step;
    
    // Scroll to top of form
    document.querySelector('.account-form-container').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function validateCurrentStep() {
    console.log('validateCurrentStep called for step:', currentStep);
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const requiredFields = currentFormStep.querySelectorAll('input[required], select[required]');
    console.log('Found required fields:', requiredFields.length);
    
    for (let field of requiredFields) {
        console.log('Checking field:', field.id, 'Type:', field.type, 'Value:', field.value);
        if (!field.value.trim()) {
            showNotification('Please fill in all required fields.', 'error');
            field.focus();
            return false;
        }
        
        // Email validation
        if (field.type === 'email' || field.id === 'email') {
            console.log('Validating email:', field.value);
            const validationResult = validateEmail(field.value);
            console.log('Validation result:', validationResult);
            if (!validationResult.valid) {
                showNotification(validationResult.message, 'error');
                field.focus();
                return false;
            }
        }
        
        // Phone number validation - check for letters
        if (field.type === 'tel' || field.name === 'phone') {
            const phoneValue = field.value.replace(/\D/g, ''); // Remove non-digits
            if (phoneValue.length < 9) {
                showNotification('Please enter a valid phone number with at least 9 digits.', 'error');
                field.focus();
                return false;
            }
            if (field.value !== phoneValue && field.value !== '+233 ' + phoneValue) {
                // If the value contains letters or invalid characters
                showNotification('Phone number should only contain digits. Please remove any letters or special characters.', 'error');
                field.focus();
                return false;
            }
        }
        
        // Date of birth validation - minimum age 18
        if (field.name === 'dob' || field.type === 'date') {
            const dob = new Date(field.value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                // Birthday hasn't occurred yet this year
                const adjustedAge = age - 1;
                if (adjustedAge < 18) {
                    showNotification('You must be at least 18 years old to open an account.', 'error');
                    field.focus();
                    return false;
                }
            } else {
                if (age < 18) {
                    showNotification('You must be at least 18 years old to open an account.', 'error');
                    field.focus();
                    return false;
                }
            }
        }
        
        // Ghana Card validation
        if (field.name === 'ghanaCard') {
            const ghanaCardRegex = /^GHA-\d{7}-\d{1}$/;
            if (!ghanaCardRegex.test(field.value)) {
                showNotification('Please enter a valid Ghana Card format (GHA-XXXXXXX-X).', 'error');
                field.focus();
                return false;
            }
        }
        
        // Digital address validation
        if (field.name === 'digitalAddress') {
            const digitalAddressRegex = /^[A-Z]{2}-\d{3}-\d{4}$/;
            if (!digitalAddressRegex.test(field.value)) {
                showNotification('Please enter a valid digital address format (XX-000-0000).', 'error');
                field.focus();
                return false;
            }
        }
    }
    
    // Check if account type is selected in step 2
    if (currentStep === 2) {
        if (!selectedAccountType) {
            showNotification('Please select an account type.', 'error');
            return false;
        }
    }
    
    // Check if file is uploaded in step 3
    if (currentStep === 3) {
        const fileInput = document.getElementById('idUpload');
        if (!fileInput.files.length) {
            showNotification('Please upload your ID document.', 'error');
            return false;
        }
    }
    
    return true;
}

// Account type selection
document.querySelectorAll('.account-type-card').forEach(card => {
    card.addEventListener('click', function() {
        // Remove selected class from all cards
        document.querySelectorAll('.account-type-card').forEach(c => {
            c.classList.remove('selected');
        });
        
        // Add selected class to clicked card
        this.classList.add('selected');
        selectedAccountType = this.dataset.account;
    });
});

// File upload handling
document.getElementById('idUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('File size must be less than 5MB.', 'error');
            this.value = '';
            return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please upload an image file.', 'error');
            this.value = '';
            return;
        }
        
        // Update upload label
        const label = this.nextElementSibling;
        label.innerHTML = `
            <span class="upload-icon">✅</span>
            <span>${file.name}</span>
        `;
        label.style.background = 'rgba(16, 185, 129, 0.1)';
        label.style.borderColor = '#10b981';
        label.style.color = '#10b981';
    }
});

// Populate review section
function populateReviewSection() {
    // Personal Information Review
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    
    document.getElementById('personalReview').innerHTML = `
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date of Birth:</strong> ${new Date(dob).toLocaleDateString()}</p>
    `;
    
    // Account Type Review
    const accountTypeNames = {
        'checking': 'Checking Account',
        'savings': 'Savings Account',
        'business': 'Business Account'
    };
    
    document.getElementById('accountReview').innerHTML = `
        <p><strong>Account Type:</strong> ${accountTypeNames[selectedAccountType]}</p>
    `;
    
    // Address Review
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    
    document.getElementById('addressReview').innerHTML = `
        <p>${street}</p>
        <p>${city}, ${state} ${zip}</p>
    `;
}

// Form submission
document.getElementById('accountForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if terms are accepted
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showNotification('Please accept the terms and conditions.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Account application submitted successfully! We will review your application and contact you within 1-2 business days.', 'success');
        
        // Reset form
        this.reset();
        selectedAccountType = '';
        
        // Reset UI
        document.querySelectorAll('.account-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset upload label
        const uploadLabel = document.querySelector('.upload-label');
        uploadLabel.innerHTML = `
            <span class="upload-icon"> upload </span>
            <span>Upload ID Document</span>
        `;
        uploadLabel.style.background = 'rgba(59, 130, 246, 0.05)';
        uploadLabel.style.borderColor = '#3b82f6';
        uploadLabel.style.color = '#3b82f6';
        
        // Go back to step 1
        showStep(1);
        
        // Reset submit button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }, 2000);
});

// Navigation helper
function goToHome() {
    if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
        window.location.href = 'index.html';
    }
}

// Format phone number input (Ghana) - Immediate initialization
function initializePhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        // Set max length attribute
        phoneInput.setAttribute('maxlength', '15'); // +233 + space + 9 digits = 15 chars
        phoneInput.setAttribute('placeholder', '+233 XXXXXXXXX');
        
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Remove existing +233 if present to prevent duplication
            if (value.startsWith('233')) {
                value = value.slice(3);
            }
            
            // Remove leading 0 if present
            if (value.startsWith('0') && value.length > 1) {
                value = value.slice(1);
            }
            
            // Strictly limit to 9 digits
            if (value.length > 9) {
                value = value.slice(0, 9);
            }
            
            // Format with +233 prefix
            if (value.length > 0) {
                e.target.value = '+233 ' + value;
            } else {
                e.target.value = '';
            }
        });
        
        // Prevent paste of invalid numbers
        phoneInput.addEventListener('paste', function(e) {
            e.preventDefault();
            let pastedData = (e.clipboardData || window.clipboardData).getData('text');
            let cleanData = pastedData.replace(/\D/g, '');
            
            // Remove +233 if present
            if (cleanData.startsWith('233')) {
                cleanData = cleanData.slice(3);
            }
            
            // Remove leading 0
            if (cleanData.startsWith('0')) {
                cleanData = cleanData.slice(1);
            }
            
            // Limit to 9 digits
            cleanData = cleanData.slice(0, 9);
            
            if (cleanData.length > 0) {
                e.target.value = '+233 ' + cleanData;
            } else {
                e.target.value = '';
            }
        });
    }
}

// Call immediately and also on DOM load
initializePhoneFormatting();

// Helper function to create email error element
function createEmailErrorElement() {
    const emailInput = document.getElementById('email');
    if (!emailInput) return null;
    
    const errorElement = document.createElement('span');
    errorElement.id = 'emailError';
    errorElement.className = 'email-error';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.display = 'none';
    errorElement.style.marginTop = '0.25rem';
    
    // Insert error element after the email input's parent
    const formGroup = emailInput.closest('.form-group');
    if (formGroup) {
        formGroup.appendChild(errorElement);
    }
    
    return errorElement;
}

// Helper function to create phone error element
function createPhoneErrorElement() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return null;
    
    const errorElement = document.createElement('span');
    errorElement.id = 'phoneError';
    errorElement.className = 'phone-error';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.display = 'none';
    errorElement.style.marginTop = '0.25rem';
    
    // Insert error element after the phone input's parent
    const formGroup = phoneInput.closest('.form-group');
    if (formGroup) {
        formGroup.appendChild(errorElement);
    }
    
    return errorElement;
}

// Helper function to create date of birth error element
function createDobErrorElement() {
    const dobInput = document.getElementById('dob');
    if (!dobInput) return null;
    
    const errorElement = document.createElement('span');
    errorElement.id = 'dobError';
    errorElement.className = 'dob-error';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.display = 'none';
    errorElement.style.marginTop = '0.25rem';
    
    // Insert error element after the dob input's parent
    const formGroup = dobInput.closest('.form-group');
    if (formGroup) {
        formGroup.appendChild(errorElement);
    }
    
    return errorElement;
}

// Format all input fields when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Email validation with real-time feedback
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function(e) {
            const value = e.target.value.trim();
            const emailError = document.getElementById('emailError') || createEmailErrorElement();
            
            if (value === '') {
                emailError.textContent = '';
                emailError.style.display = 'none';
                e.target.style.borderColor = '#e2e8f0';
                return;
            }
            
            // Check for @ symbol
            if (!value.includes('@')) {
                emailError.textContent = 'Email must contain an @ symbol';
                emailError.style.display = 'block';
                e.target.style.borderColor = '#ef4444';
                return;
            }
            
            // Check for domain part after @
            const parts = value.split('@');
            if (parts.length < 2 || parts[1] === '') {
                emailError.textContent = 'Email must have a domain after @';
                emailError.style.display = 'block';
                e.target.style.borderColor = '#ef4444';
                return;
            }
            
            // Check for domain extension
            const domain = parts[1];
            if (!domain.includes('.')) {
                emailError.textContent = 'Email must have a domain extension (e.g., .com)';
                emailError.style.display = 'block';
                e.target.style.borderColor = '#ef4444';
                return;
            }
            
            // Check for extension after dot
            const domainParts = domain.split('.');
            if (domainParts.length < 2) {
                emailError.textContent = 'Email must have a complete domain extension (e.g., .com)';
                emailError.style.display = 'block';
                e.target.style.borderColor = '#ef4444';
                return;
            }
            
            // Check if extension is empty
            if (domainParts[1].trim() === '') {
                emailError.textContent = 'Domain extension cannot be empty';
                emailError.style.display = 'block';
                e.target.style.borderColor = '#ef4444';
                return;
            }
            
            // Check if extension is too short (at least 2 characters)
            if (domainParts[1].length < 2) {
                emailError.textContent = 'Domain extension must be at least 2 characters (e.g., .com)';
                emailError.style.display = 'block';
                e.target.style.borderColor = '#ef4444';
                return;
            }
            
            // Valid email format
            emailError.textContent = '';
            emailError.style.display = 'none';
            e.target.style.borderColor = '#10b981';
        });
        
        // Remove error on blur if empty
        emailInput.addEventListener('blur', function(e) {
            const value = e.target.value.trim();
            const emailError = document.getElementById('emailError');
            if (value === '' && emailError) {
                emailError.textContent = '';
                emailError.style.display = 'none';
                e.target.style.borderColor = '#e2e8f0';
            }
        });
    }
    
    // Phone number real-time validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const value = e.target.value;
            const phoneError = document.getElementById('phoneError') || createPhoneErrorElement();
            
            // Check for letters
            if (/[a-zA-Z]/.test(value)) {
                phoneError.textContent = 'Phone number should only contain digits';
                phoneError.style.display = 'block';
                e.target.style.borderColor = '#ef4444';
                return;
            }
            
            // Clear error if valid
            phoneError.textContent = '';
            phoneError.style.display = 'none';
            e.target.style.borderColor = '#10b981';
        });
        
        phoneInput.addEventListener('blur', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            const phoneError = document.getElementById('phoneError');
            if (value.length > 0 && value.length < 9 && phoneError) {
                phoneError.textContent = 'Phone number must have at least 9 digits';
                phoneError.style.display = 'block';
                e.target.style.borderColor = '#ef4444';
            }
        });
    }
    
    // Date of birth real-time validation
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        dobInput.addEventListener('change', function(e) {
            const dob = new Date(e.target.value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            const dobError = document.getElementById('dobError') || createDobErrorElement();
            
            let actualAge = age;
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                actualAge = age - 1;
            }
            
            if (actualAge < 18) {
                dobError.textContent = `You must be at least 18 years old. Current age: ${actualAge}`;
                dobError.style.display = 'block';
                e.target.style.borderColor = '#ef4444';
            } else {
                dobError.textContent = '';
                dobError.style.display = 'none';
                e.target.style.borderColor = '#10b981';
            }
        });
    }
    
    // Format Ghana Card input
    const ghanaCardInput = document.getElementById('ghanaCard');
    if (ghanaCardInput) {
        ghanaCardInput.setAttribute('placeholder', 'GHA-XXXXXXX-X');
        ghanaCardInput.setAttribute('maxlength', '14');
        
        ghanaCardInput.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase().replace(/[^GHA0-9-]/g, '');
            
            // Remove existing dashes to prevent duplication
            value = value.replace(/-/g, '');
            
            // Handle Ghana Card format: GHA-XXXXXXX-X (12 characters total)
            if (value.length >= 4 && value.length <= 10) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else if (value.length >= 11) {
                value = value.slice(0, 3) + '-' + value.slice(3, 10) + '-' + value.slice(10, 11);
            }
            
            // Limit to proper length
            if (value.length > 14) {
                value = value.slice(0, 14);
            }
            
            e.target.value = value;
        });
    }

    // Re-initialize phone formatting to ensure it works
    initializePhoneFormatting();

    // Format digital address input
    const digitalAddressInput = document.getElementById('digitalAddress');
    if (digitalAddressInput) {
        digitalAddressInput.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            
            // Ghana Digital Address format: XX-000-0000
            if (value.length >= 3 && value.length <= 6) {
                value = value.slice(0, 2) + '-' + value.slice(2);
            } else if (value.length >= 7) {
                value = value.slice(0, 2) + '-' + value.slice(2, 5) + '-' + value.slice(5, 9);
            }
            
            e.target.value = value;
        });
    }

// Verification Process Functions
function startVerification() {
    // Simulate database verification process
    const uploadStatus = document.getElementById('uploadStatus');
    const verificationStatus = document.getElementById('verificationStatus');
    const confirmationStatus = document.getElementById('confirmationStatus');
    
    // Step 1: Document Upload
    updateStatus(uploadStatus, 'processing', 'Uploading document...');
    setTimeout(() => {
        updateStatus(uploadStatus, 'success', 'Document uploaded successfully');
        
        // Step 2: Document Verification
        updateStatus(verificationStatus, 'processing', 'Verifying document...');
        setTimeout(() => {
            updateStatus(verificationStatus, 'success', 'Document verified successfully');
            
            // Step 3: Identity Confirmation
            updateStatus(confirmationStatus, 'processing', 'Confirming identity...');
            setTimeout(() => {
                updateStatus(confirmationStatus, 'success', 'Identity confirmed');
                
                // Auto-advance to review step after verification
                setTimeout(() => {
                    nextStep(5);
                    populateReviewSection();
                }, 1000);
            }, 2000);
        }, 3000);
    }, 2000);
}

function updateStatus(element, status, text) {
    const statusIcon = element.querySelector('.status-icon');
    const statusText = element.querySelector('.status-text');
    
    statusText.textContent = text;
    
    switch(status) {
        case 'pending':
            statusIcon.textContent = 'pending';
            statusIcon.style.color = '#64748b';
            break;
        case 'processing':
            statusIcon.textContent = 'processing';
            statusIcon.style.color = '#f59e0b';
            break;
        case 'success':
            statusIcon.textContent = 'success';
            statusIcon.style.color = '#10b981';
            break;
        case 'error':
            statusIcon.textContent = 'error';
            statusIcon.style.color = '#ef4444';
            break;
    }
}

function populateReviewSection() {
    // Simulate database retrieval and display
    const formData = getFormData();
    
    // Personal Information Review
    const personalReview = document.getElementById('personalReview');
    personalReview.innerHTML = `
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Date of Birth:</strong> ${formData.dob}</p>
        <p><strong>Ghana Card:</strong> ${formData.ghanaCard}</p>
    `;
    
    // Account Type Review
    const accountReview = document.getElementById('accountReview');
    accountReview.innerHTML = `
        <p><strong>Account Type:</strong> ${formData.accountType}</p>
        <p><strong>Initial Deposit:</strong> GH¢${formData.initialDeposit || '0'}</p>
    `;
    
    // Address Review
    const addressReview = document.getElementById('addressReview');
    addressReview.innerHTML = `
        <p><strong>Address:</strong> ${formData.street}, ${formData.city}</p>
        <p><strong>Region:</strong> ${formData.region}</p>
        <p><strong>Digital Address:</strong> ${formData.digitalAddress}</p>
    `;
    
    // Verification Status Review
    const verificationReview = document.getElementById('verificationReview');
    verificationReview.innerHTML = `
        <p><strong>Document Upload:</strong> <span style="color: #10b981;">Completed</span></p>
        <p><strong>Document Verification:</strong> <span style="color: #10b981;">Verified</span></p>
        <p><strong>Identity Confirmation:</strong> <span style="color: #10b981;">Confirmed</span></p>
        <p><strong>Verification ID:</strong> VER${Date.now()}</p>
    `;
}

function getFormData() {
    // Simulate database data retrieval
    return {
        firstName: document.getElementById('firstName')?.value || 'John',
        lastName: document.getElementById('lastName')?.value || 'Doe',
        email: document.getElementById('email')?.value || 'john.doe@email.com',
        phone: document.getElementById('phone')?.value || '+233 241234567',
        dob: document.getElementById('dob')?.value || '1990-01-01',
        ghanaCard: document.getElementById('ghanaCard')?.value || 'GHA-1234567-8',
        accountType: 'Checking Account',
        initialDeposit: '100',
        street: document.getElementById('street')?.value || '123 Main Street',
        city: document.getElementById('city')?.value || 'Accra',
        region: document.getElementById('region')?.value || 'Greater Accra',
        digitalAddress: document.getElementById('digitalAddress')?.value || 'GA-123-4567'
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show first step
    showStep(1);
    
    // Initialize account type selection
    initializeAccountTypeSelection();
    
    // Initialize file upload
    initializeFileUpload();
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});
