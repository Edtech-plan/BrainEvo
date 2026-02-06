/**
 * Calendar Utility Functions
 */

import type { LiveClass } from '@/shared/types';
import type { Assignment } from '@/shared/types';

/**
 * Get all days in a month
 */
export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Add days from previous month to fill the first week (starting from Monday)
  const startDay = firstDay.getDay();
  // Adjust: Monday = 1, so if day is 0 (Sunday), we need 6 days before, else day-1 days
  const daysBefore = startDay === 0 ? 6 : startDay - 1;
  for (let i = daysBefore; i > 0; i--) {
    const prevDate = new Date(year, month, -i + 1);
    days.push(prevDate);
  }

  // Add all days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  // Add days from next month to fill the last week
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    days.push(new Date(year, month + 1, day));
  }

  return days;
}

/**
 * Get week days for a given date (Monday to Sunday)
 */
export function getWeekDays(date: Date): Date[] {
  const weekDays: Date[] = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  // Adjust to Monday (day 1), where Sunday is 0
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days, else go to Monday
  startOfWeek.setDate(startOfWeek.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(startOfWeek);
    weekDay.setDate(startOfWeek.getDate() + i);
    weekDays.push(weekDay);
  }

  return weekDays;
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if two dates are the same day
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Format time from date
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get hour slots for day view
 */
export function getHourSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    slots.push(formatTime(time));
  }
  return slots;
}

/**
 * Get events for a specific date
 */
export function getEventsForDate(
  date: Date,
  liveClasses: LiveClass[],
  assignments: Assignment[]
): { liveClasses: LiveClass[]; assignments: Assignment[] } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dateStr = date.toISOString().split('T')[0];

  const classes = liveClasses.filter((lc) => {
    const scheduledAt = new Date(lc.scheduledAt);
    return scheduledAt.toISOString().split('T')[0] === dateStr;
  });

  const assignmentList = assignments.filter((a) => {
    if (!a.dueDate) return false;
    const dueDate = new Date(a.dueDate);
    return dueDate.toISOString().split('T')[0] === dateStr;
  });

  return { liveClasses: classes, assignments: assignmentList };
}
