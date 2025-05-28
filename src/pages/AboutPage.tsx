import React from 'react';
import Header from '../components/Header';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <Header 
        title="About Page" 
        subtitle="Learn more about this project" 
      />
      
      <div className="content">
        <h2>About this Project</h2>
        <p>This is a React TypeScript application created for the Enginyeria-de-Prompts-Lab6.</p>
        <p>The project demonstrates:</p>
        <ul>
          <li>React with TypeScript integration</li>
          <li>Component-based architecture</li>
          <li>React Router for navigation</li>
          <li>State management with React Hooks</li>
          <li>Service class implementation</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
