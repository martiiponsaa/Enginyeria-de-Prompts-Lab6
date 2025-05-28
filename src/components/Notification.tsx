import React, { useEffect } from 'react';
import { useHabits } from '../contexts/HabitsContext';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  message: string;
  type?: NotificationType;
  timeout?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type = 'success', 
  timeout = 3000 
}) => {
  const { clearNotification } = useHabits();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      clearNotification();
    }, timeout);
    
    return () => {
      clearTimeout(timer);
    };
  }, [message, clearNotification, timeout]);
  
  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '!';
      case 'warning':
        return '⚠';
      case 'info':
        return 'i';
      default:
        return '✓';
    }
  };
  
  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <div className={`notification-icon notification-icon-${type}`}>
          {getIcon()}
        </div>
        <span className="notification-message">{message}</span>
      </div>
      <button onClick={clearNotification} className="close-btn">×</button>
    </div>
  );
};

export default Notification;
