import React from 'react';
import { AuthenticationProvider } from './context/AuthenticationContext';
import { AppRouter } from './routes/Router';

function App() {
  return (
    <div>
      <AuthenticationProvider>
        <AppRouter />
      </AuthenticationProvider>
    </div>
  );
}

export default App;
