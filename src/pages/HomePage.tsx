import React from 'react';
import Header from '../components/Header';
import Counter from '../components/Counter';
import { ExampleService } from '../services/example.service';

const HomePage: React.FC = () => {
  const exampleService = new ExampleService("React with TypeScript");
  const processedData = exampleService.processData();
  
  return (
    <div className="home-page">
      <Header 
        title="React + TypeScript App" 
        subtitle="A modern web application" 
      />
      
      <div className="content">
        <p>Welcome to our React and TypeScript application!</p>
        <p>Data from service: {processedData}</p>
        
        <Counter initialValue={5} />
      </div>
    </div>
  );
};

export default HomePage;
