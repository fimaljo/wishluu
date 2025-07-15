import { Template } from '@/types/templates';

// Local Storage Keys
const TEMPLATES_STORAGE_KEY = 'wishluu_templates';
const TEMPLATES_VERSION_KEY = 'wishluu_templates_version';

// Current version for migration purposes
const CURRENT_VERSION = '1.0.0';

// Default templates for initial setup
const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'custom-blank',
    name: 'Custom Wish',
    description:
      'Start from scratch and create your own unique interactive wish',
    occasion: 'custom',
    thumbnail: '✨',
    color: 'from-indigo-400 to-purple-500',
    elements: ['balloons-interactive', 'beautiful-text'],
    difficulty: 'expert',
    defaultElements: [], // Empty for custom creation
  },
];

/**
 * Template Service for Local Storage Management
 * Handles CRUD operations for templates stored in browser localStorage
 */
export class TemplateService {
  /**
   * Reset templates to default (useful for testing)
   */
  static resetToDefault(): void {
    try {
      if (typeof window === 'undefined') return;

      localStorage.removeItem(TEMPLATES_STORAGE_KEY);
      localStorage.removeItem(TEMPLATES_VERSION_KEY);
      console.log('Templates reset to default');
    } catch (error) {
      console.error('Error resetting templates:', error);
    }
  }

  /**
   * Get all templates from local storage
   */
  static getAllTemplates(): Template[] {
    try {
      if (typeof window === 'undefined') {
        return DEFAULT_TEMPLATES;
      }

      const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (!stored) {
        // Initialize with default templates
        this.saveTemplates(DEFAULT_TEMPLATES);
        return DEFAULT_TEMPLATES;
      }

      const data = JSON.parse(stored);

      // Check version for migration
      const version = localStorage.getItem(TEMPLATES_VERSION_KEY);
      if (version !== CURRENT_VERSION) {
        // Migrate data if needed
        this.migrateTemplates(data);
        localStorage.setItem(TEMPLATES_VERSION_KEY, CURRENT_VERSION);
      }

      // If no templates exist or only custom-blank exists, reset to defaults
      let templates = data.templates || DEFAULT_TEMPLATES;
      if (templates.length <= 1) {
        console.log('Resetting to default templates');
        this.saveTemplates(DEFAULT_TEMPLATES);
        return DEFAULT_TEMPLATES;
      }

      // Fix any duplicate IDs that might exist
      templates = this.fixDuplicateIds(templates);

      return templates;
    } catch (error) {
      console.error('Error loading templates from localStorage:', error);
      return DEFAULT_TEMPLATES;
    }
  }

  /**
   * Save templates to local storage
   */
  static saveTemplates(templates: Template[]): void {
    try {
      if (typeof window === 'undefined') return;

      const data = {
        version: CURRENT_VERSION,
        templates: templates,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(TEMPLATES_VERSION_KEY, CURRENT_VERSION);
    } catch (error) {
      console.error('Error saving templates to localStorage:', error);
    }
  }

  /**
   * Get template by ID
   */
  static getTemplateById(id: string): Template | undefined {
    const templates = this.getAllTemplates();
    return templates.find(template => template.id === id);
  }

  /**
   * Create a new template
   */
  static createTemplate(template: Omit<Template, 'id'>): Template {
    const templates = this.getAllTemplates();

    // Generate a unique ID with better collision resistance
    const generateUniqueId = (): string => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substr(2, 9);
      let counter = 0;
      let id = `template_${timestamp}_${random}`;

      // Check if ID already exists and try with counter if needed
      while (templates.some(t => t.id === id)) {
        counter++;
        id = `template_${timestamp}_${random}_${counter}`;
      }

      return id;
    };

    const newTemplate: Template = {
      ...template,
      id: generateUniqueId(),
    };

    templates.push(newTemplate);
    this.saveTemplates(templates);
    return newTemplate;
  }

