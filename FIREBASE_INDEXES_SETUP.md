# Firebase Indexes Setup for WishLuu

## Overview

Firestore requires composite indexes for queries that combine `where` clauses with `orderBy` clauses. This document explains the required indexes for WishLuu and how to set them up.

## Required Indexes

### 1. Wishes Collection Indexes

#### Index 1: User Wishes Query

- **Collection**: `wishes`
- **Fields**:
  - `createdBy` (Ascending)
  - `createdAt` (Descending)
- **Purpose**: Used by `getWishesByUserId()` method
- **Query**: `where('createdBy', '==', userId) + orderBy('createdAt', 'desc')`

#### Index 2: Public Wishes Query

- **Collection**: `wishes`
- **Fields**:
  - `isPublic` (Ascending)
  - `createdAt` (Descending)
- **Purpose**: Used by `getPublicWishes()` method
- **Query**: `where('isPublic', '==', true) + orderBy('createdAt', 'desc')`

## How to Create Indexes

### Method 1: Using the Error Link (Easiest)

1. When you get the index error, click the provided link
2. It will take you directly to the Firebase Console with the correct index pre-filled
3. Click "Create Index"

### Method 2: Manual Creation

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`wishluu-dev`)
3. Navigate to **Firestore Database** → **Indexes**
4. Click **"Create Index"**
5. Fill in the details:
   - **Collection ID**: `wishes`
   - **Fields**: Add the required fields in the correct order
6. Click **"Create"**

### Method 3: Using Firebase CLI

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Create indexes using firestore.indexes.json
```

## Current Temporary Fix

The code has been temporarily modified to avoid the index requirement by:

1. Removing `orderBy` clauses from queries
2. Implementing client-side sorting as a workaround

This allows the app to work immediately while you set up the proper indexes.

## Restoring Full Functionality

Once the indexes are created and built (this can take a few minutes), you can restore the original queries:

```typescript
// In getWishesByUserId method
const q = query(
  this.wishesCollectionRef,
  where('createdBy', '==', userId),
  orderBy('createdAt', 'desc') // Restore this line
);

// In getPublicWishes method
const q = query(
  this.wishesCollectionRef,
  where('isPublic', '==', true),
  orderBy('createdAt', 'desc'), // Restore this line
  limit(limitCount)
);
```

## Index Building Time

- **Small datasets** (< 1000 documents): Usually 1-2 minutes
- **Medium datasets** (1000-10000 documents): 5-10 minutes
- **Large datasets** (> 10000 documents): 15-30 minutes

You can monitor the build progress in the Firebase Console.

## Best Practices

1. **Create indexes proactively**: Set up indexes before deploying to production
2. **Monitor query performance**: Use Firebase Console to monitor query performance
3. **Limit result sets**: Always use `limit()` for queries that could return large datasets
4. **Consider pagination**: For large datasets, implement pagination using `startAfter()`

## Troubleshooting

### Common Issues

1. **Index still building**: Wait for the index to finish building
2. **Wrong field order**: Ensure fields are in the exact order specified
3. **Wrong collection name**: Double-check the collection ID
4. **Permission issues**: Ensure you have the necessary permissions

### Error Messages

- **"The query requires an index"**: Create the required composite index
- **"Index not ready"**: Wait for the index to finish building
- **"Permission denied"**: Check your Firestore security rules

## Additional Resources

- [Firestore Indexing Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Composite Indexes Guide](https://firebase.google.com/docs/firestore/query-data/indexing#composite_indexes)
- [Query Performance Best Practices](https://firebase.google.com/docs/firestore/best-practices#queries)
