import { v4 as uuidv4 } from 'uuid';
import { Achievement, HabitStats, UserProgress } from '../models/Progress';
import { Habit, HabitCompletion } from '../models/Habit';

/**
 * Service for managing user progress and achievements
 */
export class ProgressService {
  private readonly PROGRESS_STORAGE_KEY = 'user_progress';
  private readonly ACHIEVEMENTS_STORAGE_KEY = 'achievements';

  // Default achievements that users can earn
  private readonly DEFAULT_ACHIEVEMENTS: Achievement[] = [
    {
      id: 'first-habit',
      name: 'Starting Fresh',
      description: 'Create your first habit',
      icon: '🌱',
      isUnlocked: false,
      requirement: {
        type: 'habits',
        value: 1
      }
    },
    {
      id: 'habit-collector',
      name: 'Habit Collector',
      description: 'Create 5 different habits',
      icon: '📚',
      isUnlocked: false,
      requirement: {
        type: 'habits',
        value: 5
      }
    },
    {
      id: 'first-completion',
      name: 'First Step',
      description: 'Complete a habit for the first time',
      icon: '👣',
      isUnlocked: false,
      requirement: {
        type: 'completions',
        value: 1
      }
    },
    {
      id: 'streak-3',
      name: 'Consistency',
      description: 'Achieve a 3-day streak on any habit',
      icon: '🔥',
      isUnlocked: false,
      requirement: {
        type: 'streak',
        value: 3
      }
    },
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Achieve a 7-day streak on any habit',
      icon: '🏆',
      isUnlocked: false,
      requirement: {
        type: 'streak',
        value: 7
      }
    },
    {
      id: 'streak-30',
      name: 'Monthly Master',
      description: 'Achieve a 30-day streak on any habit',
      icon: '👑',
      isUnlocked: false,
      requirement: {
        type: 'streak',
        value: 30
      }
    },
    {
      id: 'completions-10',
      name: 'Dedicated',
      description: 'Complete habits 10 times in total',
      icon: '⭐',
      isUnlocked: false,
      requirement: {
        type: 'completions',
        value: 10
      }
    },
    {
      id: 'completions-50',
      name: 'Habit Pro',
      description: 'Complete habits 50 times in total',
      icon: '🌟',
      isUnlocked: false,
      requirement: {
        type: 'completions',
        value: 50
      }
    },
    {
      id: 'completions-100',
      name: 'Habit Master',
      description: 'Complete habits 100 times in total',
      icon: '💫',
      isUnlocked: false,
      requirement: {
        type: 'completions',
        value: 100
      }
    }
  ];

  /**
   * Initialize user progress if it doesn't exist
   */
  initializeProgress(): UserProgress {
    const progress = this.getUserProgress();
    
    if (progress) {
      return progress;
    }

    const newProgress: UserProgress = {
      totalHabits: 0,
      activeHabits: 0,
      totalCompletions: 0,
      achievements: this.DEFAULT_ACHIEVEMENTS,
      habitStats: {},
      joinDate: new Date()
    };

    this.saveUserProgress(newProgress);
    return newProgress;
  }

  /**
   * Get user progress
   */
  getUserProgress(): UserProgress | null {
    const progressJson = localStorage.getItem(this.PROGRESS_STORAGE_KEY);
    
    if (!progressJson) {
      return null;
    }
    
    try {
      const progress = JSON.parse(progressJson) as UserProgress;
      
      // Convert string dates back to Date objects
      progress.joinDate = new Date(progress.joinDate);
      
      progress.achievements = progress.achievements.map(achievement => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
      }));
      
      // Convert dates in habitStats
      Object.keys(progress.habitStats).forEach(key => {
        const stat = progress.habitStats[key];
        progress.habitStats[key] = {
          ...stat,
          completionDates: stat.completionDates.map(date => new Date(date)),
          lastCompletedAt: stat.lastCompletedAt ? new Date(stat.lastCompletedAt) : undefined
        };
      });
      
      return progress;
    } catch (error) {
      console.error('Error parsing user progress:', error);
      return null;
    }
  }

  /**
   * Update progress when a habit is added
   */
  habitAdded(habit: Habit): Achievement[] {
    const progress = this.getUserProgress() || this.initializeProgress();
    
    // Update habit stats
    progress.totalHabits++;
    progress.activeHabits++;
    
    // Initialize stats for this habit
    progress.habitStats[habit.id] = {
      habitId: habit.id,
      habitName: habit.name,
      streak: 0,
      totalCompletions: 0,
      bestStreak: 0,
      completionDates: [],
      lastCompletedAt: undefined
    };
    
    // Check for achievements
    const unlockedAchievements = this.checkAchievements(progress);
    
    // Save updated progress
    this.saveUserProgress(progress);
    
    return unlockedAchievements;
  }

  /**
   * Update progress when a habit is completed
   */
  habitCompleted(habit: Habit, completion: HabitCompletion): Achievement[] {
    const progress = this.getUserProgress() || this.initializeProgress();
    
    // Update overall stats
    progress.totalCompletions++;
    
    // Update habit-specific stats
    const habitStat = progress.habitStats[habit.id] || {
      habitId: habit.id,
      habitName: habit.name,
      streak: 0,
      totalCompletions: 0,
      bestStreak: 0,
      completionDates: [],
      lastCompletedAt: undefined
    };
    
    habitStat.totalCompletions++;
    habitStat.streak = habit.streak;
    habitStat.bestStreak = Math.max(habitStat.bestStreak, habit.streak);
    habitStat.completionDates.push(completion.completedAt);
    habitStat.lastCompletedAt = completion.completedAt;
    
    progress.habitStats[habit.id] = habitStat;
    
    // Check for achievements
    const unlockedAchievements = this.checkAchievements(progress);
    
    // Save updated progress
    this.saveUserProgress(progress);
    
    return unlockedAchievements;
  }

  /**
   * Update progress when a habit is deleted
   */
  habitDeleted(habitId: string): void {
    const progress = this.getUserProgress();
    
    if (!progress) return;
    
    // Update counts
    progress.totalHabits--;
    progress.activeHabits--;
    
    // Remove habit-specific stats
    delete progress.habitStats[habitId];
    
    // Save updated progress
    this.saveUserProgress(progress);
  }

  /**
   * Check if any achievements are unlocked
   * Returns an array of newly unlocked achievements
   */
  private checkAchievements(progress: UserProgress): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    
    progress.achievements = progress.achievements.map(achievement => {
      // Skip already unlocked achievements
      if (achievement.isUnlocked) {
        return achievement;
      }
      
      let isUnlocked = false;
      
      switch (achievement.requirement.type) {
        case 'habits':
          isUnlocked = progress.totalHabits >= achievement.requirement.value;
          break;
        
        case 'completions':
          isUnlocked = progress.totalCompletions >= achievement.requirement.value;
          break;
        
        case 'streak':
          // Check if any habit has reached the required streak
          isUnlocked = Object.values(progress.habitStats).some(
            stat => stat.streak >= achievement.requirement.value
          );
          break;
        
        case 'custom':
          // For custom achievements, check specific habit if specified
          if (achievement.requirement.habitId) {
            const habitStat = progress.habitStats[achievement.requirement.habitId];
            isUnlocked = habitStat && habitStat.totalCompletions >= achievement.requirement.value;
          }
          break;
      }
      
      if (isUnlocked && !achievement.isUnlocked) {
        const unlockedAchievement = {
          ...achievement,
          isUnlocked: true,
          unlockedAt: new Date()
        };
        newlyUnlocked.push(unlockedAchievement);
        return unlockedAchievement;
      }
      
      return achievement;
    });
    
    // Save achievements separately for quick access
    if (newlyUnlocked.length > 0) {
      this.saveUserProgress(progress);
    }
    
    return newlyUnlocked;
  }

  /**
   * Get all unlocked achievements
   */
  getUnlockedAchievements(): Achievement[] {
    const progress = this.getUserProgress();
    
    if (!progress) {
      return [];
    }
    
    return progress.achievements.filter(achievement => achievement.isUnlocked);
  }

  /**
   * Get all available achievements (locked and unlocked)
   */
  getAllAchievements(): Achievement[] {
    const progress = this.getUserProgress();
    
    if (!progress) {
      return this.DEFAULT_ACHIEVEMENTS;
    }
    
    return progress.achievements;
  }

  /**
   * Get stats for a specific habit
   */
  getHabitStats(habitId: string): HabitStats | null {
    const progress = this.getUserProgress();
    
    if (!progress || !progress.habitStats[habitId]) {
      return null;
    }
    
    return progress.habitStats[habitId];
  }

  /**
   * Save user progress to localStorage
   */
  private saveUserProgress(progress: UserProgress): void {
    localStorage.setItem(this.PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }
}
