import React from 'react';
import './App.css';

/**
 * Main application component
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Allied Health Assessment System</h1>
      </header>
      
      <main className="app-main">
        <div>Assessment System</div>
      </main>
      
      <footer className="app-footer">
        <p>© 2023 Allied Health Assessment System</p>
      </footer>
    </div>
  );
};

export default App; 