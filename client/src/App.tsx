import React from 'react';
import TooltipTestingDemo from './components/tooltips/TooltipTestingDemo';
import './App.css';

/**
 * Main application component
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Allied Health Assessment System</h1>
        <p>Tooltip Testing Module</p>
      </header>
      
      <main className="app-main">
        <TooltipTestingDemo />
      </main>
      
      <footer className="app-footer">
        <p>© 2023 Allied Health Assessment System</p>
      </footer>
    </div>
  );
};

export default App; 