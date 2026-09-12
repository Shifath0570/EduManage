import { ContactFormInput, ContactFormValidationResult } from '@/types/contact';

/**
 * Validates a Contact form submission input.
 * Ensures required fields, valid email format, and reasonable string lengths.
 */
export function validateContactForm(data: ContactFormInput): ContactFormValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Full name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.subject || data.subject.trim().length === 0) {
    errors.subject = 'Subject is required';
  } else if (data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
  } else if (data.subject.trim().length > 200) {
    errors.subject = 'Subject cannot exceed 200 characters';
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.trim().length > 3000) {
    errors.message = 'Message cannot exceed 3000 characters';
  }

  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^[0-9+\s\-()]{6,20}$/;
    if (!phoneRegex.test(data.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (digits, +, - only)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Strips potential HTML tags from user input to prevent injection
 */
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}
