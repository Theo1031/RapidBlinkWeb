import React, { useState } from 'react';
import './App.css';
import SpeedReader from './SpeedReader';

function App() {
  const [userInput, setUserInput] = useState('');
  const [speed, setSpeed] = useState(300); // Default speed in milliseconds
  const [showReader, setShowReader] = useState(false);

  const startReading = () => {
    setShowReader(true);
  };

  const handleQuit = () => {
    setShowReader(false);
  };

  const handleSpeedChange = (e) => {
    // Invert speed (higher value = slower)
    setSpeed(600 - e.target.value);
  };

  return (
    <div className="App">
      {!showReader ? (
        <div className="input-area">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter text here..."
          />
          <div>
            <label>Reading Speed: </label>
            <input
              type="range"
              min="100"
              max="500"
              value={600 - speed}
              onChange={handleSpeedChange}
            />
          </div>
          <button onClick={startReading}>Start Reading</button>
        </div>
      ) : (
        <SpeedReader
          text={userInput}
          readingSpeed={speed}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
}

export default App;
