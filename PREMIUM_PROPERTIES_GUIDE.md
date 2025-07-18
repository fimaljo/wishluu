# Premium Properties Management Guide

This guide explains how to manage premium element properties in the credit-based system, including premium fonts, animations, and other premium features.

## Overview

The system now supports property-level credit costs, allowing you to charge credits for specific premium features within elements. This provides more granular control over monetization while keeping basic elements free.

## How It Works

### 1. Property-Level Credit Costs

Elements can have premium properties that cost additional credits:

- **Premium Fonts**: Special fonts like "Dancing Script", "Pacifico", etc. (0.5 credits each)
- **Premium Animations**: Advanced animations like "3D Flip", "Typewriter", etc. (1 credit each)
- **Premium Features**: Effects like gradients, shadows, etc. (0.25-0.5 credits each)

### 2. Credit Calculation

The system calculates total credit costs as:

```
Total Cost = Element Base Cost + Sum of Premium Property Costs
```

### 3. Credit Deduction

Credits are deducted when saving wishes:

- **Template-based wishes**: Only template cost is deducted
- **Custom wishes**: Element costs + premium property costs are deducted

## Configuration

### Adding Premium Properties

To add premium properties to elements, update the element definitions in `src/config/elements.ts`:

```typescript
{
  id: 'beautiful-text',
  type: 'text',
  name: 'Beautiful Text',
  creditCost: 2, // Base element cost
  propertyDefinitions: [
    {
      name: 'titleFont',
      type: 'select',
      label: 'Title Font',
      defaultValue: 'playfair',
      options: [
        { value: 'inter', label: 'Inter' }, // Free
        { value: 'dancing', label: 'Dancing Script', creditCost: 0.5 }, // Premium
        { value: 'pacifico', label: 'Pacifico', creditCost: 0.5 }, // Premium
      ],
    },
    {
      name: 'animation',
      type: 'select',
      label: 'Animation',
      defaultValue: 'fade-in',
      options: [
        { value: 'fade-in', label: 'Fade In' }, // Free
        { value: 'flip', label: '3D Flip', creditCost: 1 }, // Premium
        { value: 'typewriter', label: 'Typewriter', creditCost: 1 }, // Premium
      ],
    },
    {
      name: 'gradient',
      type: 'checkbox',
      label: 'Enable Gradient',
      defaultValue: false,
      creditCost: 0.5, // Premium feature
    },
  ],
}
```

### Premium Property Types

#### 1. Premium Options in Select Properties

```typescript
{
  name: 'font',
  type: 'select',
  options: [
    { value: 'inter', label: 'Inter' }, // Free
    { value: 'dancing', label: 'Dancing Script', creditCost: 0.5 }, // Premium
  ],
}
```

#### 2. Premium Checkbox Properties

```typescript
{
  name: 'gradient',
  type: 'checkbox',
  label: 'Enable Gradient',
  defaultValue: false,
  creditCost: 0.5, // Costs 0.5 credits when enabled
}
```

#### 3. Premium Range Properties

```typescript
{
  name: 'quality',
  type: 'range',
  label: 'Quality Level',
  defaultValue: 1,
  min: 1,
  max: 3,
  step: 1,
  creditCost: 0.25, // Costs 0.25 credits per level above 1
}
```

## Credit Calculator

The `src/lib/creditCalculator.ts` file provides utilities for calculating credit costs:

### Functions

- `calculateTotalCreditCost(elements)`: Calculate total cost for multiple elements
- `calculateElementCreditCost(element)`: Calculate cost for a single element
- `getPremiumProperties(element)`: Get list of premium properties for an element
- `hasPremiumProperties(element)`: Check if element has premium properties

### Usage

```typescript
import {
  calculateTotalCreditCost,
  getPremiumProperties,
} from '@/lib/creditCalculator';

// Calculate total cost for a wish
const elements = [
  /* wish elements */
];
const breakdown = calculateTotalCreditCost(elements);
console.log(`Total cost: ${breakdown.totalCost} credits`);

// Get premium properties for an element
const premiumProps = getPremiumProperties(element);
premiumProps.forEach(prop => {
  console.log(
    `${prop.propertyName}: ${prop.propertyValue} (${prop.cost} credits)`
  );
});
```

## UI Components

### Credit Cost Display

Use the `CreditCostDisplay` component to show credit costs:

