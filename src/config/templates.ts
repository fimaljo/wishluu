import { Template } from '@/types/templates';

// ===== TEMPLATE METADATA =====

// ===== TEMPLATE METADATA =====

export const TEMPLATE_OCCASIONS = [
  {
    id: 'all',
    name: 'All Templates',
    emoji: '✨',
    description: 'All available templates',
  },
  {
    id: 'birthday',
    name: 'Birthday',
    emoji: '🎂',
    description: 'Birthday celebration templates',
  },
  {
    id: 'valentine',
    name: 'Valentine',
    emoji: '💕',
    description: "Valentine's Day templates",
  },
  {
    id: 'celebration',
    name: 'Celebration',
    emoji: '🎊',
    description: 'General celebration templates',
  },
  {
    id: 'custom',
    name: 'Custom',
    emoji: '✨',
    description: 'Custom creation templates',
  },
];

export const TEMPLATE_DIFFICULTIES = [
  {
    id: 'easy',
    name: 'Easy',
    emoji: '😊',
    description: 'Simple templates for beginners',
  },
  {
    id: 'medium',
    name: 'Medium',
    emoji: '😐',
    description: 'Moderate complexity templates',
  },
  {
    id: 'hard',
    name: 'Hard',
    emoji: '😰',
    description: 'Complex templates for advanced users',
  },
  {
    id: 'expert',
    name: 'Expert',
    emoji: '🤯',
    description: 'Professional-level templates',
  },
];

// ===== EXPORT ALL =====

export default {
  TEMPLATE_OCCASIONS,
  TEMPLATE_DIFFICULTIES,
};
