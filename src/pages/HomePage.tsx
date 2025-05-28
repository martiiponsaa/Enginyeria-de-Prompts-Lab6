import React from 'react';
import { Link } from 'react-router-dom';
import { useHabits } from '../contexts/HabitsContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Achievements from '../components/Achievements';
import { ProgressService } from '../services/progress.service';

const HomePage: React.FC = () => {
  const { habits, notification } = useHabits();
  const { isDarkMode } = useTheme();
  
  const progressService = new ProgressService();
  const userProgress = progressService.getUserProgress();
  
  // Calculate stats for the dashboard
  const totalHabits = habits.length;
  const habitsWithStreak = habits.filter(h => h.streak > 0).length;
  const totalCompletions = userProgress?.totalCompletions || 0;
  
  // Find the habit with the longest streak
  const bestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
  const bestStreakHabit = habits.find(h => h.streak === bestStreak);
  
  // Get habits completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const habitsCompletedToday = habits.filter(habit => {
    if (!habit.lastCompleted) return false;
    const completedDate = new Date(habit.lastCompleted);
    completedDate.setHours(0, 0, 0, 0);
    return completedDate.getTime() === today.getTime();
  });
  
  return (
    <div className="home-page">
      <Header 
        title="Habit Tracker" 
        subtitle="Build better habits, one day at a time" 
      />
      
      <div className="content">
        {notification && (
          <div className="notification">
          </div>
        )}
        
        <div className="dashboard">
          <section className="dashboard-welcome">
            <h2>Welcome to Your Habit Dashboard</h2>
            <p>
              Track your daily routines, build consistency, and achieve your goals
              with our habit tracking system.
            </p>
            
            {totalHabits === 0 ? (
              <div className="get-started-box">
                <h3>Get Started</h3>
                <p>You don't have any habits yet. Create your first habit to begin building better routines!</p>
                <Link to="/habits" className="btn-primary">Create Your First Habit</Link>
              </div>
            ) : (
              <>
                <div className="dashboard-stats">
                  <div className="stat-card">
                    <div className="stat-icon">🌱</div>
                    <div className="stat-value">{totalHabits}</div>
                    <div className="stat-label">Active Habits</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">✓</div>
                    <div className="stat-value">{habitsCompletedToday.length}</div>
                    <div className="stat-label">Completed Today</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-value">{bestStreak}</div>
                    <div className="stat-label">Best Streak</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-value">{totalCompletions}</div>
                    <div className="stat-label">Total Completions</div>
                  </div>
                </div>
                
                <div className="dashboard-actions">
                  <Link to="/habits" className="dashboard-button">
                    <span className="button-icon">📝</span>
                    <span className="button-text">Manage Habits</span>
                  </Link>
                  
                  <Link to="/stats" className="dashboard-button">
                    <span className="button-icon">📊</span>
                    <span className="button-text">View Statistics</span>
                  </Link>
                </div>
              </>
            )}
          </section>
          
          {totalHabits > 0 && (
            <>
              <section className="dashboard-section dashboard-habits">
                <h2>Today's Habits</h2>
                {habits.length === 0 ? (
                  <p>You don't have any active habits to track.</p>
                ) : (
                  <div className="habits-overview">
                    {habits.map(habit => {
                      const isCompletedToday = habitsCompletedToday.some(h => h.id === habit.id);
                      
                      return (
                        <div 
                          key={habit.id}
                          className={`habit-overview-card ${isCompletedToday ? 'completed' : ''}`}
                          style={{ borderLeft: `4px solid ${habit.color || '#4CAF50'}` }}
                        >
                          <div className="habit-overview-header">
                            <h3>{habit.name}</h3>
                            {isCompletedToday ? (
                              <span className="habit-completed-badge">✓</span>
                            ) : (
                              <Link to="/habits" className="habit-complete-link">Complete</Link>
                            )}
                          </div>
                          
                          <div className="habit-overview-details">
                            <div className="habit-detail">
                              <span className="detail-label">Streak:</span>
                              <span className="detail-value">{habit.streak} days</span>
                            </div>
                            <div className="habit-detail">
                              <span className="detail-label">Frequency:</span>
                              <span className="detail-value">
                                {habit.frequency === 'custom'
                                  ? `Every ${habit.customFrequency} days`
                                  : habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="see-all-link">
                  <Link to="/habits">See all habits →</Link>
                </div>
              </section>
              
              <section className="dashboard-section dashboard-achievements">
                <h2>Recent Achievements</h2>
                <Achievements showAll={false} />
                
                <div className="see-all-link">
                  <Link to="/stats">See all achievements →</Link>
                </div>
              </section>
              
              {bestStreakHabit && bestStreak > 0 && (
                <section className="dashboard-section dashboard-streak">
                  <h2>Your Best Streak</h2>
                  <div className="streak-highlight">
                    <div className="streak-icon">🔥</div>
                    <div className="streak-details">
                      <h3>{bestStreakHabit.name}</h3>
                      <p>You've maintained this habit for <strong>{bestStreak} days</strong> in a row!</p>
                      <p>Keep it up to unlock more achievements.</p>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
          
          <section className="dashboard-section dashboard-tips">
            <h2>Habit Building Tips</h2>
            <div className="tips-container">
              <div className="tip-card">
                <h3>Start Small</h3>
                <p>Begin with easy habits that take less than 2 minutes to complete. Build momentum before tackling bigger changes.</p>
              </div>
              
              <div className="tip-card">
                <h3>Be Consistent</h3>
                <p>Consistency matters more than perfection. Try to maintain your streak even with minimal effort on tough days.</p>
              </div>
              
              <div className="tip-card">
                <h3>Track Progress</h3>
                <p>Seeing your progress is motivating. Check your stats page regularly to see how far you've come.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
