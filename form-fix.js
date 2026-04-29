// Simple, working form validation
document.addEventListener('DOMContentLoaded', function() {
    
    // Phone Number Formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Remove 233 if present at start
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
            
            // Format as +233 XXXXXXXXX
            e.target.value = value.length > 0 ? '+233 ' + value : '';
        });
    }
    
    // Ghana Card Formatting
    const ghanaCardInput = document.getElementById('ghanaCard');
    if (ghanaCardInput) {
        ghanaCardInput.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase().replace(/[^GHA0-9-]/g, '');
            
            // Remove all dashes first
            value = value.replace(/-/g, '');
            
            // Add dashes at correct positions
            if (value.length >= 4 && value.length <= 10) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else if (value.length >= 11) {
                value = value.slice(0, 3) + '-' + value.slice(3, 10) + '-' + value.slice(10, 11);
            }
            
            e.target.value = value;
        });
    }
    
    // Digital Address Formatting
    const digitalAddressInput = document.getElementById('digitalAddress');
    if (digitalAddressInput) {
        digitalAddressInput.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            
            if (value.length >= 3 && value.length <= 6) {
                value = value.slice(0, 2) + '-' + value.slice(2);
            } else if (value.length >= 7) {
                value = value.slice(0, 2) + '-' + value.slice(2, 5) + '-' + value.slice(5, 9);
            }
            
            e.target.value = value;
        });
    }
    
    // Global functions for buttons
    window.nextStep = function(step) {
        if (validateCurrentStep()) {
            showStep(step);
        }
    };
    
    window.previousStep = function(step) {
        showStep(step);
    };
    
    window.selectAccountType = function(type) {
        // Remove selected class from all
        document.querySelectorAll('.account-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected class to clicked
        const selected = document.querySelector(`[data-account="${type}"]`);
        if (selected) {
            selected.classList.add('selected');
            window.selectedAccountType = type;
            
            // Enable proceed button
            const proceedBtn = document.getElementById('proceedToDetailsBtn');
            if (proceedBtn) {
                proceedBtn.disabled = false;
            }
        }
    };
    
    window.goToHome = function() {
        if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
            window.location.href = 'index.html';
        }
    };
    
    window.startVerification = function() {
        alert('Verification process would start here');
        setTimeout(() => {
            window.nextStep(5);
        }, 2000);
    };
    
    function validateCurrentStep() {
        const currentStepElement = document.querySelector('.form-step.active');
        if (!currentStepElement) return false;
        
        const stepNum = currentStepElement.dataset.step;
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                alert('Please fill in all required fields.');
                field.focus();
                return false;
            }
            
            // Validate phone
            if (field.id === 'phone') {
                const phoneRegex = /^\+233\s\d{9}$/;
                if (!phoneRegex.test(field.value)) {
                    alert('Please enter a valid Ghana phone number (+233 XXXXXXXXX)');
                    field.focus();
                    return false;
                }
            }
            
            // Validate Ghana Card
            if (field.id === 'ghanaCard') {
                const cardRegex = /^GHA-\d{7}-\d{1}$/;
                if (!cardRegex.test(field.value)) {
                    alert('Please enter a valid Ghana Card number (GHA-XXXXXXX-X)');
                    field.focus();
                    return false;
                }
            }
            
            // Validate digital address
            if (field.id === 'digitalAddress') {
                const addressRegex = /^[A-Z]{2}-\d{3}-\d{4}$/;
                if (!addressRegex.test(field.value)) {
                    alert('Please enter a valid digital address (XX-000-0000)');
                    field.focus();
                    return false;
                }
            }
        }
        
        return true;
    }
    
    function showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(s => {
            s.classList.remove('active');
        });
        
        // Remove active from indicators
        document.querySelectorAll('.step').forEach(s => {
            s.classList.remove('active');
        });
        
        // Show current step
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
        
        // Mark completed
        for (let i = 1; i < step; i++) {
            document.querySelector(`.step[data-step="${i}"]`).classList.add('completed');
        }
        
        // Only scroll to form if user is already past the hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            if (heroBottom < 0) {
                const formContainer = document.querySelector('.account-form-container');
                if (formContainer) {
                    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }
    
    // Initialize first step
    showStep(1);
});
