'use client';

import React, { useState, useEffect } from 'react';
import {
  InteractiveElement,
  WishElement,
  ElementProperties,
} from '@/types/templates';
import { Button } from '@/components/ui/Button';
import { ElementPalette } from './ElementPalette';
import { WishCanvas } from './WishCanvas';
import { ElementPropertiesPanel } from './ElementPropertiesPanel';
import { SaveShareDialog } from '@/components/ui/SaveShareDialog';
import { PresentationMode } from '@/components/ui/PresentationMode';
import { getAllElements } from '@/config/elements';
import { premiumService, UserPremiumStatus } from '@/lib/premiumService';
import { useWishManagement } from '@/features/wishes/hooks/useWishManagement';
import { Wish } from '@/types';

interface CustomWishBuilderProps {
  onBack: () => void;
  templateId?: string;
  isUserPremium?: boolean; // Optional prop for demo/testing purposes
}

export function CustomWishBuilder({
  onBack,
  templateId,
  isUserPremium: propIsUserPremium,
}: CustomWishBuilderProps) {
  const [selectedElement, setSelectedElement] = useState<WishElement | null>(
    null
  );
  const [elements, setElements] = useState<WishElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<WishElement[]>([]);
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('purple');
  const [customBackgroundColor, setCustomBackgroundColor] = useState('#ffffff');
  const [showCanvasSettings, setShowCanvasSettings] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Mobile responsive state
  const [mobileView, setMobileView] = useState<
    'canvas' | 'palette' | 'properties' | 'steps'
  >('canvas');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Premium user status from service
  const [userPremiumStatus, setUserPremiumStatus] =
    useState<UserPremiumStatus | null>(null);
  const [isLoadingPremium, setIsLoadingPremium] = useState(true);

  // Get wish management hooks
  const { createWish, shareWish, error: wishError } = useWishManagement();

  // Get elements from centralized config
  const availableElements = getAllElements();

  // Step management
  const [showStepManager, setShowStepManager] = useState(false);
  const [stepSequence, setStepSequence] = useState<string[][]>([]); // Array of steps, each step is an array of element IDs

  // Save and Share Dialog
  const [showSaveShareDialog, setShowSaveShareDialog] = useState(false);
  const [currentWish, setCurrentWish] = useState<Wish | null>(null);

  // Presentation Mode
  const [showPresentationMode, setShowPresentationMode] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768 ? 'canvas' : 'canvas');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load user premium status
  useEffect(() => {
    const loadPremiumStatus = async () => {
      try {
        // For demo purposes, use a fixed user ID
        // In real app, this would come from authentication
        const userId = 'demo-user-123';
        const status = await premiumService.getUserPremiumStatus(userId);
        setUserPremiumStatus(status);
      } catch (error) {
        console.error('Error loading premium status:', error);
      } finally {
        setIsLoadingPremium(false);
      }
    };

    loadPremiumStatus();
  }, []);

  // Debug theme changes
  // console.log('CustomWishBuilder - Current theme:', theme);
  // console.log('CustomWishBuilder - Selected element:', selectedElement);
  // console.log('CustomWishBuilder - Elements count:', elements.length);
  // console.log('CustomWishBuilder - User premium status:', userPremiumStatus);

  const handleAddToCanvas = (elementId: string) => {
    const element = availableElements.find(e => e.id === elementId);
    if (element) {
      const newElement: WishElement = {
        id: `${elementId}_${Date.now()}`,
        elementType: elementId,
        properties: { ...element.properties },
        order: elements.length,
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement);
    }
  };

  const handleSelectElement = (elementId: string) => {
    const element = availableElements.find(el => el.id === elementId);
    if (element) {
      // Create selected element
      const selectedElement: WishElement = {
        id: elementId,
        elementType: elementId,
        properties: { ...element.properties, isSelected: true },
        order: selectedElements.length,
      };
      setSelectedElements([...selectedElements, selectedElement]);

      // Also add to canvas automatically
      const canvasElement: WishElement = {
        id: `${elementId}_${Date.now()}`,
        elementType: elementId,
        properties: { ...element.properties },
        order: elements.length,
      };
      setElements([...elements, canvasElement]);
      setSelectedElement(canvasElement);

      // Switch to element properties when element is selected
      setShowCanvasSettings(false);
    }
  };

  const handleUnselectElement = (elementId: string) => {
    // Remove from selected elements
    setSelectedElements(selectedElements.filter(el => el.id !== elementId));

    // Remove from canvas (find elements that match the elementType and were created from this selection)
    setElements(
      elements.filter(
        el =>
          !(el.elementType === elementId && el.id.startsWith(elementId + '_'))
      )
    );

    // Clear selected element if it was the one being unselected
    if (selectedElement?.elementType === elementId) {
      setSelectedElement(null);
    }
  };

  const handleAddElement = (elementType: string) => {
    const element = availableElements.find(e => e.id === elementType);
    if (element) {
      const newElement: WishElement = {
        id: `${elementType}_${Date.now()}`,
        elementType: elementType,
        properties: { ...element.properties },
        order: elements.length,
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement);
    }
  };

  const handleUpdateElement = (
    elementId: string,
    properties: ElementProperties
  ) => {
    const updatedElements = elements.map(el =>
      el.id === elementId ? { ...el, properties } : el
    );
    setElements(updatedElements);

    // Maintain the selected element when properties are updated
    if (selectedElement?.id === elementId) {
      setSelectedElement({ ...selectedElement, properties });
    }
  };

  const handleDeleteElement = (elementId: string) => {
    setElements(elements.filter(el => el.id !== elementId));
    setSelectedElements(selectedElements.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
    // Also remove from step sequence if it exists there
    setStepSequence(
      stepSequence
        .map(step => step.filter(id => id !== elementId))
        .filter(step => step.length > 0)
    );
  };

  const handleCanvasElementSelect = (element: WishElement | null) => {
    if (element === null) {
      // "Select All" was clicked - select all elements
      setSelectedElements(elements);
      setSelectedElement(null);
      setShowCanvasSettings(false);
    } else {
      setSelectedElement(element);
      setSelectedElements([element]);
      setShowCanvasSettings(false);
    }
  };

  const handleSwitchToElement = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      setSelectedElement(element);
      setSelectedElements([element]);
      setShowCanvasSettings(false);
    }
  };

  const getSelectedElementsForDisplay = () => {
    return selectedElements.length > 0 ? selectedElements : elements;
  };

  const canCombine = (step: string[], newElementId: string) => {
    // Check if the new element can be combined with the current step
    if (step.length >= 2) return false; // Max 2 elements per step

    // Check if the new element is already in the step
    if (step.includes(newElementId)) return false;

    // Check if the new element is compatible with existing elements in the step
    const existingElements = step
      .map(id => elements.find(el => el.id === id))
      .filter(Boolean);
    const newElement = elements.find(el => el.id === newElementId);

    if (!newElement) return false;

    // For now, allow any combination of different element types
    const existingTypes = existingElements.map(el => el?.elementType);
    return !existingTypes.includes(newElement.elementType);
  };

  const canAddMoreSteps = () => {
    // Check if we can add more steps based on available elements
    const usedElementIds = new Set();
    stepSequence.forEach(step => {
      step.forEach(id => usedElementIds.add(id));
    });

    const availableElements = elements.filter(el => !usedElementIds.has(el.id));
    return availableElements.length > 0 && stepSequence.length < 10;
  };

  const getAvailableElementTypes = () => {
    const types = new Set<string>();
    elements.forEach(element => {
      types.add(element.elementType);
    });
    return Array.from(types);
  };

  const getElementTypeCounts = () => {
    const counts: { [key: string]: number } = {};
    elements.forEach(element => {
      counts[element.elementType] = (counts[element.elementType] || 0) + 1;
    });
    return counts;
  };

  const getAvailableElementsForSteps = () => {
    // Return elements that haven't been added to steps yet
    const usedElementIds = new Set();
    stepSequence.forEach(step => {
      step.forEach(id => usedElementIds.add(id));
    });

    return elements.filter(el => !usedElementIds.has(el.id));
  };

  const getAvailablePresets = () => {
    const elementTypes = getAvailableElementTypes();
    const elementCounts = getElementTypeCounts();

    const quickSequencePresets = [
      {
        name: 'Birthday Celebration',
        description: 'Perfect for birthday wishes',
        steps: [['beautiful-text'], ['balloons-interactive']],
        requiredElements: {
          'beautiful-text': 1,
          'balloons-interactive': 1,
        },
      },
      {
        name: 'Romantic Surprise',
        description: 'Sweet and romantic sequence',
        steps: [['beautiful-text'], ['balloons-interactive']],
        requiredElements: {
          'beautiful-text': 1,
          'balloons-interactive': 1,
        },
      },
      {
        name: 'Celebration Flow',
        description: 'Dynamic celebration sequence',
        steps: [['beautiful-text'], ['balloons-interactive']],
        requiredElements: {
          'beautiful-text': 1,
          'balloons-interactive': 1,
        },
      },
    ];

    return quickSequencePresets.filter(preset => {
      // Check if we have the required elements
      for (const [elementType, count] of Object.entries(
        preset.requiredElements
      )) {
        if ((elementCounts[elementType] || 0) < count) {
          return false;
        }
      }
      return true;
    });
  };

  const handleAddNextStep = () => {
    if (!canAddMoreSteps()) return;

    const availableElements = getAvailableElementsForSteps();
    if (availableElements.length === 0) return;

    // Add the first available element to a new step
    const firstElement = availableElements[0];
    if (!firstElement) return;

    const newStep = [firstElement.id];
    setStepSequence([...stepSequence, newStep]);
  };

  const quickSequencePresets = [
    {
      name: 'Birthday Celebration',
      description: 'Perfect for birthday wishes',
      steps: [['beautiful-text'], ['balloons-interactive']],
      requiredElements: {
        'beautiful-text': 1,
        'balloons-interactive': 1,
      },
    },
    {
      name: 'Romantic Surprise',
      description: 'Sweet and romantic sequence',
      steps: [['beautiful-text'], ['balloons-interactive']],
      requiredElements: {
        'beautiful-text': 1,
        'balloons-interactive': 1,
      },
    },
    {
      name: 'Celebration Flow',
      description: 'Dynamic celebration sequence',
      steps: [['beautiful-text'], ['balloons-interactive']],
      requiredElements: {
        'beautiful-text': 1,
        'balloons-interactive': 1,
      },
    },
  ];

  const handleQuickSequence = (preset: (typeof quickSequencePresets)[0]) => {
    // Clear existing sequence
    setStepSequence([]);

    // Add elements to steps based on preset
    const elementTypeCounts: { [key: string]: number } = {};
    const newSequence: string[][] = [];

    preset.steps.forEach(stepElementTypes => {
      const step: string[] = [];
      stepElementTypes.forEach(elementType => {
        // Find an element of this type that hasn't been used yet
        const availableElement = elements.find(el => {
          const currentCount = elementTypeCounts[el.elementType] || 0;
          const requiredCount =
            preset.requiredElements[
              el.elementType as keyof typeof preset.requiredElements
            ] || 0;
          return el.elementType === elementType && currentCount < requiredCount;
        });

        if (availableElement) {
          step.push(availableElement.id);
          elementTypeCounts[availableElement.elementType] =
            (elementTypeCounts[availableElement.elementType] || 0) + 1;
        }
      });
      if (step.length > 0) {
        newSequence.push(step);
      }
    });

    setStepSequence(newSequence);
  };

  const handleAddToStepSequence = (elementId: string) => {
    // Try to add to the last step if it can be combined
    if (stepSequence.length > 0) {
      const lastStep = stepSequence[stepSequence.length - 1];
      if (lastStep && canCombine(lastStep, elementId)) {
        const updatedSequence = [...stepSequence];
        updatedSequence[updatedSequence.length - 1] = [...lastStep, elementId];
        setStepSequence(updatedSequence);
        return;
      }
    }

    // Create a new step with this element
    setStepSequence([...stepSequence, [elementId]]);
  };

  const handleRemoveFromStepSequence = (elementId: string) => {
    setStepSequence(
      stepSequence
        .map(step => step.filter(id => id !== elementId))
        .filter(step => step.length > 0)
    );
  };

  const handleReorderSteps = (fromIndex: number, toIndex: number) => {
    const newSequence = [...stepSequence];
    const [movedStep] = newSequence.splice(fromIndex, 1);
    if (movedStep) {
      newSequence.splice(toIndex, 0, movedStep);
      setStepSequence(newSequence);
    }
  };

  const handleClearStepSequence = () => {
    setStepSequence([]);
  };

  const handleAutoGenerateSequence = () => {
    // Automatically create a step for each interactive element
    const interactiveElements = elements.filter(
      el =>
        el.elementType === 'balloons-interactive' ||
        el.elementType === 'beautiful-text' ||
        el.elementType === 'confetti' ||
        el.elementType === 'music-player'
    );

    const newSequence = interactiveElements.map(el => [el.id]);
    setStepSequence(newSequence);
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
    if (isPreviewMode) {
      // Exiting preview mode, switch back to canvas view on mobile
      if (window.innerWidth < 768) {
        setMobileView('canvas');
      }
    }
  };

  const handleSaveWish = async () => {
    if (elements.length === 0) {
      alert('Please add at least one element to your wish before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const wishData = {
        recipientName,
        message,
        theme,
        occasion: templateId || 'custom',
        animation: 'fade',
        elements: elements,
        customBackgroundColor,
      };

      const createdWish = await createWish(wishData);
      if (createdWish) {
        setCurrentWish(createdWish);
        setShowSaveShareDialog(true);
      }
    } catch (error) {
      console.error('Error saving wish:', error);
      alert('Error saving wish. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFromDialog = async (wishData: any): Promise<Wish | null> => {
    try {
      const createdWish = await createWish(wishData);
      if (createdWish) {
        setCurrentWish(createdWish);
        return createdWish;
      }
      return null;
    } catch (error) {
      console.error('Error saving wish from dialog:', error);
      alert('Error saving wish. Please try again.');
      return null;
    }
  };

  const handleShareFromDialog = async (wish: Wish): Promise<string> => {
    try {
      const shareUrl = await shareWish(wish);
      setShareUrl(shareUrl);
      return shareUrl;
    } catch (error) {
      console.error('Error sharing wish:', error);
      alert('Error sharing wish. Please try again.');
      return '';
    }
  };

  const handleOpenPresentationMode = () => {
    if (elements.length === 0) {
      alert(
        'Please add at least one element to your wish before entering presentation mode.'
      );
      return;
    }

    // Create a temporary wish object for presentation
    const tempWish: Wish = {
      id: 'temp-presentation',
      recipientName,
      message,
      theme,
      occasion: templateId || 'custom',
      animation: 'fade',
      isPublic: true,
      elements: elements,
      customBackgroundColor,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    };

    setCurrentWish(tempWish);
    setShowPresentationMode(true);
  };

  const handleUpgradeClick = async () => {
    try {
      // For demo purposes, upgrade the user
      const userId = 'demo-user-123';
      await premiumService.upgradeUser(userId, 'pro');

      // Reload premium status
      const newStatus = await premiumService.getUserPremiumStatus(userId);
      setUserPremiumStatus(newStatus);

      // console.log('User upgraded successfully');
    } catch (error) {
      console.error('Error upgrading user:', error);
      alert('Error upgrading user. Please try again.');
    }
  };

  // Get current premium status - use prop if provided, otherwise use service
  const isUserPremium =
    propIsUserPremium !== undefined
      ? propIsUserPremium
      : userPremiumStatus?.isPremium || false;

  // Mobile navigation component
  const MobileNavigation = () => (
    <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50'>
      <div className='flex justify-around p-2'>
        <button
          onClick={() => setMobileView('canvas')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            mobileView === 'canvas'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600'
          }`}
        >
          <span className='text-lg'>🎨</span>
          <span className='text-xs'>Canvas</span>
        </button>
        <button
          onClick={() => setMobileView('palette')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            mobileView === 'palette'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600'
          }`}
        >
          <span className='text-lg'>✨</span>
          <span className='text-xs'>Elements</span>
        </button>
        <button
          onClick={() => setMobileView('properties')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            mobileView === 'properties'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600'
          }`}
        >
          <span className='text-lg'>⚙️</span>
          <span className='text-xs'>Settings</span>
        </button>
        <button
          onClick={() => setMobileView('steps')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            mobileView === 'steps'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600'
          }`}
        >
          <span className='text-lg'>🎭</span>
          <span className='text-xs'>Steps</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className='h-screen bg-gray-50 flex flex-col'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b flex-shrink-0'>
        <div className='w-full max-w-[1800px] mx-auto px-4 md:px-6 py-3 md:py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2 md:space-x-4'>
              <Button
                variant='outline'
                onClick={onBack}
                className='text-sm md:text-base'
              >
                ← Back
              </Button>
              <h1 className='text-lg md:text-2xl font-bold text-gray-900'>
                Custom Wish Builder
              </h1>
              {isPreviewMode && (
                <span className='px-2 md:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs md:text-sm font-medium'>
                  Preview
                </span>
              )}
            </div>

            {/* Desktop buttons */}
            <div className='hidden md:flex items-center space-x-4'>
              <Button
                variant='outline'
                onClick={() => setShowStepManager(!showStepManager)}
              >
                {showStepManager ? 'Hide Steps' : 'Manage Steps'}
              </Button>
              <Button
                variant={isPreviewMode ? 'primary' : 'outline'}
                onClick={handlePreviewToggle}
              >
                {isPreviewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              {elements.length > 0 && (
                <Button variant='outline' onClick={handleOpenPresentationMode}>
                  🎭 Presentation
                </Button>
              )}
              <Button
                variant='primary'
                onClick={handleSaveWish}
                disabled={elements.length === 0}
              >
                Save & Share
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <Button
                variant='outline'
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className='p-2'
              >
                ☰
              </Button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {showMobileMenu && (
            <div className='md:hidden mt-3 p-3 bg-gray-50 rounded-lg border'>
              <div className='space-y-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setShowStepManager(!showStepManager);
                    setShowMobileMenu(false);
                  }}
                  className='w-full justify-start'
                >
                  {showStepManager ? 'Hide Steps' : 'Manage Steps'}
                </Button>
                <Button
                  variant={isPreviewMode ? 'primary' : 'outline'}
                  size='sm'
                  onClick={() => {
                    handlePreviewToggle();
                    setShowMobileMenu(false);
                  }}
                  className='w-full justify-start'
                >
                  {isPreviewMode ? 'Exit Preview' : 'Preview'}
                </Button>
                {elements.length > 0 && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      handleOpenPresentationMode();
                      setShowMobileMenu(false);
                    }}
                    className='w-full justify-start'
                  >
                    🎭 Presentation
                  </Button>
                )}
                <Button
                  variant='primary'
                  size='sm'
                  onClick={() => {
                    handleSaveWish();
                    setShowMobileMenu(false);
                  }}
                  disabled={elements.length === 0}
                  className='w-full justify-start'
                >
                  Save & Share
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Builder */}
      <div className='flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-6 py-4 md:py-6 overflow-hidden'>
        {/* Desktop Layout */}
        <div className='hidden md:grid md:grid-cols-12 gap-6 h-full'>
          {/* Step Manager Panel */}
          {showStepManager && !isPreviewMode && (
            <div
              className='col-span-12 bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col'
              style={{
                height: 'calc(100vh - 200px)',
                maxHeight: 'calc(100vh - 200px)',
              }}
            >
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Step Sequence Manager
                </h3>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleAutoGenerateSequence}
                    title='Automatically create a step for each interactive element'
                  >
                    Auto Generate
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleClearStepSequence}
                    title='Remove all steps'
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className='mb-4 p-3 bg-blue-50 rounded text-blue-800 text-sm flex-shrink-0'>
                <strong>How to use:</strong> Add elements to steps, combine up
                to 2 allowed elements per step, reorder steps, and remove
                elements or steps as needed. Hover buttons for tips.
              </div>
              {/* Add Next Step Button */}
              {stepSequence.length > 0 && stepSequence.length < 10 && (
                <div className='mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 flex-shrink-0'>
                  <button
                    onClick={handleAddNextStep}
                    className='w-full p-3 bg-white rounded-lg border border-green-300 hover:border-green-400 hover:shadow-sm transition-all text-center'
                    title='Add the next step to your sequence'
                  >
                    <div className='font-medium text-sm text-green-800 mb-1'>
                      ➕ Add Step {stepSequence.length + 1}
                    </div>
                    <div className='text-xs text-green-600'>
                      Automatically add the next logical step to your sequence
                    </div>
                  </button>
                </div>
              )}
              <div
                className='grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden'
                style={{ minHeight: 0 }}
              >
                {/* Available Elements */}
                <div className='flex flex-col h-full min-h-0'>
                  <h4 className='text-sm font-medium text-gray-700 mb-3'>
                    Available Elements
                  </h4>
                  <div
                    className='space-y-2 flex-1 overflow-y-auto min-h-0'
                    style={{ minHeight: 0 }}
                  >
                    {getAvailableElementsForSteps().map(element => (
                      <div
                        key={element.id}
                        className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                      >
                        <div className='flex items-center space-x-2'>
                          <span
                            title={
                              element.elementType === 'balloons-interactive'
                                ? 'Balloons'
                                : 'Beautiful Text'
                            }
                          >
                            {element.elementType === 'balloons-interactive'
                              ? '🎈'
                              : '📝'}
                          </span>
                          <span className='font-medium text-sm text-gray-800'>
                            {element.elementType}
                          </span>
                          <span className='text-xs text-gray-500'>
                            ID: {element.id}
                          </span>
                        </div>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleAddToStepSequence(element.id as string)
                          }
                          title='Add to a new step or combine with last step if allowed'
                        >
                          Add to Step
                        </Button>
                      </div>
                    ))}
                    {getAvailableElementsForSteps().length === 0 && (
                      <div className='text-center py-4 text-gray-500'>
                        <p className='text-sm'>
                          All elements have been added to steps
                        </p>
                        <p className='text-xs'>
                          Add more elements to your canvas to continue
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Step Sequence */}
                <div className='flex flex-col h-full min-h-0'>
                  <h4 className='text-sm font-medium text-gray-700 mb-3'>
                    Step Sequence
                  </h4>
                  <div
                    className='space-y-2 flex-1 overflow-y-auto min-h-0'
                    style={{ minHeight: 0 }}
                  >
                    {stepSequence.length === 0 ? (
                      <div className='text-center text-gray-500 py-8'>
                        <div className='text-2xl mb-2'>🎭</div>
                        <p className='text-sm'>No steps defined</p>
                        <p className='text-xs'>
                          Add elements from the left to create your sequence
                        </p>
                      </div>
                    ) : (
                      stepSequence.map((step, index) => (
                        <div
                          key={index}
                          className='p-3 rounded-lg border bg-white shadow-sm flex flex-col'
                        >
                          <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center space-x-3'>
                              <div className='w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold'>
                                {index + 1}
                              </div>
                              <div className='font-medium text-sm text-gray-800'>
                                Step {index + 1}
                              </div>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <button
                                onClick={() =>
                                  handleReorderSteps(
                                    index,
                                    Math.max(0, index - 1)
                                  )
                                }
                                disabled={index === 0}
                                className='text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                                title='Move step up'
                              >
                                ↑
                              </button>
                              <button
                                onClick={() =>
                                  handleReorderSteps(
                                    index,
                                    Math.min(stepSequence.length - 1, index + 1)
                                  )
                                }
                                disabled={index === stepSequence.length - 1}
                                className='text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                                title='Move step down'
                              >
                                ↓
                              </button>
                              <button
                                onClick={() =>
                                  setStepSequence(
                                    stepSequence.filter((_, i) => i !== index)
                                  )
                                }
                                className='text-red-500 hover:text-red-700 text-sm'
                                title='Remove entire step'
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <div className='flex flex-wrap gap-2 items-center'>
                            {step.map((id, i) => {
                              const element = elements.find(el => el.id === id);
                              return (
                                <span
                                  key={id}
                                  className='flex items-center bg-purple-100 text-purple-800 rounded px-2 py-1 text-xs font-medium'
                                >
                                  {element?.elementType ===
                                  'balloons-interactive'
                                    ? '🎈'
                                    : '📝'}
                                  <span className='ml-1'>
                                    {element?.elementType || 'Unknown'}
                                  </span>
                                  <button
                                    className='ml-2 text-xs text-red-500 hover:text-red-700'
                                    onClick={() =>
                                      handleRemoveFromStepSequence(id)
                                    }
                                    title='Remove this element from step'
                                  >
                                    ✕
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                    {/* Step Limit Warning */}
                    {stepSequence.length >= 10 && (
                      <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                        <div className='flex items-center space-x-2'>
                          <span className='text-yellow-600'>⚠️</span>
                          <span className='text-sm text-yellow-800'>
                            Maximum 10 steps reached. Remove some steps to add
                            more.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Element Palette - Hidden in preview mode */}
          {!isPreviewMode && !showStepManager && (
            <div className='col-span-3 overflow-hidden'>
              <ElementPalette
                elements={availableElements}
                onAddElement={handleAddElement}
                selectedElements={selectedElements}
                onSelectElement={handleSelectElement}
                onUnselectElement={handleUnselectElement}
                isUserPremium={isUserPremium}
              />
            </div>
          )}

          {/* Canvas - Full width in preview mode */}
          <div
            className={`overflow-hidden ${isPreviewMode ? 'col-span-12' : showStepManager ? 'hidden' : 'col-span-6'}`}
            style={{ height: showStepManager ? '0' : 'auto' }}
          >
            <WishCanvas
              elements={elements}
              selectedElement={isPreviewMode ? null : selectedElement}
              onSelectElement={
                isPreviewMode ? () => {} : handleCanvasElementSelect
              }
              onUpdateElement={handleUpdateElement}
              recipientName={recipientName}
              message={message}
              theme={theme}
              customBackgroundColor={customBackgroundColor}
              onCanvasSettingsToggle={setShowCanvasSettings}
              isPreviewMode={isPreviewMode}
              stepSequence={stepSequence}
            />
          </div>

          {/* Properties Panel - Hidden in preview mode */}
          {!isPreviewMode && !showStepManager && (
            <div className='col-span-3 overflow-hidden'>
              <ElementPropertiesPanel
                element={selectedElement}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                recipientName={recipientName}
                message={message}
                theme={theme}
                onUpdateRecipientName={setRecipientName}
                onUpdateMessage={setMessage}
                onUpdateTheme={setTheme}
                customBackgroundColor={customBackgroundColor}
                onUpdateCustomBackgroundColor={setCustomBackgroundColor}
                showCanvasSettings={showCanvasSettings}
                isUserPremium={isUserPremium}
                onUpgradeClick={handleUpgradeClick}
                selectedElements={getSelectedElementsForDisplay()}
                elements={elements}
                onSwitchToElement={handleSwitchToElement}
              />
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden h-full pb-16'>
          {/* Step Manager Panel */}
          {mobileView === 'steps' && !isPreviewMode && (
            <div className='bg-white rounded-lg shadow-sm border p-4 h-full overflow-y-auto'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Step Sequence
                </h3>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleAutoGenerateSequence}
                  >
                    Auto
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleClearStepSequence}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Add Next Step Button */}
              {stepSequence.length > 0 && stepSequence.length < 10 && (
                <div className='mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200'>
                  <button
                    onClick={handleAddNextStep}
                    className='w-full p-2 bg-white rounded-lg border border-green-300 hover:border-green-400 transition-all text-center'
                  >
                    <div className='font-medium text-sm text-green-800'>
                      ➕ Add Step {stepSequence.length + 1}
                    </div>
                  </button>
                </div>
              )}

              {/* Available Elements */}
              <div className='mb-4'>
                <h4 className='text-sm font-medium text-gray-700 mb-2'>
                  Available Elements
                </h4>
                <div className='space-y-2'>
                  {getAvailableElementsForSteps().map(element => (
                    <div
                      key={element.id}
                      className='p-3 rounded-lg border bg-gray-50 border-gray-200 flex items-center justify-between'
                    >
                      <div className='flex items-center space-x-2'>
                        <span>
                          {element.elementType === 'balloons-interactive'
                            ? '🎈'
                            : '📝'}
                        </span>
                        <span className='font-medium text-sm text-gray-800'>
                          {element.elementType}
                        </span>
                      </div>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() =>
                          handleAddToStepSequence(element.id as string)
                        }
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Sequence */}
              <div>
                <h4 className='text-sm font-medium text-gray-700 mb-2'>
                  Steps
                </h4>
                <div className='space-y-2'>
                  {stepSequence.length === 0 ? (
                    <div className='text-center text-gray-500 py-8'>
                      <div className='text-2xl mb-2'>🎭</div>
                      <p className='text-sm'>No steps defined</p>
                    </div>
                  ) : (
                    stepSequence.map((step, index) => (
                      <div
                        key={index}
                        className='p-3 rounded-lg border bg-white shadow-sm'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <div className='flex items-center space-x-2'>
                            <div className='w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold'>
                              {index + 1}
                            </div>
                            <span className='font-medium text-sm text-gray-800'>
                              Step {index + 1}
                            </span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <button
                              onClick={() =>
                                handleReorderSteps(
                                  index,
                                  Math.max(0, index - 1)
                                )
                              }
                              disabled={index === 0}
                              className='text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50'
                            >
                              ↑
                            </button>
                            <button
                              onClick={() =>
                                handleReorderSteps(
                                  index,
                                  Math.min(stepSequence.length - 1, index + 1)
                                )
                              }
                              disabled={index === stepSequence.length - 1}
                              className='text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50'
                            >
                              ↓
                            </button>
                            <button
                              onClick={() =>
                                setStepSequence(
                                  stepSequence.filter((_, i) => i !== index)
                                )
                              }
                              className='text-red-500 hover:text-red-700 text-sm'
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                          {step.map(id => {
                            const element = elements.find(el => el.id === id);
                            return (
                              <span
                                key={id}
                                className='flex items-center bg-purple-100 text-purple-800 rounded px-2 py-1 text-xs'
                              >
                                {element?.elementType === 'balloons-interactive'
                                  ? '🎈'
                                  : '📝'}
                                <span className='ml-1'>
                                  {element?.elementType || 'Unknown'}
                                </span>
                                <button
                                  className='ml-1 text-xs text-red-500'
                                  onClick={() =>
                                    handleRemoveFromStepSequence(id)
                                  }
                                >
                                  ✕
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Element Palette */}
          {mobileView === 'palette' && !isPreviewMode && (
            <div className='h-full'>
              <ElementPalette
                elements={availableElements}
                onAddElement={handleAddElement}
                selectedElements={selectedElements}
                onSelectElement={handleSelectElement}
                onUnselectElement={handleUnselectElement}
                isUserPremium={isUserPremium}
              />
            </div>
          )}

          {/* Canvas */}
          {mobileView === 'canvas' && (
            <div className='h-full'>
              <WishCanvas
                elements={elements}
                selectedElement={isPreviewMode ? null : selectedElement}
                onSelectElement={
                  isPreviewMode ? () => {} : handleCanvasElementSelect
                }
                onUpdateElement={handleUpdateElement}
                recipientName={recipientName}
                message={message}
                theme={theme}
                customBackgroundColor={customBackgroundColor}
                onCanvasSettingsToggle={setShowCanvasSettings}
                isPreviewMode={isPreviewMode}
                stepSequence={stepSequence}
              />
            </div>
          )}

          {/* Properties Panel */}
          {mobileView === 'properties' && !isPreviewMode && (
            <div className='h-full'>
              <ElementPropertiesPanel
                element={selectedElement}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                recipientName={recipientName}
                message={message}
                theme={theme}
                onUpdateRecipientName={setRecipientName}
                onUpdateMessage={setMessage}
                onUpdateTheme={setTheme}
                customBackgroundColor={customBackgroundColor}
                onUpdateCustomBackgroundColor={setCustomBackgroundColor}
                showCanvasSettings={showCanvasSettings}
                isUserPremium={isUserPremium}
                onUpgradeClick={handleUpgradeClick}
                selectedElements={getSelectedElementsForDisplay()}
                elements={elements}
                onSwitchToElement={handleSwitchToElement}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Save & Share Dialog */}
      <SaveShareDialog
        isOpen={showSaveShareDialog}
        onClose={() => setShowSaveShareDialog(false)}
        wish={currentWish}
        onSave={handleSaveFromDialog}
        onShare={handleShareFromDialog}
        isSaving={isSaving}
      />

      {/* Presentation Mode */}
      <PresentationMode
        isOpen={showPresentationMode}
        onClose={() => setShowPresentationMode(false)}
        wish={currentWish!}
      />
    </div>
  );
}
