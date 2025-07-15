// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  occasion: string;
  thumbnail: string;
  color: string;
  elements: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  preview?: string;
  defaultElementIds?: string[]; // Element IDs instead of full elements
  stepSequence?: string[][]; // Step sequence for presentation mode
  // Firebase-specific properties
  createdAt?: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
  createdBy?: string; // User ID who created the template
  isPublic?: boolean; // Whether template is publicly available
  version?: string; // Template version for migration
}

// Premium Property Types
export interface PremiumProperty {
  name: string;
  isPremium: boolean;
  premiumLabel?: string;
  upgradeMessage?: string;
}

export interface PropertyDefinition {
  name: string;
  type: 'text' | 'number' | 'color' | 'select' | 'range' | 'checkbox' | 'file';
  label: string;
  defaultValue: any;
  options?: { value: string; label: string; isPremium?: boolean }[];
  min?: number;
  max?: number;
  step?: number;
  isPremium?: boolean;
  premiumLabel?: string;
  upgradeMessage?: string;
}

// Interactive Element Types
export interface InteractiveElement {
  id: string;
  type: 'image' | 'text' | 'animation' | 'sound' | 'interaction';
  name: string;
  description: string;
  icon: string;
  category: 'basic' | 'birthday' | 'valentine' | 'celebration' | 'custom';
  properties: ElementProperties;
  propertyDefinitions?: PropertyDefinition[];
  isPremium?: boolean;
  tags?: string[];
}

export interface ElementProperties {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  color?: string;
  text?: string;
  font?: string;
  fontSize?: number;
  imageUrl?: string | null;
  animation?: string;
  soundUrl?: string;
  interactive?: boolean;
  // Balloon specific properties
  numberOfBalloons?: number;
  balloonColors?: string[];
  animationDuration?: number;
  popOnClick?: boolean;
  showImageOnPop?: boolean;
  balloonSize?: number;
  floatSpeed?: number;
  startAnimation?: boolean;
  resetAnimation?: boolean;
  // Dynamic balloon image properties (balloonImage0, balloonImage1, etc.)
  [key: string]: any;
  // Element transition
  transition?: string;
}

// Wish Builder Types
export interface WishBuilderState {
  template: Template | null;
  elements: WishElement[];
  recipientName: string;
  message: string;
  theme: string;
  isPublic: boolean;
}

export interface WishElement {
  id: string;
  elementType: string;
  properties: ElementProperties;
  order: number;
}

// Template Categories
export interface TemplateCategory {
  name: string;
  emoji: string;
  count: number;
  templates: string[];
}
