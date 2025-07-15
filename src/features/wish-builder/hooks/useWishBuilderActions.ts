import { useCallback } from 'react';
import { WishElement, ElementProperties } from '@/types/templates';
import { Wish } from '@/types';
import { useWishManagement } from '@/features/wishes/hooks/useWishManagement';
import { premiumService } from '@/lib/premiumService';
import { useFirebaseWishes } from '@/hooks/useFirebaseWishes';
import { useAuth } from '@/contexts/AuthContext';

const DEMO_USER_ID = 'demo-user-123';
const MAX_STEPS = 10;

interface UseWishBuilderActionsProps {
  // State setters
  setElements: React.Dispatch<React.SetStateAction<WishElement[]>>;
  setSelectedElement: React.Dispatch<React.SetStateAction<WishElement | null>>;
  setSelectedElements: React.Dispatch<React.SetStateAction<WishElement[]>>;
  setStepSequence: React.Dispatch<React.SetStateAction<string[][]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentWish: React.Dispatch<React.SetStateAction<Wish | null>>;
  setShowSaveShareDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setUserPremiumStatus: React.Dispatch<React.SetStateAction<any>>;

  // State values
  elements: WishElement[];
  selectedElement: WishElement | null;
  selectedElements: WishElement[];
  stepSequence: string[][];
  originalTemplateElements: WishElement[];
  availableElements: any[];
  isRestrictedMode: boolean;

  // Wish content
  recipientName: string;
  message: string;
  theme: string;
  templateId: string | undefined;
  customBackgroundColor: string;
}

