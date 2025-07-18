# Production Deployment Checklist

## 🚀 Pre-Deployment Checklist

### ✅ Code Quality

- [ ] All debug code removed (`console.log` statements)
- [ ] Test pages removed (`/test-premium`, `/test-firebase`, `/test-credits`)
- [ ] Debug information hidden in production
- [ ] All TypeScript errors resolved
- [ ] ESLint passes without warnings
- [ ] Code formatting consistent (Prettier)

### ✅ Security

- [ ] Environment variables properly configured
- [ ] No hardcoded secrets in code
- [ ] Firebase security rules implemented
- [ ] API endpoints have proper authentication
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF protection implemented

### ✅ Error Handling

- [ ] Error boundaries implemented
- [ ] User-friendly error messages
- [ ] Proper error logging configured
- [ ] Retry logic for transient failures
- [ ] Graceful degradation for offline scenarios

### ✅ Performance

- [ ] Images optimized and compressed
- [ ] Code splitting implemented
- [ ] Bundle size optimized
- [ ] Lazy loading for components
- [ ] Caching strategies implemented
- [ ] Database indexes created

### ✅ Testing

- [ ] Unit tests written and passing
- [ ] Integration tests implemented
- [ ] End-to-end tests configured
- [ ] Error scenarios tested
- [ ] Payment flow tested (if applicable)

## 🔧 Environment Setup

### Required Environment Variables

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com

# Premium System
NEXT_PUBLIC_PREMIUM_ENABLED=true
NEXT_PUBLIC_FREE_WISH_LIMIT=2
NEXT_PUBLIC_PRO_WISH_LIMIT=20
NEXT_PUBLIC_PREMIUM_WISH_LIMIT=-1

# App Configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production
```

### Optional Environment Variables (Future Use)

```env
# Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 🔒 Security Configuration

### Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Premium users - users can only access their own data
    match /premium_users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User usage - users can only access their own usage data
    match /user_usage/{usageId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Credit transactions - users can only access their own transactions
    match /credit_transactions/{transactionId} {
      allow read: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }

    // Wishes - users can read public wishes, write their own
    match /wishes/{wishId} {
      allow read: if resource.data.isPublic == true ||
        (request.auth != null && request.auth.uid == resource.data.createdBy);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        request.auth.uid == resource.data.createdBy;
    }

    // Templates - public read, admin write
    match /templates/{templateId} {
      allow read: if resource.data.isPublic == true;
      allow write: if request.auth != null &&
        request.auth.token.email in ['admin@yourdomain.com'];
    }
  }
}
```

### Required Firebase Indexes

```javascript
// Collection: wishes
// Fields: createdBy (Ascending), createdAt (Descending)

// Collection: wishes
// Fields: isPublic (Ascending), createdAt (Descending)

// Collection: credit_transactions
// Fields: userId (Ascending), createdAt (Descending)

// Collection: user_usage
// Fields: userId (Ascending), month (Ascending)
```

## 🚀 Deployment Steps

### 1. Staging Deployment

```bash
# 1. Create staging branch
git checkout -b staging

# 2. Set staging environment variables
# Configure staging Firebase project
# Set NODE_ENV=staging

# 3. Deploy to staging
npm run build
npm run start

# 4. Run tests
npm run test
npm run test:e2e

# 5. Manual testing
# - Test user registration/login
# - Test wish creation
# - Test premium features
# - Test credit system
# - Test admin features
```

### 2. Production Deployment

```bash
# 1. Merge staging to main
git checkout main
git merge staging

# 2. Set production environment variables
# Configure production Firebase project
# Set NODE_ENV=production

# 3. Deploy to production
npm run build
npm run start

# 4. Verify deployment
# - Check all pages load correctly
# - Verify Firebase connections
# - Test critical user flows
# - Monitor error rates
```

## 📊 Post-Deployment Monitoring

### Key Metrics to Monitor

- [ ] Application error rates
- [ ] Firebase connection success rates
- [ ] User authentication success rates
- [ ] Credit transaction success rates
- [ ] Page load times
- [ ] API response times
- [ ] Database query performance

### Alerts to Set Up

- [ ] High error rate alerts
- [ ] Payment processing failure alerts
- [ ] Credit balance discrepancy alerts
- [ ] Database connection failure alerts
- [ ] Authentication failure rate alerts

### Health Checks

- [ ] Application health endpoint
- [ ] Database connectivity check
- [ ] Firebase connectivity check
- [ ] External service dependency checks

## 🔄 Rollback Plan

### Quick Rollback Steps

```bash
# 1. Revert to previous deployment
git checkout <previous-commit-hash>

# 2. Rebuild and redeploy
npm run build
npm run start

# 3. Verify rollback success
# - Check application functionality
# - Verify data integrity
# - Monitor error rates
```

### Data Recovery Plan

- [ ] Database backup strategy
- [ ] User data export procedures
- [ ] Credit balance recovery process
- [ ] Wish data recovery process

## 📝 Documentation

### Required Documentation

- [ ] API documentation
- [ ] User manual
- [ ] Admin guide
- [ ] Troubleshooting guide
- [ ] Support contact information

### Technical Documentation

- [ ] Architecture overview
- [ ] Database schema
- [ ] Security implementation
- [ ] Monitoring setup
- [ ] Deployment procedures

## 🎯 Success Criteria

### Functional Requirements

- [ ] Users can create and share wishes
- [ ] Premium credit system works correctly
- [ ] Admin features are accessible
- [ ] All templates load properly
- [ ] Authentication works seamlessly

### Performance Requirements

- [ ] Page load times < 3 seconds
- [ ] API response times < 1 second
- [ ] 99.9% uptime
- [ ] Error rate < 1%

### Security Requirements

- [ ] No unauthorized data access
- [ ] All API endpoints protected
- [ ] User data properly isolated
- [ ] No sensitive data in client-side code

## 🆘 Emergency Contacts

### Technical Support

- **Lead Developer**: [Contact Info]
- **DevOps Engineer**: [Contact Info]
- **Database Administrator**: [Contact Info]

### Business Support

- **Product Manager**: [Contact Info]
- **Customer Support**: [Contact Info]
- **Legal/Compliance**: [Contact Info]

---

**Last Updated**: [Date]
**Version**: 1.0
**Next Review**: [Date]
