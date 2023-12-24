import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import SpeedReader from './SpeedReader';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [displaySpeed, setDisplaySpeed] = useState(300);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [showReader, setShowReader] = useState(false);
  const [audibleReading, setAudibleReading] = useState(false);
  const [summary, setSummary] = useState('');

  const startReading = (audible = false) => {
    setAudibleReading(audible);
    setShowReader(true);
  };

  const handleQuit = () => {
    setShowReader(false);
  };

  const handleChat = () => {
    axios.post('http://localhost:4003/api/chat', { prompt: userInput })
      .then(response => {
        if (response.data) {
          setResponse(response.data);
        } else {
          console.error('No data in response');
        }
      })
      .catch(error => {
        console.error('Error during chat:', error.message);
      });
  };
  //Summarize text is not working, use chat
 

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
          {/*<input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter chat prompt here..."
          />
      */}
          <button onClick={() => startReading()}>Start Reading</button>
          <button onClick={() => startReading(true)}>Start Audible Reading</button>
          {/*<button onClick={summarizeText}>Summarize Text</button>
      */}
          <button onClick={handleChat}>Chat</button>
          {summary && <div className="summary">{summary}</div>}
          {response && <div className="response">{response}</div>}
        </div>
      ) : (
        <SpeedReader
          text={userInput}
          displaySpeed={displaySpeed}
          voiceSpeed={voiceSpeed}
          audibleReading={audibleReading}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
}

export default App;