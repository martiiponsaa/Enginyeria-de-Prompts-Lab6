/**
 * Types for the statistics and achievements feature
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  requirement: {
    type: 'streak' | 'completions' | 'habits' | 'custom';
    value: number;
    habitId?: string;  // For habit-specific achievements
  };
}

export interface HabitStats {
  habitId: string;
  habitName: string;
  streak: number;
  totalCompletions: number;
  bestStreak: number;
  completionDates: Date[];
  lastCompletedAt?: Date;
}

export interface UserProgress {
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  achievements: Achievement[];
  habitStats: Record<string, HabitStats>;
  joinDate: Date;
}
