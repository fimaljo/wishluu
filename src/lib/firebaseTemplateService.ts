import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
} from 'firebase/firestore';
import { db } from './firebase';
import { Template, WishElement } from '@/types/templates';

// Collection name for templates
const TEMPLATES_COLLECTION = 'templates';

// Template document interface for Firestore
export interface TemplateDocument
  extends Omit<Template, 'id' | 'defaultElementIds' | 'stepSequence'> {
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  createdBy: string; // User ID who created the template
  isPublic: boolean; // Whether template is publicly available
  version: string; // Template version for migration
  // Serialized fields for Firestore compatibility
  defaultElementIds?: string[]; // Array of element IDs (much simpler!)
  stepSequence?: string; // JSON string of string[][]
}

// Service response types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Query options for filtering templates
export interface TemplateQueryOptions {
  occasion?: string;
  difficulty?: string;
  isPublic?: boolean | undefined;
  createdBy?: string;
  limit?: number;
  orderBy?: 'name' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Firebase Template Service
 * Handles all CRUD operations for templates stored in Firestore
 * Follows clean code principles and best practices
 */
export class FirebaseTemplateService {
  private static collectionRef = collection(db, TEMPLATES_COLLECTION);

  /**
   * Convert Firestore document to Template
   */
  private static documentToTemplate(
    doc: QueryDocumentSnapshot<DocumentData>
  ): Template {
    const data = doc.data() as TemplateDocument;
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      occasion: data.occasion,
      thumbnail: data.thumbnail,
      color: data.color,
      elements: data.elements,
      difficulty: data.difficulty,
      ...(data.creditCost !== undefined && { creditCost: data.creditCost }),
      ...(data.preview && { preview: data.preview }),
      // Handle element IDs (no deserialization needed)
      ...(data.defaultElementIds && {
        defaultElementIds: data.defaultElementIds,
      }),
      // Deserialize step sequence
      ...(data.stepSequence && {
        stepSequence: JSON.parse(data.stepSequence) as string[][],
      }),
      // Firebase-specific properties
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      isPublic: data.isPublic,
      version: data.version,
    };
  }

  /**
   * Convert Template to Firestore document
   */
  private static templateToDocument(
    template: Omit<Template, 'id'>,
    userId: string
  ): Omit<TemplateDocument, 'createdAt' | 'updatedAt'> {
    return {
      name: template.name,
      description: template.description,
      occasion: template.occasion,
      thumbnail: template.thumbnail,
      color: template.color,
      elements: template.elements,
      difficulty: template.difficulty,
      ...(template.creditCost !== undefined && {
        creditCost: template.creditCost,
      }),
      ...(template.preview && { preview: template.preview }),
      // Handle element IDs (no serialization needed)
      ...(template.defaultElementIds && {
        defaultElementIds: template.defaultElementIds,
      }),
      // Serialize step sequence
      ...(template.stepSequence && {
        stepSequence: JSON.stringify(template.stepSequence),
      }),
      createdBy: userId,
      isPublic: true, // Default to public
      version: '1.0.0',
    };
  }

  /**
   * Get all templates with optional filtering
   */
  static async getAllTemplates(
    options: TemplateQueryOptions = {}
  ): Promise<ServiceResponse<Template[]>> {
    try {
      // Start with the simplest possible query - no filters, no ordering
      let q = query(this.collectionRef);

      const querySnapshot = await getDocs(q);
      const templates: Template[] = [];

      querySnapshot.forEach(doc => {
        templates.push(this.documentToTemplate(doc));
      });

      // Apply all filters client-side
      let filteredTemplates = templates;

      if (options.occasion) {
        filteredTemplates = filteredTemplates.filter(
          t => t.occasion === options.occasion
        );
      }

      if (options.difficulty) {
        filteredTemplates = filteredTemplates.filter(
          t => t.difficulty === options.difficulty
        );
      }

      if (options.isPublic === true) {
        filteredTemplates = filteredTemplates.filter(t => t.isPublic === true);
      } else if (options.isPublic === false) {
        filteredTemplates = filteredTemplates.filter(t => t.isPublic === false);
      }
      // If options.isPublic is undefined, don't filter - show all templates

      if (options.createdBy) {
        filteredTemplates = filteredTemplates.filter(
          t => t.createdBy === options.createdBy
        );
      }

      // Apply client-side sorting
      const orderField = options.orderBy || 'name';
      const orderDirection = options.orderDirection || 'asc';

      filteredTemplates.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (orderField === 'createdAt') {
          aValue = a.createdAt?.toDate?.() || new Date(0);
          bValue = b.createdAt?.toDate?.() || new Date(0);
          aValue = aValue.getTime();
          bValue = bValue.getTime();
        } else if (orderField === 'updatedAt') {
          aValue = a.updatedAt?.toDate?.() || new Date(0);
          bValue = b.updatedAt?.toDate?.() || new Date(0);
          aValue = aValue.getTime();
          bValue = bValue.getTime();
        } else {
          // Default to name
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
        }

        if (orderDirection === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });

      // Apply limit client-side
      if (options.limit) {
        filteredTemplates = filteredTemplates.slice(0, options.limit);
      }

      return {
        success: true,
        data: filteredTemplates,
        message: `Retrieved ${filteredTemplates.length} templates`,
      };
    } catch (error) {
      console.error('Error fetching templates:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get template by ID
   */
  static async getTemplateById(id: string): Promise<ServiceResponse<Template>> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Template not found',
        };
      }

