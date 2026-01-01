import { twMerge } from 'tailwind-merge'
import type { ClassNameValue } from 'tailwind-merge'

export function cn(...inputs: Array<ClassNameValue>): string {
  return twMerge(inputs.filter(Boolean).join(' '))
}
