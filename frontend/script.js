// Main application class
class MotobombasApp {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav');
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupMobileMenu();
    }
    setupEventListeners() {
        // Contact form submission
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactFormSubmit(e));
        }
        // CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleCTAClick(e));
        });
        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        // Scroll events for header
        window.addEventListener('scroll', () => this.handleScroll());
    }
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href')?.substring(1);
                const targetElement = document.getElementById(targetId || '');
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    setupFormValidation() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    setupMobileMenu() {
        // Mobile menu functionality is handled in event listeners
    }
    handleContactFormSubmit(e) {
        e.preventDefault();
        if (!this.contactForm)
            return;
        const formData = new FormData(this.contactForm);
        const contactData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        if (this.validateForm(contactData)) {
            this.submitContactForm(contactData);
        }
    }
    validateForm(data) {
        let isValid = true;
        // Validate first name
        if (!data.firstName.trim()) {
            this.showFieldError('firstName', 'Nome é obrigatório');
            isValid = false;
        }
        // Validate last name
        if (!data.lastName.trim()) {
            this.showFieldError('lastName', 'Sobrenome é obrigatório');
            isValid = false;
        }
        // Validate phone
        if (!data.phone.trim()) {
            this.showFieldError('phone', 'Telefone é obrigatório');
            isValid = false;
        }
        else if (!this.isValidPhone(data.phone)) {
            this.showFieldError('phone', 'Telefone inválido');
            isValid = false;
        }
        // Validate email
        if (!data.email.trim()) {
            this.showFieldError('email', 'Email é obrigatório');
            isValid = false;
        }
        else if (!this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Email inválido');
            isValid = false;
        }
        // Validate message
        if (!data.message.trim()) {
            this.showFieldError('message', 'Mensagem é obrigatória');
            isValid = false;
        }
        return isValid;
    }
    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        if (!value) {
            this.showFieldError(fieldName, 'Este campo é obrigatório');
            return;
        }
        if (fieldName === 'email' && !this.isValidEmail(value)) {
            this.showFieldError(fieldName, 'Email inválido');
            return;
        }
        if (fieldName === 'phone' && !this.isValidPhone(value)) {
            this.showFieldError(fieldName, 'Telefone inválido');
            return;
        }
        this.clearFieldError(input);
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\(\)\-\+]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (!field)
            return;
        field.classList.add('error');
        let errorElement = field.parentElement?.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentElement?.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentElement?.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    submitContactForm(data) {
        // Show loading state
        const submitButton = this.contactForm?.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            // Create WhatsApp message
            const whatsappMessage = this.createWhatsAppMessage(data);
            const whatsappUrl = `https://wa.me/5531971705354?text=${encodeURIComponent(whatsappMessage)}`;
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            // Show success message
            this.showNotification('Mensagem enviada! Redirecionando para o WhatsApp...', 'success');
            // Reset form
            this.contactForm?.reset();
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1000);
    }
    createWhatsAppMessage(data) {
        return `Olá! Recebi uma mensagem através do site:

*Nome:* ${data.firstName} ${data.lastName}
*Telefone:* ${data.phone}
*Email:* ${data.email}

*Mensagem:*
${data.message}

Por favor, entre em contato para mais informações.`;
    }
    handleCTAClick(e) {
        const target = e.target;
        const buttonText = target.textContent?.toLowerCase();
        if (buttonText?.includes('contato') || buttonText?.includes('contate')) {
            const contactSection = document.getElementById('contato');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    toggleMobileMenu() {
        if (this.navMenu) {
            this.navMenu.classList.toggle('active');
        }
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.toggle('active');
        }
    }
    closeMobileMenu() {
        if (this.navMenu) {
            this.navMenu.classList.remove('active');
        }
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.remove('active');
        }
    }
    handleScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            }
            else {
                header.classList.remove('scrolled');
            }
        }
    }
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        // Add to page
        document.body.appendChild(notification);
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}
// Utility functions
class Utils {
    static formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    }
    static debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}
// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MotobombasApp();
});
// Phone number formatting
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const target = e.target;
            const formatted = Utils.formatPhoneNumber(target.value);
            target.value = formatted;
        });
    }
});
// Export for potential module usage
export { MotobombasApp, Utils };
