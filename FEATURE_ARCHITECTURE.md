# 🏗️ Feature-Based Architecture in Next.js

## 📋 **Overview**

This guide shows how to build features and pages in Next.js using a **feature-based architecture** similar to Angular's approach.

## 🗂️ **Project Structure**

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── create/page.tsx    # Create wish page
│   ├── wishes/page.tsx    # Wishes list page
│   └── wish/[id]/page.tsx # Individual wish page
├── features/              # Feature-based modules (like Angular)
│   ├── wishes/           # Wish feature module
│   │   ├── components/   # Feature-specific components
│   │   │   └── WishCard.tsx
│   │   ├── hooks/        # Feature-specific hooks (like Angular services)
│   │   │   └── useWishManagement.ts
│   │   ├── pages/        # Feature-specific page components
│   │   │   └── WishListPage.tsx
│   │   └── index.ts      # Feature exports (like Angular module)
│   └── auth/             # Another feature module
│       ├── components/
│       ├── hooks/
│       └── index.ts
├── components/           # Shared components
├── contexts/            # Global state (like Angular services)
├── hooks/               # Shared hooks
├── lib/                 # Utilities and configs
└── types/               # TypeScript types
```

## 🔄 **Angular vs Next.js Comparison**

| Angular Concept | Next.js Equivalent | Purpose |
|----------------|-------------------|---------|
| `Feature Module` | `src/features/feature/` | Organize related functionality |
| `Component` | `src/features/feature/components/` | UI components |
| `Service` | `src/features/feature/hooks/` | Business logic & API calls |
| `Module` | `src/features/feature/index.ts` | Export feature components |
| `Injectable` | `useContext()` + Custom Hooks | Dependency injection |

## 🚀 **How to Build New Features**

### **Step 1: Create Feature Structure**

```bash
mkdir -p src/features/your-feature/{components,hooks,pages}
touch src/features/your-feature/index.ts
```

### **Step 2: Create Feature Components**

```tsx
// src/features/your-feature/components/YourComponent.tsx
'use client';

import React from 'react';
import { useYourFeatureHook } from '../hooks/useYourFeatureHook';

interface YourComponentProps {
  // Props here
}

export function YourComponent({ ...props }: YourComponentProps) {
  const { data, actions } = useYourFeatureHook();
  
  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

### **Step 3: Create Feature Hooks (Services)**

```tsx
// src/features/your-feature/hooks/useYourFeatureHook.ts
'use client';

import { useState, useCallback } from 'react';
import { useYourContext } from '@/contexts/YourContext';

export function useYourFeatureHook() {
  const { state, actions } = useYourContext();
  const [localState, setLocalState] = useState();

  const handleAction = useCallback(async () => {
    // Business logic here
  }, []);

  return {
    data: state,
    actions: { handleAction },
    loading: state.loading,
    error: state.error,
  };
}
```

### **Step 4: Create Feature Pages**

```tsx
// src/features/your-feature/pages/YourFeaturePage.tsx
'use client';

import React from 'react';
import { YourComponent } from '../components/YourComponent';
import { useYourFeatureHook } from '../hooks/useYourFeatureHook';

export function YourFeaturePage() {
  const { data, actions } = useYourFeatureHook();

  return (
    <div className="min-h-screen">
      <YourComponent />
      {/* More components */}
    </div>
  );
}
```

### **Step 5: Export Feature**

```tsx
// src/features/your-feature/index.ts
export { YourComponent } from './components/YourComponent';
export { YourFeaturePage } from './pages/YourFeaturePage';
export { useYourFeatureHook } from './hooks/useYourFeatureHook';
```

### **Step 6: Use in Next.js Page**

```tsx
// src/app/your-feature/page.tsx
import { YourFeaturePage } from '@/features/your-feature';

export default function Page() {
  return <YourFeaturePage />;
}
```

## 🎯 **Best Practices**

### **1. Feature Isolation**
- Keep feature-specific code within the feature folder
- Use shared components only when necessary
- Each feature should be self-contained

### **2. Hook-Based Services**
```tsx
// Instead of Angular services, use custom hooks
export function useWishService() {
  const { state, dispatch } = useWishContext();
  
  const createWish = useCallback(async (data) => {
    // API call logic
  }, []);
  
  return { createWish, wishes: state.wishes };
}
```

### **3. Context for Global State**
```tsx
// src/contexts/YourContext.tsx
export function YourProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <YourContext.Provider value={{ state, dispatch }}>
      {children}
    </YourContext.Provider>
  );
}
```

### **4. Type Safety**
```tsx
// src/features/your-feature/types.ts
export interface YourFeatureData {
  id: string;
  name: string;
  // ... other properties
}

export interface YourFeatureState {
  data: YourFeatureData[];
  loading: boolean;
  error: string | null;
}
```

## 🔧 **Example: Building a New Feature**

Let's say you want to add a **User Profile** feature:

### **1. Create Structure**
```bash
mkdir -p src/features/profile/{components,hooks,pages}
```

### **2. Create Profile Hook**
```tsx
// src/features/profile/hooks/useProfile.ts
export function useProfile() {
  const [profile, setProfile] = useState(null);
  
  const updateProfile = useCallback(async (data) => {
    // API call to update profile
  }, []);
  
  return { profile, updateProfile };
}
```

### **3. Create Profile Component**
```tsx
// src/features/profile/components/ProfileCard.tsx
export function ProfileCard() {
  const { profile, updateProfile } = useProfile();
  
  return (
    <div className="profile-card">
      {/* Profile UI */}
    </div>
  );
}
```

### **4. Create Profile Page**
```tsx
// src/features/profile/pages/ProfilePage.tsx
export function ProfilePage() {
  return (
    <div className="profile-page">
      <ProfileCard />
      <ProfileSettings />
    </div>
  );
}
```

### **5. Export Feature**
```tsx
// src/features/profile/index.ts
export { ProfileCard } from './components/ProfileCard';
export { ProfilePage } from './pages/ProfilePage';
export { useProfile } from './hooks/useProfile';
```

### **6. Use in App Router**
```tsx
// src/app/profile/page.tsx
import { ProfilePage } from '@/features/profile';

export default function Page() {
  return <ProfilePage />;
}
```

## 🎨 **Styling Approach**

### **Global Styles**
```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Feature-specific styles */
@layer components {
  .wish-card {
    @apply bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300;
  }
}
```

### **Component Styles**
```tsx
// Use Tailwind classes directly in components
<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg">
  {/* Content */}
</div>
```

### **Custom CSS Classes**
```css
/* src/app/globals.css */
@layer components {
  .feature-button {
    @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors;
  }
}
```

## 🔄 **State Management**

### **Local State (useState)**
```tsx
const [localData, setLocalData] = useState();
```

### **Feature State (useReducer)**
```tsx
const [state, dispatch] = useReducer(featureReducer, initialState);
```

### **Global State (Context)**
```tsx
const { state, actions } = useGlobalContext();
```

## 📱 **Responsive Design**

```tsx
// Use Tailwind responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

## 🚀 **Performance Tips**

1. **Code Splitting**: Next.js automatically code-splits by page
2. **Lazy Loading**: Use `dynamic()` for heavy components
3. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
4. **Image Optimization**: Use Next.js `Image` component

## 🧪 **Testing Strategy**

```tsx
// src/features/your-feature/__tests__/YourComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { YourComponent } from '../components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

This architecture provides a clean, scalable, and maintainable way to build features in Next.js, similar to Angular's feature modules! 