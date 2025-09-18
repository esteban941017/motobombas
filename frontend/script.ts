// TypeScript interfaces
interface ContactFormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
}

interface Product {
    id: string;
    name: string;
    image: string;
    technicalSpecs: string;
}

// Main application class
class MotobombasApp {
    private contactForm: HTMLFormElement | null;
    private mobileMenuToggle: HTMLElement | null;
    private navMenu: HTMLElement | null;

    constructor() {
        this.contactForm = document.getElementById('contactForm') as HTMLFormElement;
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav');
        
        this.init();
    }

    private init(): void {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupMobileMenu();
    }

    private setupEventListeners(): void {
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

    private setupSmoothScrolling(): void {
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

    private setupFormValidation(): void {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input as HTMLInputElement));
            input.addEventListener('input', () => this.clearFieldError(input as HTMLInputElement));
        });
    }

    private setupMobileMenu(): void {
        // Mobile menu functionality is handled in event listeners
    }

    private handleContactFormSubmit(e: Event): void {
        e.preventDefault();
        
        if (!this.contactForm) return;

        const formData = new FormData(this.contactForm);
        const contactData: ContactFormData = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string
        };

        if (this.validateForm(contactData)) {
            this.submitContactForm(contactData);
        }
    }

    private validateForm(data: ContactFormData): boolean {
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
        } else if (!this.isValidPhone(data.phone)) {
            this.showFieldError('phone', 'Telefone inválido');
            isValid = false;
        }

        // Validate email
        if (!data.email.trim()) {
            this.showFieldError('email', 'Email é obrigatório');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
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

    private validateField(input: HTMLInputElement): void {
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

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const phoneRegex = /^[\d\s\(\)\-\+]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    private showFieldError(fieldName: string, message: string): void {
        const field = document.getElementById(fieldName) as HTMLInputElement;
        if (!field) return;

        field.classList.add('error');
        
        let errorElement = field.parentElement?.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentElement?.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    private clearFieldError(input: HTMLInputElement): void {
        input.classList.remove('error');
        const errorElement = input.parentElement?.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    private submitContactForm(data: ContactFormData): void {
        // Show loading state
        const submitButton = this.contactForm?.querySelector('button[type="submit"]') as HTMLButtonElement;
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

    private createWhatsAppMessage(data: ContactFormData): string {
        return `Olá! Recebi uma mensagem através do site:

*Nome:* ${data.firstName} ${data.lastName}
*Telefone:* ${data.phone}
*Email:* ${data.email}

*Mensagem:*
${data.message}

Por favor, entre em contato para mais informações.`;
    }

    private handleCTAClick(e: Event): void {
        const target = e.target as HTMLElement;
        const buttonText = target.textContent?.toLowerCase();

        if (buttonText?.includes('contato') || buttonText?.includes('contate')) {
            const contactSection = document.getElementById('contato');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    private toggleMobileMenu(): void {
        if (this.navMenu) {
            this.navMenu.classList.toggle('active');
        }
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.toggle('active');
        }
    }

    private closeMobileMenu(): void {
        if (this.navMenu) {
            this.navMenu.classList.remove('active');
        }
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.remove('active');
        }
    }

    private handleScroll(): void {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
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
    static formatPhoneNumber(phone: string): string {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    }

    static debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: number;
        return (...args: Parameters<T>) => {
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
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const formatted = Utils.formatPhoneNumber(target.value);
            target.value = formatted;
        });
    }
});

// Export for potential module usage
export { MotobombasApp, Utils, type ContactFormData, type Product };
