'use client';

import React, { useState, useEffect } from 'react';
import { InteractiveElement, WishElement, ElementProperties } from '@/types/templates';
import { Button } from '@/components/ui/Button';
import { ElementPalette } from './ElementPalette';
import { WishCanvas } from './WishCanvas';
import { ElementPropertiesPanel } from './ElementPropertiesPanel';
import { getAllElements } from '@/config/elements';
import { premiumService, UserPremiumStatus } from '@/lib/premiumService';
import { useWishManagement } from '@/features/wishes/hooks/useWishManagement';
import { Wish } from '@/types';

interface CustomWishBuilderProps {
  onBack: () => void;
  templateId?: string;
  isUserPremium?: boolean; // Optional prop for demo/testing purposes
}

export function CustomWishBuilder({ onBack, templateId, isUserPremium: propIsUserPremium }: CustomWishBuilderProps) {
  const [selectedElement, setSelectedElement] = useState<WishElement | null>(null);
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
  
  // Premium user status from service
  const [userPremiumStatus, setUserPremiumStatus] = useState<UserPremiumStatus | null>(null);
  const [isLoadingPremium, setIsLoadingPremium] = useState(true);

  // Get wish management hooks
  const { createWish, shareWish, error: wishError } = useWishManagement();

  // Get elements from centralized config
  const availableElements = getAllElements();

  // Step management
  const [showStepManager, setShowStepManager] = useState(false);
  const [stepSequence, setStepSequence] = useState<string[][]>([]); // Array of steps, each step is an array of element IDs

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
  console.log('CustomWishBuilder - Current theme:', theme);
  console.log('CustomWishBuilder - Selected element:', selectedElement);
  console.log('CustomWishBuilder - Elements count:', elements.length);
  console.log('CustomWishBuilder - User premium status:', userPremiumStatus);

  const handleAddToCanvas = (elementId: string) => {
    const element = availableElements.find(e => e.id === elementId);
    if (element) {
      const newElement: WishElement = {
        id: `${elementId}_${Date.now()}`,
        elementType: elementId,
        properties: { ...element.properties },
        order: elements.length
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
        order: selectedElements.length
      };
      setSelectedElements([...selectedElements, selectedElement]);
      
      // Also add to canvas automatically
      const canvasElement: WishElement = {
        id: `${elementId}_${Date.now()}`,
        elementType: elementId,
        properties: { ...element.properties },
        order: elements.length
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
    setElements(elements.filter(el => !(el.elementType === elementId && el.id.startsWith(elementId + '_'))));
    
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
        order: elements.length
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement);
    }
  };

  const handleUpdateElement = (elementId: string, properties: ElementProperties) => {
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
    setStepSequence(stepSequence.map(step => step.filter(id => id !== elementId)).filter(step => step.length > 0));
  };

  const handleCanvasElementSelect = (element: WishElement | null) => {
    if (element === null) {
      // "Select All" was clicked - select all elements
      setSelectedElements(elements);
      setSelectedElement(null);
      setShowCanvasSettings(false);
    } else {
      setSelectedElement(element);
      // Switch to element properties when an element is selected from canvas
      setShowCanvasSettings(false);
    }
  };

  // Function to switch between selected elements for editing
  const handleSwitchToElement = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      setSelectedElement(element);
      setShowCanvasSettings(false);
    }
  };

  // Function to get all selected elements for display
  const getSelectedElementsForDisplay = () => {
    // Return the actual selected elements that still exist in the elements array
    return selectedElements.filter(selected => 
      elements.some(el => el.id === selected.id)
    );
  };

  // Only allow combining if both are 'balloons-interactive' or 'beautiful-text'
  const canCombine = (step: string[], newElementId: string) => {
    if (step.length === 0) return true;
    if (step.length >= 2) return false; // Still limit 2 elements per step, but allow more steps
    const elementA = elements.find(el => el.id === step[0]);
    const elementB = elements.find(el => el.id === newElementId);
    if (!elementA || !elementB) return false;
    const allowed = ['balloons-interactive', 'beautiful-text'];
    return allowed.includes(elementA.elementType) && allowed.includes(elementB.elementType);
  };

  // Check if we can add more steps (limit to 10 steps)
  const canAddMoreSteps = () => {
    return stepSequence.length < 10;
  };

  // Quick sequence presets
  const quickSequencePresets = [
    {
      name: "Balloons → Balloons+Text",
      description: "Start with balloons, then show balloons with text",
      pattern: [
        ['balloons-interactive'],
        ['balloons-interactive', 'beautiful-text']
      ]
    },
    {
      name: "Text → Balloons",
      description: "Start with text, then show balloons",
      pattern: [
        ['beautiful-text'],
        ['balloons-interactive']
      ]
    },
    {
      name: "Balloons → Text",
      description: "Start with balloons, then show text",
      pattern: [
        ['balloons-interactive'],
        ['beautiful-text']
      ]
    },
    {
      name: "Text → Balloons+Text",
      description: "Start with text, then show text with balloons",
      pattern: [
        ['beautiful-text'],
        ['beautiful-text', 'balloons-interactive']
      ]
    }
  ];

  // Get available element types from user's canvas
  const getAvailableElementTypes = () => {
    const elementTypes = elements.map(el => el.elementType);
    return {
      hasBalloons: elementTypes.includes('balloons-interactive'),
      hasText: elementTypes.includes('beautiful-text'),
      hasConfetti: elementTypes.includes('confetti'),
      hasMusic: elementTypes.includes('music-player')
    };
  };

  // Get count of each element type
  const getElementTypeCounts = () => {
    const counts: { [key: string]: number } = {};
    elements.forEach(el => {
      counts[el.elementType] = (counts[el.elementType] || 0) + 1;
    });
    return counts;
  };

  // Get available elements for step sequence (including duplicates)
  const getAvailableElementsForSteps = () => {
    const usedElementIds = stepSequence.flat();
    return elements.filter(el => !usedElementIds.includes(el.id));
  };

  // Filter presets based on available elements
  const getAvailablePresets = () => {
    const available = getAvailableElementTypes();
    const elementCounts = getElementTypeCounts();
    const usedElementIds = stepSequence.flat();
    const remainingElements = elements.filter(el => !usedElementIds.includes(el.id));
    const remainingCounts: { [key: string]: number } = {};
    remainingElements.forEach(el => {
      remainingCounts[el.elementType] = (remainingCounts[el.elementType] || 0) + 1;
    });
    
    return quickSequencePresets.filter(preset => {
      const requiredTypes = preset.pattern.flat();
      return requiredTypes.every(type => {
        if (type === 'balloons-interactive') return (remainingCounts[type] || 0) > 0;
        if (type === 'beautiful-text') return (remainingCounts[type] || 0) > 0;
        if (type === 'confetti') return (remainingCounts[type] || 0) > 0;
        if (type === 'music-player') return (remainingCounts[type] || 0) > 0;
        return false;
      });
    });
  };

  // Add a second step to existing sequence
  const handleAddNextStep = () => {
    if (stepSequence.length === 0) {
      // If no steps exist, create first step with first available element
      const availableElements = getAvailableElementsForSteps();
      if (availableElements.length > 0) {
        const firstElement = availableElements[0];
        if (firstElement) {
          setStepSequence([[firstElement.id]]);
        }
      }
    } else {
      // Add next step with remaining elements
      const availableElements = getAvailableElementsForSteps();
      
      if (availableElements.length > 0 && availableElements[0]) {
        // Add the first available element as the next step
        setStepSequence([...stepSequence, [availableElements[0].id]]);
      }
    }
  };

  const handleQuickSequence = (preset: typeof quickSequencePresets[0]) => {
    // Clear current sequence
    setStepSequence([]);
    
    // Create the sequence based on available elements
    const newSequence: string[][] = [];
    
    for (const stepPattern of preset.pattern) {
      const stepElements: string[] = [];
      
      for (const elementType of stepPattern) {
        // Find an available element of this type that's not already used
        const availableElement = elements.find(el => 
          el.elementType === elementType && 
          !newSequence.flat().includes(el.id)
        );
        
        if (availableElement) {
          stepElements.push(availableElement.id);
        }
      }
      
      if (stepElements.length > 0) {
        newSequence.push(stepElements);
      }
    }
    
    setStepSequence(newSequence);
  };

  // Add to a new step or combine with the last step if allowed
  const handleAddToStepSequence = (elementId: string) => {
    // Check step limit
    if (!canAddMoreSteps()) {
      alert('Maximum 10 steps allowed. Please remove some steps to add more.');
      return;
    }
    
    // Try to combine with last step if allowed
    const lastStep = stepSequence[stepSequence.length - 1];
    if (stepSequence.length > 0 && lastStep && canCombine(lastStep, elementId)) {
      const newSequence = [...stepSequence];
      newSequence[newSequence.length - 1] = [...lastStep, elementId];
      setStepSequence(newSequence);
    } else {
      setStepSequence([...stepSequence, [elementId]]);
    }
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
    }
    setStepSequence(newSequence);
  };

  const handleClearStepSequence = () => {
    setStepSequence([]);
  };

  const handleAutoGenerateSequence = () => {
    // Auto-generate: each allowed element in its own step
    const interactiveElements = elements.filter(el => 
      el.elementType === 'balloons-interactive' || 
      el.elementType === 'beautiful-text' ||
      el.elementType === 'confetti' ||
      el.elementType === 'music-player'
    );
    const steps = interactiveElements.map(el => [el.id as string]);
    setStepSequence(steps);
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
    if (isPreviewMode) {
      setSelectedElement(null); // Clear selection when exiting preview
    }
  };

  const handleSaveWish = async () => {
    if (!recipientName.trim() || !message.trim()) {
      alert('Please fill in recipient name and message before saving.');
      return;
    }

    if (elements.length === 0) {
      alert('Please add at least one element to your wish before saving.');
      return;
    }

    setIsSaving(true);
    try {
      // Create the wish object
      const wishData = {
        recipientName: recipientName.trim(),
        message: message.trim(),
        theme,
        animation: 'fade', // Default animation
        occasion: templateId || 'custom',
        isPublic: true,
        elements: elements, // Include the canvas elements
        customBackgroundColor
      };

      // Save the wish using the wish management hook
      const savedWish = await createWish(wishData);
      
      if (savedWish) {
        // Generate share URL
        const shareUrl = await shareWish(savedWish);
        setShareUrl(shareUrl);
        
        // Show success message with share URL
        alert(`Wish saved successfully! Share URL: ${shareUrl}`);
        
        // Optionally redirect to the wish view page
        // window.location.href = `/wish/${savedWish.id}`;
      }
    } catch (error) {
      console.error('Error saving wish:', error);
      alert('Failed to save wish. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgradeClick = async () => {
    try {
      // For demo purposes, upgrade the user
      const userId = 'demo-user-123';
      await premiumService.upgradeUser(userId, 'pro');
      
      // Reload premium status
      const newStatus = await premiumService.getUserPremiumStatus(userId);
      setUserPremiumStatus(newStatus);
      
      console.log('User upgraded successfully');
    } catch (error) {
      console.error('Error upgrading user:', error);
      alert('Error upgrading user. Please try again.');
    }
  };

  // Get current premium status - use prop if provided, otherwise use service
  const isUserPremium = propIsUserPremium !== undefined ? propIsUserPremium : (userPremiumStatus?.isPremium || false);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="w-full max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack}>
                ← Back to Templates
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Custom Wish Builder</h1>
              {isPreviewMode && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Preview Mode
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => setShowStepManager(!showStepManager)}
              >
                {showStepManager ? 'Hide Steps' : 'Manage Steps'}
              </Button>
              <Button 
                variant={isPreviewMode ? "primary" : "outline"} 
                onClick={handlePreviewToggle}
              >
                {isPreviewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveWish}
                disabled={isSaving || !recipientName.trim() || !message.trim() || elements.length === 0}
              >
                {isSaving ? 'Saving...' : 'Save & Share'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Builder */}
      <div className="flex-1 w-full max-w-[1800px] mx-auto px-6 py-6 overflow-hidden">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Step Manager Panel */}
          {showStepManager && !isPreviewMode && (
            <div className="col-span-12 bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col" style={{ height: 'calc(100vh - 200px)', maxHeight: 'calc(100vh - 200px)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Step Sequence Manager</h3>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAutoGenerateSequence}
                    title="Automatically create a step for each interactive element"
                  >
                    Auto Generate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearStepSequence}
                    title="Remove all steps"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="mb-4 p-3 bg-blue-50 rounded text-blue-800 text-sm flex-shrink-0">
                <strong>How to use:</strong> Add elements to steps, combine up to 2 allowed elements per step, reorder steps, and remove elements or steps as needed. Hover buttons for tips.
              </div>
              {/* Add Next Step Button */}
              {stepSequence.length > 0 && stepSequence.length < 10 && (
                <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 flex-shrink-0">
                  <button
                    onClick={handleAddNextStep}
                    className="w-full p-3 bg-white rounded-lg border border-green-300 hover:border-green-400 hover:shadow-sm transition-all text-center"
                    title="Add the next step to your sequence"
                  >
                    <div className="font-medium text-sm text-green-800 mb-1">➕ Add Step {stepSequence.length + 1}</div>
                    <div className="text-xs text-green-600">
                      Automatically add the next logical step to your sequence
                    </div>
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden" style={{ minHeight: 0 }}>
                {/* Available Elements */}
                <div className="flex flex-col h-full min-h-0">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Available Elements</h4>
                  <div className="space-y-2 flex-1 overflow-y-auto min-h-0" style={{ minHeight: 0 }}>
                    {getAvailableElementsForSteps().map((element) => (
                      <div
                        key={element.id}
                        className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                          'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span title={element.elementType === 'balloons-interactive' ? 'Balloons' : 'Beautiful Text'}>
                            {element.elementType === 'balloons-interactive' ? '🎈' : '📝'}
                          </span>
                          <span className="font-medium text-sm text-gray-800">{element.elementType}</span>
                          <span className="text-xs text-gray-500">ID: {element.id}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToStepSequence(element.id as string)}
                          title="Add to a new step or combine with last step if allowed"
                        >
                          Add to Step
                        </Button>
                      </div>
                    ))}
                    {getAvailableElementsForSteps().length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">All elements have been added to steps</p>
                        <p className="text-xs">Add more elements to your canvas to continue</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Step Sequence */}
                <div className="flex flex-col h-full min-h-0">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Step Sequence</h4>
                  <div className="space-y-2 flex-1 overflow-y-auto min-h-0" style={{ minHeight: 0 }}>
                    {stepSequence.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <div className="text-2xl mb-2">🎭</div>
                        <p className="text-sm">No steps defined</p>
                        <p className="text-xs">Add elements from the left to create your sequence</p>
                      </div>
                    ) : (
                      stepSequence.map((step, index) => (
                        <div key={index} className="p-3 rounded-lg border bg-white shadow-sm flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <div className="font-medium text-sm text-gray-800">Step {index + 1}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleReorderSteps(index, Math.max(0, index - 1))}
                                disabled={index === 0}
                                className="text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move step up"
                              >↑</button>
                              <button
                                onClick={() => handleReorderSteps(index, Math.min(stepSequence.length - 1, index + 1))}
                                disabled={index === stepSequence.length - 1}
                                className="text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move step down"
                              >↓</button>
                              <button
                                onClick={() => setStepSequence(stepSequence.filter((_, i) => i !== index))}
                                className="text-red-500 hover:text-red-700 text-sm"
                                title="Remove entire step"
                              >🗑️</button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 items-center">
                            {step.map((id, i) => {
                              const element = elements.find(el => el.id === id);
                              return (
                                <span key={id} className="flex items-center bg-purple-100 text-purple-800 rounded px-2 py-1 text-xs font-medium">
                                  {element?.elementType === 'balloons-interactive' ? '🎈' : '📝'}
                                  <span className="ml-1">{element?.elementType || 'Unknown'}</span>
                                  <button
                                    className="ml-2 text-xs text-red-500 hover:text-red-700"
                                    onClick={() => handleRemoveFromStepSequence(id)}
                                    title="Remove this element from step"
                                  >✕</button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                    {/* Step Limit Warning */}
                    {stepSequence.length >= 10 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-600">⚠️</span>
                          <span className="text-sm text-yellow-800">Maximum 10 steps reached. Remove some steps to add more.</span>
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
            <div className="col-span-3 overflow-hidden">
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
          <div className={`overflow-hidden ${isPreviewMode ? 'col-span-12' : showStepManager ? 'hidden' : 'col-span-6'}`} style={{ height: showStepManager ? '0' : 'auto' }}>
            <WishCanvas
              elements={elements}
              selectedElement={isPreviewMode ? null : selectedElement}
              onSelectElement={isPreviewMode ? () => {} : handleCanvasElementSelect}
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
            <div className="col-span-3 overflow-hidden">
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

      {/* Share URL Modal */}
      {shareUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Wish Created Successfully! 🎉</h3>
            <p className="text-gray-600 mb-4">Your wish has been saved and is ready to share.</p>
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-700 break-all">{shareUrl}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="primary" 
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert('Link copied to clipboard!');
                }}
              >
                Copy Link
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShareUrl(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 