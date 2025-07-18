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
    creditCost: 0, // Free element
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
    creditCost: 2, // Free element
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
      },
      {
        name: 'message',
        type: 'text',
        label: 'Message',
        defaultValue:
          'Wishing you a wonderful day filled with joy and laughter!',
      },
      {
        name: 'titleFont',
        type: 'select',
        label: 'Title Font',
        defaultValue: 'playfair',
        options: [
          { value: 'inter', label: 'Inter' },
          { value: 'poppins', label: 'Poppins' },
          { value: 'montserrat', label: 'Montserrat' },
          { value: 'roboto', label: 'Roboto' },
          { value: 'opensans', label: 'Open Sans' },
          { value: 'lato', label: 'Lato' },
          { value: 'raleway', label: 'Raleway' },
          { value: 'playfair', label: 'Playfair Display' },
          { value: 'dancing', label: 'Dancing Script', creditCost: 0.5 },
          { value: 'pacifico', label: 'Pacifico', creditCost: 0.5 },
          { value: 'great-vibes', label: 'Great Vibes', creditCost: 0.5 },
          { value: 'satisfy', label: 'Satisfy', creditCost: 0.5 },
          { value: 'kaushan', label: 'Kaushan Script', creditCost: 0.5 },
          { value: 'allura', label: 'Allura', creditCost: 0.5 },
        ],
      },
      {
        name: 'messageFont',
        type: 'select',
        label: 'Message Font',
        defaultValue: 'inter',
        options: [
          { value: 'inter', label: 'Inter' },
          { value: 'poppins', label: 'Poppins' },
          { value: 'montserrat', label: 'Montserrat' },
          { value: 'roboto', label: 'Roboto' },
          { value: 'opensans', label: 'Open Sans' },
          { value: 'lato', label: 'Lato' },
          { value: 'raleway', label: 'Raleway' },
          { value: 'playfair', label: 'Playfair Display' },
          { value: 'dancing', label: 'Dancing Script', creditCost: 0.5 },
          { value: 'pacifico', label: 'Pacifico', creditCost: 0.5 },
        ],
      },
      {
        name: 'titleColor',
        type: 'color',
        label: 'Title Color',
        defaultValue: '#FF6B9D',
      },
      {
        name: 'messageColor',
        type: 'color',
        label: 'Message Color',
        defaultValue: '#4A5568',
      },
      {
        name: 'titleSize',
        type: 'range',
        label: 'Title Size',
        defaultValue: 48,
        min: 24,
        max: 96,
        step: 1,
      },
      {
        name: 'messageSize',
        type: 'range',
        label: 'Message Size',
        defaultValue: 18,
        min: 12,
        max: 32,
        step: 1,
      },
      {
        name: 'alignment',
        type: 'select',
        label: 'Text Alignment',
        defaultValue: 'center',
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
        options: [
          { value: 'none', label: 'None' },
          { value: 'fade-in', label: 'Fade In' },
          { value: 'slide-up', label: 'Slide Up' },
          { value: 'slide-down', label: 'Slide Down' },
          { value: 'zoom-in', label: 'Zoom In' },
          { value: 'bounce', label: 'Bounce' },
          { value: 'pulse', label: 'Pulse' },
          { value: 'flip', label: '3D Flip', creditCost: 1 },
          { value: 'rotate', label: 'Rotate', creditCost: 1 },
          { value: 'typewriter', label: 'Typewriter', creditCost: 1 },
        ],
      },
      {
        name: 'shadow',
        type: 'checkbox',
        label: 'Enable Shadow',
        defaultValue: true,
      },
      {
        name: 'gradient',
        type: 'checkbox',
        label: 'Enable Gradient',
        defaultValue: false,
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
    creditCost: 0, // Free element
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
      },
      {
        name: 'postDescription',
        type: 'text',
        label: 'Post Description',
        defaultValue: 'Share your thoughts and memories here...',
      },
    ],
  },
  {
    id: 'date-question',
    type: 'interaction',
    name: 'Interactive Question',
    description:
      'Fun interactive question with growing Yes button and shrinking No button',
    icon: '❓',
    category: 'basic',
    creditCost: 0, // Free element
    tags: ['question', 'yes', 'no', 'interactive', 'fun'],
    properties: {
      question: 'Will you come for a date?',
      yesText: 'Yes',
      noText: 'No',
    },
    propertyDefinitions: [
      {
        name: 'question',
        type: 'text',
        label: 'Question',
        defaultValue: 'Will you come for a date?',
      },
      {
        name: 'yesText',
        type: 'text',
        label: 'Yes Button Text',
        defaultValue: 'Yes',
      },
      {
        name: 'noText',
        type: 'text',
        label: 'No Button Text',
        defaultValue: 'No',
      },
    ],
  },

  {
    id: 'image-puzzle',
    type: 'interaction',
    name: 'Image Puzzle',
    description: 'Interactive image puzzle with drag and drop pieces',
    icon: '🧩',
    category: 'basic',
    creditCost: 0, // Free element
    tags: ['puzzle', 'image', 'drag', 'drop', 'game', 'interactive'],
    properties: {
      imageUrl: '',
      gridSize: 3,
      difficulty: 'medium',
      secretMessage: '',
    },
    propertyDefinitions: [
      {
        name: 'imageUrl',
        type: 'text',
        label: 'Image URL',
        defaultValue: '',
      },
      {
        name: 'gridSize',
        type: 'select',
        label: 'Grid Size',
        defaultValue: 3,
        options: [
          { value: '2', label: '2x2 (Easy)' },
          { value: '3', label: '3x3 (Medium)' },
          { value: '4', label: '4x4 (Hard)' },
          { value: '5', label: '5x5 (Expert)' },
        ],
      },
      {
        name: 'difficulty',
        type: 'select',
        label: 'Difficulty',
        defaultValue: 'medium',
        options: [
          { value: 'easy', label: 'Easy' },
          { value: 'medium', label: 'Medium' },
          { value: 'hard', label: 'Hard' },
        ],
      },
      {
        name: 'secretMessage',
        type: 'text',
        label: 'Secret Message (shown when solved)',
        defaultValue: '',
      },
    ],
  },

  {
    id: 'interactive-quiz',
    type: 'interaction',
    name: 'Interactive Quiz',
    description: 'Test how well you know me with multiple choice questions',
    icon: '🧠',
    category: 'basic',
    creditCost: 0, // Free element
    tags: ['quiz', 'questions', 'score', 'interactive', 'fun'],
    properties: {
      title: 'How Well Do You Know Me?',
      questions: [
        {
          question: 'What is my favorite color?',
          options: ['Blue', 'Red', 'Green', 'Purple'],
          correctAnswer: 0,
        },
      ],
      perfectScoreMessage:
        'Wow! You know me perfectly! We must be soulmates! 💕',
      goodScoreMessage: 'Great job! You know me pretty well! 😊',
      averageScoreMessage: 'Not bad! You know some things about me! 🤔',
      lowScoreMessage: 'Hmm... We need to spend more time together! 😅',
    },
    propertyDefinitions: [
      {
        name: 'title',
        type: 'text',
        label: 'Quiz Title',
        defaultValue: 'How Well Do You Know Me?',
      },
      {
        name: 'perfectScoreMessage',
        type: 'text',
        label: 'Perfect Score Message (90-100%)',
        defaultValue: 'Wow! You know me perfectly! We must be soulmates! 💕',
      },
      {
        name: 'goodScoreMessage',
        type: 'text',
        label: 'Good Score Message (70-89%)',
        defaultValue: 'Great job! You know me pretty well! 😊',
      },
      {
        name: 'averageScoreMessage',
        type: 'text',
        label: 'Average Score Message (50-69%)',
        defaultValue: 'Not bad! You know some things about me! 🤔',
      },
      {
        name: 'lowScoreMessage',
        type: 'text',
        label: 'Low Score Message (0-49%)',
        defaultValue: 'Hmm... We need to spend more time together! 😅',
      },
    ],
  },

  {
    id: 'love-letter',
    type: 'interaction',
    name: 'Love Letter',
    description: 'A romantic letter with unfolding animation and wax seal',
    icon: '💌',
    category: 'valentine',
    creditCost: 0, // Free element
    tags: ['love', 'letter', 'romantic', 'animation', 'seal', 'handwriting'],
    properties: {
      title: 'My Dearest',
      message:
        'Every moment with you feels like a beautiful dream come true. Your love has filled my heart with endless joy and happiness. I promise to cherish and adore you forever.',
      signature: 'With all my love',
      initials: 'JD',
      letterColor: '#F5F5DC',
      inkColor: '#2F2F2F',
      fontStyle: 'handwriting',
    },
    propertyDefinitions: [
      {
        name: 'title',
        type: 'text',
        label: 'Letter Title',
        defaultValue: 'My Dearest',
      },
      {
        name: 'message',
        type: 'text',
        label: 'Love Message',
        defaultValue:
          'Every moment with you feels like a beautiful dream come true. Your love has filled my heart with endless joy and happiness. I promise to cherish and adore you forever.',
      },
      {
        name: 'signature',
        type: 'text',
        label: 'Signature',
        defaultValue: 'With all my love',
      },
      {
        name: 'initials',
        type: 'text',
        label: 'Wax Seal Initials',
        defaultValue: 'JD',
      },
      {
        name: 'letterColor',
        type: 'color',
        label: 'Letter Paper Color',
        defaultValue: '#F5F5DC',
      },
      {
        name: 'inkColor',
        type: 'color',
        label: 'Ink Color',
        defaultValue: '#2F2F2F',
      },
      {
        name: 'fontStyle',
        type: 'select',
        label: 'Handwriting Font',
        defaultValue: 'handwriting',
        options: [
          { value: 'handwriting', label: 'Elegant Handwriting' },
          { value: 'cursive', label: 'Flowing Cursive' },
          { value: 'calligraphy', label: 'Calligraphy Style' },
          { value: 'romantic', label: 'Romantic Script' },
        ],
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
  return ELEMENT_DEFINITIONS.filter(element => (element.creditCost ?? 0) > 0);
};

/**
 * Get free elements only
 */
export const getFreeElements = (): InteractiveElement[] => {
  return ELEMENT_DEFINITIONS.filter(element => (element.creditCost ?? 0) === 0);
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
