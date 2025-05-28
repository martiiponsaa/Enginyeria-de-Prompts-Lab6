import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Habit } from '../models/Habit';
import { Achievement } from '../models/Progress';
import { HabitService } from '../services/habit.service';
import { ProgressService } from '../services/progress.service';

interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak'>) => Habit;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  completeHabit: (habitId: string, notes?: string) => void;
  undoLastAction: () => string;
  notification: NotificationData | null;
  clearNotification: () => void;
  recentAchievements: Achievement[];
  allAchievements: Achievement[];
  getHabitStats: (habitId: string) => any; // Using any to simplify
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

interface HabitsProviderProps {
  children: ReactNode;
}

export const HabitsProvider: React.FC<HabitsProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  
  const habitService = new HabitService();
  const progressService = new ProgressService();
  
  // Load habits and initialize progress on initial render
  useEffect(() => {
    const loadedHabits = habitService.getHabits();
    setHabits(loadedHabits);
    
    // Initialize progress if needed
    progressService.initializeProgress();
    
    // Load achievements
    setAllAchievements(progressService.getAllAchievements());
  }, []);
  
  // Function to show notifications
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setNotification({ message, type });
    // Auto-clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const clearNotification = () => {
    setNotification(null);
  };
    // Habit management functions
  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'streak'>) => {
    const newHabit = habitService.addHabit(habitData);
    setHabits([...habits, newHabit]);
    
    // Update progress and check for achievements
    const unlockedAchievements = progressService.habitAdded(newHabit);
      if (unlockedAchievements.length > 0) {
      setRecentAchievements(unlockedAchievements);
      setAllAchievements(progressService.getAllAchievements());
      showNotification(`🎉 Achievement unlocked: ${unlockedAchievements[0].name}!`, 'info');
    } else {
      showNotification(`Habit "${newHabit.name}" added successfully!`, 'success');
    }
    
    return newHabit;
  };
  
  const updateHabit = (updatedHabit: Habit) => {    try {
      habitService.updateHabit(updatedHabit);
      setHabits(habits.map(habit => 
        habit.id === updatedHabit.id ? updatedHabit : habit
      ));
      showNotification(`Habit "${updatedHabit.name}" updated successfully!`, 'success');
    } catch (error) {
      console.error('Error updating habit:', error);
      showNotification('Error updating habit. Please try again.', 'error');
    }
  };
    const deleteHabit = (habitId: string) => {
    try {
      const habitToDelete = habits.find(h => h.id === habitId);
      if (!habitToDelete) return;
      
      habitService.deleteHabit(habitId);
      setHabits(habits.filter(habit => habit.id !== habitId));
        // Update progress
      progressService.habitDeleted(habitId);
      
      showNotification(`Habit "${habitToDelete.name}" deleted. You can undo this action.`, 'warning');
    } catch (error) {
      console.error('Error deleting habit:', error);
      showNotification('Error deleting habit. Please try again.', 'error');
    }
  };
    const completeHabit = (habitId: string, notes?: string) => {
    try {
      const completion = habitService.completeHabit(habitId, notes);
      
      // Update the habit in state with new streak and completion date
      const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
          return {
            ...habit,
            streak: habit.streak + 1,
            lastCompleted: new Date()
          };
        }
        return habit;
      });
      
      setHabits(updatedHabits);
      
      // Find the habit to pass to the progress service
      const completedHabit = updatedHabits.find(h => h.id === habitId);
      if (completedHabit) {
        // Update progress and check for achievements
        const unlockedAchievements = progressService.habitCompleted(completedHabit, completion);
          if (unlockedAchievements.length > 0) {
          setRecentAchievements(unlockedAchievements);
          setAllAchievements(progressService.getAllAchievements());
          showNotification(`🎉 Achievement unlocked: ${unlockedAchievements[0].name}!`, 'info');
        } else {
          showNotification('Great job! Habit completed!', 'success');
        }
      } else {
        showNotification('Great job! Habit completed!', 'success');
      }
    } catch (error) {
      console.error('Error completing habit:', error);
      showNotification('Error completing habit. Please try again.', 'error');
    }
  };
    const undoLastAction = () => {
    const message = habitService.undoLastAction();
    
    if (message.includes('Nothing') || message.includes('Failed')) {
      showNotification(message, 'warning');
    } else if (message.includes('Undid') || message.includes('Restored')) {
      showNotification(message, 'success');
    } else {
      showNotification(message, 'info');
    }
    
    // Refresh habits from storage after undo
    const refreshedHabits = habitService.getHabits();
    setHabits(refreshedHabits);
    
    return message;
  };
    // Get stats for a specific habit
  const getHabitStats = (habitId: string) => {
    return progressService.getHabitStats(habitId);
  };

  return (
    <HabitsContext.Provider 
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        completeHabit,
        undoLastAction,
        notification,
        clearNotification,
        recentAchievements,
        allAchievements,
        getHabitStats
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = (): HabitsContextType => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};
