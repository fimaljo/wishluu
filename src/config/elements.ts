import { InteractiveElement, WishElement } from '@/types/templates';

// Centralized Elements Configuration
// This is the single source of truth for all elements in the application
export const ELEMENT_DEFINITIONS: InteractiveElement[] = [
  // ===== ANIMATION ELEMENTS =====
  {
    id: 'balloons-interactive',
    type: 'animation',
    name: 'Interactive Balloons',
    description: 'Click to pop balloons with surprise images',
    icon: '🎈',
    category: 'birthday',
    isPremium: false,
    tags: [
      'balloons',
      'interactive',
      'birthday',
      'celebration',
      'click',
      'pop',
    ],
    properties: {
      numberOfBalloons: 5,
      balloonColors: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      animationDuration: 3000,
      popOnClick: true,
      showImageOnPop: true,
      imageUrl: null,
      balloonSize: 60,
      floatSpeed: 2,
      interactive: true,
      transition: 'fade',
      zIndex: 10,
      scale: 1,
      showHint: true, // Control hint visibility
    },
  },

  // ===== TEXT ELEMENTS =====
  {
    id: 'beautiful-text',
    type: 'text',
    name: 'Beautiful Text',
    description:
      'Add beautiful titles and messages with custom fonts and colors',
    icon: '✨',
    category: 'basic',
    isPremium: true,
    properties: {
      title: 'Happy Birthday!',
      message: 'Wishing you a wonderful day filled with joy and laughter!',
      titleFont: 'playfair',
      messageFont: 'inter',
      titleColor: '#FF6B9D',
      messageColor: '#4A5568',
      titleSize: 48,
      messageSize: 18,
      alignment: 'center',
      animation: 'fade-in',
      shadow: true,
      gradient: false,
      padding: 20,
      transition: 'fade',
      zIndex: 15,
    },
    propertyDefinitions: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        defaultValue: 'Happy Birthday!',
        isPremium: false,
      },
      {
        name: 'message',
        type: 'text',
        label: 'Message',
        defaultValue:
          'Wishing you a wonderful day filled with joy and laughter!',
        isPremium: false,
      },
      {
        name: 'titleFont',
        type: 'select',
        label: 'Title Font',
        defaultValue: 'playfair',
        isPremium: false,
        options: [
          { value: 'inter', label: 'Inter' },
          { value: 'poppins', label: 'Poppins' },
          { value: 'montserrat', label: 'Montserrat' },
          { value: 'roboto', label: 'Roboto' },
          { value: 'opensans', label: 'Open Sans' },
          { value: 'lato', label: 'Lato' },
          { value: 'raleway', label: 'Raleway' },
          { value: 'playfair', label: 'Playfair Display' },
          { value: 'dancing', label: 'Dancing Script', isPremium: true },
          { value: 'pacifico', label: 'Pacifico', isPremium: true },
          { value: 'great-vibes', label: 'Great Vibes', isPremium: true },
          { value: 'satisfy', label: 'Satisfy', isPremium: true },
          { value: 'kaushan', label: 'Kaushan Script', isPremium: true },
          { value: 'allura', label: 'Allura', isPremium: true },
        ],
      },
      {
        name: 'messageFont',
        type: 'select',
        label: 'Message Font',
        defaultValue: 'inter',
        isPremium: false,
        options: [
          { value: 'inter', label: 'Inter' },
          { value: 'poppins', label: 'Poppins' },
          { value: 'montserrat', label: 'Montserrat' },
          { value: 'roboto', label: 'Roboto' },
          { value: 'opensans', label: 'Open Sans' },
          { value: 'lato', label: 'Lato' },
          { value: 'raleway', label: 'Raleway' },
          { value: 'playfair', label: 'Playfair Display' },
          { value: 'dancing', label: 'Dancing Script', isPremium: true },
          { value: 'pacifico', label: 'Pacifico', isPremium: true },
        ],
      },
      {
        name: 'titleColor',
        type: 'color',
        label: 'Title Color',
        defaultValue: '#FF6B9D',
        isPremium: false,
      },
      {
        name: 'messageColor',
        type: 'color',
        label: 'Message Color',
        defaultValue: '#4A5568',
        isPremium: false,
      },
      {
        name: 'titleSize',
        type: 'range',
        label: 'Title Size',
        defaultValue: 48,
        min: 24,
        max: 96,
        step: 1,
        isPremium: false,
      },
      {
        name: 'messageSize',
        type: 'range',
        label: 'Message Size',
        defaultValue: 18,
        min: 12,
        max: 32,
        step: 1,
        isPremium: false,
      },
      {
        name: 'alignment',
        type: 'select',
        label: 'Text Alignment',
        defaultValue: 'center',
        isPremium: false,
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
      {
        name: 'animation',
        type: 'select',
        label: 'Animation',
        defaultValue: 'fade-in',
        isPremium: false,
        options: [
          { value: 'none', label: 'None' },
          { value: 'fade-in', label: 'Fade In' },
          { value: 'slide-up', label: 'Slide Up' },
          { value: 'slide-down', label: 'Slide Down' },
          { value: 'zoom-in', label: 'Zoom In' },
          { value: 'bounce', label: 'Bounce' },
          { value: 'pulse', label: 'Pulse' },
          { value: 'flip', label: '3D Flip', isPremium: true },
          { value: 'rotate', label: 'Rotate', isPremium: true },
          { value: 'typewriter', label: 'Typewriter', isPremium: true },
        ],
      },
      {
        name: 'shadow',
        type: 'checkbox',
        label: 'Enable Shadow',
        defaultValue: true,
        isPremium: false,
      },
      {
        name: 'gradient',
        type: 'checkbox',
        label: 'Enable Gradient',
        defaultValue: false,
        isPremium: false,
        premiumLabel: 'Premium',
        upgradeMessage: 'Unlock gradient text effects',
      },
      {
        name: 'padding',
        type: 'range',
        label: 'Padding',
        defaultValue: 20,
        min: 0,
        max: 60,
        step: 1,
        isPremium: false,
      },
    ],
  },

  // ===== INTERACTION ELEMENTS =====
  {
    id: 'comment-wall',
    type: 'interaction',
    name: 'Instagram Style Post',
    description: 'Create an Instagram-style post with photo/video and comments',
    icon: '📱',
    category: 'social',
    isPremium: false,
    tags: [
      'instagram',
      'social',
      'post',
      'photo',
      'video',
      'comments',
      'sharing',
    ],
    properties: {
      postType: 'photo', // 'photo' or 'video'
      mediaUrl: '',
      postDescription: 'Share your thoughts and memories here...',
    },
    propertyDefinitions: [
      {
        name: 'postType',
        type: 'select',
        label: 'Post Type',
        defaultValue: 'photo',
        isPremium: false,
        options: [
          { value: 'photo', label: 'Photo Post' },
          { value: 'video', label: 'Video Post' },
        ],
      },
      {
        name: 'mediaUrl',
        type: 'text',
        label: 'Media URL',
        defaultValue: '',
        isPremium: false,
      },
      {
        name: 'postDescription',
        type: 'text',
        label: 'Post Description',
        defaultValue: 'Share your thoughts and memories here...',
        isPremium: false,
      },
    ],
  },
];

