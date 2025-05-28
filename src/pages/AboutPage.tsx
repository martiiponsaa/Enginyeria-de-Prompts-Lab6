import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <Header 
        title="About Habit Tracker" 
        subtitle="Building better habits together" 
      />
      
      <div className="content">
        <section className="about-section">
          <h2>What is Habit Tracker?</h2>
          <p>
            Habit Tracker is a modern application designed to help you build and maintain positive habits
            in your daily life. Whether you're trying to exercise regularly, read more books,
            or practice a new skill, our app helps you stay consistent and motivated.
          </p>
          <p>
            By tracking your progress, celebrating streaks, and unlocking achievements,
            Habit Tracker transforms the challenging process of habit building into an engaging journey.
          </p>
        </section>

        <section className="about-section">
          <h2>Core Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Habit Management</h3>
              <p>Create, update, and organize your habits with customizable frequencies and color coding.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Undo Functionality</h3>
              <p>Made a mistake? No problem. Our app allows you to undo your last action.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Visualize your habit completion with detailed statistics and history.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Achievements</h3>
              <p>Stay motivated with unlockable achievements that celebrate your consistency.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Daily Dashboard</h3>
              <p>See all your habits at a glance and track what needs to be completed today.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Data Persistence</h3>
              <p>Your habits and progress are automatically saved and accessible across sessions.</p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>The Science of Habit Building</h2>
          <p>
            Research shows that it takes approximately 66 days (not just 21!) to form a new habit.
            Habit Tracker is built on proven psychological principles that make habit formation more effective:
          </p>
          <ul className="science-list">
            <li><strong>Streak Counting</strong> - Leveraging the psychological principle of "don't break the chain" to motivate consistency</li>
            <li><strong>Visual Progress</strong> - Providing clear visual feedback on your journey to reinforce positive behavior</li>
            <li><strong>Achievement System</strong> - Using milestone rewards to create dopamine-releasing moments that strengthen habit loops</li>
            <li><strong>Accountability</strong> - Creating a system of record that helps maintain commitment to your goals</li>
          </ul>
        </section>
        
        <section className="about-section">
          <h2>Technical Information</h2>
          <p>
            This application is built using React with TypeScript, featuring a robust architecture
            designed for maintainability and extensibility:
          </p>
          <ul>
            <li>React with TypeScript for type-safe development</li>
            <li>Context API for state management</li>
            <li>Service-oriented architecture for data operations</li>
            <li>LocalStorage for data persistence</li>
            <li>React Router for seamless navigation</li>
            <li>Responsive design for all devices</li>
          </ul>
        </section>

        <div className="action-buttons">
          <Link to="/habits" className="btn-primary">Start Tracking Habits</Link>
          <Link to="/" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
