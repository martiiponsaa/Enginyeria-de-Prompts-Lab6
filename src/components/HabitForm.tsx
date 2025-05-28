import React, { useState } from 'react';
import { Habit } from '../models/Habit';
import { useHabits } from '../contexts/HabitsContext';

interface HabitFormProps {
  existingHabit?: Habit;
  onClose: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ existingHabit, onClose }) => {
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState(existingHabit?.name || '');
  const [description, setDescription] = useState(existingHabit?.description || '');
  const [frequency, setFrequency] = useState<Habit['frequency']>(existingHabit?.frequency || 'daily');
  const [customFrequency, setCustomFrequency] = useState<number>(existingHabit?.customFrequency || 1);
  const [color, setColor] = useState(existingHabit?.color || '#4CAF50');
  
  const isEditing = !!existingHabit;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      alert('Please enter a habit name');
      return;
    }
    
    const habitData = {
      name: name.trim(),
      description: description.trim() || undefined,
      frequency,
      customFrequency: frequency === 'custom' ? customFrequency : undefined,
      color,
    };
    
    if (isEditing && existingHabit) {
      updateHabit({
        ...existingHabit,
        ...habitData
      });
    } else {
      addHabit(habitData);
    }
    
    onClose();
  };
  
  return (
    <div className="habit-form-container">
      <form onSubmit={handleSubmit} className="habit-form">
        <h2>{isEditing ? 'Edit Habit' : 'Add New Habit'}</h2>
        
        <div className="form-group">
          <label htmlFor="habit-name">Habit Name*</label>
          <input
            id="habit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Morning Run"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="habit-description">Description (Optional)</label>
          <textarea
            id="habit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this habit"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="habit-frequency">Frequency</label>
          <select
            id="habit-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as Habit['frequency'])}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        {frequency === 'custom' && (
          <div className="form-group">
            <label htmlFor="custom-frequency">Every</label>
            <div className="custom-frequency-container">
              <input
                id="custom-frequency"
                type="number"
                min="1"
                max="365"
                value={customFrequency}
                onChange={(e) => setCustomFrequency(parseInt(e.target.value))}
              />
              <span>days</span>
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="habit-color">Color</label>
          <input
            id="habit-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        
        <div className="form-buttons">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {isEditing ? 'Update Habit' : 'Add Habit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
