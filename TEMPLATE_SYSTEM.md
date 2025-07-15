# Template System Documentation

## Overview

The WishLuu template system allows you (as the owner) to create predefined templates that users can choose from to create their interactive wishes. Templates are stored locally in the browser's localStorage, similar to how elements are managed. Users can customize these templates but cannot add new elements - they can only modify existing ones or remove elements they don't want.

## How It Works

### For Users (Template Mode)

1. **Template Selection**: Users browse templates at `/templates`
2. **Restricted Editing**: When using a template, users can:
   - Customize existing elements (colors, text, properties)
   - Remove elements they don't want
   - Cannot add new elements
   - Cannot change the template structure
3. **Save & Share**: Users can save their customized template as a wish

### For You (Owner/Admin)

1. **Template Management**: Access `/admin/templates` to manage templates
2. **Create Templates**: Define templates with default elements and properties
3. **Edit Templates**: Modify existing templates
4. **Delete Templates**: Remove templates you no longer want
5. **Export/Import**: Backup and restore templates
6. **Statistics**: View template usage and statistics

## Local Storage System

Templates are stored in the browser's localStorage with the following structure:

- **Storage Key**: `wishluu_templates`
- **Version Key**: `wishluu_templates_version`
- **Backup System**: Automatic backups with timestamp
- **Migration**: Version-based data migration support

### Default Templates

The system starts with one default template:

- **Custom Wish**: Empty canvas for full creative freedom

## Template Structure

Each template includes:

- **Basic Info**: Name, description, occasion, difficulty
- **Visual**: Thumbnail emoji, color gradient
- **Elements**: List of element types included
- **Default Elements**: Pre-configured elements with properties

## Managing Templates

### Creating a New Template

1. Go to `/admin/templates`
2. Click "Create Template"
3. Fill in the form:
   - **Name**: Template name (e.g., "Mother's Day Flowers")
   - **Description**: What the template is for
   - **Thumbnail**: Emoji representation (e.g., "🌷")
   - **Occasion**: Category (birthday, valentine, celebration, custom)
   - **Difficulty**: Easy, Medium, Hard, Expert
   - **Color**: Gradient color scheme
4. Click "Create Template"

### Editing Templates

1. Go to `/admin/templates`
2. Click "Edit" on any template
3. Modify the properties
4. Click "Update Template"

### Template Configuration

Templates are now managed through the admin interface at `/admin/templates`. You can:

1. **Create Templates**: Use the "Create Template" button
2. **Configure Elements**: Use the element configuration panel
3. **Export/Import**: Use the export button to backup templates
4. **View Statistics**: Use the stats button to see template analytics

### Local Storage Management

The `TemplateService` class provides comprehensive template management:

```typescript
// Get all templates
const templates = TemplateService.getAllTemplates();

// Create a new template
const newTemplate = TemplateService.createTemplate({
  name: 'My Template',
  description: 'A custom template',
  occasion: 'birthday',
  // ... other properties
});

// Update a template
TemplateService.updateTemplate(templateId, updates);

// Delete a template
TemplateService.deleteTemplate(templateId);

// Export templates
const json = TemplateService.exportTemplates();

// Import templates
TemplateService.importTemplates(jsonData);
```

## Available Elements

### Interactive Balloons

- **Type**: `balloons-interactive`
- **Properties**: Number of balloons, colors, size, animation, hints

### Beautiful Text

- **Type**: `beautiful-text`
- **Properties**: Title, message, fonts, colors, sizes, alignment

## Best Practices

### Template Design

1. **Keep it Simple**: Start with 1-2 elements for easy templates
2. **Meaningful Defaults**: Set good default values for properties
3. **Clear Purpose**: Make templates specific to occasions
4. **Visual Appeal**: Choose attractive color schemes and emojis

### User Experience

1. **Clear Instructions**: Use descriptive names and descriptions
2. **Flexible Customization**: Allow users to modify key properties
3. **Consistent Structure**: Keep similar templates organized similarly

## Technical Implementation

### Files Structure

```
src/
├── config/
│   └── templates.ts          # Template definitions
├── types/
│   └── templates.ts          # Type definitions
├── app/
│   ├── templates/
│   │   └── page.tsx          # User template selection
│   ├── admin/
│   │   └── templates/
│   │       └── page.tsx      # Admin template management
│   └── wishes/
│       └── create/
│           └── [template]/
│               └── page.tsx  # Template builder
└── features/
    └── templates/
        └── components/
            ├── CustomWishBuilder.tsx  # Main builder
            └── ElementPalette.tsx     # Element selection
```

### Key Components

- **CustomWishBuilder**: Main builder with restricted mode
- **ElementPalette**: Shows template mode notice
- **Template Config**: Centralized template definitions
- **Admin Interface**: Template management UI

## Future Enhancements

1. **Template Categories**: More specific occasion categories
2. **Template Preview**: Visual previews in selection
3. **Template Analytics**: Usage statistics
4. **Template Sharing**: Allow users to share custom templates
5. **Advanced Elements**: More interactive elements
6. **Template Versioning**: Track template changes

## Support

For questions or issues with the template system:

1. Check this documentation
2. Review the template configuration
3. Test templates in different scenarios
4. Ensure proper element properties are set
