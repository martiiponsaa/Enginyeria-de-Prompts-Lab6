import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitsContext';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import Header from '../components/Header';

const HabitsPage: React.FC = () => {
  const { habits, undoLastAction, notification } = useHabits();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  
  // Filter habits based on search and frequency filter
  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (habit.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
                         
    const matchesFrequency = filterFrequency === 'all' || habit.frequency === filterFrequency;
    
    return matchesSearch && matchesFrequency;
  });
  
  const handleUndoClick = () => {
    undoLastAction();
  };
  
  return (
    <div className="habits-page">
      <Header 
        title="My Habits" 
        subtitle="Track your daily routines and build better habits" 
      />
      
      <div className="habits-container">
        <div className="habits-controls">
          <div className="search-filter-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-container">
              <select 
                value={filterFrequency}
                onChange={(e) => setFilterFrequency(e.target.value)}
                className="frequency-filter"
              >
                <option value="all">All Frequencies</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn-secondary" 
              onClick={handleUndoClick}
            >
              Undo Last Action
            </button>
            
            <button 
              className="btn-primary" 
              onClick={() => setShowAddForm(true)}
            >
              Add New Habit
            </button>
          </div>
        </div>
        
        {notification && (
          <div className="notification">
          </div>
        )}
        
        {habits.length === 0 ? (
          <div className="no-habits-message">
            <p>You don't have any habits yet. Click "Add New Habit" to get started!</p>
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="no-habits-message">
            <p>No habits match your search or filter criteria.</p>
          </div>
        ) : (
          <div className="habits-list">
            {filteredHabits.map(habit => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>
      
      {showAddForm && (
        <div className="modal-overlay">
          <HabitForm onClose={() => setShowAddForm(false)} />
        </div>
      )}
    </div>
  );
};

export default HabitsPage;
