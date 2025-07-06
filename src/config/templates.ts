import { Template } from '@/types/templates';
import { TemplateService } from '@/lib/templateService';

// ===== HELPER FUNCTIONS =====

/**
 * Get template by ID
 */
export const getTemplateById = (id: string): Template | undefined => {
  return TemplateService.getTemplateById(id);
};

/**
 * Get all templates
 */
export const getAllTemplates = (): Template[] => {
  return TemplateService.getAllTemplates();
};

/**
 * Get templates by occasion
 */
export const getTemplatesByOccasion = (occasion: string): Template[] => {
  return TemplateService.getTemplatesByOccasion(occasion);
};

/**
 * Get templates by difficulty
 */
export const getTemplatesByDifficulty = (difficulty: string): Template[] => {
  return TemplateService.getTemplatesByDifficulty(difficulty);
};

/**
 * Get recommended templates based on context
 */
export const getRecommendedTemplates = (context: string): Template[] => {
  const templates = getAllTemplates();
  const recommendations: { [key: string]: string[] } = {
    birthday: ['birthday-balloons'],
    valentine: ['valentine-love'],
    celebration: ['celebration-party'],
    custom: ['custom-blank'],
  };

  const recommendedIds = recommendations[context] || [];
  return templates.filter(template => recommendedIds.includes(template.id));
};

/**
 * Get template default elements
 */
export const getTemplateDefaultElements = (templateId: string): any[] => {
  const template = getTemplateById(templateId);
  return template?.defaultElements || [];
};

/**
 * Clone template with new ID
 */
export const cloneTemplate = (
  templateId: string,
  newId?: string
): Template | null => {
  const template = getTemplateById(templateId);
  if (!template) return null;

  return {
    ...template,
    id: newId || `${templateId}_${Date.now()}`,
  };
};

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
  getTemplateById,
  getAllTemplates,
  getTemplatesByOccasion,
  getTemplatesByDifficulty,
  getRecommendedTemplates,
  getTemplateDefaultElements,
  cloneTemplate,
  TEMPLATE_OCCASIONS,
  TEMPLATE_DIFFICULTIES,
};
