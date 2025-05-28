import React, { useState } from 'react';
import { Achievement } from '../models/Progress';
import { useHabits } from '../contexts/HabitsContext';

interface AchievementsProps {
  showAll?: boolean;
}

const Achievements: React.FC<AchievementsProps> = ({ showAll = false }) => {
  const { allAchievements, recentAchievements } = useHabits();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  // Filter achievements based on the selected filter
  const filteredAchievements = allAchievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.isUnlocked;
    if (filter === 'locked') return !achievement.isUnlocked;
    return true;
  });
  
  // Format date function
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="achievements-container">
      {showAll ? (
        <>
          <div className="achievements-header">
            <h2>Your Achievements</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'unlocked' ? 'active' : ''}`} 
                onClick={() => setFilter('unlocked')}
              >
                Unlocked
              </button>
              <button 
                className={`filter-btn ${filter === 'locked' ? 'active' : ''}`} 
                onClick={() => setFilter('locked')}
              >
                Locked
              </button>
            </div>
          </div>
          
          <div className="achievements-grid">
            {filteredAchievements.length === 0 ? (
              <p className="no-achievements">No achievements match your filter.</p>
            ) : (
              filteredAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-content">
                    <h3>{achievement.name}</h3>
                    <p>{achievement.description}</p>
                    {achievement.isUnlocked && achievement.unlockedAt && (
                      <p className="unlock-date">Unlocked on {formatDate(achievement.unlockedAt)}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        // Display only recent achievements (for dashboard)
        <>
          <h3>Recent Achievements</h3>
          {recentAchievements.length === 0 ? (
            <p className="no-achievements">No recent achievements.</p>
          ) : (
            <div className="recent-achievements">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card unlocked">
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-content">
                    <h3>{achievement.name}</h3>
                    <p>{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Achievements;
