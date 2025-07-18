# Firebase Template Storage Implementation

This document outlines the implementation of Firebase-based template storage for WishLuu, following clean code principles and best practices.

## 🏗️ Architecture Overview

### Components

1. **FirebaseTemplateService** (`src/lib/firebaseTemplateService.ts`)
   - Core service for all Firebase template operations
   - Handles CRUD operations, queries, and batch operations
   - Implements proper error handling and type safety

2. **useFirebaseTemplates Hook** (`src/hooks/useFirebaseTemplates.ts`)
   - React hook for managing template state
   - Provides loading states, error handling, and automatic refresh
   - Integrates with authentication context

3. **Firebase Template Hook** (`src/hooks/useFirebaseTemplates.ts`)
   - React hook for managing Firebase templates
   - Provides loading states, error handling, and automatic refresh
   - Integrates with authentication context

## 🔧 Setup Instructions

### 1. Firebase Configuration

Ensure your Firebase configuration is properly set up in `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

### 2. Firestore Security Rules

Set up proper Firestore security rules for the `templates` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Templates collection
    match /templates/{templateId} {
      // Anyone can read public templates
      allow read: if resource.data.isPublic == true;

      // Only authenticated users can create templates
      allow create: if request.auth != null;

      // Only the creator can update their templates
      allow update: if request.auth != null &&
                      request.auth.uid == resource.data.createdBy;

      // Only the creator can delete their templates
      allow delete: if request.auth != null &&
                      request.auth.uid == resource.data.createdBy;
    }
  }
}
```

### 3. Database Indexes

Create the following composite indexes in Firestore for optimal query performance:

1. **For filtering by occasion and ordering by creation date:**
   - Collection: `templates`
   - Fields: `occasion` (Ascending), `createdAt` (Descending)

2. **For filtering by difficulty and ordering by creation date:**
   - Collection: `templates`
   - Fields: `difficulty` (Ascending), `createdAt` (Descending)

3. **For filtering by public status and ordering by creation date:**
   - Collection: `templates`
   - Fields: `isPublic` (Ascending), `createdAt` (Descending)

## 📊 Data Structure

### Template Document Schema

```typescript
interface TemplateDocument {
  // Basic Information
  name: string;
  description: string;
  occasion: string;
  thumbnail: string;
  color: string;
  elements: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';

  // Optional Fields
  preview?: string;
  defaultElements?: WishElement[];
  stepSequence?: string[][];

  // Metadata
  createdBy: string; // User ID
  isPublic: boolean; // Visibility flag
  version: string; // Template version
  createdAt: Timestamp; // Firestore timestamp
  updatedAt: Timestamp; // Firestore timestamp
}
```

## 🚀 Usage Examples

### Using the Hook

```typescript
import { useFirebaseTemplates } from '@/hooks/useFirebaseTemplates';

function TemplatesPage() {
  const {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates
  } = useFirebaseTemplates();

  const handleCreateTemplate = async () => {
    const newTemplate = {
      name: 'My Template',
      description: 'A beautiful template',
      occasion: 'birthday',
      thumbnail: '🎂',
      color: 'from-purple-400 to-pink-500',
      elements: ['balloons-interactive', 'beautiful-text'],
      difficulty: 'easy' as const,
    };

    const result = await createTemplate(newTemplate);
    if (result.success) {
      console.log('Template created:', result.data);
    } else {
      console.error('Error:', result.error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>{template.name}</div>
      ))}
    </div>
  );
}
```

### Direct Service Usage

```typescript
import { FirebaseTemplateService } from '@/lib/firebaseTemplateService';

// Get all public templates
const response = await FirebaseTemplateService.getAllTemplates({
  isPublic: true,
  orderBy: 'createdAt',
  orderDirection: 'desc',
});

// Search templates
const searchResponse =
  await FirebaseTemplateService.searchTemplates('birthday');

// Get template statistics
const statsResponse = await FirebaseTemplateService.getTemplateStats();
```

## 🚀 Getting Started

### First Time Setup

1. **Configure Firebase**: Set up your Firebase project and add configuration to `.env.local`
2. **Set up Firestore**: Create the `templates` collection with proper security rules
3. **Create Indexes**: Add the recommended composite indexes for optimal performance
4. **Test Connection**: Use the admin interface to create your first template

### Creating Templates

Templates are created through the admin interface and stored directly in Firebase:

```typescript
// Templates are created via the admin interface
// No migration needed - everything is stored in Firebase from the start
```

## 🛡️ Security Features

### Authentication Required

- All write operations require user authentication
- User ID is automatically attached to created templates
- Users can only modify their own templates

### Permission Checks

- Template updates/deletes verify ownership
- Public/private template visibility control
- Admin-only operations for template management

### Data Validation

- Required field validation
- Type safety with TypeScript
- Input sanitization and validation

## 📈 Performance Optimizations

### Query Optimization

- Composite indexes for common queries
- Pagination support with `limit()`
- Efficient filtering and ordering

### Batch Operations

- Batch create for multiple templates
- Atomic operations for data consistency
- Reduced network requests

### Caching Strategy

- React hook caching with `useCallback`
- Automatic refresh on data changes
- Optimistic updates for better UX

## 🧪 Testing

### Unit Tests

```typescript
// Test template creation
const template = { name: 'Test', description: 'Test desc', ... };
const result = await FirebaseTemplateService.createTemplate(template, userId);
expect(result.success).toBe(true);
expect(result.data?.name).toBe('Test');
```

### Integration Tests

```typescript
// Test full CRUD cycle
const created = await createTemplate(template);
const retrieved = await getTemplateById(created.data!.id);
const updated = await updateTemplate(created.data!.id, { name: 'Updated' });
const deleted = await deleteTemplate(created.data!.id);
```

## 🚨 Error Handling

### Service Response Format

```typescript
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Common Error Scenarios

- Network connectivity issues
- Authentication failures
- Permission denied errors
- Invalid data format
- Firestore quota limits

### Error Recovery

- Automatic retry for transient errors
- Graceful degradation for offline scenarios
- User-friendly error messages
- Fallback to local storage if needed

## 🔧 Configuration Options

### Environment Variables

- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration
- `NEXT_PUBLIC_ADMIN_EMAILS`: Admin user emails

### Service Options

- `isPublic`: Filter by visibility
- `createdBy`: Filter by creator
- `occasion`: Filter by occasion type
- `difficulty`: Filter by difficulty level
- `limit`: Pagination limit
- `orderBy`: Sort field
- `orderDirection`: Sort direction

## 📝 Best Practices

### Code Organization

- Separation of concerns
- Single responsibility principle
- Dependency injection
- Type safety with TypeScript

### Error Handling

- Comprehensive error catching
- User-friendly error messages
- Proper error logging
- Graceful degradation

### Performance

- Efficient queries with indexes
- Batch operations for bulk data
- Proper caching strategies
- Minimal network requests

### Security

- Input validation
- Authentication checks
- Permission verification
- Data sanitization

## 🔮 Future Enhancements

### Planned Features

- Real-time template updates
- Template versioning
- Advanced search with Algolia
- Template sharing and collaboration
- Analytics and usage tracking

### Scalability Considerations

- Pagination for large datasets
- Caching layer (Redis)
- CDN for template assets
- Database sharding for high volume

## 📞 Support

For issues or questions:

1. Check the console for error logs
2. Verify Firebase configuration
3. Ensure proper authentication
4. Check Firestore security rules
5. Review network connectivity

---

This implementation provides a robust, scalable, and secure foundation for template storage in WishLuu using Firebase Firestore.
