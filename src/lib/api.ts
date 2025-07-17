// Centralized API utilities for data fetching
import { auth } from '@/lib/firebase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Generic API client with JWT authentication
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return null;
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async getHeaders(includeAuth: boolean = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(
    endpoint: string,
    data: any,
    includeAuth: boolean = true
  ): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }

  async put<T>(
    endpoint: string,
    data: any,
    includeAuth: boolean = true
  ): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE);

// Wish-specific API functions
export const wishApi = {
  getAll: () => apiClient.get('/wishes'),
  getById: (id: string) => apiClient.get(`/wishes/${id}`),
  create: (data: any) => apiClient.post('/wishes', data),
  update: (id: string, data: any) => apiClient.put(`/wishes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/wishes/${id}`),
};

// User-specific API functions
export const userApi = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data: any) => apiClient.put('/user/profile', data),
};

// Premium API functions with JWT authentication
export const premiumApi = {
  useCredits: (feature: string, description: string, wishId?: string) =>
    apiClient.post('/premium', {
      action: 'useCredits',
      feature,
      description,
      wishId,
    }),

  addCredits: (amount: number, description: string, source: string) =>
    apiClient.post('/premium', {
      action: 'addCredits',
      amount,
      description,
      source,
    }),

  getStatus: () => apiClient.post('/premium', { action: 'getStatus' }),

  getCreditHistory: () =>
    apiClient.post('/premium', { action: 'getCreditHistory' }),

  claimMonthlyLoginBonus: () =>
    apiClient.post('/premium', { action: 'claimMonthlyLoginBonus' }),

  // GET endpoints
  getStatusGet: () => apiClient.get('/premium?action=status'),

  getUsage: () => apiClient.get('/premium?action=usage'),
};

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Response wrapper for consistent API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
