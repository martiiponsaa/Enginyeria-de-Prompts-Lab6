/**
 * Represents a habit that a user wants to track
 */
export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  customFrequency?: number; // Number of days if custom frequency
  createdAt: Date;
  lastCompleted?: Date;
  streak: number; // Current streak of completions
  color?: string; // Optional color for UI customization
}

/**
 * Represents a completed habit instance
 */
export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: Date;
  notes?: string;
}
