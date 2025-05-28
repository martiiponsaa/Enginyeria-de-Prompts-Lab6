# Enginyeria-de-Prompts-Lab6

A React with TypeScript application scaffold with a basic structure and examples.

## Project Structure

```
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── Counter.tsx # Counter component with state
│   │   ├── Header.tsx  # Header component 
│   │   └── Navigation.tsx # Navigation bar component
│   ├── contexts/       # React Context providers
│   │   └── ThemeContext.tsx # Theme context for styling
│   ├── pages/          # Page components
│   │   ├── HomePage.tsx # Home page component
│   │   └── AboutPage.tsx # About page component
│   ├── services/       # Service classes
│   │   └── example.service.ts # Example service
│   ├── App.tsx         # Main App component with routing
│   ├── index.tsx       # React entry point
│   ├── index.css       # Global styles
│   └── types.ts        # TypeScript type definitions
├── public/             # Static assets
│   ├── index.html      # HTML entry point
│   └── manifest.json   # Web app manifest
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── .gitignore          # Git ignore file
└── README.md           # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- TypeScript
- React and React DOM
- React Router (for navigation)

### Installation

1. Install TypeScript globally (if not already installed):
   ```
   npm install -g typescript
   ```

2. Install project dependencies:
   ```
   npm install
   ```

### Development

- Run the development server:
  ```
  npm start
  ```

- Build the project for production:
  ```
  npm run build
  ```

- Run tests:
  ```
  npm test
  ```

- Eject from Create React App (advanced):
  ```
  npm run eject
  ```

## Features

- React with TypeScript integration
- Component-based architecture
- TypeScript configuration with strict type checking
- React Router for navigation between pages
- React Context API for theme and global state management
- React Hooks demonstration (useState, useContext)
- Dark mode / light mode theme switching
- Type definitions with TypeScript interfaces
- Sample TypeScript class service implementation
- Modern CSS styling with responsive design

## License

This project is licensed under the ISC License - see the package.json file for details.