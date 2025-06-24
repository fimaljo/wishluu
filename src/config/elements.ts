import { InteractiveElement } from '@/types/templates';

export const ELEMENT_DEFINITIONS: InteractiveElement[] = [
  // Interactive Balloons Element
  {
    id: 'balloons-interactive',
    type: 'animation',
    name: 'Interactive Balloons',
    description: 'Click to pop balloons with surprise images',
    icon: '🎈',
    category: 'birthday',
    isPremium: false,
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
    },
  },
  // Beautiful Text Element
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
];

// Helper function to get element by ID
export const getElementById = (id: string): InteractiveElement | undefined => {
  return ELEMENT_DEFINITIONS.find(element => element.id === id);
};

// Helper function to get all elements
export const getAllElements = (): InteractiveElement[] => {
  return ELEMENT_DEFINITIONS;
};

// Helper function to get elements by category
export const getElementsByCategory = (
  category: string
): InteractiveElement[] => {
  return ELEMENT_DEFINITIONS.filter(element => element.category === category);
};