export function useWishBuilderActions({
  setElements,
  setSelectedElement,
  setSelectedElements,
  setStepSequence,
  setError,
  setIsLoading,
  setCurrentWish,
  setShowSaveShareDialog,
  setUserPremiumStatus,
  elements,
  selectedElement,
  selectedElements,
  stepSequence,
  originalTemplateElements,
  availableElements,
  isRestrictedMode,
  recipientName,
  message,
  theme,
  templateId,
  customBackgroundColor,
}: UseWishBuilderActionsProps) {
  const { createWish, shareWish } = useWishManagement();
  const { createWish: createFirebaseWish } = useFirebaseWishes({
    autoLoad: false,
  });
  const { user } = useAuth();

  // Error handling
  const handleError = useCallback(
    (error: any, context: string) => {
      console.error(`Error in ${context}:`, error);
      setError(`An error occurred while ${context}. Please try again.`);
      setTimeout(() => setError(null), 5000);
    },
    [setError]
  );

  const withLoading = useCallback(
    async (operation: () => Promise<void>, context: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await operation();
      } catch (error) {
        handleError(error, context);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError, handleError]
  );

  // Element management
  const handleAddToCanvas = useCallback(
    (elementId: string) => {
      const element = availableElements.find(e => e.id === elementId);
      if (element) {
        const newElement: WishElement = {
          id: `${elementId}_${Date.now()}`,
          elementType: elementId,
          properties: { ...element.properties },
          order: elements.length,
        };
        setElements(prev => [...prev, newElement]);
        setSelectedElement(newElement);
      }
    },
    [availableElements, elements.length, setElements, setSelectedElement]
  );

  const handleUpdateElement = useCallback(
    (elementId: string, properties: ElementProperties) => {
      setElements(prev =>
        prev.map(el => (el.id === elementId ? { ...el, properties } : el))
      );

      if (selectedElement?.id === elementId) {
        setSelectedElement(prev => (prev ? { ...prev, properties } : null));
      }
    },
    [selectedElement?.id, setElements, setSelectedElement]
  );

  const handleDeleteElement = useCallback(
    (elementId: string) => {
      setElements(prev => prev.filter(el => el.id !== elementId));
      setSelectedElements(prev => prev.filter(el => el.id !== elementId));
      if (selectedElement?.id === elementId) {
        setSelectedElement(null);
      }
      setStepSequence(prev =>
        prev
          .map(step => step.filter(id => id !== elementId))
          .filter(step => step.length > 0)
      );
    },
    [
      selectedElement?.id,
      setElements,
      setSelectedElements,
      setSelectedElement,
      setStepSequence,
    ]
  );

  // Step sequence management
  const getAvailableElementsForSteps = useCallback(() => {
    const usedElementIds = new Set();
    stepSequence.forEach(step => step.forEach(id => usedElementIds.add(id)));
    return elements.filter(el => !usedElementIds.has(el.id));
  }, [stepSequence, elements]);

  const canCombine = useCallback(
    (step: string[], newElementId: string) => {
      if (step.length >= 2) return false;
      if (step.includes(newElementId)) return false;

      const existingElements = step
        .map(id => elements.find(el => el.id === id))
        .filter(Boolean);
      const newElement = elements.find(el => el.id === newElementId);
      if (!newElement) return false;

      const existingTypes = existingElements.map(el => el?.elementType);
      return !existingTypes.includes(newElement.elementType);
    },
    [elements]
  );

  const handleAddToStepSequence = useCallback(
    (elementId: string) => {
      if (stepSequence.length > 0) {
        const lastStep = stepSequence[stepSequence.length - 1];
        if (lastStep && canCombine(lastStep, elementId)) {
          setStepSequence(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = [...lastStep, elementId];
            return updated;
          });
          return;
        }
      }

      setStepSequence(prev => [...prev, [elementId]]);
    },
    [stepSequence, canCombine, setStepSequence]
  );

  const handleRemoveFromStepSequence = useCallback(
    (elementId: string) => {
      setStepSequence(prev =>
        prev
          .map(step => step.filter(id => id !== elementId))
          .filter(step => step.length > 0)
      );
    },
    [setStepSequence]
  );

  const handleReorderSteps = useCallback(
    (fromIndex: number, toIndex: number) => {
      setStepSequence(prev => {
        const newSequence = [...prev];
        const [movedStep] = newSequence.splice(fromIndex, 1);
        if (movedStep) {
          newSequence.splice(toIndex, 0, movedStep);
        }
        return newSequence;
      });
    },
    [setStepSequence]
  );

  const handleClearStepSequence = useCallback(() => {
    setStepSequence([]);
  }, [setStepSequence]);

  const handleAutoGenerateSequence = useCallback(() => {
    const interactiveElements = elements.filter(
      el =>
        el.elementType === 'balloons-interactive' ||
        el.elementType === 'beautiful-text' ||
        el.elementType === 'confetti' ||
        el.elementType === 'music-player'
    );
    const newSequence = interactiveElements.map(el => [el.id]);
    setStepSequence(newSequence);
  }, [elements, setStepSequence]);

  // Wish saving and sharing
  const handleSaveWish = useCallback(async () => {
    if (elements.length === 0) {
      setError('Please add at least one element to your wish before saving.');
      return;
    }

    if (!user?.uid) {
      setError('Please sign in to save your wish.');
      return;
    }

    if (!recipientName?.trim()) {
      setError('Please enter a recipient name before saving.');
      return;
    }

    await withLoading(async () => {
      const wishData = {
        title: `Wish for ${recipientName.trim()}`,
        recipientName: recipientName.trim(),
        message: message?.trim() || '',
        theme,
        elements: elements,
        stepSequence: stepSequence,
        customBackgroundColor,
        isPublic: true,
      };

      const result = await createFirebaseWish(wishData);
      if (result.success && result.data) {
        // Create a wish object compatible with the existing system
        const createdWish: Wish = {
          id: result.data.id,
          recipientName: result.data.recipientName,
          message: result.data.message,
          theme: result.data.theme,
          occasion: templateId || 'custom',
          animation: 'fade',
          elements: result.data.elements,
          ...(result.data.customBackgroundColor && {
            customBackgroundColor: result.data.customBackgroundColor,
          }),
          shareId: result.data.shareId,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
          isPublic: result.data.isPublic,
        };

        setCurrentWish(createdWish);
        setShowSaveShareDialog(true);
      } else {
        setError(result.error || 'Failed to save wish');
      }
    }, 'saving wish');
  }, [
    elements,
    stepSequence,
    recipientName,
    message,
    theme,
    templateId,
    customBackgroundColor,
    createFirebaseWish,
    user?.uid,
    withLoading,
    setError,
    setCurrentWish,
    setShowSaveShareDialog,
  ]);

  const handleSaveFromDialog = useCallback(
    async (wishData: any): Promise<Wish | null> => {
      try {
        console.log('handleSaveFromDialog called with:', wishData);

        if (!user?.uid) {
          alert('Please sign in to save your wish.');
          return null;
        }

        const result = await createFirebaseWish(wishData);
        console.log('Firebase save result:', result);

        if (result.success && result.data) {
          // Create a wish object compatible with the existing system
          const createdWish: Wish = {
            id: result.data.id,
            recipientName: result.data.recipientName,
            message: result.data.message,
            theme: result.data.theme,
            occasion: templateId || 'custom',
            animation: 'fade',
            elements: result.data.elements,
            ...(result.data.customBackgroundColor && {
              customBackgroundColor: result.data.customBackgroundColor,
            }),
            shareId: result.data.shareId,
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt,
            isPublic: result.data.isPublic,
          };

          console.log('Created wish object:', createdWish);
          setCurrentWish(createdWish);
          return createdWish;
        } else {
          console.error('Firebase save failed:', result.error);
          alert(result.error || 'Failed to save wish');
          return null;
        }
      } catch (error) {
        console.error('Error saving wish from dialog:', error);
        alert('Error saving wish. Please try again.');
        return null;
      }
    },
    [createFirebaseWish, user?.uid, templateId, setCurrentWish]
  );

  const handleShareFromDialog = useCallback(
    async (wish: Wish): Promise<string> => {
      try {
        // Generate Firebase share URL
        if (wish.shareId) {
          const baseUrl = window.location.origin;
          return `${baseUrl}/wish/${wish.shareId}`;
        } else {
          // Fallback: generate a temporary share URL
          const baseUrl = window.location.origin;
          return `${baseUrl}/wish/${wish.id}`;
        }
      } catch (error) {
        console.error('Error sharing wish:', error);
        alert('Error sharing wish. Please try again.');
        return '';
      }
    },
    []
  );

  // Premium features
  const handleUpgradeClick = useCallback(async () => {
    await withLoading(async () => {
      await premiumService.upgradeUser(DEMO_USER_ID, 'pro');
      const newStatus = await premiumService.getUserPremiumStatus(DEMO_USER_ID);
      setUserPremiumStatus(newStatus);
    }, 'upgrading user');
  }, [withLoading, setUserPremiumStatus]);

  return {
    handleError,
    withLoading,
    handleAddToCanvas,
    handleUpdateElement,
    handleDeleteElement,
    getAvailableElementsForSteps,
    canCombine,
    handleAddToStepSequence,
    handleRemoveFromStepSequence,
    handleReorderSteps,
    handleClearStepSequence,
    handleAutoGenerateSequence,
    handleSaveWish,
    handleSaveFromDialog,
    handleShareFromDialog,
    handleUpgradeClick,
  };
}
