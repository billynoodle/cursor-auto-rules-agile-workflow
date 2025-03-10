import React from 'react';
import ReactDOM from 'react-dom/client';
import AssessmentPage from './pages/AssessmentPage';
import { SupabaseProvider } from './contexts/SupabaseContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SupabaseProvider>
      <AssessmentPage />
    </SupabaseProvider>
  </React.StrictMode>
); 