      const template = this.documentToTemplate(docSnap);
      return {
        success: true,
        data: template,
        message: 'Template retrieved successfully',
      };
    } catch (error) {
      console.error('Error fetching template:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create a new template
   */
  static async createTemplate(
    template: Omit<Template, 'id'>,
    userId: string
  ): Promise<ServiceResponse<Template>> {
    try {
      // Validate required fields
      if (!template.name || !template.description) {
        return {
          success: false,
          error: 'Template name and description are required',
        };
      }

      const templateDoc = this.templateToDocument(template, userId);
      const docRef = await addDoc(this.collectionRef, {
        ...templateDoc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newTemplate: Template = {
        id: docRef.id,
        ...template,
      };

      return {
        success: true,
        data: newTemplate,
        message: 'Template created successfully',
      };
    } catch (error) {
      console.error('Error creating template:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Update an existing template
   */
  static async updateTemplate(
    id: string,
    updates: Partial<Omit<Template, 'id'>>,
    userId: string
  ): Promise<ServiceResponse<Template>> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Template not found',
        };
      }

      const existingData = docSnap.data() as TemplateDocument;

      // Check if user has permission to update this template
      if (existingData.createdBy !== userId) {
        return {
          success: false,
          error: 'You do not have permission to update this template',
        };
      }

      // Prepare update data
      const updateData: Partial<TemplateDocument> = {
        updatedAt: serverTimestamp(),
      };

      // Only update provided fields
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.occasion !== undefined)
        updateData.occasion = updates.occasion;
      if (updates.thumbnail !== undefined)
        updateData.thumbnail = updates.thumbnail;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.elements !== undefined)
        updateData.elements = updates.elements;
      if (updates.difficulty !== undefined)
        updateData.difficulty = updates.difficulty;
      if (updates.creditCost !== undefined)
        updateData.creditCost = updates.creditCost;
      if (updates.preview !== undefined) updateData.preview = updates.preview;
      // Handle element IDs (no serialization needed)
      if (updates.defaultElementIds !== undefined) {
        updateData.defaultElementIds = updates.defaultElementIds;
      }
      // Serialize step sequence
      if (updates.stepSequence !== undefined) {
        updateData.stepSequence = JSON.stringify(updates.stepSequence);
      }

      await updateDoc(docRef, updateData);

      // Get updated template
      const updatedDocSnap = await getDoc(docRef);
      if (!updatedDocSnap.exists()) {
        return {
          success: false,
          error: 'Failed to retrieve updated template',
        };
      }
      const updatedTemplate = this.documentToTemplate(
        updatedDocSnap as QueryDocumentSnapshot<DocumentData>
      );

      return {
        success: true,
        data: updatedTemplate,
        message: 'Template updated successfully',
      };
    } catch (error) {
      console.error('Error updating template:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete a template
   */
  static async deleteTemplate(
    id: string,
    userId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Template not found',
        };
      }

      const templateData = docSnap.data() as TemplateDocument;

      // Check if user has permission to delete this template
      if (templateData.createdBy !== userId) {
        return {
          success: false,
          error: 'You do not have permission to delete this template',
        };
      }

      await deleteDoc(docRef);

      return {
        success: true,
        data: true,
        message: 'Template deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting template:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get templates by occasion
   */
  static async getTemplatesByOccasion(
    occasion: string
  ): Promise<ServiceResponse<Template[]>> {
    return this.getAllTemplates({ occasion });
  }

  /**
   * Get templates by difficulty
   */
  static async getTemplatesByDifficulty(
    difficulty: string
  ): Promise<ServiceResponse<Template[]>> {
    return this.getAllTemplates({ difficulty });
  }

  /**
   * Search templates by name or description
   */
  static async searchTemplates(
    query: string
  ): Promise<ServiceResponse<Template[]>> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation - consider using Algolia or similar for production
      const response = await this.getAllTemplates();

      if (!response.success || !response.data) {
        return response;
      }

      const searchTerm = query.toLowerCase();
      const filteredTemplates = response.data.filter(
        template =>
          template.name.toLowerCase().includes(searchTerm) ||
          template.description.toLowerCase().includes(searchTerm)
      );

      return {
        success: true,
        data: filteredTemplates,
        message: `Found ${filteredTemplates.length} templates matching "${query}"`,
      };
    } catch (error) {
      console.error('Error searching templates:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get template statistics
   */
  static async getTemplateStats(): Promise<ServiceResponse<any>> {
    try {
      const response = await this.getAllTemplates();

      if (!response.success || !response.data) {
        return response;
      }

      const templates = response.data;
      const stats = {
        total: templates.length,
        byOccasion: {} as Record<string, number>,
        byDifficulty: {} as Record<string, number>,
        averageElements: 0,
      };

      let totalElements = 0;

      templates.forEach(template => {
        // Count by occasion
        stats.byOccasion[template.occasion] =
          (stats.byOccasion[template.occasion] || 0) + 1;

        // Count by difficulty
        stats.byDifficulty[template.difficulty] =
          (stats.byDifficulty[template.difficulty] || 0) + 1;

        // Count elements
        totalElements += template.elements.length;
      });

      stats.averageElements =
        templates.length > 0 ? totalElements / templates.length : 0;

      return {
        success: true,
        data: stats,
        message: 'Template statistics retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting template stats:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Batch operations for multiple templates
   */
  static async batchCreateTemplates(
    templates: Omit<Template, 'id'>[],
    userId: string
  ): Promise<ServiceResponse<Template[]>> {
    try {
      const batch = writeBatch(db);
      const createdTemplates: Template[] = [];

      for (const template of templates) {
        const docRef = doc(this.collectionRef);
        const templateDoc = this.templateToDocument(template, userId);

        batch.set(docRef, {
          ...templateDoc,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        createdTemplates.push({
          id: docRef.id,
          ...template,
        });
      }

      await batch.commit();

      return {
        success: true,
        data: createdTemplates,
        message: `Successfully created ${createdTemplates.length} templates`,
      };
    } catch (error) {
      console.error('Error batch creating templates:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Export templates to JSON
   */
  static async exportTemplates(): Promise<ServiceResponse<string>> {
    try {
      const response = await this.getAllTemplates();

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to retrieve templates for export',
        };
      }

      const exportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        templates: response.data,
      };

      return {
        success: true,
        data: JSON.stringify(exportData, null, 2),
        message: 'Templates exported successfully',
      };
    } catch (error) {
      console.error('Error exporting templates:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Import templates from JSON
   */
  static async importTemplates(
    jsonData: string,
    userId: string
  ): Promise<ServiceResponse<Template[]>> {
    try {
      const importData = JSON.parse(jsonData);

      if (!importData.templates || !Array.isArray(importData.templates)) {
        return {
          success: false,
          error: 'Invalid import data format',
        };
      }

      const templates = importData.templates.map((template: any) => ({
        name: template.name,
        description: template.description,
        occasion: template.occasion,
        thumbnail: template.thumbnail,
        color: template.color,
        elements: template.elements,
        difficulty: template.difficulty,
        preview: template.preview,
        defaultElements: template.defaultElements,
        stepSequence: template.stepSequence,
      }));

      const response = await this.batchCreateTemplates(templates, userId);

      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to import templates',
        };
      }

      return {
        success: true,
        data: response.data || [],
        message: `Successfully imported ${templates.length} templates`,
      };
    } catch (error) {
      console.error('Error importing templates:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
