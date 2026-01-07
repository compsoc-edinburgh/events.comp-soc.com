import type { CustomField } from '@events.comp-soc.com/shared'

export const DEFAULT_FIELDS: Array<CustomField> = [
  {
    id: `field-${Date.now()}-1`,
    type: 'input',
    label: 'University Email',
    required: true,
  },
  {
    id: `field-${Date.now()}-2`,
    type: 'select',
    label: 'University Year',
    required: true,
    options: ['1', '2', '3', '4', 'Masters', 'PhD'],
  },
  {
    id: `field-${Date.now()}-3`,
    type: 'select',
    label: 'Dietary Requirements',
    options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],
    required: true,
  },
]
