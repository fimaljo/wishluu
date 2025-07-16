// Core Wish Types
export interface Wish {
  id: string;
  recipientName: string;
  occasion: string;
  message: string;
  theme: string;
  animation: string;
  createdAt: string;
  senderName?: string;
  senderEmail?: string;
  isPublic: boolean;
  views?: number;
  likes?: number;
  elements?: any[]; // Canvas elements from the builder
  customBackgroundColor?: string; // Custom background color
  shareId?: string; // Firebase share ID for public sharing
  updatedAt?: string; // Firebase updated timestamp
  createdBy?: string; // Firebase user ID who created the wish
  stepSequence?: string[][]; // Step sequence for wish presentation
  expiresAt?: any; // Firebase timestamp for expiration (7 days from creation)
  music?: string; // Background music ID
}

// Form Types
export interface WishFormData {
  recipientName: string;
  occasion: string;
  message: string;
  theme: string;
  animation: string;
  senderName?: string;
  senderEmail?: string;
  elements?: any[]; // Canvas elements from the builder
  customBackgroundColor?: string; // Custom background color
  music?: string; // Background music ID
}

export interface FormErrors {
  [key: string]: string;
}

// Template Types
export * from './templates';

// Occasion Types
export interface Occasion {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

// Theme Types
export interface Theme {
  value: string;
  name: string;
  gradient: string;
}

// Animation Types
export interface Animation {
  value: string;
  name: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// User Types (for future authentication)
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Analytics Types (for future features)
export interface WishAnalytics {
  wishId: string;
  views: number;
  uniqueViews: number;
  shares: number;
  likes: number;
  createdAt: string;
  lastViewed?: string;
}

// Share Types
export interface ShareOptions {
  title: string;
  text: string;
  url: string;
  platforms: ('twitter' | 'facebook' | 'whatsapp' | 'email')[];
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Settings Types
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    wishVisibility: 'public' | 'private' | 'friends';
  };
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event Types
export interface WishEvent {
  type: 'created' | 'viewed' | 'shared' | 'liked';
  wishId: string;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Constants
export const OCCASIONS: Occasion[] = [
  {
    value: 'birthday',
    label: 'Birthday',
    emoji: '🎂',
    color: 'from-pink-400 to-rose-500',
  },
  {
    value: 'valentine',
    label: "Valentine's Day",
    emoji: '��',
    color: 'from-red-400 to-pink-500',
  },
  {
    value: 'mothers-day',
    label: "Mother's Day",
    emoji: '🌷',
    color: 'from-purple-400 to-pink-500',
  },
  {
    value: 'proposal',
    label: 'Proposal',
    emoji: '💍',
    color: 'from-blue-400 to-purple-500',
  },
  {
    value: 'anniversary',
    label: 'Anniversary',
    emoji: '💑',
    color: 'from-green-400 to-blue-500',
  },
  {
    value: 'graduation',
    label: 'Graduation',
    emoji: '🎓',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    value: 'thank-you',
    label: 'Thank You',
    emoji: '🙏',
    color: 'from-indigo-400 to-purple-500',
  },
  {
    value: 'congratulations',
    label: 'Congratulations',
    emoji: '🎉',
    color: 'from-cyan-400 to-blue-500',
  },
];

export const THEMES: Theme[] = [
  {
    value: 'purple',
    name: 'Purple Dream',
    gradient: 'from-purple-400 to-pink-400',
  },
  { value: 'ocean', name: 'Ocean Blue', gradient: 'from-blue-400 to-cyan-400' },
  { value: 'sunset', name: 'Sunset', gradient: 'from-orange-400 to-pink-400' },
  {
    value: 'forest',
    name: 'Forest Green',
    gradient: 'from-green-400 to-emerald-400',
  },
  {
    value: 'royal',
    name: 'Royal Gold',
    gradient: 'from-yellow-400 to-orange-400',
  },
];

export const ANIMATIONS: Animation[] = [
  { value: 'fade', name: 'Fade In' },
  { value: 'slide', name: 'Slide Up' },
  { value: 'bounce', name: 'Bounce' },
  { value: 'zoom', name: 'Zoom In' },
];
