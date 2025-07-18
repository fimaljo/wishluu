import { WishElement } from '@/types/templates';
import { ELEMENT_DEFINITIONS } from '@/config/elements';

export interface CreditBreakdown {
  elementCost: number;
  propertyCosts: { [propertyName: string]: number };
  totalCost: number;
  details: {
    elementName: string;
    elementCost: number;
    premiumProperties: Array<{
      propertyName: string;
      propertyValue: string;
      cost: number;
    }>;
  }[];
}

/**
 * Calculate the total credit cost for a list of elements including their properties
 */
export function calculateTotalCreditCost(
  elements: WishElement[]
): CreditBreakdown {
  let totalElementCost = 0;
  let totalPropertyCost = 0;
  const details: CreditBreakdown['details'] = [];

  elements.forEach(element => {
    const elementDef = ELEMENT_DEFINITIONS.find(
      e => e.id === element.elementType
    );
    if (!elementDef) return;

    const elementCost = elementDef.creditCost || 0;
    totalElementCost += elementCost;

    const elementDetails = {
      elementName: elementDef.name,
      elementCost,
      premiumProperties: [] as Array<{
        propertyName: string;
        propertyValue: string;
        cost: number;
      }>,
    };

    // Calculate property costs
    if (elementDef.propertyDefinitions) {
      elementDef.propertyDefinitions.forEach(propDef => {
        const currentValue = element.properties[propDef.name];

        // Check if this property has premium options
        if (propDef.options) {
          const selectedOption = propDef.options.find(
            opt => opt.value === currentValue
          );
          if (selectedOption?.creditCost && selectedOption.creditCost > 0) {
            totalPropertyCost += selectedOption.creditCost;
            elementDetails.premiumProperties.push({
              propertyName: propDef.label,
              propertyValue: selectedOption.label,
              cost: selectedOption.creditCost,
            });
          }
        }

        // Check if the property itself has a credit cost
        if (propDef.creditCost && propDef.creditCost > 0) {
          totalPropertyCost += propDef.creditCost;
          elementDetails.premiumProperties.push({
            propertyName: propDef.label,
            propertyValue: 'Enabled',
            cost: propDef.creditCost,
          });
        }
      });
    }

    // Check for premium properties that might not be in propertyDefinitions
    // (like custom properties that are set programmatically)
    Object.entries(element.properties).forEach(([key, value]) => {
      // Check for premium animations
      if (key === 'animation' && typeof value === 'string') {
        const animationCosts: { [key: string]: number } = {
          flip: 1,
          rotate: 1,
          typewriter: 1,
          '3d-flip': 1,
          'bounce-in': 0.5,
          'slide-in': 0.5,
        };

        if (animationCosts[value]) {
          totalPropertyCost += animationCosts[value];
          elementDetails.premiumProperties.push({
            propertyName: 'Animation',
            propertyValue: value,
            cost: animationCosts[value],
          });
        }
      }

      // Check for premium fonts
      if (
        (key === 'titleFont' || key === 'messageFont' || key === 'font') &&
        typeof value === 'string'
      ) {
        const premiumFonts: { [key: string]: number } = {
          dancing: 0.5,
          pacifico: 0.5,
          'great-vibes': 0.5,
          satisfy: 0.5,
          kaushan: 0.5,
          allura: 0.5,
        };

        if (premiumFonts[value]) {
          totalPropertyCost += premiumFonts[value];
          elementDetails.premiumProperties.push({
            propertyName: 'Font',
            propertyValue: value,
            cost: premiumFonts[value],
          });
        }
      }

      // Check for premium features
      if (key === 'gradient' && value === true) {
        totalPropertyCost += 0.5;
        elementDetails.premiumProperties.push({
          propertyName: 'Gradient',
          propertyValue: 'Enabled',
          cost: 0.5,
        });
      }

      if (key === 'shadow' && value === true) {
        totalPropertyCost += 0.25;
        elementDetails.premiumProperties.push({
          propertyName: 'Shadow',
          propertyValue: 'Enabled',
          cost: 0.25,
        });
      }
    });

    if (elementCost > 0 || elementDetails.premiumProperties.length > 0) {
      details.push(elementDetails);
    }
  });

  return {
    elementCost: totalElementCost,
    propertyCosts: { total: totalPropertyCost },
    totalCost: totalElementCost + totalPropertyCost,
    details,
  };
}

/**
 * Calculate credit cost for a single element
 */
export function calculateElementCreditCost(element: WishElement): number {
  const breakdown = calculateTotalCreditCost([element]);
  return breakdown.totalCost;
}

/**
 * Get a human-readable breakdown of credit costs
 */
