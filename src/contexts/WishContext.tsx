'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Wish } from '@/lib/firebase';

// Define action types for type safety
type WishAction = 
  | { type: 'SET_WISHES'; payload: Wish[] }
  | { type: 'ADD_WISH'; payload: Wish }
  | { type: 'UPDATE_WISH'; payload: { id: string; updates: Partial<Wish> } }
  | { type: 'DELETE_WISH'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Define the state interface
interface WishState {
  wishes: Wish[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: WishState = {
  wishes: [],
  loading: false,
  error: null,
};

// Reducer function for state management
function wishReducer(state: WishState, action: WishAction): WishState {
  switch (action.type) {
    case 'SET_WISHES':
      return {
        ...state,
        wishes: action.payload,
        loading: false,
        error: null,
      };
    
    case 'ADD_WISH':
      return {
        ...state,
        wishes: [action.payload, ...state.wishes],
        error: null,
      };
    
    case 'UPDATE_WISH':
      return {
        ...state,
        wishes: state.wishes.map(wish =>
          wish.id === action.payload.id
            ? { ...wish, ...action.payload.updates }
            : wish
        ),
        error: null,
      };
    
    case 'DELETE_WISH':
      return {
        ...state,
        wishes: state.wishes.filter(wish => wish.id !== action.payload),
        error: null,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    default:
      return state;
  }
}

// Create the context
interface WishContextType {
  state: WishState;
  dispatch: React.Dispatch<WishAction>;
  // Helper functions for common operations
  addWish: (wish: Wish) => void;
  updateWish: (id: string, updates: Partial<Wish>) => void;
  deleteWish: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const WishContext = createContext<WishContextType | undefined>(undefined);

// Provider component
interface WishProviderProps {
  children: ReactNode;
}

export function WishProvider({ children }: WishProviderProps) {
  const [state, dispatch] = useReducer(wishReducer, initialState);

  // Helper functions
  const addWish = (wish: Wish) => {
    dispatch({ type: 'ADD_WISH', payload: wish });
  };

  const updateWish = (id: string, updates: Partial<Wish>) => {
    dispatch({ type: 'UPDATE_WISH', payload: { id, updates } });
  };

  const deleteWish = (id: string) => {
    dispatch({ type: 'DELETE_WISH', payload: id });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const value: WishContextType = {
    state,
    dispatch,
    addWish,
    updateWish,
    deleteWish,
    setLoading,
    setError,
  };

  return (
    <WishContext.Provider value={value}>
      {children}
    </WishContext.Provider>
  );
}

// Custom hook to use the wish context
export function useWishContext() {
  const context = useContext(WishContext);
  if (context === undefined) {
    throw new Error('useWishContext must be used within a WishProvider');
  }
  return context;
}

// Custom hook for wish operations
export function useWishes() {
  const { state, addWish, updateWish, deleteWish, setLoading, setError } = useWishContext();

  const fetchWishes = async () => {
    setLoading(true);
    try {
      // TODO: Implement Firebase fetch
      // const wishes = await getWishes();
      // dispatch({ type: 'SET_WISHES', payload: wishes });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch wishes');
    }
  };

  const createWish = async (wishData: Omit<Wish, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      // TODO: Implement Firebase create
      // const newWish = await createWish(wishData);
      // addWish(newWish);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create wish');
    }
  };

  return {
    wishes: state.wishes,
    loading: state.loading,
    error: state.error,
    fetchWishes,
    createWish,
    updateWish,
    deleteWish,
  };
} 