// ===== HELPER FUNCTIONS =====

/**
 * Get element by ID
 */
export const getElementById = (id: string): InteractiveElement | undefined => {
  return ELEMENT_DEFINITIONS.find(element => element.id === id);
};

/**
 * Get all elements
 */
export const getAllElements = (): InteractiveElement[] => {
  return ELEMENT_DEFINITIONS;
};

/**
 * Get elements by category
 */
export const getElementsByCategory = (
  category: string
): InteractiveElement[] => {
  return ELEMENT_DEFINITIONS.filter(element => element.category === category);
};

/**
 * Get elements by type
 */
export const getElementsByType = (type: string): InteractiveElement[] => {
  return ELEMENT_DEFINITIONS.filter(element => element.type === type);
};

/**
 * Get premium elements only
 */
export const getPremiumElements = (): InteractiveElement[] => {
  return ELEMENT_DEFINITIONS.filter(element => element.isPremium);
};

/**
 * Get free elements only
 */
export const getFreeElements = (): InteractiveElement[] => {
  return ELEMENT_DEFINITIONS.filter(element => !element.isPremium);
};

/**
 * Get elements by search term
 */
export const searchElements = (searchTerm: string): InteractiveElement[] => {
  const term = searchTerm.toLowerCase();
  return ELEMENT_DEFINITIONS.filter(
    element =>
      element.name.toLowerCase().includes(term) ||
      element.description.toLowerCase().includes(term) ||
      element.category.toLowerCase().includes(term) ||
      element.tags?.some((tag: string) => tag.toLowerCase().includes(term))
  );
};

