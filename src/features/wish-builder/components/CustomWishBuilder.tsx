'use client';

import React, { useEffect, useMemo } from 'react';
import { WishElement } from '@/types/templates';
import { Button } from '@/components/ui/Button';
import { ElementPalette } from './ElementPalette';
import { WishCanvas } from './WishCanvas';
import {
  ElementPropertiesPanel,
  CanvasSettingsPanel,
} from './ElementPropertiesPanel';
import { SaveShareDialog } from '@/components/ui/SaveShareDialog';
import { PresentationMode } from '@/components/ui/PresentationMode';
import { getAllElements } from '@/config/elements';
import { premiumService } from '@/lib/premiumService';
import { FirebaseTemplateService } from '@/lib/firebaseTemplateService';
import { Wish } from '@/types';
import {
  useWishBuilderState,
  useWishBuilderActions,
  useWishBuilderNavigation,
} from '../hooks';

// Constants
const CREATION_STEPS = ['create', 'steps', 'preview', 'save'] as const;
const TEMPLATE_STEPS = [
  'canvas-settings',
  'element-settings',
  'preview',
  'save',
] as const;
const MAX_STEPS = 10;
const MOBILE_BREAKPOINT = 768;
const DEMO_USER_ID = 'demo-user-123';

interface CustomWishBuilderProps {
  onBack: () => void;
  templateId?: string;
  isUserPremium?: boolean;
  isTemplateMode?: boolean;
  isAdminMode?: boolean;
  onSaveTemplate?: (elements: WishElement[], stepSequence: string[][]) => void;
  templateMetadata?:
    | {
        name: string;
        description: string;
        occasion: string;
      }
    | undefined;
  onShowMetadataForm?: (() => void) | undefined;
  adminIsSaving?: boolean;
}

type CreationStep = (typeof CREATION_STEPS)[number];
type TemplateStep = (typeof TEMPLATE_STEPS)[number];

