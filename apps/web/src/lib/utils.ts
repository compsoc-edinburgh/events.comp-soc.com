import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function formatErrorMessage(message?: string) {
  return message || 'Something went wrong'
}

export function formatEventDate(date: Date | string) {
  const d = new Date(date)

  const datePart = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  const timePart = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return {
    date: datePart,
    time: timePart,
    full: `${datePart} - ${timePart}`,
  }
}

export function formatDateFilter(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`
}

export function isHistoricalEvent(date: Date | string, now = new Date()) {
  return new Date(date).getTime() < now.getTime()
}
