import { useState, useCallback } from 'react';

// Define the wish form data structure
export interface WishFormData {
  recipientName: string;
  occasion: string;
  message: string;
  theme: string;
  animation: string;
  senderName?: string;
  senderEmail?: string;
}

// Define validation errors structure
export interface FormErrors {
  [key: string]: string;
}

// Custom hook for wish form handling
export function useWishForm(initialData?: Partial<WishFormData>) {
  // Initialize form state
  const [formData, setFormData] = useState<WishFormData>({
    recipientName: '',
    occasion: 'birthday',
    message: '',
    theme: 'purple',
    animation: 'fade',
    senderName: '',
    senderEmail: '',
    ...initialData,
  });

  // Form validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form field
  const updateField = useCallback(
    (name: keyof WishFormData, value: string) => {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  // Validate form data
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate recipient name
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    // Validate sender email if provided
    if (formData.senderEmail && !isValidEmail(formData.senderEmail)) {
      newErrors.senderEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (onSubmit: (data: WishFormData) => Promise<void>) => {
      if (!validateForm()) {
        return false;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        return true;
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to submit form. Please try again.',
        }));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm]
  );

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      recipientName: '',
      occasion: 'birthday',
      message: '',
      theme: 'purple',
      animation: 'fade',
      senderName: '',
      senderEmail: '',
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // Check if form is valid
  const isValid =
    Object.keys(errors).length === 0 &&
    formData.recipientName.trim() !== '' &&
    formData.message.trim() !== '';

  return {
    formData,
    errors,
    isSubmitting,
    isValid,
    updateField,
    handleSubmit,
    resetForm,
    validateForm,
  };
}

// Email validation helper function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
