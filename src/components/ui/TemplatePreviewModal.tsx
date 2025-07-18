'use client';

import { Template } from '@/types/templates';
import { WishCanvas } from '@/features/wish-builder/components/WishCanvas';
import { WishElement, ElementProperties } from '@/types/templates';
import { ELEMENT_DEFINITIONS } from '@/config/elements';

interface TemplatePreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) {
  if (!isOpen || !template) return null;

  // Create sample elements based on template configuration
  const createSampleElements = (): WishElement[] => {
    const elements: WishElement[] = [];

    template.elements.forEach((elementType, index) => {
      const elementDef = ELEMENT_DEFINITIONS.find(
        def => def.id === elementType
      );
      if (!elementDef) return;

      const element: WishElement = {
        id: `preview-${elementType}-${index}`,
        elementType: elementType as any,
        properties: {
          ...elementDef.properties,
          // Add some sample data for preview
          title: template.name,
          message: template.description,
          titleColor: '#FF6B9D',
          messageColor: '#4A5568',
          numberOfBalloons: 3,
          balloonColors: ['#FF6B9D', '#4ECDC4', '#45B7D1'],
          balloonSize: 50,
          showHint: true,
          startAnimation: true,
        } as ElementProperties,
        order: index,
      };

      elements.push(element);
    });

    return elements;
  };

  const sampleElements = createSampleElements();

  return (
    <div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-gray-100'>
        {/* Minimal Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0'>
          <div className='flex items-center space-x-4'>
            <div className='text-3xl'>{template.thumbnail}</div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                {template.name}
              </h2>
              <p className='text-sm text-gray-500'>{template.description}</p>
              {template.creditCost && template.creditCost > 0 && (
                <div className='flex items-center space-x-2 mt-1'>
                  <span className='text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-medium'>
                    💎 {template.creditCost} credits
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
          >
            <svg
              className='w-4 h-4 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 flex flex-col lg:flex-row overflow-hidden'>
          {/* Preview Canvas */}
          <div className='flex-1 min-h-[500px] lg:min-h-[700px] bg-gradient-to-br from-gray-50 to-gray-100'>
            <WishCanvas
              elements={sampleElements}
              selectedElement={null}
              onSelectElement={() => {}}
              onUpdateElement={() => {}}
              recipientName='Preview'
              message={template.description}
              theme='purple'
              isPreviewMode={true}
              {...(template.stepSequence && {
                stepSequence: template.stepSequence,
              })}
            />
          </div>

          {/* Minimal Sidebar */}
          <div className='w-full lg:w-72 bg-white p-6 overflow-y-auto flex-shrink-0 border-l border-gray-100'>
            <div className='space-y-6'>
              {/* Elements */}
              <div className='space-y-3'>
                <h3 className='text-sm font-medium text-gray-900 uppercase tracking-wide'>
                  Elements
                </h3>
                <div className='space-y-2'>
                  {template.elements.map((element, index) => {
                    const elementDef = ELEMENT_DEFINITIONS.find(
                      def => def.id === element
                    );
                    return (
                      <div
                        key={index}
                        className='flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'
                      >
                        <span className='text-lg'>
                          {elementDef?.icon || '🎨'}
                        </span>
                        <div className='flex-1 min-w-0'>
                          <div className='text-sm font-medium text-gray-900 truncate'>
                            {elementDef?.name || element}
                          </div>
                          <div className='text-xs text-gray-500 truncate'>
                            {elementDef?.description || 'Custom element'}
                          </div>
                        </div>
                        {elementDef?.creditCost &&
                          elementDef.creditCost > 0 && (
                            <span className='text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full flex-shrink-0'>
                              💎 {elementDef.creditCost}
                            </span>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Sequence */}
              {template.stepSequence && template.stepSequence.length > 0 && (
                <div className='space-y-3'>
                  <h3 className='text-sm font-medium text-gray-900 uppercase tracking-wide'>
                    Steps
                  </h3>
                  <div className='space-y-2'>
                    {template.stepSequence.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className='p-3 bg-gray-50 rounded-xl'
                      >
                        <div className='flex items-center space-x-2 mb-2'>
                          <span className='text-xs font-bold text-white w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0'>
                            {stepIndex + 1}
                          </span>
                          <span className='text-xs text-gray-500'>
                            Step {stepIndex + 1}
                          </span>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                          {step.map((element, elementIndex) => {
                            const elementDef = ELEMENT_DEFINITIONS.find(
                              def => def.id === element
                            );
                            return (
                              <span
                                key={elementIndex}
                                className='text-xs bg-white px-2 py-1 rounded-lg flex items-center space-x-1 flex-shrink-0 border border-gray-200'
                              >
                                <span>{elementDef?.icon || '🎨'}</span>
                                <span className='hidden sm:inline'>
                                  {elementDef?.name || element}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Note */}
              <div className='bg-blue-50 border border-blue-100 rounded-xl p-4'>
                <div className='flex items-start space-x-2'>
                  <span className='text-blue-500 text-sm'>💡</span>
                  <div className='text-xs text-blue-700'>
                    Click elements to see interactive features in action
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className='bg-gray-50 p-4 flex-shrink-0 border-t border-gray-100'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-500'>
              Ready to create your wish?
            </div>
            <div className='flex space-x-3'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm'
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className='px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm font-medium'
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
