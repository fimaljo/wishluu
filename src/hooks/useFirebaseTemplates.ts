import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  FirebaseTemplateService,
  ServiceResponse,
  TemplateQueryOptions,
} from '@/lib/firebaseTemplateService';
import { Template } from '@/types/templates';

interface UseFirebaseTemplatesReturn {
  // State
  templates: Template[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createTemplate: (
    template: Omit<Template, 'id'>
  ) => Promise<ServiceResponse<Template>>;
  updateTemplate: (
    id: string,
    updates: Partial<Omit<Template, 'id'>>
  ) => Promise<ServiceResponse<Template>>;
  deleteTemplate: (id: string) => Promise<ServiceResponse<boolean>>;
  refreshTemplates: () => Promise<void>;

  // Queries
  getTemplateById: (id: string) => Promise<ServiceResponse<Template>>;
  searchTemplates: (query: string) => Promise<ServiceResponse<Template[]>>;
  getTemplatesByOccasion: (
    occasion: string
  ) => Promise<ServiceResponse<Template[]>>;
  getTemplatesByDifficulty: (
    difficulty: string
  ) => Promise<ServiceResponse<Template[]>>;
  getTemplateStats: () => Promise<ServiceResponse<any>>;

  // Utilities
  exportTemplates: () => Promise<ServiceResponse<string>>;
  importTemplates: (jsonData: string) => Promise<ServiceResponse<Template[]>>;
}

export function useFirebaseTemplates(
  options: TemplateQueryOptions = {}
): UseFirebaseTemplatesReturn {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load templates on mount and when options change
  const loadTemplates = useCallback(async () => {
    // Always require authentication
    if (!user) {
      setTemplates([]);
      setIsLoading(false);
      setError('Authentication required');
      return;
    }

    // Prevent multiple simultaneous calls
    if (isLoading && isInitialized) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const serviceOptions = {
        ...options,
        isPublic: options.isPublic !== undefined ? options.isPublic : true,
      };

      const response =
        await FirebaseTemplateService.getAllTemplates(serviceOptions);

      if (response.success && response.data) {
        setTemplates(response.data);
      } else {
        setError(response.error || 'Failed to load templates');
        setTemplates([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setTemplates([]);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [user, options, isLoading, isInitialized]);

  useEffect(() => {
    // Only load templates when user changes or on initial mount
    if (user) {
      loadTemplates();
    }
  }, [user]); // Remove loadTemplates from dependencies to prevent infinite loops

  // Create template
  const createTemplate = useCallback(
    async (
      template: Omit<Template, 'id'>
    ): Promise<ServiceResponse<Template>> => {
      if (!user) {
        return {
          success: false,
          error: 'User must be authenticated to create templates',
        };
      }

      const response = await FirebaseTemplateService.createTemplate(
        template,
        user.uid
      );

      if (response.success) {
        // Refresh templates list
        await loadTemplates();
      }

      return response;
    },
    [user, loadTemplates]
  );

  // Update template
  const updateTemplate = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Template, 'id'>>
    ): Promise<ServiceResponse<Template>> => {
      if (!user) {
        return {
          success: false,
          error: 'User must be authenticated to update templates',
        };
      }

      const response = await FirebaseTemplateService.updateTemplate(
        id,
        updates,
        user.uid
      );

      if (response.success) {
        // Refresh templates list
        await loadTemplates();
      }

      return response;
    },
    [user, loadTemplates]
  );

  // Delete template
  const deleteTemplate = useCallback(
    async (id: string): Promise<ServiceResponse<boolean>> => {
      if (!user) {
        return {
          success: false,
          error: 'User must be authenticated to delete templates',
        };
      }

      const response = await FirebaseTemplateService.deleteTemplate(
        id,
        user.uid
      );

      if (response.success) {
        // Refresh templates list
        await loadTemplates();
      }

      return response;
    },
    [user, loadTemplates]
  );

  // Refresh templates
  const refreshTemplates = useCallback(async () => {
    await loadTemplates();
  }, [loadTemplates]);

  // Get template by ID
  const getTemplateById = useCallback(
    async (id: string): Promise<ServiceResponse<Template>> => {
      return FirebaseTemplateService.getTemplateById(id);
    },
    []
  );

  // Search templates
  const searchTemplates = useCallback(
    async (query: string): Promise<ServiceResponse<Template[]>> => {
      return FirebaseTemplateService.searchTemplates(query);
    },
    []
  );

  // Get templates by occasion
  const getTemplatesByOccasion = useCallback(
    async (occasion: string): Promise<ServiceResponse<Template[]>> => {
      return FirebaseTemplateService.getTemplatesByOccasion(occasion);
    },
    []
  );

  // Get templates by difficulty
  const getTemplatesByDifficulty = useCallback(
    async (difficulty: string): Promise<ServiceResponse<Template[]>> => {
      return FirebaseTemplateService.getTemplatesByDifficulty(difficulty);
    },
    []
  );

  // Get template stats
  const getTemplateStats = useCallback(async (): Promise<
    ServiceResponse<any>
  > => {
    return FirebaseTemplateService.getTemplateStats();
  }, []);

  // Export templates
  const exportTemplates = useCallback(async (): Promise<
    ServiceResponse<string>
  > => {
    return FirebaseTemplateService.exportTemplates();
  }, []);

  // Import templates
  const importTemplates = useCallback(
    async (jsonData: string): Promise<ServiceResponse<Template[]>> => {
      if (!user) {
        return {
          success: false,
          error: 'User must be authenticated to import templates',
        };
      }

      const response = await FirebaseTemplateService.importTemplates(
        jsonData,
        user.uid
      );

      if (response.success) {
        // Refresh templates list
        await loadTemplates();
      }

      return response;
    },
    [user, loadTemplates]
  );

  return {
    // State
    templates,
    isLoading,
    error,

    // Actions
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates,

    // Queries
    getTemplateById,
    searchTemplates,
    getTemplatesByOccasion,
    getTemplatesByDifficulty,
    getTemplateStats,

    // Utilities
    exportTemplates,
    importTemplates,
  };
}
