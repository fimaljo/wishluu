# Ads Setup Guide for WishLuu

This guide explains how to set up and configure the advertising system in your WishLuu application.

## 🚀 Quick Setup

### 1. Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Ads System
NEXT_PUBLIC_ADS_ENABLED=true
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX

# Google AdSense Ad Unit IDs (Optional - for specific ad units)
NEXT_PUBLIC_ADS_HEADER_UNIT_ID=1234567890
NEXT_PUBLIC_ADS_SIDEBAR_UNIT_ID=1234567891
NEXT_PUBLIC_ADS_CONTENT_UNIT_ID=1234567892
NEXT_PUBLIC_ADS_FOOTER_UNIT_ID=1234567893
NEXT_PUBLIC_ADS_MOBILE_UNIT_ID=1234567894
NEXT_PUBLIC_ADS_STICKY_UNIT_ID=1234567895
```

### 2. Install Dependencies

The ads system requires these packages (already added to package.json):

```bash
npm install react-adsense react-google-adsense
```

## 📊 Ad Units Configuration

The system comes with 6 predefined ad units:

### Header Banner

- **Position**: Top of page
- **Format**: Banner
- **Pages**: Home, Dashboard, Templates, Wishes
- **Devices**: All

### Sidebar Advertisement

- **Position**: Sidebar
- **Format**: Rectangle
- **Pages**: Dashboard, Templates, Wishes
- **Devices**: Desktop only

### Content Inline Ad

- **Position**: Within content
- **Format**: Rectangle
- **Pages**: Wishes, Templates
- **Frequency**: Once per session
- **Devices**: All

### Footer Banner

- **Position**: Bottom of page
- **Format**: Leaderboard
- **Pages**: Home, About, Contact
- **Devices**: All

### Mobile Banner

- **Position**: Bottom
- **Format**: Banner
- **Pages**: All
- **Devices**: Mobile only
- **Frequency**: 2 per session

### Sticky Bottom Ad

- **Position**: Fixed bottom
- **Format**: Banner
- **Pages**: Wishes, Templates
- **Devices**: Mobile only
- **Frequency**: Once per day

## 🔧 Google AdSense Setup

### 1. Create AdSense Account

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Sign in with your Google account
3. Complete the application process
4. Wait for approval (usually 1-2 weeks)

### 2. Get Your Publisher ID

1. In AdSense dashboard, go to **Settings** → **Account**
2. Copy your **Publisher ID** (starts with `ca-pub-`)
3. Add it to your environment variables

### 3. Create Ad Units

1. Go to **Ads** → **By ad unit**
2. Click **Create new ad unit**
3. Choose ad format and size
4. Copy the ad unit ID
5. Add to environment variables

### 4. Configure Ad Units

For each ad unit, you'll need:

- **Ad Unit ID**: The unique identifier from AdSense
- **Ad Slot**: A descriptive name for the placement
- **Format**: Banner, Rectangle, Leaderboard, etc.

## 🎯 Ad Placement Strategy

### Recommended Placement Strategy

1. **Header Banner**: High visibility, good for brand awareness
2. **Sidebar Ads**: Non-intrusive, good for desktop users
3. **Content Inline**: Contextual, higher engagement
4. **Footer Banner**: Good for mobile users
5. **Mobile Banners**: Optimized for mobile experience
6. **Sticky Bottom**: High visibility on mobile

### Frequency Limits

- **Once per session**: Content inline ads
- **Once per day**: Sticky bottom ads
- **Multiple per session**: Header, sidebar, footer
- **Device-specific**: Mobile vs desktop targeting

## 📈 Analytics & Monitoring

### Available Metrics

- **Impressions**: Number of times ads were displayed
- **Clicks**: Number of ad clicks
- **CTR**: Click-through rate
- **Revenue**: Total ad revenue
- **RPM**: Revenue per thousand impressions

### Admin Dashboard

Access the ads admin dashboard at `/admin/ads` to view:

- Real-time analytics
- Performance metrics
- User preferences
- Ad blocker detection

## 🛡️ Ad Blocker Detection

The system includes automatic ad blocker detection:

- **Detection Method**: Attempts to load test ad file
- **Fallback**: Shows message asking users to disable ad blocker
- **Analytics**: Tracks ad blocker usage

### Test Ad File

The system uses `/public/ads/test-ad.js` for detection:

```javascript
// Test ad file for ad blocker detection
console.log('Ad test file loaded successfully');
```

## 👥 User Preferences

Users can control their ad experience:

### Available Settings

- **Show Advertisements**: Enable/disable all ads
- **Personalized Ads**: Allow interest-based ads
- **Analytics**: Share usage data for improvements

### Premium User Exemption

Premium users are automatically exempt from ads:

- No ads shown to premium users
- Better user experience for paying customers
- Encourages premium upgrades

## 🔄 Revenue Sharing

The system supports revenue sharing with users:

### Configuration

```typescript
export const REVENUE_SHARING = {
  enabled: true,
  premiumUserShare: 0.1, // 10% for premium users
  freeUserShare: 0.05, // 5% for free users
  minimumPayout: 1.0, // $1 minimum payout
};
```

### Implementation

- Track user contributions to ad revenue
- Calculate payouts based on engagement
- Provide payout system for users

## 🧪 Testing

### Test Mode

In development, the system shows test ads:

- Colorful test ad placeholders
- No real ads served
- Easy to identify ad placements

### Production Testing

1. Set `NEXT_PUBLIC_ADS_ENABLED=true`
2. Add real AdSense publisher ID
3. Test on different devices
4. Monitor analytics

## 📱 Mobile Optimization

### Responsive Design

- Ads automatically resize for mobile
- Touch-friendly ad placements
- Optimized loading for mobile networks

### Mobile-Specific Features

- Sticky bottom ads for mobile
- Reduced ad frequency on mobile
- Mobile-optimized ad formats

## 🔒 Privacy & Compliance

### GDPR Compliance

- User consent for personalized ads
- Analytics opt-out option
- Transparent data usage

### COPPA Compliance

- No personalized ads for children
- Age verification system
- Safe ad content

## 🚨 Troubleshooting

### Common Issues

1. **Ads not showing**
   - Check environment variables
   - Verify AdSense approval
   - Check ad blocker detection

2. **Low revenue**
   - Optimize ad placements
   - Improve user engagement
   - Test different ad formats

3. **High bounce rate**
   - Reduce ad frequency
   - Improve ad relevance
   - Test different placements

### Debug Tools

- Browser developer tools
- AdSense diagnostics
- Analytics dashboard
- Console logging

## 📚 Additional Resources

- [Google AdSense Help](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [AdSense Optimization](https://support.google.com/adsense/answer/6167117)

## 🎉 Success Metrics

Track these metrics for success:

- **Revenue per user**: $0.50 - $2.00
- **CTR**: 0.5% - 2.0%
- **RPM**: $1.00 - $5.00
- **User retention**: No significant drop
- **Premium conversions**: Maintain or increase

This ads system provides a comprehensive monetization solution while maintaining a good user experience.