export function getCreditBreakdownText(breakdown: CreditBreakdown): string {
  if (breakdown.totalCost === 0) {
    return 'Free';
  }

  const parts: string[] = [];

  if (breakdown.elementCost > 0) {
    parts.push(`${breakdown.elementCost} credits for elements`);
  }

  if (breakdown.propertyCosts.total && breakdown.propertyCosts.total > 0) {
    parts.push(`${breakdown.propertyCosts.total} credits for premium features`);
  }

  return parts.join(' + ');
}

/**
 * Check if an element has any premium properties
 */
export function hasPremiumProperties(element: WishElement): boolean {
  const breakdown = calculateTotalCreditCost([element]);
  return (breakdown.propertyCosts.total || 0) > 0;
}

/**
 * Get premium properties for an element
 */
export function getPremiumProperties(element: WishElement): Array<{
  propertyName: string;
  propertyValue: string;
  cost: number;
}> {
  const breakdown = calculateTotalCreditCost([element]);
  return breakdown.details[0]?.premiumProperties || [];
}

/**
 * Calculate credit cost for template mode (only premium properties, no base element costs)
 */
export function calculateTemplateCreditCost(
  elements: WishElement[]
): CreditBreakdown {
  let totalPropertyCost = 0;
  const details: CreditBreakdown['details'] = [];

  elements.forEach(element => {
    const elementDef = ELEMENT_DEFINITIONS.find(
      e => e.id === element.elementType
    );
    if (!elementDef) return;

    const elementDetails = {
      elementName: elementDef.name,
      elementCost: 0, // No base element cost in template mode
      premiumProperties: [] as Array<{
        propertyName: string;
        propertyValue: string;
        cost: number;
      }>,
    };

    // Calculate property costs only
    if (elementDef.propertyDefinitions) {
      elementDef.propertyDefinitions.forEach(propDef => {
        const currentValue = element.properties[propDef.name];

        // Check if this property has premium options
        if (propDef.options) {
          const selectedOption = propDef.options.find(
            opt => opt.value === currentValue
          );
          if (selectedOption?.creditCost && selectedOption.creditCost > 0) {
            totalPropertyCost += selectedOption.creditCost;
            elementDetails.premiumProperties.push({
              propertyName: propDef.label,
              propertyValue: selectedOption.label,
              cost: selectedOption.creditCost,
            });
          }
        }

        // Check if the property itself has a credit cost
        if (propDef.creditCost && propDef.creditCost > 0) {
          totalPropertyCost += propDef.creditCost;
          elementDetails.premiumProperties.push({
            propertyName: propDef.label,
            propertyValue: 'Enabled',
            cost: propDef.creditCost,
          });
        }
      });
    }

    // Check for premium properties that might not be in propertyDefinitions
    Object.entries(element.properties).forEach(([key, value]) => {
      // Check for premium animations
      if (key === 'animation' && typeof value === 'string') {
        const animationCosts: { [key: string]: number } = {
          flip: 1,
          rotate: 1,
          typewriter: 1,
          '3d-flip': 1,
          'bounce-in': 0.5,
          'slide-in': 0.5,
        };

        if (animationCosts[value]) {
          totalPropertyCost += animationCosts[value];
          elementDetails.premiumProperties.push({
            propertyName: 'Animation',
            propertyValue: value,
            cost: animationCosts[value],
          });
        }
      }

      // Check for premium fonts
      if (
        (key === 'titleFont' || key === 'messageFont' || key === 'font') &&
        typeof value === 'string'
      ) {
        const premiumFonts: { [key: string]: number } = {
          dancing: 0.5,
          pacifico: 0.5,
          'great-vibes': 0.5,
          satisfy: 0.5,
          kaushan: 0.5,
          allura: 0.5,
        };

        if (premiumFonts[value]) {
          totalPropertyCost += premiumFonts[value];
          elementDetails.premiumProperties.push({
            propertyName: 'Font',
            propertyValue: value,
            cost: premiumFonts[value],
          });
        }
      }

      // Check for premium features
      if (key === 'gradient' && value === true) {
        totalPropertyCost += 0.5;
        elementDetails.premiumProperties.push({
          propertyName: 'Gradient',
          propertyValue: 'Enabled',
          cost: 0.5,
        });
      }

      if (key === 'shadow' && value === true) {
        totalPropertyCost += 0.25;
        elementDetails.premiumProperties.push({
          propertyName: 'Shadow',
          propertyValue: 'Enabled',
          cost: 0.25,
        });
      }
    });

    if (elementDetails.premiumProperties.length > 0) {
      details.push(elementDetails);
    }
  });

  return {
    elementCost: 0, // No base element cost in template mode
    propertyCosts: { total: totalPropertyCost },
    totalCost: totalPropertyCost, // Only premium property costs
    details,
  };
}

/**
 * Calculate credit cost for a single element in template mode
 */
export function calculateTemplateElementCreditCost(
  element: WishElement
): number {
  const breakdown = calculateTemplateCreditCost([element]);
  return breakdown.totalCost;
}
