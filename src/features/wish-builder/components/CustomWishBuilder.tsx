'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
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

// Constants
const CREATION_STEPS = ['create', 'steps', 'preview', 'save'] as const;
const MAX_STEPS = 10;
const MOBILE_BREAKPOINT = 768;
const DEMO_USER_ID = 'demo-user-123';

interface CustomWishBuilderProps {
  onBack: () => void;
  templateId?: string;
  isUserPremium?: boolean;
  isTemplateMode?: boolean;
}

type CreationStep = (typeof CREATION_STEPS)[number];

// Extracted Step Info Component
const StepInfo = ({ currentStep }: { currentStep: CreationStep }) => {
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

// Extracted Progress Stepper Component
const ProgressStepper = ({ currentStep }: { currentStep: CreationStep }) => {
  return (
    <div className='hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2'>
      <div className='flex items-center space-x-2'>
        {CREATION_STEPS.map((step, index) => {
          const isCurrent = currentStep === step;
          const isCompleted = CREATION_STEPS.indexOf(currentStep) > index;

          return (
            <div key={step} className='flex items-center'>
              {/* Step Circle */}
              <div className='relative'>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                      : isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
                  aria-label={`Step ${index + 1}: ${step}`}
                >
                  {index + 1}
                </div>

                {/* Checkmark for completed steps */}
                {isCompleted && (
                  <div className='absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`ml-1 text-xs font-medium ${
                  isCurrent
                    ? 'text-purple-700'
                    : isCompleted
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
              {index < CREATION_STEPS.length - 1 && (
                <div className='relative mx-1'>
                  <div className='w-6 h-0.5 bg-gray-200'>
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gray-200'
                      }`}
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Extracted Mobile Progress Component
const MobileProgress = ({ currentStep }: { currentStep: CreationStep }) => {
  return (
    <div className='md:hidden mt-3'>
      <div className='flex items-center justify-center space-x-3'>
        {CREATION_STEPS.map((step, index) => {
          const isCurrent = currentStep === step;
          const isCompleted = CREATION_STEPS.indexOf(currentStep) > index;

          return (
            <div key={step} className='flex flex-col items-center'>
              <div className='relative'>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                      : isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
                  aria-label={`Step ${index + 1}: ${step}`}
                >
                  {index + 1}
                </div>

                {isCompleted && (
                  <div className='absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                )}
              </div>

              <div className='mt-1 text-center'>
                <div
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-purple-700'
                      : isCompleted
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

              {index < CREATION_STEPS.length - 1 && (
                <div className='absolute top-3 left-full w-full h-0.5 bg-gray-200'>
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gray-200'
                    }`}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Extracted Mobile Navigation Component
const MobileNavigation = ({
  currentStep,
  mobileView,
  setMobileView,
}: {
  currentStep: CreationStep;
  mobileView: 'canvas' | 'palette' | 'properties' | 'steps';
  setMobileView: (view: 'canvas' | 'palette' | 'properties' | 'steps') => void;
}) => (
  <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50'>
    <div className='flex justify-around p-2'>
      <button
        onClick={() => setMobileView('canvas')}
        className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
          mobileView === 'canvas'
            ? 'bg-purple-100 text-purple-700'
            : 'text-gray-600'
        }`}
        aria-label='Switch to canvas view'
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
        aria-label='Switch to elements palette'
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
        aria-label='Switch to properties panel'
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
          aria-label='Switch to steps management'
        >
          <span className='text-lg'>🎭</span>
          <span className='text-xs'>Steps</span>
        </button>
      )}
    </div>
  </div>
);

// Extracted Step Sequence Item Component
const StepSequenceItem = ({
  step,
  index,
  elements,
  onReorder,
  onRemove,
  onRemoveElement,
}: {
  step: string[];
  index: number;
  elements: WishElement[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (index: number) => void;
  onRemoveElement: (elementId: string) => void;
}) => (
  <div className='p-3 rounded-lg border bg-white shadow-sm flex flex-col'>
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
          onClick={() => onReorder(index, Math.max(0, index - 1))}
          disabled={index === 0}
          className='text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
          title='Move step up'
          aria-label='Move step up'
        >
          ↑
        </button>
        <button
          onClick={() => onReorder(index, Math.min(step.length - 1, index + 1))}
          disabled={index === step.length - 1}
          className='text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
          title='Move step down'
          aria-label='Move step down'
        >
          ↓
        </button>
        <button
          onClick={() => onRemove(index)}
          className='text-red-500 hover:text-red-700 text-sm'
          title='Remove entire step'
          aria-label='Remove step'
        >
          🗑️
        </button>
      </div>
    </div>
    <div className='flex flex-wrap gap-2 items-center'>
      {step.map(id => {
        const element = elements.find(el => el.id === id);
        return (
          <span
            key={id}
            className='flex items-center bg-purple-100 text-purple-800 rounded px-2 py-1 text-xs font-medium'
          >
            {element?.elementType === 'balloons-interactive' ? '🎈' : '📝'}
            <span className='ml-1'>{element?.elementType || 'Unknown'}</span>
            <button
              className='ml-2 text-xs text-red-500 hover:text-red-700'
              onClick={() => onRemoveElement(id)}
              title='Remove this element from step'
              aria-label={`Remove ${element?.elementType} from step`}
            >
              ✕
            </button>
          </span>
        );
      })}
    </div>
  </div>
);

// Extracted Save Share Step Component
const SaveShareStep = ({
  elements,
  stepSequence,
  onBackToPreview,
  onSave,
}: {
  elements: WishElement[];
  stepSequence: string[][];
  onBackToPreview: () => void;
  onSave: () => void;
}) => (
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
          onClick={onBackToPreview}
          className='text-sm'
          aria-label='Go back to preview'
        >
          ← Back to Preview
        </Button>
        <Button
          variant='primary'
          onClick={onSave}
          disabled={elements.length === 0}
          className='text-sm'
          aria-label='Save and share wish'
        >
          Save & Share
        </Button>
      </div>
    </div>
  </div>
);

// Extracted Step Manager Panel Component
const StepManagerPanel = ({
  stepSequence,
  elements,
  getAvailableElementsForSteps,
  handleAddNextStep,
  handleAddToStepSequence,
  handleReorderSteps,
  handleRemoveFromStepSequence,
  handleAutoGenerateSequence,
  handleClearStepSequence,
  setStepSequence,
}: {
  stepSequence: string[][];
  elements: WishElement[];
  getAvailableElementsForSteps: () => WishElement[];
  handleAddNextStep: () => void;
  handleAddToStepSequence: (elementId: string) => void;
  handleReorderSteps: (fromIndex: number, toIndex: number) => void;
  handleRemoveFromStepSequence: (elementId: string) => void;
  handleAutoGenerateSequence: () => void;
  handleClearStepSequence: () => void;
  setStepSequence: React.Dispatch<React.SetStateAction<string[][]>>;
}) => (
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
          aria-label='Auto generate step sequence'
        >
          Auto Generate
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleClearStepSequence}
          title='Remove all steps'
          aria-label='Clear all steps'
        >
          Clear All
        </Button>
      </div>
    </div>

    {/* Add Next Step Button */}
    {stepSequence.length > 0 && stepSequence.length < MAX_STEPS && (
      <div className='mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 flex-shrink-0'>
        <button
          onClick={handleAddNextStep}
          className='w-full p-3 bg-white rounded-lg border border-green-300 hover:border-green-400 hover:shadow-sm transition-all text-center'
          title='Add the next step to your sequence'
          aria-label='Add next step to sequence'
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
                  {element.elementType === 'balloons-interactive' ? '🎈' : '📝'}
                </span>
                <span className='font-medium text-sm text-gray-800'>
                  {element.elementType}
                </span>
                <span className='text-xs text-gray-500'>ID: {element.id}</span>
              </div>
              <Button
                size='sm'
                variant='outline'
                onClick={() => handleAddToStepSequence(element.id as string)}
                title='Add to a new step or combine with last step if allowed'
                aria-label={`Add ${element.elementType} to step sequence`}
              >
                Add to Step
              </Button>
            </div>
          ))}
          {getAvailableElementsForSteps().length === 0 && (
            <div className='text-center py-4 text-gray-500'>
              <p className='text-sm'>All elements have been added to steps</p>
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
              <StepSequenceItem
                key={index}
                step={step}
                index={index}
                elements={elements}
                onReorder={handleReorderSteps}
                onRemove={index =>
                  setStepSequence(stepSequence.filter((_, i) => i !== index))
                }
                onRemoveElement={handleRemoveFromStepSequence}
              />
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);

export function CustomWishBuilder({
  onBack,
  templateId,
  isUserPremium: propIsUserPremium,
  isTemplateMode = false,
}: CustomWishBuilderProps) {
  // ALL HOOKS MUST BE DECLARED AT THE TOP LEVEL IN A CONSISTENT ORDER

  // 1. All useState hooks first
  const [selectedElement, setSelectedElement] = useState<WishElement | null>(
    null
  );
  const [elements, setElements] = useState<WishElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<WishElement[]>([]);
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
  const [currentStep, setCurrentStep] = useState<CreationStep>('create');
  const [mobileView, setMobileView] = useState<
    'canvas' | 'palette' | 'properties' | 'steps'
  >('canvas');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userPremiumStatus, setUserPremiumStatus] =
    useState<UserPremiumStatus | null>(null);
  const [isLoadingPremium, setIsLoadingPremium] = useState(true);
  const [showSaveShareDialog, setShowSaveShareDialog] = useState(false);
  const [currentWish, setCurrentWish] = useState<Wish | null>(null);
  const [showPresentationMode, setShowPresentationMode] = useState(false);
  const [stepSequence, setStepSequence] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. All useRef hooks
  const loadedTemplateRef = useRef<string | null>(null);

  // 3. All custom hooks
  const { createWish, shareWish, error: wishError } = useWishManagement();

  // 4. All useMemo hooks
  const availableElements = useMemo(() => getAllElements(), []);
  const template = useMemo(
    () => (templateId ? getTemplateById(templateId) : null),
    [templateId]
  );
  const isRestrictedMode = useMemo(
    () => isTemplateMode && templateId !== 'custom-blank',
    [isTemplateMode, templateId]
  );
  const isUserPremium = useMemo(
    () =>
      propIsUserPremium !== undefined
        ? propIsUserPremium
        : userPremiumStatus?.isPremium || false,
    [propIsUserPremium, userPremiumStatus]
  );
  const stepInfo = useMemo(() => StepInfo({ currentStep }), [currentStep]);

  // 5. All useCallback hooks
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    setError(`An error occurred while ${context}. Please try again.`);
    setTimeout(() => setError(null), 5000);
  }, []);

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
    [handleError]
  );

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

  const canAddMoreSteps = useCallback(() => {
    const usedElementIds = new Set();
    stepSequence.forEach(step => step.forEach(id => usedElementIds.add(id)));
    const availableElements = elements.filter(el => !usedElementIds.has(el.id));
    return availableElements.length > 0 && stepSequence.length < MAX_STEPS;
  }, [stepSequence, elements]);

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
    [availableElements, elements.length]
  );

  const handleTemplateModeSelection = useCallback(
    (elementId: string) => {
      const elementTypeExists = originalTemplateElements.some(
        el => el.elementType === elementId
      );
      if (!elementTypeExists) return;

      const canvasElementExists = elements.some(
        el => el.elementType === elementId
      );
      if (canvasElementExists) {
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
        setElements(prev => [...prev, newElement]);
        setSelectedElement(newElement);
        setShowCanvasSettings(false);
      }
    },
    [originalTemplateElements, elements]
  );

  const handleNormalModeSelection = useCallback(
    (elementId: string) => {
      const element = availableElements.find(el => el.id === elementId);
      if (element) {
        const selectedElement: WishElement = {
          id: elementId,
          elementType: elementId,
          properties: { ...element.properties, isSelected: true },
          order: selectedElements.length,
        };
        setSelectedElements(prev => [...prev, selectedElement]);

        const canvasElement: WishElement = {
          id: `${elementId}_${Date.now()}`,
          elementType: elementId,
          properties: { ...element.properties },
          order: elements.length,
        };
        setElements(prev => [...prev, canvasElement]);
        setSelectedElement(canvasElement);
        setShowCanvasSettings(false);
      }
    },
    [availableElements, selectedElements.length, elements.length]
  );

  const handleSelectElement = useCallback(
    (elementId: string) => {
      if (isRestrictedMode) {
        handleTemplateModeSelection(elementId);
      } else {
        handleNormalModeSelection(elementId);
      }
    },
    [isRestrictedMode, handleTemplateModeSelection, handleNormalModeSelection]
  );

  const handleUnselectElement = useCallback(
    (elementId: string) => {
      setSelectedElements(prev => prev.filter(el => el.id !== elementId));

      if (isRestrictedMode) {
        setElements(prev => prev.filter(el => el.id !== elementId));
      } else {
        setElements(prev =>
          prev.filter(
            el =>
              !(
                el.elementType === elementId &&
                el.id.startsWith(elementId + '_')
              )
          )
        );
      }

      if (selectedElement?.id === elementId) {
        setSelectedElement(null);
      }
    },
    [isRestrictedMode, selectedElement?.id]
  );

  const handleAddElement = useCallback(
    (elementType: string) => {
      if (isRestrictedMode) return;

      const element = availableElements.find(e => e.id === elementType);
      if (element) {
        const newElement: WishElement = {
          id: `${elementType}_${Date.now()}`,
          elementType: elementType,
          properties: { ...element.properties },
          order: elements.length,
        };
        setElements(prev => [...prev, newElement]);
        setSelectedElement(newElement);
      }
    },
    [isRestrictedMode, availableElements, elements.length]
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
    [selectedElement?.id]
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
    [selectedElement?.id]
  );

  const handleCanvasElementSelect = useCallback(
    (element: WishElement | null) => {
      if (element === null) {
        setSelectedElements(elements);
        setSelectedElement(null);
        setShowCanvasSettings(false);
      } else {
        setSelectedElement(element);
        setSelectedElements([element]);
        setShowCanvasSettings(false);
      }
    },
    [elements]
  );

  const handleSwitchToElement = useCallback(
    (elementId: string) => {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        setSelectedElement(element);
        setSelectedElements([element]);
        setShowCanvasSettings(false);
      }
    },
    [elements]
  );

  const handleAddNextStep = useCallback(() => {
    if (!canAddMoreSteps()) return;

    const availableElements = getAvailableElementsForSteps();
    if (availableElements.length === 0) return;

    const firstElement = availableElements[0];
    if (!firstElement) return;

    const newStep = [firstElement.id];
    setStepSequence(prev => [...prev, newStep]);
  }, [canAddMoreSteps, getAvailableElementsForSteps]);

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
    [stepSequence, canCombine]
  );

  const handleRemoveFromStepSequence = useCallback((elementId: string) => {
    setStepSequence(prev =>
      prev
        .map(step => step.filter(id => id !== elementId))
        .filter(step => step.length > 0)
    );
  }, []);

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
    []
  );

  const handleClearStepSequence = useCallback(() => {
    setStepSequence([]);
  }, []);

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
  }, [elements]);

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
  }, [currentStep]);

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
  }, [currentStep, elements.length]);

  const handleSaveWish = useCallback(async () => {
    if (elements.length === 0) {
      setError('Please add at least one element to your wish before saving.');
      return;
    }

    await withLoading(async () => {
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
    }, 'saving wish');
  }, [
    elements,
    recipientName,
    message,
    theme,
    templateId,
    customBackgroundColor,
    createWish,
    withLoading,
  ]);

  const handleSaveFromDialog = useCallback(
    async (wishData: any): Promise<Wish | null> => {
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
    },
    [createWish]
  );

  const handleShareFromDialog = useCallback(
    async (wish: Wish): Promise<string> => {
      try {
        const shareUrl = await shareWish(wish);
        setShareUrl(shareUrl);
        return shareUrl;
      } catch (error) {
        console.error('Error sharing wish:', error);
        alert('Error sharing wish. Please try again.');
        return '';
      }
    },
    [shareWish]
  );

  const handleOpenPresentationMode = useCallback(() => {
    if (elements.length === 0) {
      setError(
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
  }, [
    elements,
    recipientName,
    message,
    theme,
    templateId,
    customBackgroundColor,
  ]);

  const handleUpgradeClick = useCallback(async () => {
    await withLoading(async () => {
      await premiumService.upgradeUser(DEMO_USER_ID, 'pro');
      const newStatus = await premiumService.getUserPremiumStatus(DEMO_USER_ID);
      setUserPremiumStatus(newStatus);
    }, 'upgrading user');
  }, [withLoading]);

  const getSelectedElementsForDisplay = useCallback(() => {
    return selectedElements.length > 0 ? selectedElements : elements;
  }, [selectedElements, elements]);

  // 6. All useEffect hooks
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(
        window.innerWidth < MOBILE_BREAKPOINT ? 'canvas' : 'canvas'
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadPremiumStatus = async () => {
      try {
        const status = await premiumService.getUserPremiumStatus(DEMO_USER_ID);
        setUserPremiumStatus(status);
      } catch (error) {
        console.error('Error loading premium status:', error);
      } finally {
        setIsLoadingPremium(false);
      }
    };

    loadPremiumStatus();
  }, []);

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
        setSelectedElements(template.defaultElements);
      }
      loadedTemplateRef.current = template.id;
    }
  }, [template?.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showSaveShareDialog) {
          setShowSaveShareDialog(false);
        } else if (showPresentationMode) {
          setShowPresentationMode(false);
        } else if (currentStep !== 'create') {
          handlePreviousStep();
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (currentStep === 'save') {
          handleSaveWish();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showSaveShareDialog,
    showPresentationMode,
    currentStep,
    handlePreviousStep,
    handleSaveWish,
  ]);

  return (
    <div className='h-screen bg-gray-50 flex flex-col'>
      {/* Error Toast */}
      {error && (
        <div className='fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-md'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <span className='text-red-500 mr-2'>⚠️</span>
              <span className='text-sm'>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className='text-red-500 hover:text-red-700 ml-2'
              aria-label='Dismiss error'
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 flex items-center space-x-3'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600'></div>
            <span className='text-gray-700'>Processing...</span>
          </div>
        </div>
      )}

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
                aria-label='Go back to previous page'
                disabled={isLoading}
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
            <ProgressStepper currentStep={currentStep} />

            {/* Right Section - Navigation Buttons */}
            <div className='flex items-center space-x-1 md:space-x-2 flex-shrink-0'>
              {currentStep !== 'create' && (
                <Button
                  variant='outline'
                  onClick={handlePreviousStep}
                  className='text-xs md:text-sm px-2 md:px-3 py-1.5 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200'
                  aria-label='Go to previous step'
                  disabled={isLoading}
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
                    isLoading ||
                    (currentStep === 'create' && elements.length === 0) ||
                    (currentStep === 'steps' && stepSequence.length === 0)
                  }
                  className='text-xs md:text-sm px-3 md:px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  aria-label={
                    currentStep === 'preview'
                      ? 'Save and share wish'
                      : 'Go to next step'
                  }
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
                  disabled={isLoading || elements.length === 0}
                  className='text-xs md:text-sm px-2 md:px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  aria-label='Save and share wish'
                >
                  <span className='hidden sm:inline'>💾 Save & Share</span>
                  <span className='sm:hidden'>💾</span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <MobileProgress currentStep={currentStep} />
        </div>
      </div>

      {/* Main Builder */}
      <div className='flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-6 py-4 md:py-6 overflow-hidden'>
        {/* Desktop Layout */}
        <div className='hidden md:grid md:grid-cols-12 gap-6 h-full'>
          {/* Step Manager Panel - Only show in steps step */}
          {currentStep === 'steps' && (
            <StepManagerPanel
              stepSequence={stepSequence}
              elements={elements}
              getAvailableElementsForSteps={getAvailableElementsForSteps}
              handleAddNextStep={handleAddNextStep}
              handleAddToStepSequence={handleAddToStepSequence}
              handleReorderSteps={handleReorderSteps}
              handleRemoveFromStepSequence={handleRemoveFromStepSequence}
              handleAutoGenerateSequence={handleAutoGenerateSequence}
              handleClearStepSequence={handleClearStepSequence}
              setStepSequence={setStepSequence}
            />
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
            <SaveShareStep
              elements={elements}
              stepSequence={stepSequence}
              onBackToPreview={() => setCurrentStep('preview')}
              onSave={handleSaveWish}
            />
          )}
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden h-full pb-16'>
          {/* Step Manager Panel */}
          {currentStep === 'steps' && mobileView === 'steps' && (
            <StepManagerPanel
              stepSequence={stepSequence}
              elements={elements}
              getAvailableElementsForSteps={getAvailableElementsForSteps}
              handleAddNextStep={handleAddNextStep}
              handleAddToStepSequence={handleAddToStepSequence}
              handleReorderSteps={handleReorderSteps}
              handleRemoveFromStepSequence={handleRemoveFromStepSequence}
              handleAutoGenerateSequence={handleAutoGenerateSequence}
              handleClearStepSequence={handleClearStepSequence}
              setStepSequence={setStepSequence}
            />
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
            <SaveShareStep
              elements={elements}
              stepSequence={stepSequence}
              onBackToPreview={() => setCurrentStep('preview')}
              onSave={handleSaveWish}
            />
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        currentStep={currentStep}
        mobileView={mobileView}
        setMobileView={setMobileView}
      />

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