/**
 * Get all available categories
 */
export const getCategories = (): string[] => {
  const categories = ELEMENT_DEFINITIONS.map(element => element.category);
  return [...new Set(categories)];
};

/**
 * Get element count by category
 */
export const getElementCountByCategory = (category: string): number => {
  return getElementsByCategory(category).length;
};

/**
 * Get recommended elements based on context
 */
export const getRecommendedElements = (
  context: string
): InteractiveElement[] => {
  const recommendations: { [key: string]: string[] } = {
    birthday: ['balloons-interactive', 'beautiful-text', 'comment-wall'],
    valentine: ['beautiful-text', 'comment-wall'],
    celebration: ['balloons-interactive', 'beautiful-text', 'comment-wall'],
    basic: ['beautiful-text', 'comment-wall'],
    social: ['comment-wall'],
  };

  const recommendedIds = recommendations[context] || [];
  return ELEMENT_DEFINITIONS.filter(element =>
    recommendedIds.includes(element.id)
  );
};

/**
 * Validate element properties
 */
export const validateElementProperties = (
  elementId: string,
  properties: any
): boolean => {
  const element = getElementById(elementId);
  if (!element) return false;

  // Add validation logic here based on element type
  return true;
};

/**
 * Get default properties for an element
 */
export const getDefaultProperties = (elementId: string): any => {
  const element = getElementById(elementId);
  return element ? { ...element.properties } : {};
};

/**
 * Clone element with new ID
 */
export const cloneElement = (
  elementId: string,
  newId?: string
): InteractiveElement | null => {
  const element = getElementById(elementId);
  if (!element) return null;

  return {
    ...element,
    id: newId || `${elementId}_${Date.now()}`,
  };
};

/**
 * Convert element IDs to WishElements with default properties
 */
export const elementIdsToWishElements = (
  elementIds: string[]
): WishElement[] => {
  return elementIds
    .map((elementId, index) => {
      const element = getElementById(elementId);
      if (!element) {
        console.warn(`Element with ID ${elementId} not found`);
        return null;
      }

      return {
        id: `${elementId}_${Date.now()}_${index}`,
        elementType: elementId,
        properties: { ...element.properties },
        order: index,
      };
    })
    .filter(Boolean) as WishElement[];
};

// ===== ELEMENT METADATA =====

export const ELEMENT_CATEGORIES = [
  {
    id: 'all',
    name: 'All Elements',
    emoji: '✨',
    description: 'All available elements',
  },
  {
    id: 'basic',
    name: 'Basic',
    emoji: '📝',
    description: 'Essential elements for any wish',
  },
  {
    id: 'birthday',
    name: 'Birthday',
    emoji: '🎂',
    description: 'Perfect for birthday wishes',
  },
  {
    id: 'social',
    name: 'Social',
    emoji: '💬',
    description: 'Interactive social elements',
  },
];

export const ELEMENT_TYPES = [
  {
    id: 'animation',
    name: 'Animations',
    emoji: '🎬',
    description: 'Moving and interactive elements',
  },
  {
    id: 'text',
    name: 'Text',
    emoji: '📝',
    description: 'Text and typography elements',
  },
  {
    id: 'interaction',
    name: 'Interactive',
    emoji: '💬',
    description: 'Social and interactive elements',
  },
];

// ===== EXPORT ALL =====

export default {
  ELEMENT_DEFINITIONS,
  getElementById,
  getAllElements,
  getElementsByCategory,
  getElementsByType,
  getPremiumElements,
  getFreeElements,
  searchElements,
  getCategories,
  getElementCountByCategory,
  getRecommendedElements,
  validateElementProperties,
  getDefaultProperties,
  cloneElement,
  elementIdsToWishElements,
  ELEMENT_CATEGORIES,
  ELEMENT_TYPES,
};
