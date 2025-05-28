import React, { useState } from 'react';
import { Habit } from '../models/Habit';
import { useHabits } from '../contexts/HabitsContext';
import HabitForm from './HabitForm';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { completeHabit, deleteHabit } = useHabits();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [completionNote, setCompletionNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  
  const handleComplete = () => {
    if (showNoteInput) {
      completeHabit(habit.id, completionNote);
      setCompletionNote('');
      setShowNoteInput(false);
    } else {
      setShowNoteInput(true);
    }
  };
  
  const handleCompleteWithoutNote = () => {
    completeHabit(habit.id);
    setShowNoteInput(false);
  };
  
  const handleDelete = () => {
    if (showConfirmDelete) {
      deleteHabit(habit.id);
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };
  
  // Format date function
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <>
      <div className="habit-card" style={{ borderLeft: `5px solid ${habit.color || '#4CAF50'}` }}>
        <div className="habit-header">
          <h3>{habit.name}</h3>
          <span className="habit-streak">
            <span className="streak-number">{habit.streak}</span>
            <span className="streak-label">streak</span>
          </span>
        </div>
        
        {habit.description && (
          <p className="habit-description">{habit.description}</p>
        )}
        
        <div className="habit-details">
          <div className="habit-detail">
            <span className="detail-label">Frequency:</span>
            <span className="detail-value">
              {habit.frequency === 'custom' 
                ? `Every ${habit.customFrequency} days` 
                : habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            </span>
          </div>
          
          <div className="habit-detail">
            <span className="detail-label">Last Completed:</span>
            <span className="detail-value">{formatDate(habit.lastCompleted)}</span>
          </div>
        </div>
        
        {showNoteInput && (
          <div className="completion-note">
            <textarea
              placeholder="Add a note about this completion (optional)"
              value={completionNote}
              onChange={(e) => setCompletionNote(e.target.value)}
              rows={2}
            />
            <div className="note-buttons">
              <button 
                className="btn-secondary" 
                onClick={() => setShowNoteInput(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleCompleteWithoutNote}
              >
                Complete
              </button>
              <button 
                className="btn-primary" 
                onClick={handleComplete}
              >
                Complete with Note
              </button>
            </div>
          </div>
        )}
        
        {showConfirmDelete && (
          <div className="delete-confirm">
            <p>Are you sure you want to delete this habit?</p>
            <div className="confirm-buttons">
              <button 
                className="btn-secondary" 
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger" 
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
        
        <div className="habit-actions">
          {!showNoteInput && !showConfirmDelete && (
            <>
              <button 
                className="btn-secondary" 
                onClick={() => setShowEditForm(true)}
              >
                Edit
              </button>
              <button 
                className="btn-danger" 
                onClick={handleDelete}
              >
                Delete
              </button>
              <button 
                className="btn-primary" 
                onClick={handleComplete}
              >
                Complete
              </button>
            </>
          )}
        </div>
      </div>
      
      {showEditForm && (
        <div className="modal-overlay">
          <HabitForm 
            existingHabit={habit} 
            onClose={() => setShowEditForm(false)} 
          />
        </div>
      )}
    </>
  );
};

export default HabitCard;
