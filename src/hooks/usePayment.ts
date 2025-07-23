import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/components/ui/Notification';
import { CREDIT_PACKAGES, type CreditPackageId } from '@/lib/stripe';

interface PaymentState {
  isProcessing: boolean;
  error: string | null;
}

export function usePayment() {
  const { user } = useAuth();
  const { showError, showInfo } = useNotification();
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isProcessing: false,
    error: null,
  });

  const purchaseCredits = useCallback(
    async (packageId: CreditPackageId) => {
      if (!user?.uid) {
        showError('Please sign in to purchase credits');
        return { success: false };
      }

      setPaymentState({ isProcessing: true, error: null });

      try {
        // Get the user's JWT token
        const token = await user.getIdToken();

        // Create payment session
        const response = await fetch('/api/payment/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ packageId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment session');
        }

        if (!data.success || !data.url) {
          throw new Error('Invalid response from payment server');
        }

        // Redirect to Stripe Checkout
        window.location.href = data.url;

        return { success: true, sessionId: data.sessionId };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Payment failed';
        setPaymentState({ isProcessing: false, error: errorMessage });
        showError(`Payment error: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }
    },
    [user, showError]
  );

  const getPackageInfo = useCallback((packageId: CreditPackageId) => {
    return CREDIT_PACKAGES[packageId];
  }, []);

  const getAllPackages = useCallback(() => {
    return Object.values(CREDIT_PACKAGES);
  }, []);

  const resetPaymentState = useCallback(() => {
    setPaymentState({ isProcessing: false, error: null });
  }, []);

  return {
    purchaseCredits,
    getPackageInfo,
    getAllPackages,
    resetPaymentState,
    isProcessing: paymentState.isProcessing,
    error: paymentState.error,
  };
}
