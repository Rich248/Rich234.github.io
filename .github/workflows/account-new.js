// Account Opening JavaScript - New Version with Proper Email Validation
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
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    const stepIndicator = document.querySelector(`.step[data-step="${step}"]`);
    if (stepIndicator) {
        stepIndicator.classList.add('active');
    }
    
    // Mark completed steps
    for (let i = 1; i < step; i++) {
        const completedIndicator = document.querySelector(`.step[data-step="${i}"]`);
        if (completedIndicator) {
            completedIndicator.classList.add('completed');
        }
    }
    
    currentStep = step;
    
    // Scroll to top of form only if user is already below hero
    const formContainer = document.querySelector('.account-form-container');
    const heroSection = document.querySelector('.hero-section');
    if (formContainer && heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
            formContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
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
    if (parts.length !== 2) {
        return { valid: false, message: 'Email must contain exactly one @ symbol.' };
    }
    
    const localPart = parts[0];
    const domainPart = parts[1];
    
    // Check if local part (before @) is empty
    if (!localPart) {
        return { valid: false, message: 'Email must have text before @ symbol.' };
    }
    
    // Check if domain part (after @) is empty
    if (!domainPart) {
        return { valid: false, message: 'Email must have a domain after @ (e.g., user@gmail.com).' };
    }
    
    // Check for domain extension (dot)
    if (!domainPart.includes('.')) {
        return { valid: false, message: 'Email must have a domain extension with a dot (e.g., .com, .org).' };
    }
    
    // Check domain extension parts
    const domainParts = domainPart.split('.');
    if (domainParts.length < 2) {
        return { valid: false, message: 'Email must have a complete domain extension.' };
    }
    
    // Get the last part (TLD like com, org, net)
    const tld = domainParts[domainParts.length - 1];
    if (!tld || tld.length < 2) {
        return { valid: false, message: 'Domain extension must be at least 2 characters (e.g., .com).' };
    }
    
    // Final regex validation for overall format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return { valid: false, message: 'Please enter a valid email address (e.g., user@gmail.com).' };
    }
    
    return { valid: true, message: '' };
}

// Main validation function
function validateCurrentStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentFormStep) {
        console.error('Current form step not found');
        return false;
    }
    
    const requiredFields = currentFormStep.querySelectorAll('input[required], select[required]');
    
    // Validate each required field
    for (let field of requiredFields) {
        const value = field.value.trim();
        
        // Check if field is empty
        if (!value) {
            showNotification(`Please fill in ${field.name || field.id || 'all required fields'}.`, 'error');
            field.focus();
            return false;
        }
        
        // Email validation - check by type AND id
        if (field.type === 'email' || field.id === 'email') {
            const validationResult = validateEmail(field.value);
            if (!validationResult.valid) {
                // Create inline error message
                showInlineError(field, validationResult.message);
                showNotification(validationResult.message, 'error');
                field.focus();
                return false;
            } else {
                // Clear any existing error
                clearInlineError(field);
            }
        }
        
        // Phone number validation
        if (field.type === 'tel' || field.id === 'phone') {
            const phoneValue = field.value.replace(/\D/g, '');
            if (phoneValue.length < 9) {
                showNotification('Please enter a valid phone number with at least 9 digits.', 'error');
                field.focus();
                return false;
            }
            if (/[a-zA-Z]/.test(field.value)) {
                showNotification('Phone number should only contain digits.', 'error');
                field.focus();
                return false;
            }
        }
        
        // Date of birth validation - minimum age 18
        if (field.type === 'date' || field.id === 'dob') {
            const dob = new Date(field.value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            if (age < 18) {
                showNotification('You must be at least 18 years old to open an account.', 'error');
                field.focus();
                return false;
            }
        }
        
        // Ghana Card validation
        if (field.id === 'ghanaCard') {
            const ghanaCardRegex = /^GHA-\d{7}-\d{1}$/;
            if (!ghanaCardRegex.test(field.value)) {
                showNotification('Please enter a valid Ghana Card format (GHA-XXXXXXX-X).', 'error');
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
        if (fileInput && !fileInput.files.length) {
            showNotification('Please upload your ID document.', 'error');
            return false;
        }
    }
    
    return true;
}

// Helper function to show inline error
function showInlineError(field, message) {
    // Remove any existing error
    clearInlineError(field);
    
    // Create error element
    const errorElement = document.createElement('span');
    errorElement.className = 'inline-error';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.display = 'block';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    // Insert after the field
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.appendChild(errorElement);
    }
    
    // Style the field
    field.style.borderColor = '#ef4444';
}

// Helper function to clear inline error
function clearInlineError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        const existingError = formGroup.querySelector('.inline-error');
        if (existingError) {
            existingError.remove();
        }
    }
    field.style.borderColor = '#10b981';
}

// Notification function
function showNotification(message, type = 'info') {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '400px';
    notification.style.wordWrap = 'break-word';
    
    // Set colors based on type
    if (type === 'error') {
        notification.style.background = '#fef2f2';
        notification.style.color = '#dc2626';
        notification.style.border = '1px solid #fecaca';
    } else if (type === 'success') {
        notification.style.background = '#f0fdf4';
        notification.style.color = '#16a34a';
        notification.style.border = '1px solid #bbf7d0';
    } else {
        notification.style.background = '#eff6ff';
        notification.style.color = '#2563eb';
        notification.style.border = '1px solid #bfdbfe';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Account type selection
function selectAccountType(type) {
    selectedAccountType = type;
    
    // Remove selected class from all options
    document.querySelectorAll('.account-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to chosen option
    const selectedOption = document.querySelector(`.account-option[data-account="${type}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Show summary
    const summary = document.getElementById('selectedAccountSummary');
    if (summary) {
        summary.style.display = 'block';
    }
    
    // Enable proceed button
    const proceedBtn = document.getElementById('proceedToDetailsBtn');
    if (proceedBtn) {
        proceedBtn.disabled = false;
    }
    
    // Auto-advance to next step (Personal Details)
    setTimeout(() => {
        nextStep(3);
    }, 300);
}

// Populate review section
function populateReviewSection() {
    // This function would populate the review section with form data
    console.log('Populating review section...');
}

// Go to home function
function goToHome() {
    if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
        window.location.href = 'index.html';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show first step
    showStep(1);
    
    // Initialize account type selection buttons
    document.querySelectorAll('.account-option').forEach(option => {
        option.addEventListener('click', function() {
            const accountType = this.dataset.account;
            if (accountType) {
                selectAccountType(accountType);
            }
        });
    });
    
    // Initialize file upload
    const idUpload = document.getElementById('idUpload');
    if (idUpload) {
        idUpload.addEventListener('change', function(e) {
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
                
                showNotification('File uploaded successfully!', 'success');
            }
        });
    }
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#fff';
                header.style.backdropFilter = 'none';
            }
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});
