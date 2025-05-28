import { Habit, HabitCompletion } from '../models/Habit';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for managing habits
 */
export class HabitService {
  private readonly HABITS_STORAGE_KEY = 'habits';
  private readonly HABIT_COMPLETIONS_KEY = 'habit_completions';
  private readonly DELETED_HABITS_KEY = 'deleted_habits';
  
  /**
   * Get all habits
   */
  getHabits(): Habit[] {
    const habitsJson = localStorage.getItem(this.HABITS_STORAGE_KEY);
    if (!habitsJson) {
      return [];
    }
    
    try {
      const habits = JSON.parse(habitsJson) as Habit[];
      // Convert string dates back to Date objects
      return habits.map(habit => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        lastCompleted: habit.lastCompleted ? new Date(habit.lastCompleted) : undefined
      }));
    } catch (error) {
      console.error('Error parsing habits from localStorage:', error);
      return [];
    }
  }
  
  /**
   * Add a new habit
   */
  addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'streak'>): Habit {
    const habits = this.getHabits();
    
    const newHabit: Habit = {
      ...habit,
      id: uuidv4(),
      createdAt: new Date(),
      streak: 0
    };
    
    habits.push(newHabit);
    this.saveHabits(habits);
    
    // Save to deleted habits for undo functionality
    this.saveLastAction('add', newHabit);
    
    return newHabit;
  }
  
  /**
   * Update an existing habit
   */
  updateHabit(updatedHabit: Habit): Habit {
    const habits = this.getHabits();
    const oldHabit = habits.find(h => h.id === updatedHabit.id);
    
    if (!oldHabit) {
      throw new Error(`Habit with id ${updatedHabit.id} not found`);
    }
    
    // Save old habit for undo functionality
    this.saveLastAction('update', oldHabit);
    
    const updatedHabits = habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    
    this.saveHabits(updatedHabits);
    return updatedHabit;
  }
  
  /**
   * Delete a habit
   */
  deleteHabit(habitId: string): void {
    const habits = this.getHabits();
    const habitToDelete = habits.find(h => h.id === habitId);
    
    if (!habitToDelete) {
      throw new Error(`Habit with id ${habitId} not found`);
    }
    
    // Save deleted habit for undo functionality
    this.saveLastAction('delete', habitToDelete);
    
    const filteredHabits = habits.filter(habit => habit.id !== habitId);
    this.saveHabits(filteredHabits);
  }
  
  /**
   * Complete a habit
   */
  completeHabit(habitId: string, notes?: string): HabitCompletion {
    const habits = this.getHabits();
    const habitIndex = habits.findIndex(h => h.id === habitId);
    
    if (habitIndex === -1) {
      throw new Error(`Habit with id ${habitId} not found`);
    }
    
    const completedAt = new Date();
    const habit = habits[habitIndex];
    
    // Update streak and last completed date
    const updatedHabit = {
      ...habit,
      streak: habit.streak + 1,
      lastCompleted: completedAt
    };
    
    habits[habitIndex] = updatedHabit;
    this.saveHabits(habits);
    
    // Create and save completion record
    const completion: HabitCompletion = {
      id: uuidv4(),
      habitId,
      completedAt,
      notes
    };
    
    this.saveCompletion(completion);
    return completion;
  }
  
  /**
   * Undo last action
   * Returns a message about what was undone
   */
  undoLastAction(): string {
    const lastActionJson = localStorage.getItem(this.DELETED_HABITS_KEY);
    if (!lastActionJson) {
      return 'Nothing to undo';
    }
    
    try {
      const { action, habit } = JSON.parse(lastActionJson);
      
      switch (action) {
        case 'add':
          this.undoAdd(habit.id);
          return `Undid addition of habit "${habit.name}"`;
        
        case 'update':
          this.undoUpdate(habit);
          return `Undid update of habit "${habit.name}"`;
          
        case 'delete':
          this.undoDelete(habit);
          return `Restored deleted habit "${habit.name}"`;
          
        default:
          return 'Unknown action to undo';
      }
    } catch (error) {
      console.error('Error undoing last action:', error);
      return 'Failed to undo last action';
    }
  }
  
  private undoAdd(habitId: string): void {
    const habits = this.getHabits().filter(h => h.id !== habitId);
    this.saveHabits(habits);
    localStorage.removeItem(this.DELETED_HABITS_KEY);
  }
  
  private undoUpdate(originalHabit: Habit): void {
    const habits = this.getHabits();
    const updatedHabits = habits.map(h => 
      h.id === originalHabit.id ? originalHabit : h
    );
    this.saveHabits(updatedHabits);
    localStorage.removeItem(this.DELETED_HABITS_KEY);
  }
  
  private undoDelete(deletedHabit: Habit): void {
    const habits = this.getHabits();
    habits.push(deletedHabit);
    this.saveHabits(habits);
    localStorage.removeItem(this.DELETED_HABITS_KEY);
  }
  
  private saveHabits(habits: Habit[]): void {
    localStorage.setItem(this.HABITS_STORAGE_KEY, JSON.stringify(habits));
  }
  
  private saveCompletion(completion: HabitCompletion): void {
    const completionsJson = localStorage.getItem(this.HABIT_COMPLETIONS_KEY);
    let completions: HabitCompletion[] = [];
    
    if (completionsJson) {
      try {
        completions = JSON.parse(completionsJson);
      } catch (error) {
        console.error('Error parsing completions:', error);
      }
    }
    
    completions.push(completion);
    localStorage.setItem(this.HABIT_COMPLETIONS_KEY, JSON.stringify(completions));
  }
  
  private saveLastAction(action: 'add' | 'update' | 'delete', habit: Habit): void {
    localStorage.setItem(this.DELETED_HABITS_KEY, JSON.stringify({ action, habit }));
  }
}
