import { useState, useRef } from 'react';
import { WishElement, ElementProperties } from '@/types/templates';
import { UserPremiumStatus } from '@/lib/premiumService';
import { Wish } from '@/types';

type CreationStep = 'create' | 'steps' | 'preview' | 'save';
type TemplateStep = 'canvas-settings' | 'element-settings' | 'preview' | 'save';
type MobileView = 'canvas' | 'palette' | 'properties' | 'steps';

export function useWishBuilderState() {
  // Element Management
  const [selectedElement, setSelectedElement] = useState<WishElement | null>(
    null
  );
  const [elements, setElements] = useState<WishElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<WishElement[]>([]);
  const [originalTemplateElements, setOriginalTemplateElements] = useState<
    WishElement[]
  >([]);

  // Wish Content
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('white');
  const [customBackgroundColor, setCustomBackgroundColor] = useState('#ffffff');

  // UI State
  const [showCanvasSettings, setShowCanvasSettings] = useState(true);
  const [currentStep, setCurrentStep] = useState<CreationStep | TemplateStep>(
    'create'
  );
  const [mobileView, setMobileView] = useState<MobileView>('canvas');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Step Sequence
  const [stepSequence, setStepSequence] = useState<string[][]>([]);

  // Loading & Error States
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Premium & User State
  const [userPremiumStatus, setUserPremiumStatus] =
    useState<UserPremiumStatus | null>(null);
  const [isLoadingPremium, setIsLoadingPremium] = useState(true);

  // Dialogs & Modals
  const [showSaveShareDialog, setShowSaveShareDialog] = useState(false);
  const [showPresentationMode, setShowPresentationMode] = useState(false);
  const [currentWish, setCurrentWish] = useState<Wish | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Refs
  const loadedTemplateRef = useRef<string | null>(null);

  return {
    // Element Management
    selectedElement,
    setSelectedElement,
    elements,
    setElements,
    selectedElements,
    setSelectedElements,
    originalTemplateElements,
    setOriginalTemplateElements,

    // Wish Content
    recipientName,
    setRecipientName,
    message,
    setMessage,
    theme,
    setTheme,
    customBackgroundColor,
    setCustomBackgroundColor,

    // UI State
    showCanvasSettings,
    setShowCanvasSettings,
    currentStep,
    setCurrentStep,
    mobileView,
    setMobileView,
    showMobileMenu,
    setShowMobileMenu,

    // Step Sequence
    stepSequence,
    setStepSequence,

    // Loading & Error States
    isSaving,
    setIsSaving,
    isLoading,
    setIsLoading,
    error,
    setError,

    // Premium & User State
    userPremiumStatus,
    setUserPremiumStatus,
    isLoadingPremium,
    setIsLoadingPremium,

    // Dialogs & Modals
    showSaveShareDialog,
    setShowSaveShareDialog,
    showPresentationMode,
    setShowPresentationMode,
    currentWish,
    setCurrentWish,
    shareUrl,
    setShareUrl,

    // Refs
    loadedTemplateRef,
  };
}
