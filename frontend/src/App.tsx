import React from 'react';
import './App.css';
import TestConnection from './components/TestConnection';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <h1>Thesis Project Frontend</h1>
          <TestConnection />
        </header>
      </div>
  );
}

export default App;
