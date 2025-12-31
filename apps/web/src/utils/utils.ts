import { twMerge } from 'tailwind-merge'

type ClassValue = string | number | boolean | undefined | null

export function cn(...inputs: Array<ClassValue>): string {
  return twMerge(inputs.filter(Boolean).join(' '))
}
