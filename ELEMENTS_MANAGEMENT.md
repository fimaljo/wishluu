# Elements Management Guide

This document explains how to manage elements in the centralized elements system.

## Overview

All elements are centrally managed in `src/config/elements.ts`. This is the single source of truth for all elements in the application.

## File Structure

```
src/
├── config/
│   └── elements.ts          # Centralized elements configuration
├── types/
│   └── templates.ts         # TypeScript interfaces
└── features/templates/
    └── components/          # Components that use elements
```

## Adding New Elements

### 1. Define the Element

Add your new element to the `ELEMENT_DEFINITIONS` array in `src/config/elements.ts`:

```typescript
{
  id: 'my-new-element',
  type: 'animation', // 'animation' | 'text' | 'image' | 'sound' | 'interaction'
  name: 'My New Element',
  description: 'Description of what this element does',
  icon: '🎉',
  category: 'celebration', // 'basic' | 'birthday' | 'valentine' | 'celebration' | 'custom'
  isPremium: false, // Set to true for premium features
  tags: ['tag1', 'tag2', 'tag3'], // Optional tags for search
  properties: {
    // Default properties for this element
    property1: 'default value',
    property2: 100,
    // ... other properties
  },
  propertyDefinitions: [
    // Optional: Define how properties should be edited in the UI
    {
      name: 'property1',
      type: 'text',
      label: 'Property Label',
      defaultValue: 'default value',
      isPremium: false,
    },
    // ... other property definitions
  ],
}
```

### 2. Element Types

- **animation**: Moving/interactive elements (balloons, confetti, etc.)
- **text**: Text-based elements (titles, messages, etc.)
- **image**: Static or animated images
- **sound**: Audio elements (music, sound effects)
- **interaction**: Clickable/interactive elements

### 3. Categories

- **basic**: Essential elements for any wish
- **birthday**: Birthday-specific elements
- **valentine**: Romantic/love elements
- **celebration**: Party/celebration elements
- **custom**: Custom or special elements

## Helper Functions

The elements system provides several helper functions:

```typescript
import {
  getAllElements,
  getElementById,
  getElementsByCategory,
  getElementsByType,
  getPremiumElements,
  getFreeElements,
  searchElements,
  getRecommendedElements,
  // ... other functions
} from '@/config/elements';

// Get all elements
const allElements = getAllElements();

// Get element by ID
const element = getElementById('balloons-interactive');

// Get elements by category
const birthdayElements = getElementsByCategory('birthday');

// Search elements
const searchResults = searchElements('balloon');

// Get recommended elements for context
const recommended = getRecommendedElements('birthday');
```

## Property Definitions

For elements that need custom UI controls, define `propertyDefinitions`:

```typescript
propertyDefinitions: [
  {
    name: 'title',
    type: 'text',
    label: 'Title',
    defaultValue: 'Happy Birthday!',
    isPremium: false,
  },
  {
    name: 'titleColor',
    type: 'color',
    label: 'Title Color',
    defaultValue: '#FF6B9D',
    isPremium: false,
  },
  {
    name: 'titleSize',
    type: 'range',
    label: 'Title Size',
    defaultValue: 48,
    min: 24,
    max: 96,
    step: 1,
    isPremium: false,
  },
  {
    name: 'titleFont',
    type: 'select',
    label: 'Title Font',
    defaultValue: 'playfair',
    isPremium: false,
    options: [
      { value: 'inter', label: 'Inter' },
      { value: 'poppins', label: 'Poppins' },
      // ... more options
    ],
  },
  {
    name: 'gradient',
    type: 'checkbox',
    label: 'Enable Gradient',
    defaultValue: false,
    isPremium: true, // Premium feature
    premiumLabel: 'Premium',
    upgradeMessage: 'Unlock gradient text effects',
  },
];
```

## Property Types

- **text**: Text input
- **color**: Color picker
- **range**: Slider with min/max values
- **select**: Dropdown with options
- **checkbox**: Boolean toggle
- **number**: Numeric input
- **file**: File upload

## Premium Features

To mark a property as premium:

```typescript
{
  name: 'premiumFeature',
  type: 'select',
  label: 'Premium Feature',
  defaultValue: 'basic',
  isPremium: true,
  premiumLabel: 'Premium',
  upgradeMessage: 'Upgrade to unlock this feature',
  options: [
    { value: 'basic', label: 'Basic' },
    { value: 'premium', label: 'Premium', isPremium: true },
  ],
}
```

## Best Practices

1. **Use descriptive IDs**: Make element IDs clear and unique
2. **Add tags**: Include relevant tags for better search functionality
3. **Set appropriate categories**: Choose the right category for your element
4. **Define properties**: Always define default properties
5. **Add property definitions**: For complex elements, define how properties should be edited
6. **Test thoroughly**: Test your element in the builder before releasing

## Example: Adding a New Animation Element

```typescript
{
  id: 'fireworks-animation',
  type: 'animation',
  name: 'Fireworks Display',
  description: 'Colorful fireworks animation for celebrations',
  icon: '🎆',
  category: 'celebration',
  isPremium: true,
  tags: ['fireworks', 'celebration', 'animation', 'colorful', 'night'],
  properties: {
    fireworkCount: 10,
    fireworkColors: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#FFD700'],
    animationDuration: 8000,
    autoStart: true,
    fireworkSize: 20,
    explosionRadius: 100,
    transition: 'fade',
    zIndex: 5,
  },
  propertyDefinitions: [
    {
      name: 'fireworkCount',
      type: 'range',
      label: 'Number of Fireworks',
      defaultValue: 10,
      min: 1,
      max: 50,
      step: 1,
      isPremium: false,
    },
    {
      name: 'fireworkColors',
      type: 'color',
      label: 'Firework Colors',
      defaultValue: '#FF6B9D',
      isPremium: false,
    },
    {
      name: 'autoStart',
      type: 'checkbox',
      label: 'Auto Start Animation',
      defaultValue: true,
      isPremium: false,
    },
  ],
}
```

## Migration from Old System

If you have elements defined elsewhere:

1. Move element definitions to `src/config/elements.ts`
2. Update imports to use the centralized functions
3. Remove duplicate element definitions
4. Test that all elements work correctly

## Troubleshooting

### Element not showing up

- Check that the element is properly added to `ELEMENT_DEFINITIONS`
- Verify the category is correct
- Ensure `isPremium` is set appropriately for your user

### Properties not working

- Check that properties are defined in the `properties` object
- Verify property definitions if using custom UI controls
- Test property validation

### Search not finding elements

- Add relevant tags to your element
- Check that the search term matches element name, description, or tags
- Verify the search function is being called correctly
