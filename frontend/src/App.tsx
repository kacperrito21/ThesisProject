import React from 'react';
import './App.css';
import { AuthenticationProvider } from './context/AuthenticationContext';
import { AppRouter } from './routes/Router';

function App() {
  return (
    <div className="App">
      <AuthenticationProvider>
        <AppRouter />
      </AuthenticationProvider>
    </div>
  );
}

export default App;