// Extracted Step Info Component
const StepInfo = ({
  currentStep,
  isTemplateMode,
}: {
  currentStep: CreationStep | TemplateStep;
  isTemplateMode: boolean;
}) => {
  if (isTemplateMode) {
    switch (currentStep as TemplateStep) {
      case 'canvas-settings':
        return {
          title: 'Canvas Settings',
          description:
            'Configure background, music, and overall template settings',
          stepNumber: 1,
        };
      case 'element-settings':
        return {
          title: 'Element Settings',
          description: 'Customize individual elements one by one',
          stepNumber: 2,
        };
      case 'preview':
        return {
          title: 'Preview',
          description: 'See how your customized template will look',
          stepNumber: 3,
        };
      case 'save':
        return {
          title: 'Save & Share',
          description: 'Save and share your customized template',
          stepNumber: 4,
        };
    }
  }

  switch (currentStep as CreationStep) {
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
const ProgressStepper = ({
  currentStep,
  isTemplateMode,
}: {
  currentStep: CreationStep | TemplateStep;
  isTemplateMode: boolean;
}) => {
  const steps = isTemplateMode ? TEMPLATE_STEPS : CREATION_STEPS;

  return (
    <div className='hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2'>
      <div className='flex items-center space-x-2'>
        {steps.map((step, index) => {
          const isCurrent = currentStep === step;
          const isCompleted = steps.indexOf(currentStep as any) > index;

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
                {step === 'canvas-settings' && 'Canvas'}
                {step === 'element-settings' && 'Elements'}
                {step === 'preview' && 'Preview'}
                {step === 'save' && 'Save'}
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
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
const MobileProgress = ({
  currentStep,
  isTemplateMode,
}: {
  currentStep: CreationStep | TemplateStep;
  isTemplateMode: boolean;
}) => {
  const steps = isTemplateMode ? TEMPLATE_STEPS : CREATION_STEPS;

  return (
    <div className='md:hidden mt-3'>
      <div className='flex items-center justify-center space-x-3'>
        {steps.map((step, index) => {
          const isCurrent = currentStep === step;
          const isCompleted = steps.indexOf(currentStep as any) > index;

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
                  {step === 'canvas-settings' && 'Canvas'}
                  {step === 'element-settings' && 'Elements'}
                  {step === 'preview' && 'Preview'}
                  {step === 'save' && 'Save'}
                </div>
              </div>

              {index < steps.length - 1 && (
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
  isTemplateMode,
}: {
  currentStep: CreationStep | TemplateStep;
  mobileView: 'canvas' | 'palette' | 'properties' | 'steps';
  setMobileView: (view: 'canvas' | 'palette' | 'properties' | 'steps') => void;
  isTemplateMode: boolean;
}) => (
  <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50'>
    <div className='flex justify-around p-2'>
      {/* Canvas button - show in create step (non-template) and element-settings step (template) */}
      {((currentStep === 'create' && !isTemplateMode) ||
        (currentStep === 'element-settings' && isTemplateMode)) && (
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
      )}

      {/* Elements button - only in non-template mode create step */}
      {currentStep === 'create' && !isTemplateMode && (
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
      )}

      {/* Settings/Properties button - show in appropriate steps */}
      {((currentStep === 'create' && !isTemplateMode) ||
        (currentStep === 'canvas-settings' && isTemplateMode) ||
        (currentStep === 'element-settings' && isTemplateMode)) && (
        <button
          onClick={() => setMobileView('properties')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            mobileView === 'properties'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600'
          }`}
          aria-label='Switch to properties panel'
        >
          <span className='text-lg'>
            {isTemplateMode && currentStep === 'canvas-settings'
              ? '⚙️'
              : isTemplateMode && currentStep === 'element-settings'
                ? '🎨'
                : '⚙️'}
          </span>
          <span className='text-xs'>
            {isTemplateMode && currentStep === 'canvas-settings'
              ? 'Settings'
              : isTemplateMode && currentStep === 'element-settings'
                ? 'Elements'
                : 'Settings'}
          </span>
        </button>
      )}

      {/* Steps button - only in non-template mode */}
      {!isTemplateMode && currentStep === 'steps' && (
        <button
          onClick={() => setMobileView('steps')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            mobileView === 'steps'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-orange-100 text-orange-700'
          }`}
          aria-label='Switch to steps management'
        >
          <span className='text-lg'>🎭</span>
          <span className='text-xs'>Steps</span>
        </button>
      )}

      {/* Preview button - only in preview step */}
      {currentStep === 'preview' && (
        <button
          onClick={() => setMobileView('canvas')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            mobileView === 'canvas'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
          }`}
          aria-label='Switch to preview view'
        >
          <span className='text-lg'>👁️</span>
          <span className='text-xs'>Preview</span>
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
  isTemplateMode,
  isAdminMode = false,
  templateMetadata,
  onShowMetadataForm,
  adminIsSaving = false,
  recipientName = '',
  setRecipientName = () => {},
  message = '',
  setMessage = () => {},
  theme = '',
}: {
  elements: WishElement[];
  stepSequence: string[][];
  onBackToPreview: () => void;
  onSave: () => void;
  isTemplateMode: boolean;
  isAdminMode?: boolean;
  templateMetadata?:
    | {
        name: string;
        description: string;
        occasion: string;
      }
    | undefined;
  onShowMetadataForm?: (() => void) | undefined;
  adminIsSaving?: boolean;
  recipientName?: string;
  setRecipientName?: (name: string) => void;
  message?: string;
  setMessage?: (message: string) => void;
  theme?: string;
}) => {
  return (
    <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12'>
      <div className='text-center'>
        <div className='text-8xl mb-6'>{isAdminMode ? '🎨' : '🎉'}</div>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
          {isAdminMode
            ? 'Template Creation Complete!'
            : isTemplateMode
              ? 'Your Customized Template is Ready!'
              : 'Your Wish is Ready!'}
        </h2>
        <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed'>
          {isAdminMode ? (
            <>
              You've created a template with{' '}
              <span className='font-semibold text-purple-600'>
                {elements.length} element{elements.length !== 1 ? 's' : ''}
              </span>
              . Now add the template information to make it available for users.
            </>
          ) : (
            <>
              You've{' '}
              {isTemplateMode
                ? 'customized a template with'
                : 'created a beautiful wish with'}{' '}
              <span className='font-semibold text-purple-600'>
                {elements.length} element{elements.length !== 1 ? 's' : ''}
              </span>
              {isTemplateMode ? ' and configured all settings.' : '.'}
              {!isTemplateMode && stepSequence.length > 0 && (
                <span>
                  {' '}
                  It has{' '}
                  <span className='font-semibold text-purple-600'>
                    {stepSequence.length} step
                    {stepSequence.length !== 1 ? 's' : ''}
                  </span>{' '}
                  in the sequence.
                </span>
              )}
            </>
          )}
        </p>

        {/* Stats Cards */}
        <div
          className={`grid gap-4 mb-8 max-w-md mx-auto ${isTemplateMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}
        >
          <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200'>
            <div className='text-2xl font-bold text-purple-600'>
              {elements.length}
            </div>
            <div className='text-sm text-gray-600'>Elements</div>
          </div>
          {!isTemplateMode && (
            <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200'>
              <div className='text-2xl font-bold text-green-600'>
                {stepSequence.length}
              </div>
              <div className='text-sm text-gray-600'>Steps</div>
            </div>
          )}
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <Button
            variant='outline'
            onClick={onBackToPreview}
            className='w-full sm:w-auto px-8 py-3 text-base font-medium'
            aria-label='Go back to preview'
          >
            ← Back to Preview
          </Button>

          {isAdminMode ? (
            <>
              <Button
                variant='outline'
                onClick={onShowMetadataForm}
                className='w-full sm:w-auto px-8 py-3 text-base font-medium'
                aria-label='Add template information'
              >
                📝 Add Template Info
              </Button>
              <Button
                variant='primary'
                onClick={onSave}
                disabled={elements.length === 0 || adminIsSaving}
                className='w-full sm:w-auto px-8 py-3 text-base font-medium bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                aria-label='Save template'
              >
                {adminIsSaving ? '💾 Saving...' : '💾 Save Template'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='primary'
                onClick={onSave}
                disabled={elements.length === 0}
                className='w-full sm:w-auto px-8 py-3 text-base font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                aria-label={
                  isTemplateMode
                    ? 'Save and share customized template'
                    : 'Save and share wish'
                }
              >
                💾 {isTemplateMode ? 'Save Template' : 'Save & Share'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

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
  isAdminMode = false,
  onSaveTemplate,
  templateMetadata,
  onShowMetadataForm,
  adminIsSaving = false,
}: CustomWishBuilderProps) {
  // Use custom hooks for state management
  const state = useWishBuilderState();
  const {
    selectedElement,
    setSelectedElement,
    elements,
    setElements,
    selectedElements,
    setSelectedElements,
    originalTemplateElements,
    setOriginalTemplateElements,
    recipientName,
    setRecipientName,
    message,
    setMessage,
    theme,
    setTheme,
    customBackgroundColor,
    setCustomBackgroundColor,
    showCanvasSettings,
    setShowCanvasSettings,
    currentStep,
    setCurrentStep,
    mobileView,
    setMobileView,
    showMobileMenu,
    setShowMobileMenu,
    stepSequence,
    setStepSequence,
    isSaving,
    setIsSaving,
    isLoading,
    setIsLoading,
    error,
    setError,
    userPremiumStatus,
    setUserPremiumStatus,
    isLoadingPremium,
    setIsLoadingPremium,
    showSaveShareDialog,
    setShowSaveShareDialog,
    currentWish,
    setCurrentWish,
    showPresentationMode,
    setShowPresentationMode,
    shareUrl,
    setShareUrl,
    loadedTemplateRef,
  } = state;

  // State for template loading
  const [template, setTemplate] = React.useState<any>(null);
  const [templateLoading, setTemplateLoading] = React.useState(false);
  const [music, setMusic] = React.useState('');

  // Computed values
  const availableElements = useMemo(() => getAllElements(), []);

  // Load template from Firebase
  React.useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) {
        setTemplate(null);
        return;
      }

      // Don't try to load template for custom-blank (custom wish creation)
      if (templateId === 'custom-blank') {
        setTemplate(null);
        setTemplateLoading(false);
        return;
      }

      setTemplateLoading(true);
      try {
        const result =
          await FirebaseTemplateService.getTemplateById(templateId);
        if (result.success && result.data) {
          setTemplate(result.data);
        } else {
          console.error('Failed to load template:', result.error);
          setTemplate(null);
        }
      } catch (error) {
        console.error('Error loading template:', error);
        setTemplate(null);
      } finally {
        setTemplateLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);
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
  const stepInfo = useMemo(
    () => StepInfo({ currentStep, isTemplateMode }),
    [currentStep, isTemplateMode]
  );

  // Use custom hooks for actions and navigation
  const actions = useWishBuilderActions({
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
    availableElements: availableElements as any,
    isRestrictedMode,
    recipientName,
    message,
    theme,
    templateId,
    customBackgroundColor,
  });

  const navigation = useWishBuilderNavigation({
    currentStep,
    setCurrentStep,
    setError,
    elements,
    stepSequence,
    isTemplateMode,
  });

  // Enhanced navigation handlers that also manage mobile view
  const handleNextStepWithMobileView = () => {
    navigation.handleNextStep();
    // Auto-switch mobile view based on next step
    if (currentStep === 'create') {
      if (isTemplateMode) {
        setMobileView('properties'); // Go to canvas settings in template mode
      } else {
        setMobileView('steps');
      }
    } else if (currentStep === 'steps') {
      setMobileView('canvas');
    } else if (currentStep === 'canvas-settings' && isTemplateMode) {
      setMobileView('properties'); // Go to element settings
    } else if (currentStep === 'element-settings' && isTemplateMode) {
      setMobileView('canvas'); // Go to preview
    }
  };

  const handlePreviousStepWithMobileView = () => {
    navigation.handlePreviousStep();
    // Auto-switch mobile view based on previous step
    if (currentStep === 'preview') {
      if (isTemplateMode) {
        setMobileView('properties'); // Go back to element settings in template mode
      } else {
        setMobileView('steps');
      }
    } else if (currentStep === 'steps') {
      setMobileView('canvas');
    } else if (currentStep === 'element-settings' && isTemplateMode) {
      setMobileView('properties'); // Go back to canvas settings
    } else if (currentStep === 'canvas-settings' && isTemplateMode) {
      setMobileView('canvas'); // Go back to canvas view
    }
  };

  // Additional handlers that need to be defined here
  const handleTemplateModeSelection = (elementId: string) => {
    const elementTypeExists = originalTemplateElements.some(
      el => el.elementType === elementId
    );
    if (!elementTypeExists) return;

    const canvasElementExists = elements.some(
      el => el.elementType === elementId
    );
    if (canvasElementExists) {
      const existingElement = elements.find(el => el.elementType === elementId);
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
  };

  const handleNormalModeSelection = (elementId: string) => {
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
  };

  const handleSelectElement = (elementId: string) => {
    if (isRestrictedMode) {
      handleTemplateModeSelection(elementId);
    } else {
      handleNormalModeSelection(elementId);
    }
  };

  const handleUnselectElement = (elementId: string) => {
    setSelectedElements(prev => prev.filter(el => el.id !== elementId));

    if (isRestrictedMode) {
      setElements(prev => prev.filter(el => el.id !== elementId));
    } else {
      setElements(prev =>
        prev.filter(
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

  const canAddMoreSteps = () => {
    const usedElementIds = new Set();
    stepSequence.forEach(step => step.forEach(id => usedElementIds.add(id)));
    const availableElements = elements.filter(el => !usedElementIds.has(el.id));
    return availableElements.length > 0 && stepSequence.length < MAX_STEPS;
  };

  const handleAddNextStep = () => {
    if (!canAddMoreSteps()) return;

    const availableElements = actions.getAvailableElementsForSteps();
    if (availableElements.length === 0) return;

    const firstElement = availableElements[0];
    if (!firstElement) return;

    const newStep = [firstElement.id];
    setStepSequence(prev => [...prev, newStep]);
  };

  const handleOpenPresentationMode = () => {
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
  };

  const getSelectedElementsForDisplay = () => {
    return selectedElements.length > 0 ? selectedElements : elements;
  };

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

  // Set mobile view to 'steps' when in steps step (only in non-template mode)
  useEffect(() => {
    if (currentStep === 'steps' && mobileView === 'canvas' && !isTemplateMode) {
      setMobileView('steps');
    }
  }, [currentStep, mobileView, setMobileView, isTemplateMode]);

  // Set mobile view to 'canvas' when in preview step
  useEffect(() => {
    if (currentStep === 'preview' && mobileView !== 'canvas') {
      setMobileView('canvas');
    }
  }, [currentStep, mobileView, setMobileView]);

  // Set mobile view to 'properties' when in canvas-settings step (template mode)
  useEffect(() => {
    if (
      currentStep === 'canvas-settings' &&
      mobileView === 'canvas' &&
      isTemplateMode
    ) {
      setMobileView('properties');
    }
  }, [currentStep, mobileView, setMobileView, isTemplateMode]);

  // Set mobile view to 'properties' when in element-settings step (template mode) - but only if not already in canvas view
  useEffect(() => {
    if (
      currentStep === 'element-settings' &&
      mobileView !== 'canvas' &&
      mobileView !== 'properties' &&
      isTemplateMode
    ) {
      setMobileView('properties');
    }
  }, [currentStep, mobileView, setMobileView, isTemplateMode]);

  // Set initial step for template mode
  useEffect(() => {
    if (isTemplateMode && currentStep === 'create') {
      setCurrentStep('canvas-settings');
    }
  }, [isTemplateMode, currentStep, setCurrentStep]);

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
    const loadTemplateElements = async () => {
      if (
        template?.id &&
        template?.defaultElementIds &&
        loadedTemplateRef.current !== template.id
      ) {
        // Convert element IDs to WishElements using the helper function
        const { elementIdsToWishElements } = await import('@/config/elements');
        const wishElements = elementIdsToWishElements(
          template.defaultElementIds
        );

        setElements(wishElements);
        setOriginalTemplateElements(wishElements);
        if (wishElements.length > 0) {
          setSelectedElement(wishElements[0] || null);
          setSelectedElements(wishElements);
        }
        // Load step sequence if available
        if (template.stepSequence) {
          // Convert step sequence from element type IDs to actual element IDs
          const convertedStepSequence = template.stepSequence.map(
            (step: string[]) =>
              step.map((elementId: string) => {
                // First try to find by exact ID (in case it's already a full ID)
                let element = wishElements.find(el => el.id === elementId);

                // If not found by ID, try by elementType (in case it's an element type ID)
                if (!element) {
                  element = wishElements.find(
                    el => el.elementType === elementId
                  );
                }

                // If still not found, try to match by elementType from the old ID
                if (!element) {
                  // Extract elementType from old ID (e.g., "balloons-interactive_1752587338014" -> "balloons-interactive")
                  const elementType = elementId.split('_')[0];
                  element = wishElements.find(
                    el => el.elementType === elementType
                  );
                }

                return element ? element.id : elementId;
              })
          );
          setStepSequence(convertedStepSequence);
        }
        loadedTemplateRef.current = template.id;
      }
    };

    loadTemplateElements();
  }, [template?.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showSaveShareDialog) {
          setShowSaveShareDialog(false);
        } else if (showPresentationMode) {
          setShowPresentationMode(false);
        } else if (
          (currentStep !== 'create' && !isTemplateMode) ||
          (currentStep !== 'canvas-settings' && isTemplateMode)
        ) {
          handlePreviousStepWithMobileView();
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (currentStep === 'save') {
          // For both template mode and custom wish creation, create a wish object and open the dialog
          const wishData = {
            title: `Wish for ${recipientName || 'Recipient'}`,
            recipientName: recipientName || '',
            message: message || '',
            theme,
            elements: elements,
            stepSequence: stepSequence,
            customBackgroundColor,
            isPublic: true,
          };
          setCurrentWish(wishData as any);
          setShowSaveShareDialog(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showSaveShareDialog,
    showPresentationMode,
    currentStep,
    navigation.handlePreviousStep,
    recipientName,
    message,
    theme,
    elements,
    stepSequence,
    customBackgroundColor,
    setCurrentWish,
    setShowSaveShareDialog,
  ]);

  return (
    <div className='h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col'>
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
      {(isLoading || templateLoading) && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 flex items-center space-x-3'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600'></div>
            <span className='text-gray-700'>
              {templateLoading ? 'Loading template...' : 'Processing...'}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className='bg-white/80 backdrop-blur-sm border-b border-white/20 flex-shrink-0'>
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
            <ProgressStepper
              currentStep={currentStep}
              isTemplateMode={isTemplateMode}
            />

            {/* Right Section - Navigation Buttons */}
            <div className='flex items-center space-x-1 md:space-x-2 flex-shrink-0'>
              {(currentStep !== 'create' && !isTemplateMode) ||
              (currentStep !== 'canvas-settings' && isTemplateMode) ? (
                <Button
                  variant='outline'
                  onClick={handlePreviousStepWithMobileView}
                  className='text-xs md:text-sm px-2 md:px-3 py-1.5 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200'
                  aria-label='Go to previous step'
                  disabled={isLoading}
                >
                  <span className='hidden sm:inline'>← Previous</span>
                  <span className='sm:hidden'>←</span>
                </Button>
              ) : null}

              {currentStep !== 'save' && (
                <Button
                  variant='primary'
                  onClick={handleNextStepWithMobileView}
                  disabled={
                    isLoading ||
                    (currentStep === 'create' &&
                      !isTemplateMode &&
                      elements.length === 0) ||
                    (currentStep === 'element-settings' &&
                      isTemplateMode &&
                      elements.length === 0) ||
                    (!isTemplateMode &&
                      currentStep === 'steps' &&
                      stepSequence.length === 0)
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
                  onClick={() => {
                    // For both template mode and custom wish creation, create a wish object and open the dialog
                    const wishData = {
                      title: `Wish for ${recipientName || 'Recipient'}`,
                      recipientName: recipientName || '',
                      message: message || '',
                      theme,
                      elements: elements,
                      stepSequence: stepSequence,
                      customBackgroundColor,
                      isPublic: true,
                    };
                    setCurrentWish(wishData as any);
                    setShowSaveShareDialog(true);
                  }}
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
          <MobileProgress
            currentStep={currentStep}
            isTemplateMode={isTemplateMode}
          />
        </div>
      </div>

      {/* Main Builder */}
      <div className='flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-6 py-4 md:py-6 overflow-hidden'>
        {/* Desktop Layout */}
        <div className='hidden md:grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-4 lg:gap-6 h-full'>
          {/* Step Manager Panel - Only show in steps step and not in template mode */}
          {currentStep === 'steps' && !isTemplateMode && (
            <StepManagerPanel
              stepSequence={stepSequence}
              elements={elements}
              getAvailableElementsForSteps={
                actions.getAvailableElementsForSteps
              }
              handleAddNextStep={handleAddNextStep}
              handleAddToStepSequence={actions.handleAddToStepSequence}
              handleReorderSteps={actions.handleReorderSteps}
              handleRemoveFromStepSequence={
                actions.handleRemoveFromStepSequence
              }
              handleAutoGenerateSequence={actions.handleAutoGenerateSequence}
              handleClearStepSequence={actions.handleClearStepSequence}
              setStepSequence={setStepSequence}
            />
          )}

          {/* Element Palette - Show in create step (non-template mode) */}
          {currentStep === 'create' && !isTemplateMode && (
            <div className='col-span-3 lg:col-span-3 xl:col-span-3 overflow-hidden'>
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

          {/* Canvas - Show in create, preview, and template steps */}
          {(currentStep === 'create' ||
            currentStep === 'preview' ||
            currentStep === 'canvas-settings' ||
            currentStep === 'element-settings') && (
            <div
              className={`overflow-hidden ${
                currentStep === 'create' && !isTemplateMode
                  ? 'col-span-6 lg:col-span-6 xl:col-span-6'
                  : currentStep === 'canvas-settings'
                    ? 'col-span-8 lg:col-span-8 xl:col-span-8'
                    : currentStep === 'element-settings'
                      ? 'col-span-7 lg:col-span-6 xl:col-span-7'
                      : 'col-span-12'
              }`}
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
                onUpdateElement={actions.handleUpdateElement}
                recipientName={recipientName}
                message={message}
                theme={theme}
                customBackgroundColor={customBackgroundColor}
                onCanvasSettingsToggle={setShowCanvasSettings}
                isPreviewMode={currentStep === 'preview'}
                stepSequence={stepSequence}
                music={music}
              />
            </div>
          )}

          {/* Properties Panel - Show in create step (non-template mode) and element-settings step (template mode) */}
          {(currentStep === 'create' && !isTemplateMode) ||
          currentStep === 'element-settings' ? (
            <div
              className={`overflow-hidden ${
                currentStep === 'create' && !isTemplateMode
                  ? 'col-span-3 lg:col-span-3 xl:col-span-3'
                  : currentStep === 'element-settings'
                    ? 'col-span-5 lg:col-span-6 xl:col-span-5'
                    : 'col-span-3'
              }`}
            >
              <ElementPropertiesPanel
                element={selectedElement}
                onUpdateElement={actions.handleUpdateElement}
                onDeleteElement={actions.handleDeleteElement}
                recipientName={recipientName}
                message={message}
                theme={theme}
                onUpdateRecipientName={setRecipientName}
                onUpdateMessage={setMessage}
                onUpdateTheme={setTheme}
                customBackgroundColor={customBackgroundColor}
                onUpdateCustomBackgroundColor={setCustomBackgroundColor}
                showCanvasSettings={
                  currentStep === 'element-settings'
                    ? false
                    : showCanvasSettings
                }
                isUserPremium={isUserPremium}
                onUpgradeClick={actions.handleUpgradeClick}
                selectedElements={getSelectedElementsForDisplay()}
                elements={elements}
                onSwitchToElement={handleSwitchToElement}
                music={music}
                onUpdateMusic={setMusic}
              />
            </div>
          ) : null}

          {/* Canvas Settings Panel - Show in canvas-settings step (template mode) */}
          {currentStep === 'canvas-settings' && isTemplateMode && (
            <div className='col-span-4 lg:col-span-4 xl:col-span-4 overflow-hidden'>
              <CanvasSettingsPanel
                theme={theme}
                onUpdateTheme={setTheme}
                music={music}
                onUpdateMusic={setMusic}
                showCanvasSettings={true}
                isUserPremium={isUserPremium}
              />
            </div>
          )}

          {/* Save & Share Step */}
          {currentStep === 'save' && (
            <div className='col-span-12 flex items-center justify-center min-h-[600px] bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden'>
              {/* Floating decorative elements */}
              <div className='absolute top-10 left-10 text-4xl opacity-20 animate-bounce'>
                🎈
              </div>
              <div className='absolute top-20 right-20 text-3xl opacity-20 animate-pulse'>
                ✨
              </div>
              <div
                className='absolute bottom-20 left-20 text-3xl opacity-20 animate-bounce'
                style={{ animationDelay: '1s' }}
              >
                🎉
              </div>
              <div
                className='absolute bottom-10 right-10 text-4xl opacity-20 animate-pulse'
                style={{ animationDelay: '0.5s' }}
              >
                💫
              </div>

              <div className='max-w-2xl w-full relative z-10'>
                <SaveShareStep
                  elements={elements}
                  stepSequence={stepSequence}
                  onBackToPreview={() => setCurrentStep('preview')}
                  onSave={
                    isAdminMode
                      ? () => onSaveTemplate?.(elements, stepSequence)
                      : () => {
                          // For both template mode and custom wish creation, create a wish object and open the dialog
                          const wishData = {
                            title: `Wish for ${recipientName || 'Recipient'}`,
                            recipientName: recipientName || '',
                            message: message || '',
                            theme,
                            elements: elements,
                            stepSequence: stepSequence,
                            customBackgroundColor,
                            music,
                            isPublic: true,
                          };
                          setCurrentWish(wishData as any);
                          setShowSaveShareDialog(true);
                        }
                  }
                  isTemplateMode={isTemplateMode}
                  isAdminMode={isAdminMode}
                  templateMetadata={templateMetadata}
                  onShowMetadataForm={onShowMetadataForm}
                  adminIsSaving={adminIsSaving}
                  recipientName={recipientName}
                  setRecipientName={setRecipientName}
                  message={message}
                  setMessage={setMessage}
                  theme={theme}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden h-full pb-16'>
          {/* Step Manager Panel - Only in non-template mode */}
          {currentStep === 'steps' &&
            mobileView === 'steps' &&
            !isTemplateMode && (
              <StepManagerPanel
                stepSequence={stepSequence}
                elements={elements}
                getAvailableElementsForSteps={
                  actions.getAvailableElementsForSteps
                }
                handleAddNextStep={handleAddNextStep}
                handleAddToStepSequence={actions.handleAddToStepSequence}
                handleReorderSteps={actions.handleReorderSteps}
                handleRemoveFromStepSequence={
                  actions.handleRemoveFromStepSequence
                }
                handleAutoGenerateSequence={actions.handleAutoGenerateSequence}
                handleClearStepSequence={actions.handleClearStepSequence}
                setStepSequence={setStepSequence}
              />
            )}

          {/* Fallback for steps step when not in steps view - Only in non-template mode */}
          {currentStep === 'steps' &&
            mobileView !== 'steps' &&
            !isTemplateMode && (
              <div className='h-full flex items-center justify-center'>
                <div className='text-center p-6'>
                  <div className='text-4xl mb-4'>🎭</div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    Step Management
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Use the "Steps" button below to manage your step sequence.
                  </p>
                  <button
                    onClick={() => setMobileView('steps')}
                    className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                  >
                    Open Steps Manager
                  </button>
                </div>
              </div>
            )}

          {/* Element Palette - Only in non-template mode */}
          {currentStep === 'create' &&
            mobileView === 'palette' &&
            !isTemplateMode && (
              <div className='h-full'>
                <ElementPalette
                  elements={availableElements}
                  onAddElement={handleAddElement}
                  selectedElements={
                    isRestrictedMode
                      ? originalTemplateElements
                      : selectedElements
                  }
                  onSelectElement={handleSelectElement}
                  onUnselectElement={handleUnselectElement}
                  isUserPremium={isUserPremium}
                  isRestrictedMode={isRestrictedMode}
                  canvasElements={elements}
                />
              </div>
            )}

          {/* Fallback for create step when not in any specific view - Only in non-template mode */}
          {currentStep === 'create' &&
            mobileView !== 'canvas' &&
            mobileView !== 'palette' &&
            mobileView !== 'properties' &&
            !isTemplateMode && (
              <div className='h-full flex items-center justify-center'>
                <div className='text-center p-6'>
                  <div className='text-4xl mb-4'>🎨</div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    Create Your Wish
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Use the navigation buttons below to build your wish.
                  </p>
                  <div className='flex flex-col space-y-2'>
                    <button
                      onClick={() => setMobileView('canvas')}
                      className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                    >
                      Canvas
                    </button>
                    <button
                      onClick={() => setMobileView('palette')}
                      className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                    >
                      Elements
                    </button>
                    <button
                      onClick={() => setMobileView('properties')}
                      className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                    >
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

          {/* Fallback for canvas-settings step when not in properties view - Template mode */}
          {currentStep === 'canvas-settings' &&
            mobileView !== 'canvas' &&
            mobileView !== 'properties' &&
            isTemplateMode && (
              <div className='h-full flex items-center justify-center'>
                <div className='text-center p-6'>
                  <div className='text-4xl mb-4'>⚙️</div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    Canvas Settings
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Use the Settings button below to configure your template.
                  </p>
                  <div className='flex flex-col space-y-2'>
                    <button
                      onClick={() => setMobileView('canvas')}
                      className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                    >
                      Canvas
                    </button>
                    <button
                      onClick={() => setMobileView('properties')}
                      className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                    >
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

          {/* Fallback for element-settings step when not in properties view - Template mode */}
          {currentStep === 'element-settings' &&
            mobileView !== 'canvas' &&
            mobileView !== 'properties' &&
            isTemplateMode && (
              <div className='h-full flex items-center justify-center'>
                <div className='text-center p-6'>
                  <div className='text-4xl mb-4'>🎨</div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    Element Settings
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Choose Canvas to see your template or Elements to customize
                    individual elements.
                  </p>
                  <div className='flex flex-col space-y-2'>
                    <button
                      onClick={() => setMobileView('canvas')}
                      className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                    >
                      Canvas
                    </button>
                    <button
                      onClick={() => setMobileView('properties')}
                      className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                    >
                      Elements
                    </button>
                  </div>
                </div>
              </div>
            )}

          {/* Canvas */}
          {(currentStep === 'create' ||
            currentStep === 'preview' ||
            currentStep === 'canvas-settings' ||
            currentStep === 'element-settings') &&
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
                  onUpdateElement={actions.handleUpdateElement}
                  recipientName={recipientName}
                  message={message}
                  theme={theme}
                  customBackgroundColor={customBackgroundColor}
                  onCanvasSettingsToggle={setShowCanvasSettings}
                  isPreviewMode={currentStep === 'preview'}
                  stepSequence={stepSequence}
                  music={music}
                />
              </div>
            )}

          {/* Fallback for preview step when not in canvas view */}
          {currentStep === 'preview' && mobileView !== 'canvas' && (
            <div className='h-full flex items-center justify-center'>
              <div className='text-center p-6'>
                <div className='text-4xl mb-4'>👁️</div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Preview Mode
                </h3>
                <p className='text-gray-600 mb-4'>
                  Switch to Canvas view to see your{' '}
                  {isTemplateMode ? 'template' : 'wish'} preview.
                </p>
                <button
                  onClick={() => setMobileView('canvas')}
                  className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                >
                  Show Preview
                </button>
              </div>
            </div>
          )}

          {/* Properties Panel - Non-template mode and element-settings step */}
          {(currentStep === 'create' &&
            mobileView === 'properties' &&
            !isTemplateMode) ||
          (currentStep === 'element-settings' &&
            mobileView === 'properties' &&
            isTemplateMode) ? (
            <div className='h-full'>
              <ElementPropertiesPanel
                element={selectedElement}
                onUpdateElement={actions.handleUpdateElement}
                onDeleteElement={actions.handleDeleteElement}
                recipientName={recipientName}
                message={message}
                theme={theme}
                onUpdateRecipientName={setRecipientName}
                onUpdateMessage={setMessage}
                onUpdateTheme={setTheme}
                customBackgroundColor={customBackgroundColor}
                onUpdateCustomBackgroundColor={setCustomBackgroundColor}
                showCanvasSettings={
                  currentStep === 'element-settings'
                    ? false
                    : showCanvasSettings
                }
                isUserPremium={isUserPremium}
                onUpgradeClick={actions.handleUpgradeClick}
                selectedElements={getSelectedElementsForDisplay()}
                elements={elements}
                onSwitchToElement={handleSwitchToElement}
                music={music}
                onUpdateMusic={setMusic}
              />
            </div>
          ) : null}

          {/* Canvas Settings Panel - Template mode (only in canvas-settings step) */}
          {currentStep === 'canvas-settings' &&
            mobileView === 'properties' &&
            isTemplateMode && (
              <div className='h-full'>
                <CanvasSettingsPanel
                  theme={theme}
                  onUpdateTheme={setTheme}
                  music={music}
                  onUpdateMusic={setMusic}
                  showCanvasSettings={true}
                  isUserPremium={isUserPremium}
                />
              </div>
            )}

          {/* Save & Share Step */}
          {currentStep === 'save' && (
            <div className='h-full flex items-center justify-center'>
              <SaveShareStep
                elements={elements}
                stepSequence={stepSequence}
                onBackToPreview={() => setCurrentStep('preview')}
                onSave={
                  isAdminMode
                    ? () => onSaveTemplate?.(elements, stepSequence)
                    : () => {
                        // For both template mode and custom wish creation, create a wish object and open the dialog
                        const wishData = {
                          title: `Wish for ${recipientName || 'Recipient'}`,
                          recipientName: recipientName || '',
                          message: message || '',
                          theme,
                          elements: elements,
                          stepSequence: stepSequence,
                          customBackgroundColor,
                          music,
                          isPublic: true,
                        };
                        setCurrentWish(wishData as any);
                        setShowSaveShareDialog(true);
                      }
                }
                isTemplateMode={isTemplateMode}
                recipientName={recipientName}
                setRecipientName={setRecipientName}
                message={message}
                setMessage={setMessage}
                theme={theme}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        currentStep={currentStep}
        mobileView={mobileView}
        setMobileView={setMobileView}
        isTemplateMode={isTemplateMode}
      />

      {/* Save & Share Dialog */}
      <SaveShareDialog
        isOpen={showSaveShareDialog}
        onClose={() => setShowSaveShareDialog(false)}
        wish={currentWish}
        onSave={actions.handleSaveFromDialog}
        onShare={actions.handleShareFromDialog}
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