  /**
   * Fix duplicate IDs in templates array
   */
  static fixDuplicateIds(templates: Template[]): Template[] {
    const seenIds = new Set<string>();
    const fixedTemplates: Template[] = [];
    let hasChanges = false;

    console.log(
      'Checking for duplicate IDs in templates:',
      templates.map(t => t.id)
    );

    templates.forEach(template => {
      if (seenIds.has(template.id)) {
        // Generate a new unique ID for duplicate
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        let counter = 0;
        let newId = `template_${timestamp}_${random}`;

        // Ensure the new ID is also unique
        while (seenIds.has(newId)) {
          counter++;
          newId = `template_${timestamp}_${random}_${counter}`;
        }

        console.warn(`Fixed duplicate template ID: ${template.id} -> ${newId}`);
        template.id = newId;
        hasChanges = true;
      }

      seenIds.add(template.id);
      fixedTemplates.push(template);
    });

    if (hasChanges) {
      console.log(
        'Saving fixed templates:',
        fixedTemplates.map(t => t.id)
      );
      this.saveTemplates(fixedTemplates);
    } else {
      console.log('No duplicate IDs found');
    }

    return fixedTemplates;
  }

  /**
   * Update an existing template
   */
  static updateTemplate(
    id: string,
    updates: Partial<Omit<Template, 'id'>>
  ): Template | null {
    const templates = this.getAllTemplates();
    const index = templates.findIndex(template => template.id === id);

    if (index === -1) {
      console.error(`Template with id ${id} not found`);
      return null;
    }

    const existingTemplate = templates[index]!; // We know it exists because we found the index
    const updatedTemplate: Template = {
      id: existingTemplate.id,
      name: updates.name ?? existingTemplate.name,
      description: updates.description ?? existingTemplate.description,
      occasion: updates.occasion ?? existingTemplate.occasion,
      thumbnail: updates.thumbnail ?? existingTemplate.thumbnail,
      color: updates.color ?? existingTemplate.color,
      elements: updates.elements ?? existingTemplate.elements,
      difficulty: updates.difficulty ?? existingTemplate.difficulty,
      ...(updates.preview !== undefined && { preview: updates.preview }),
      ...(updates.defaultElements !== undefined && {
        defaultElements: updates.defaultElements,
      }),
    };

    templates[index] = updatedTemplate;
    this.saveTemplates(templates);
    return updatedTemplate;
  }

  /**
   * Delete a template
   */
  static deleteTemplate(id: string): boolean {
    const templates = this.getAllTemplates();
    const filteredTemplates = templates.filter(template => template.id !== id);

    if (filteredTemplates.length === templates.length) {
      console.error(`Template with id ${id} not found`);
      return false;
    }

    this.saveTemplates(filteredTemplates);
    return true;
  }

  /**
   * Get templates by occasion
   */
  static getTemplatesByOccasion(occasion: string): Template[] {
    const templates = this.getAllTemplates();
    return templates.filter(template => template.occasion === occasion);
  }

  /**
   * Get templates by difficulty
   */
  static getTemplatesByDifficulty(difficulty: string): Template[] {
    const templates = this.getAllTemplates();
    return templates.filter(template => template.difficulty === difficulty);
  }