```typescript
import { CreditCostDisplay } from '@/components/ui/CreditCostDisplay';

<CreditCostDisplay
  elements={elements}
  showBreakdown={true}
/>
```

### Premium Property Badge

Use the `PremiumPropertyBadge` component to show individual premium properties:

```typescript
import { PremiumPropertyBadge } from '@/components/ui/CreditCostDisplay';

<PremiumPropertyBadge
  propertyName="Font"
  propertyValue="Dancing Script"
  cost={0.5}
/>
```

## Admin Management

### Template Credit Costs

Admins can set credit costs for templates in the admin panel:

1. Go to `/admin/templates/create` or `/admin/templates/edit/[id]`
2. Set the "Credit Cost" field for the template
3. Save the template

### Element Credit Costs

Element credit costs are managed in the element definitions:

1. Edit `src/config/elements.ts`
2. Update `creditCost` for base element cost
3. Add `creditCost` to property options or properties
4. Deploy changes

## Best Practices

### 1. Pricing Strategy

- **Free Elements**: Basic functionality should be free
- **Premium Properties**: Advanced features should cost credits
- **Reasonable Costs**: Keep individual property costs low (0.25-1 credit)
- **Bundling**: Consider bundling related premium features

### 2. User Experience

- **Clear Indicators**: Always show credit costs before users make changes
- **Immediate Feedback**: Update credit calculations in real-time
- **Transparent Pricing**: Show breakdown of costs
- **Graceful Degradation**: Provide free alternatives when possible

### 3. Technical Implementation

- **Validation**: Always validate credit costs before saving
- **Error Handling**: Handle insufficient credits gracefully
- **Caching**: Cache credit calculations for performance
- **Testing**: Test credit calculations thoroughly

## Examples

### Premium Font Example

```typescript
// Element with premium fonts
{
  id: 'beautiful-text',
  creditCost: 2,
  propertyDefinitions: [
    {
      name: 'titleFont',
      type: 'select',
      options: [
        { value: 'inter', label: 'Inter' },
        { value: 'dancing', label: 'Dancing Script', creditCost: 0.5 },
        { value: 'pacifico', label: 'Pacifico', creditCost: 0.5 },
      ],
    },
  ],
}
```

### Premium Animation Example

```typescript
// Element with premium animations
{
  id: 'animated-text',
  creditCost: 1,
  propertyDefinitions: [
    {
      name: 'animation',
      type: 'select',
      options: [
        { value: 'fade-in', label: 'Fade In' },
        { value: 'slide-up', label: 'Slide Up' },
        { value: 'flip', label: '3D Flip', creditCost: 1 },
        { value: 'typewriter', label: 'Typewriter', creditCost: 1 },
      ],
    },
  ],
}
```

### Premium Feature Example

```typescript
// Element with premium features
{
  id: 'enhanced-text',
  creditCost: 1,
  propertyDefinitions: [
    {
      name: 'gradient',
      type: 'checkbox',
      label: 'Enable Gradient',
      creditCost: 0.5,
    },
    {
      name: 'shadow',
      type: 'checkbox',
      label: 'Enable Shadow',
      creditCost: 0.25,
    },
  ],
}
```

## Future Enhancements

### Planned Features

1. **Dynamic Pricing**: Adjust credit costs based on user tier
2. **Bulk Discounts**: Discounts for multiple premium properties
3. **Trial Periods**: Free access to premium properties for new users
4. **Usage Analytics**: Track which premium properties are most popular
5. **A/B Testing**: Test different pricing strategies

### Extension Points

The system is designed to be easily extensible:

- Add new property types with credit costs
- Implement custom credit calculation logic
- Create new UI components for different property types
- Add server-side validation for credit costs

## Troubleshooting

### Common Issues

1. **Credits not deducted**: Check credit calculation logic and API calls
2. **Wrong credit costs**: Verify property definitions and calculation functions
3. **UI not updating**: Ensure credit calculations are triggered on property changes
4. **Performance issues**: Cache credit calculations and optimize calculations

### Debug Tools

Use the credit calculator functions to debug issues:

```typescript
// Debug credit calculation
const breakdown = calculateTotalCreditCost(elements);
console.log('Credit breakdown:', breakdown);

// Check premium properties
const premiumProps = getPremiumProperties(element);
console.log('Premium properties:', premiumProps);
```

This system provides a flexible and scalable way to monetize premium features while maintaining a good user experience.
