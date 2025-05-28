import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitsContext';
import Header from '../components/Header';
import Achievements from '../components/Achievements';
import HabitCharts from '../components/HabitCharts';
import { ProgressService } from '../services/progress.service';

const StatsPage: React.FC = () => {
  const { habits } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<string | 'all'>('all');
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('week');
  
  const progressService = new ProgressService();
  const userProgress = progressService.getUserProgress();
  
  if (!userProgress) {
    return (
      <div className="stats-page">
        <Header 
          title="Statistics & Achievements" 
          subtitle="Track your progress over time" 
        />
        <div className="content">
          <p>No progress data available yet. Start by adding and completing habits!</p>
        </div>
      </div>
    );
  }
  
  // Calculate some overall stats
  const totalCompletionsCount = userProgress.totalCompletions;
  const activeHabitsCount = habits.length;
  const avgCompletionsPerHabit = activeHabitsCount > 0 
    ? (totalCompletionsCount / activeHabitsCount).toFixed(1) 
    : '0';
  
  // Get best streak across all habits
  const bestStreak = Object.values(userProgress.habitStats).reduce((max, stat) => {
    return Math.max(max, stat.bestStreak);
  }, 0);
  
  // Format date function
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get the stats for the selected habit
  const selectedStats = selectedHabit !== 'all' 
    ? userProgress.habitStats[selectedHabit] 
    : null;
  
  return (
    <div className="stats-page">
      <Header 
        title="Statistics & Achievements" 
        subtitle="Track your progress over time" 
      />
      
      <div className="content">
        <div className="stats-container">
          <div className="stats-summary">
            <div className="summary-card">
              <h3>Total Completions</h3>
              <div className="stat-value">{totalCompletionsCount}</div>
            </div>
            <div className="summary-card">
              <h3>Active Habits</h3>
              <div className="stat-value">{activeHabitsCount}</div>
            </div>
            <div className="summary-card">
              <h3>Avg. Per Habit</h3>
              <div className="stat-value">{avgCompletionsPerHabit}</div>
            </div>
            <div className="summary-card">
              <h3>Best Streak</h3>
              <div className="stat-value">{bestStreak}</div>
            </div>
          </div>
          
          <div className="habit-stats-container">
            <h2>Habit Statistics</h2>
            <div className="habit-selector">
              <label htmlFor="habit-select">Select Habit:</label>
              <select 
                id="habit-select"
                value={selectedHabit}
                onChange={(e) => setSelectedHabit(e.target.value)}
              >
                <option value="all">All Habits</option>
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id}>{habit.name}</option>
                ))}
              </select>
            </div>
            
            {selectedHabit === 'all' ? (
              <div className="all-habits-stats">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Habit</th>
                      <th>Current Streak</th>
                      <th>Best Streak</th>
                      <th>Total Completions</th>
                      <th>Last Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map(habit => {
                      const stats = userProgress.habitStats[habit.id];
                      return stats ? (
                        <tr key={habit.id}>
                          <td>{habit.name}</td>
                          <td>{stats.streak}</td>
                          <td>{stats.bestStreak}</td>
                          <td>{stats.totalCompletions}</td>
                          <td>{formatDate(stats.lastCompletedAt)}</td>
                        </tr>
                      ) : (
                        <tr key={habit.id}>
                          <td>{habit.name}</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>Never</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : selectedStats ? (
              <div className="single-habit-stats">
                <h3>{habits.find(h => h.id === selectedHabit)?.name}</h3>
                
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Current Streak:</span>
                    <span className="stat-value">{selectedStats.streak}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Best Streak:</span>
                    <span className="stat-value">{selectedStats.bestStreak}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Completions:</span>
                    <span className="stat-value">{selectedStats.totalCompletions}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Last Completed:</span>
                    <span className="stat-value">{formatDate(selectedStats.lastCompletedAt)}</span>
                  </div>
                </div>
                
                {selectedStats.completionDates.length > 0 && (
                  <div className="completion-history">
                    <h4>Completion History</h4>
                    <ul>
                      {[...selectedStats.completionDates]
                        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                        .slice(0, 5) // Show only last 5 completions
                        .map((date, index) => (
                          <li key={index}>{formatDate(date)}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>Select a habit to see detailed statistics.</p>
            )}          </div>
          
          <div className="charts-container">
            <h2>Habit Performance Charts</h2>
            
            <div className="chart-period-selector">
              <button 
                className={`period-button ${chartPeriod === 'week' ? 'active' : ''}`}
                onClick={() => setChartPeriod('week')}
              >
                Last Week
              </button>
              <button 
                className={`period-button ${chartPeriod === 'month' ? 'active' : ''}`}
                onClick={() => setChartPeriod('month')}
              >
                Last Month
              </button>
              <button 
                className={`period-button ${chartPeriod === 'year' ? 'active' : ''}`}
                onClick={() => setChartPeriod('year')}
              >
                Last Year
              </button>
            </div>
            
            <HabitCharts 
              habits={habits}
              userProgress={userProgress}
              selectedHabitId={selectedHabit}
              period={chartPeriod}
            />
          </div>
          
          <div className="achievements-section">
            <Achievements showAll={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