  /**
   * Search templates by name or description
   */
  static searchTemplates(query: string): Template[] {
    const templates = this.getAllTemplates();
    const lowerQuery = query.toLowerCase();

    return templates.filter(
      template =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get template statistics
   */
  static getTemplateStats() {
    const templates = this.getAllTemplates();

    const stats = {
      total: templates.length,
      byOccasion: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      averageElements: 0,
    };

    // Count by occasion
    templates.forEach(template => {
      stats.byOccasion[template.occasion] =
        (stats.byOccasion[template.occasion] || 0) + 1;
    });

    // Count by difficulty
    templates.forEach(template => {
      stats.byDifficulty[template.difficulty] =
        (stats.byDifficulty[template.difficulty] || 0) + 1;
    });

    // Calculate average elements
    const totalElements = templates.reduce(
      (sum, template) => sum + (template.defaultElements?.length || 0),
      0
    );
    stats.averageElements =
      templates.length > 0 ? totalElements / templates.length : 0;

    return stats;
  }

  /**
   * Export templates to JSON
   */
  static exportTemplates(): string {
    const templates = this.getAllTemplates();
    return JSON.stringify(templates, null, 2);
  }

  /**
   * Import templates from JSON
   */
  static importTemplates(jsonData: string): boolean {
    try {
      const templates = JSON.parse(jsonData);

      if (!Array.isArray(templates)) {
        throw new Error('Invalid template data format');
      }

      // Validate template structure
      templates.forEach(template => {
        if (!template.id || !template.name || !template.occasion) {
          throw new Error('Invalid template structure');
        }
      });

      this.saveTemplates(templates);
      return true;
    } catch (error) {
      console.error('Error importing templates:', error);
      return false;
    }
  }

  /**
   * Clear all templates (reset to defaults)
   */
  static clearAllTemplates(): void {
    this.saveTemplates(DEFAULT_TEMPLATES);
  }

  /**
   * Force clear all templates and localStorage (emergency cleanup)
   */
  static forceClearAllTemplates(): void {
    try {
      if (typeof window === 'undefined') return;

      // Clear all template-related localStorage
      localStorage.removeItem(TEMPLATES_STORAGE_KEY);
      localStorage.removeItem(TEMPLATES_VERSION_KEY);

      // Clear any backup keys that might contain duplicates
      const backupKeys = this.getBackupKeys();
      backupKeys.forEach(key => {
        if (key.includes('templates_backup')) {
          localStorage.removeItem(key);
        }
      });

      console.log('Force cleared all templates and localStorage');

      // Initialize with default templates
      this.saveTemplates(DEFAULT_TEMPLATES);
    } catch (error) {
      console.error('Error force clearing templates:', error);
    }
  }

  /**
   * Migrate templates data structure
   */
  private static migrateTemplates(data: any): void {
    // Add migration logic here when needed
    // For now, just ensure the data structure is correct
    if (!data.templates) {
      data.templates = DEFAULT_TEMPLATES;
    }
  }

  /**
   * Backup templates to localStorage with timestamp
   */
  static backupTemplates(): void {
    try {
      if (typeof window === 'undefined') return;

      const templates = this.getAllTemplates();
      const backup = {
        templates,
        timestamp: new Date().toISOString(),
        version: CURRENT_VERSION,
      };

      const backupKey = `wishluu_templates_backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));

      // Keep only last 5 backups
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('wishluu_templates_backup_'))
        .sort()
        .reverse();

      if (backupKeys.length > 5) {
        backupKeys.slice(5).forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.error('Error creating template backup:', error);
    }
  }

  /**
   * Restore templates from backup
   */
  static restoreFromBackup(backupKey: string): boolean {
    try {
      if (typeof window === 'undefined') return false;

      const backupData = localStorage.getItem(backupKey);
      if (!backupData) return false;

      const backup = JSON.parse(backupData);
      if (!backup.templates) return false;

      this.saveTemplates(backup.templates);
      return true;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }

  /**
   * Get available backup keys
   */
  static getBackupKeys(): string[] {
    try {
      if (typeof window === 'undefined') return [];

      return Object.keys(localStorage)
        .filter(key => key.startsWith('wishluu_templates_backup_'))
        .sort()
        .reverse();
    } catch (error) {
      console.error('Error getting backup keys:', error);
      return [];
    }
  }

  /**
   * Debug: Get all template IDs
   */
  static debugTemplateIds(): void {
    const templates = this.getAllTemplates();
    console.log(
      'All template IDs:',
      templates.map(t => t.id)
    );

    const seenIds = new Set<string>();
    const duplicates: string[] = [];

    templates.forEach(template => {
      if (seenIds.has(template.id)) {
        duplicates.push(template.id);
      }
      seenIds.add(template.id);
    });

    if (duplicates.length > 0) {
      console.error('Duplicate IDs found:', duplicates);
    } else {
      console.log('No duplicate IDs found');
    }
  }
}

// Export default instance
export default TemplateService;
