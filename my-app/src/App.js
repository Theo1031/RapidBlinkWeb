import React, { useState } from 'react';
import './App.css';
import SpeedReader from './SpeedReader';

function App() {
  const [userInput, setUserInput] = useState('');
  const [displaySpeed, setDisplaySpeed] = useState(300); // Default display speed in milliseconds
  const [voiceSpeed, setVoiceSpeed] = useState(1); // Default voice speed
  const [showReader, setShowReader] = useState(false);
  const [audibleReading, setAudibleReading] = useState(false);

  const startReading = (audible = false) => {
    setAudibleReading(audible);
    setShowReader(true);
  };

  const handleQuit = () => {
    setShowReader(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Speed Blink</h1>
      </header>
      {!showReader ? (
        <div className="input-area">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter text here..."
          />
          <div>
            <label>Display Speed: </label>
            <input
              type="range"
              min="100"
              max="1000"
              value={displaySpeed}
              onChange={(e) => setDisplaySpeed(e.target.value)}
            />
          </div>
          <div>
            <label>Voice Speed: </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(e.target.value)}
            />
          </div>
          <button onClick={() => startReading()}>Start Reading</button>
          <button onClick={() => startReading(true)}>Start Audible Reading</button>
        </div>
      ) : (
        <SpeedReader
          text={userInput}
          displaySpeed={displaySpeed}
          voiceSpeed={voiceSpeed}
          onQuit={handleQuit}
          audibleReading={audibleReading}
        />
      )}
    </div>
  );
}

export default App;
