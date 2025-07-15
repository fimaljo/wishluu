import { useCallback } from 'react';
import { WishElement } from '@/types/templates';

type CreationStep = 'create' | 'steps' | 'preview' | 'save';
type TemplateStep = 'canvas-settings' | 'element-settings' | 'preview' | 'save';

interface UseWishBuilderNavigationProps {
  currentStep: CreationStep | TemplateStep;
  setCurrentStep: (step: CreationStep | TemplateStep) => void;
  setError: (error: string | null) => void;
  elements: WishElement[];
  stepSequence: string[][];
  isTemplateMode?: boolean;
}

export function useWishBuilderNavigation({
  currentStep,
  setCurrentStep,
  setError,
  elements,
  stepSequence,
  isTemplateMode = false,
}: UseWishBuilderNavigationProps) {
  const handlePreviousStep = useCallback(() => {
    if (isTemplateMode) {
      switch (currentStep as TemplateStep) {
        case 'element-settings':
          setCurrentStep('canvas-settings');
          break;
        case 'preview':
          setCurrentStep('element-settings');
          break;
        case 'save':
          setCurrentStep('preview');
          break;
      }
    } else {
      switch (currentStep as CreationStep) {
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
    }
  }, [currentStep, setCurrentStep, isTemplateMode]);

  const handleNextStep = useCallback(() => {
    setError(null);

    if (isTemplateMode) {
      switch (currentStep as TemplateStep) {
        case 'canvas-settings':
          setCurrentStep('element-settings');
          break;
        case 'element-settings':
          if (elements.length === 0) {
            setError('Please add at least one element before proceeding.');
            return;
          }
          setCurrentStep('preview');
          break;
        case 'preview':
          setCurrentStep('save');
          break;
      }
    } else {
      switch (currentStep as CreationStep) {
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
    }
  }, [currentStep, elements.length, setCurrentStep, setError, isTemplateMode]);

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
