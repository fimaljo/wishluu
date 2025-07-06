'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import {
  getTemplateById,
  getTemplateDefaultElements,
} from '@/config/templates';
import { TemplateService } from '@/lib/templateService';
import { premiumService, UserPremiumStatus } from '@/lib/premiumService';
import { useWishManagement } from '@/features/wishes/hooks/useWishManagement';
import { Wish } from '@/types';

interface CustomWishBuilderProps {
  onBack: () => void;
  templateId?: string;
  isUserPremium?: boolean;
  isTemplateMode?: boolean; // New prop to indicate if this is template mode (restricted)
}

type CreationStep = 'create' | 'steps' | 'preview' | 'save';

export function CustomWishBuilder({
  onBack,
  templateId,
  isUserPremium: propIsUserPremium,
  isTemplateMode = false,
}: CustomWishBuilderProps) {
  const [selectedElement, setSelectedElement] = useState<WishElement | null>(
    null
  );
  const [elements, setElements] = useState<WishElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<WishElement[]>([]);
  // Track original template elements for restricted mode
  const [originalTemplateElements, setOriginalTemplateElements] = useState<
    WishElement[]
  >([]);
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('purple');
  const [customBackgroundColor, setCustomBackgroundColor] = useState('#ffffff');
  const [showCanvasSettings, setShowCanvasSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Step-by-step flow state
  const [currentStep, setCurrentStep] = useState<CreationStep>('create');
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

  // Template mode logic
  const template = templateId ? getTemplateById(templateId) : null;
  const isRestrictedMode = isTemplateMode && templateId !== 'custom-blank';

  // Track loaded template to prevent infinite re-renders
  const loadedTemplateRef = useRef<string | null>(null);

  // Step management
  const [stepSequence, setStepSequence] = useState<string[][]>([]);

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

  // Load template default elements
  useEffect(() => {
    if (
      template?.id &&
      template?.defaultElements &&
      loadedTemplateRef.current !== template.id
    ) {
      setElements(template.defaultElements);
      setOriginalTemplateElements(template.defaultElements);
      if (template.defaultElements.length > 0) {
        setSelectedElement(template.defaultElements[0] || null);
        // Also initialize selectedElements array with the template elements
        setSelectedElements(template.defaultElements);
      }
      loadedTemplateRef.current = template.id;
    }
  }, [template?.id]); // Only depend on template ID, not the entire template object

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
    // In restricted mode, check if element type exists in original template
    if (isRestrictedMode) {
      // Check if this element type exists in the original template
      const elementTypeExists = originalTemplateElements.some(
        el => el.elementType === elementId
      );
      if (!elementTypeExists) {
        // If element type doesn't exist in template, don't allow adding it
        return;
      }

      // Check if this element type already exists in the current canvas
      const canvasElementExists = elements.some(
        el => el.elementType === elementId
      );
      if (canvasElementExists) {
        // If element type exists in canvas, just select it for editing
        const existingElement = elements.find(
          el => el.elementType === elementId
        );
        if (existingElement) {
          setSelectedElement(existingElement);
          setSelectedElements([existingElement]);
          setShowCanvasSettings(false);
        }
        return;
      }

      // If element type exists in template but not in canvas, add it back
      const templateElement = originalTemplateElements.find(
        el => el.elementType === elementId
      );
      if (templateElement) {
        const newElement: WishElement = {
          id: `${elementId}_${Date.now()}`,
          elementType: elementId,
          properties: { ...templateElement.properties },
          order: elements.length,
        };
        setElements([...elements, newElement]);
        setSelectedElement(newElement);
        setShowCanvasSettings(false);
      }
      return;
    }

    const element = availableElements.find(el => el.id === elementId);
    if (element) {
      const selectedElement: WishElement = {
        id: elementId,
        elementType: elementId,
        properties: { ...element.properties, isSelected: true },
        order: selectedElements.length,
      };
      setSelectedElements([...selectedElements, selectedElement]);

      const canvasElement: WishElement = {
        id: `${elementId}_${Date.now()}`,
        elementType: elementId,
        properties: { ...element.properties },
        order: elements.length,
      };
      setElements([...elements, canvasElement]);
      setSelectedElement(canvasElement);
      setShowCanvasSettings(false);
    }
  };

  const handleUnselectElement = (elementId: string) => {
    setSelectedElements(selectedElements.filter(el => el.id !== elementId));

    // In template mode, we need to handle element removal differently
    if (isRestrictedMode) {
      // Remove the element by its actual ID
      setElements(elements.filter(el => el.id !== elementId));
    } else {
      // In normal mode, remove by element type and ID pattern
      setElements(
        elements.filter(
          el =>
            !(el.elementType === elementId && el.id.startsWith(elementId + '_'))
        )
      );
    }

    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const handleAddElement = (elementType: string) => {
    // In restricted mode, users can only remove elements, not add new ones
    if (isRestrictedMode) {
      return;
    }

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
    setStepSequence(
      stepSequence
        .map(step => step.filter(id => id !== elementId))
        .filter(step => step.length > 0)
    );
  };

  const handleCanvasElementSelect = (element: WishElement | null) => {
    if (element === null) {
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
    if (step.length >= 2) return false;
    if (step.includes(newElementId)) return false;

    const existingElements = step
      .map(id => elements.find(el => el.id === id))
      .filter(Boolean);
    const newElement = elements.find(el => el.id === newElementId);

    if (!newElement) return false;

    const existingTypes = existingElements.map(el => el?.elementType);
    return !existingTypes.includes(newElement.elementType);
  };

  const canAddMoreSteps = () => {
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
    const usedElementIds = new Set();
    stepSequence.forEach(step => {
      step.forEach(id => usedElementIds.add(id));
    });

    return elements.filter(el => !usedElementIds.has(el.id));
  };

  const handleAddNextStep = () => {
    if (!canAddMoreSteps()) return;

    const availableElements = getAvailableElementsForSteps();
    if (availableElements.length === 0) return;

    const firstElement = availableElements[0];
    if (!firstElement) return;

    const newStep = [firstElement.id];
    setStepSequence([...stepSequence, newStep]);
  };

  const handleAddToStepSequence = (elementId: string) => {
    if (stepSequence.length > 0) {
      const lastStep = stepSequence[stepSequence.length - 1];
      if (lastStep && canCombine(lastStep, elementId)) {
        const updatedSequence = [...stepSequence];
        updatedSequence[updatedSequence.length - 1] = [...lastStep, elementId];
        setStepSequence(updatedSequence);
        return;
      }
    }

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

  // Step navigation functions
  const handleNextStep = () => {
    switch (currentStep) {
      case 'create':
        if (elements.length === 0) {
          alert('Please add at least one element before proceeding.');
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
  };

  const handlePreviousStep = () => {
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
      const userId = 'demo-user-123';
      await premiumService.upgradeUser(userId, 'pro');
      const newStatus = await premiumService.getUserPremiumStatus(userId);
      setUserPremiumStatus(newStatus);
    } catch (error) {
      console.error('Error upgrading user:', error);
      alert('Error upgrading user. Please try again.');
    }
  };

  const isUserPremium =
    propIsUserPremium !== undefined
      ? propIsUserPremium
      : userPremiumStatus?.isPremium || false;

  // Get step title and description
  const getStepInfo = () => {
    switch (currentStep) {
      case 'create':
        return {
          title: 'Create Your Wish',
          description: 'Add elements to build your wish',
          stepNumber: 1,
        };
      case 'steps':
        return {
          title: 'Manage Steps',
          description: 'Organize your elements into steps',
          stepNumber: 2,
        };
      case 'preview':
        return {
          title: 'Preview',
          description: 'See how your wish will look',
          stepNumber: 3,
        };
      case 'save':
        return {
          title: 'Save & Share',
          description: 'Save and share your wish',
          stepNumber: 4,
        };
    }
  };

  const stepInfo = getStepInfo();

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
        {currentStep === 'steps' && (
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
        )}
      </div>
    </div>
  );

  return (
    <div className='h-screen bg-gray-50 flex flex-col'>
      {/* Header */}
      <div className='bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-b border-purple-100 flex-shrink-0'>
        <div className='w-full max-w-[1800px] mx-auto px-4 md:px-6 py-3'>
          {/* Main Header Row */}
          <div className='flex items-center justify-between relative'>
            {/* Left Section - Back Button and Title */}
            <div className='flex items-center space-x-2 md:space-x-3 min-w-0 flex-1'>
              <Button
                variant='outline'
                onClick={onBack}
                className='text-xs md:text-sm px-2 md:px-3 py-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 flex-shrink-0'
              >
                <span className='hidden sm:inline'>← Back</span>
                <span className='sm:hidden'>←</span>
              </Button>

              <div className='flex flex-col min-w-0 flex-1'>
                <h1 className='text-sm md:text-lg lg:text-xl font-bold text-gray-900 truncate'>
                  {stepInfo.title}
                </h1>
                <div className='flex items-center space-x-1 md:space-x-2'>
                  <span className='text-xs text-purple-600 font-medium'>
                    Step {stepInfo.stepNumber} of 4
                  </span>
                  <span className='text-gray-400 hidden sm:inline'>•</span>
                  <span className='text-xs text-gray-600 truncate hidden sm:inline'>
                    {stepInfo.description}
                  </span>
                </div>
              </div>
            </div>

            {/* Center Section - Progress Stepper */}
            <div className='hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2'>
              <div className='flex items-center space-x-2'>
                {['create', 'steps', 'preview', 'save'].map((step, index) => (
                  <div key={step} className='flex items-center'>
                    {/* Step Circle */}
                    <div className='relative'>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          currentStep === step
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                            : index <
                                ['create', 'steps', 'preview', 'save'].indexOf(
                                  currentStep
                                )
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : 'bg-white border-2 border-gray-200 text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Checkmark for completed steps */}
                      {index <
                        ['create', 'steps', 'preview', 'save'].indexOf(
                          currentStep
                        ) && (
                        <div className='absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center'>
                          <span className='text-white text-xs'>✓</span>
                        </div>
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`ml-1 text-xs font-medium ${
                        currentStep === step
                          ? 'text-purple-700'
                          : index <
                              ['create', 'steps', 'preview', 'save'].indexOf(
                                currentStep
                              )
                            ? 'text-green-700'
                            : 'text-gray-500'
                      }`}
                    >
                      {step === 'create' && 'Create'}
                      {step === 'steps' && 'Steps'}
                      {step === 'preview' && 'Preview'}
                      {step === 'save' && 'Save'}
                    </span>

                    {/* Connector Line */}
                    {index < 3 && (
                      <div className='relative mx-1'>
                        <div className='w-6 h-0.5 bg-gray-200'>
                          <div
                            className={`h-full transition-all duration-500 ${
                              index <
                              ['create', 'steps', 'preview', 'save'].indexOf(
                                currentStep
                              )
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gray-200'
                            }`}
                            style={{
                              width:
                                index <
                                ['create', 'steps', 'preview', 'save'].indexOf(
                                  currentStep
                                )
                                  ? '100%'
                                  : '0%',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Navigation Buttons */}
            <div className='flex items-center space-x-1 md:space-x-2 flex-shrink-0'>
              {currentStep !== 'create' && (
                <Button
                  variant='outline'
                  onClick={handlePreviousStep}
                  className='text-xs md:text-sm px-2 md:px-3 py-1.5 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200'
                >
                  <span className='hidden sm:inline'>← Previous</span>
                  <span className='sm:hidden'>←</span>
                </Button>
              )}

              {currentStep !== 'save' && (
                <Button
                  variant='primary'
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 'create' && elements.length === 0) ||
                    (currentStep === 'steps' && stepSequence.length === 0)
                  }
                  className='text-xs md:text-sm px-3 md:px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='hidden sm:inline'>
                    {currentStep === 'preview' ? 'Save & Share' : 'Next →'}
                  </span>
                  <span className='sm:hidden'>
                    {currentStep === 'preview' ? 'Save' : '→'}
                  </span>
                </Button>
              )}

              {currentStep === 'save' && (
                <Button
                  variant='primary'
                  onClick={handleSaveWish}
                  disabled={elements.length === 0}
                  className='text-xs md:text-sm px-2 md:px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='hidden sm:inline'>💾 Save & Share</span>
                  <span className='sm:hidden'>💾</span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className='md:hidden mt-3'>
            <div className='flex items-center justify-center space-x-3'>
              {['create', 'steps', 'preview', 'save'].map((step, index) => (
                <div key={step} className='flex flex-col items-center'>
                  <div className='relative'>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        currentStep === step
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                          : index <
                              ['create', 'steps', 'preview', 'save'].indexOf(
                                currentStep
                              )
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            : 'bg-white border-2 border-gray-200 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {index <
                      ['create', 'steps', 'preview', 'save'].indexOf(
                        currentStep
                      ) && (
                      <div className='absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-xs'>✓</span>
                      </div>
                    )}
                  </div>

                  <div className='mt-1 text-center'>
                    <div
                      className={`text-xs font-medium ${
                        currentStep === step
                          ? 'text-purple-700'
                          : index <
                              ['create', 'steps', 'preview', 'save'].indexOf(
                                currentStep
                              )
                            ? 'text-green-700'
                            : 'text-gray-500'
                      }`}
                    >
                      {step === 'create' && 'Create'}
                      {step === 'steps' && 'Steps'}
                      {step === 'preview' && 'Preview'}
                      {step === 'save' && 'Save'}
                    </div>
                  </div>

                  {index < 3 && (
                    <div className='absolute top-3 left-full w-full h-0.5 bg-gray-200'>
                      <div
                        className={`h-full transition-all duration-500 ${
                          index <
                          ['create', 'steps', 'preview', 'save'].indexOf(
                            currentStep
                          )
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gray-200'
                        }`}
                        style={{
                          width:
                            index <
                            ['create', 'steps', 'preview', 'save'].indexOf(
                              currentStep
                            )
                              ? '100%'
                              : '0%',
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Builder */}
      <div className='flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-6 py-4 md:py-6 overflow-hidden'>
        {/* Desktop Layout */}
        <div className='hidden md:grid md:grid-cols-12 gap-6 h-full'>
          {/* Step Manager Panel - Only show in steps step */}
          {currentStep === 'steps' && (
            <div className='col-span-12 bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col'>
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

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden'>
                {/* Available Elements */}
                <div className='flex flex-col h-full min-h-0'>
                  <h4 className='text-sm font-medium text-gray-700 mb-3'>
                    Available Elements
                  </h4>
                  <div className='space-y-2 flex-1 overflow-y-auto min-h-0'>
                    {getAvailableElementsForSteps().map(element => (
                      <div
                        key={element.id}
                        className='p-3 rounded-lg border flex items-center justify-between transition-colors bg-gray-50 border-gray-200 hover:bg-gray-100'
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
                  <div className='space-y-2 flex-1 overflow-y-auto min-h-0'>
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Element Palette - Show in create step */}
          {currentStep === 'create' && (
            <div className='col-span-3 overflow-hidden'>
              <ElementPalette
                elements={availableElements}
                onAddElement={handleAddElement}
                selectedElements={
                  isRestrictedMode ? originalTemplateElements : selectedElements
                }
                onSelectElement={handleSelectElement}
                onUnselectElement={handleUnselectElement}
                isUserPremium={isUserPremium}
                isRestrictedMode={isRestrictedMode}
                canvasElements={elements}
              />
            </div>
          )}

          {/* Canvas - Show in create and preview steps */}
          {(currentStep === 'create' || currentStep === 'preview') && (
            <div
              className={`overflow-hidden ${currentStep === 'create' ? 'col-span-6' : 'col-span-12'}`}
            >
              <WishCanvas
                elements={elements}
                selectedElement={
                  currentStep === 'preview' ? null : selectedElement
                }
                onSelectElement={
                  currentStep === 'preview'
                    ? () => {}
                    : handleCanvasElementSelect
                }
                onUpdateElement={handleUpdateElement}
                recipientName={recipientName}
                message={message}
                theme={theme}
                customBackgroundColor={customBackgroundColor}
                onCanvasSettingsToggle={setShowCanvasSettings}
                isPreviewMode={currentStep === 'preview'}
                stepSequence={stepSequence}
              />
            </div>
          )}

          {/* Properties Panel - Show in create step */}
          {currentStep === 'create' && (
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

          {/* Save & Share Step */}
          {currentStep === 'save' && (
            <div className='col-span-12 bg-white rounded-lg shadow-sm border p-6'>
              <div className='text-center'>
                <div className='text-6xl mb-4'>🎉</div>
                <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                  Your Wish is Ready!
                </h2>
                <p className='text-gray-600 mb-6'>
                  You've created a beautiful wish with {elements.length} element
                  {elements.length !== 1 ? 's' : ''}.
                  {stepSequence.length > 0 &&
                    ` It has ${stepSequence.length} step${stepSequence.length !== 1 ? 's' : ''} in the sequence.`}
                </p>
                <div className='flex flex-col space-y-2'>
                  <Button
                    variant='outline'
                    onClick={() => setCurrentStep('preview')}
                    className='text-sm'
                  >
                    ← Back to Preview
                  </Button>
                  <Button
                    variant='primary'
                    onClick={handleSaveWish}
                    disabled={elements.length === 0}
                    className='text-sm'
                  >
                    Save & Share
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden h-full pb-16'>
          {/* Step Manager Panel */}
          {currentStep === 'steps' && mobileView === 'steps' && (
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
          {currentStep === 'create' && mobileView === 'palette' && (
            <div className='h-full'>
              <ElementPalette
                elements={availableElements}
                onAddElement={handleAddElement}
                selectedElements={
                  isRestrictedMode ? originalTemplateElements : selectedElements
                }
                onSelectElement={handleSelectElement}
                onUnselectElement={handleUnselectElement}
                isUserPremium={isUserPremium}
                isRestrictedMode={isRestrictedMode}
                canvasElements={elements}
              />
            </div>
          )}

          {/* Canvas */}
          {(currentStep === 'create' || currentStep === 'preview') &&
            mobileView === 'canvas' && (
              <div className='h-full'>
                <WishCanvas
                  elements={elements}
                  selectedElement={
                    currentStep === 'preview' ? null : selectedElement
                  }
                  onSelectElement={
                    currentStep === 'preview'
                      ? () => {}
                      : handleCanvasElementSelect
                  }
                  onUpdateElement={handleUpdateElement}
                  recipientName={recipientName}
                  message={message}
                  theme={theme}
                  customBackgroundColor={customBackgroundColor}
                  onCanvasSettingsToggle={setShowCanvasSettings}
                  isPreviewMode={currentStep === 'preview'}
                  stepSequence={stepSequence}
                />
              </div>
            )}

          {/* Properties Panel */}
          {currentStep === 'create' && mobileView === 'properties' && (
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

          {/* Save & Share Step */}
          {currentStep === 'save' && (
            <div className='bg-white rounded-lg shadow-sm border p-6'>
              <div className='text-center'>
                <div className='text-6xl mb-4'>🎉</div>
                <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                  Your Wish is Ready!
                </h2>
                <p className='text-gray-600 mb-6'>
                  You've created a beautiful wish with {elements.length} element
                  {elements.length !== 1 ? 's' : ''}.
                  {stepSequence.length > 0 &&
                    ` It has ${stepSequence.length} step${stepSequence.length !== 1 ? 's' : ''} in the sequence.`}
                </p>
                <div className='flex flex-col space-y-2'>
                  <Button
                    variant='outline'
                    onClick={() => setCurrentStep('preview')}
                    className='text-sm'
                  >
                    ← Back to Preview
                  </Button>
                  <Button
                    variant='primary'
                    onClick={handleSaveWish}
                    disabled={elements.length === 0}
                    className='text-sm'
                  >
                    Save & Share
                  </Button>
                </div>
              </div>
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
