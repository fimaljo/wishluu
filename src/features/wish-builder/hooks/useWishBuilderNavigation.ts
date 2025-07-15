import { useCallback } from 'react';
import { WishElement } from '@/types/templates';

type CreationStep = 'create' | 'steps' | 'preview' | 'save';

interface UseWishBuilderNavigationProps {
  currentStep: CreationStep;
  setCurrentStep: (step: CreationStep) => void;
  setError: (error: string | null) => void;
  elements: WishElement[];
  stepSequence: string[][];
}

export function useWishBuilderNavigation({
  currentStep,
  setCurrentStep,
  setError,
  elements,
  stepSequence,
}: UseWishBuilderNavigationProps) {
  const handlePreviousStep = useCallback(() => {
    switch (currentStep) {
      case 'steps':
        setCurrentStep('create');
        break;
      case 'preview':
        setCurrentStep('steps');
        break;
      case 'save':
        setCurrentStep('preview');
        break;
    }
  }, [currentStep, setCurrentStep]);

  const handleNextStep = useCallback(() => {
    setError(null);

    switch (currentStep) {
      case 'create':
        if (elements.length === 0) {
          setError('Please add at least one element before proceeding.');
          return;
        }
        setCurrentStep('steps');
        break;
      case 'steps':
        setCurrentStep('preview');
        break;
      case 'preview':
        setCurrentStep('save');
        break;
    }
  }, [currentStep, elements.length, setCurrentStep, setError]);

  const handleOpenPresentationMode = useCallback(() => {
    if (elements.length === 0) {
      setError(
        'Please add at least one element to your wish before entering presentation mode.'
      );
      return;
    }
  }, [elements.length, setError]);

  return {
    handlePreviousStep,
    handleNextStep,
    handleOpenPresentationMode,
  };
}
