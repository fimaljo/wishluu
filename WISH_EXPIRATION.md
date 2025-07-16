# Wish Expiration System

## Overview

WishLuu now includes an automatic expiration system where wishes expire after 7 days from creation. This helps manage storage costs and creates urgency for users to share their wishes.

## How It Works

### Automatic Expiration

- **Expiration Period**: 7 days from creation
- **Automatic Setting**: All new wishes get an `expiresAt` timestamp
- **Hidden from Views**: Expired wishes are automatically filtered out from user lists
- **Permanent Deletion**: Expired wishes can be permanently deleted via cleanup

### User Experience

- **Visual Indicators**: Expiration badges show days remaining
- **Color Coding**:
  - 🟢 **Green**: 4+ days remaining
  - 🟡 **Yellow**: 1-3 days remaining
  - 🟠 **Orange**: Expires today
  - 🔴 **Red**: Expired

### Admin Features

- **Manual Cleanup**: Admin page at `/admin/cleanup` to delete expired wishes
- **Batch Operations**: Efficient bulk deletion using Firestore batches
- **Safety Checks**: Confirmation dialogs and warnings

## Technical Implementation

### Database Schema

```typescript
interface WishDocument {
  // ... existing fields
  expiresAt: Timestamp; // 7 days from createdAt
}
```

### Key Methods

```typescript
// Check if wish is expired
FirebaseWishService.isWishExpired(wish: Wish): boolean

// Get days until expiration
FirebaseWishService.getDaysUntilExpiration(wish: Wish): number

// Clean up expired wishes
FirebaseWishService.cleanupExpiredWishes(): Promise<ServiceResponse<number>>
```

### Filtering Logic

- **User Wishes**: Automatically excludes expired wishes from `getWishesByUserId()`
- **Public Wishes**: Automatically excludes expired wishes from `getPublicWishes()`
- **Shared Wishes**: Expired wishes return "not found" error

## Components

### ExpirationBadge

- **Location**: `src/components/ui/ExpirationBadge.tsx`
- **Usage**: Displays expiration status on wish cards
- **Features**: Color-coded status with countdown

### Cleanup Page

- **Location**: `src/app/admin/cleanup/page.tsx`
- **Access**: `/admin/cleanup`
- **Features**: Manual cleanup with confirmation

## Configuration

### Expiration Period

To change the expiration period, modify the `calculateExpirationDate()` method:

```typescript
private static calculateExpirationDate(): Date {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7); // Change 7 to desired days
  return expirationDate;
}
```

### Badge Thresholds

To adjust warning thresholds, modify the `ExpirationBadge` component:

```typescript
// Current thresholds
if (diffDays <= 0) return 'Expired';
if (diffDays <= 1) return 'Expires today';
if (diffDays <= 3) return 'Expires in X days';
// Default: "X days left"
```

## Best Practices

### For Users

- **Create wishes early**: Give recipients time to view
- **Monitor expiration**: Check badge colors regularly
- **Share promptly**: Don't wait until the last day

### For Admins

- **Regular cleanup**: Run cleanup weekly or monthly
- **Monitor storage**: Check database size periodically
- **Backup important wishes**: Consider archiving before cleanup

### For Developers

- **Test expiration**: Create test wishes with short expiration
- **Handle edge cases**: Account for timezone differences
- **Performance**: Use efficient queries for large datasets

## Future Enhancements

### Potential Features

- **Extend expiration**: Allow users to extend wish lifetime
- **Premium wishes**: Longer expiration for premium users
- **Scheduled cleanup**: Automated daily/weekly cleanup
- **Archive system**: Move expired wishes to archive instead of deletion
- **Email notifications**: Alert users before wishes expire

### Technical Improvements

- **Index optimization**: Add indexes for expiration queries
- **Caching**: Cache expiration status for better performance
- **Analytics**: Track expiration patterns and user behavior

## Troubleshooting

### Common Issues

1. **Wishes not expiring**: Check timezone settings
2. **Cleanup not working**: Verify admin permissions
3. **Badge not showing**: Ensure `expiresAt` field exists

### Debug Commands

```typescript
// Check if wish is expired
console.log(FirebaseWishService.isWishExpired(wish));

// Get days until expiration
console.log(FirebaseWishService.getDaysUntilExpiration(wish));

// Manual cleanup
const result = await FirebaseWishService.cleanupExpiredWishes();
console.log(result);
```

## Migration Notes

### Existing Wishes

- **No expiration**: Old wishes without `expiresAt` won't expire
- **Manual cleanup**: Use admin page to clean up old wishes
- **Gradual rollout**: New wishes will have expiration, old ones remain

### Database Migration

If you need to add expiration to existing wishes:

```typescript
// Add expiration to existing wishes (run once)
const addExpirationToExistingWishes = async () => {
  const wishes = await FirebaseWishService.getAllWishes();
  for (const wish of wishes) {
    if (!wish.expiresAt) {
      await FirebaseWishService.updateWish(
        wish.id,
        {
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        wish.createdBy
      );
    }
  }
};
```
