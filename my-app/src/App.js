import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import SpeedReader from './SpeedReader';
import { updateUser, getUser } from './api';     

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [displaySpeed, setDisplaySpeed] = useState(300);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [showReader, setShowReader] = useState(false);
  const [audibleReading, setAudibleReading] = useState(false);
  const [summary, setSummary] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [wordSpeed, setWordSpeed] = useState(2); 
  const [chatSummarizationLimit, setChatSummarizationLimit] = useState(500);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showChatArea, setShowChatArea] = useState(false);

  const startReading = (audible = false) => {
    setAudibleReading(audible);
    setShowReader(true);
  };

  const handleQuit = () => {
    setShowReader(false);
  };
  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:4003/api/register', {
        username,
        password,
        wordSpeed,
        chatSummarizationLimit
      });
      console.log(res.data); 
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  }; 
  const handleUpdateSettings = async () => {
    try {
      const res = await axios.post('http://localhost:4003/api/updateSettings', {
        username: loginUsername,
        newSettings: {
          wordSpeed,
          chatSummarizationLimit
        }
      });
      console.log(res.data);
    } catch (error) {
      console.error('Update settings error:', error.message);
    }
  };
  const handleLogin = async () => {
    try {
      const loginResponse = await axios.post('http://localhost:4003/api/login', {
        username: loginUsername,
        password: loginPassword
      });
  
      localStorage.setItem('token', loginResponse.data.token); 
  
  
      const settingsResponse = await getUser(loginUsername); 
      if (settingsResponse.data) {
        setWordSpeed(settingsResponse.data.wordSpeed);
        setChatSummarizationLimit(settingsResponse.data.chatSummarizationLimit);
     
      }
  
     
    } catch (error) {
      console.error('Login error:', error.message);
      
    }
  };
  
  
  

  const handleChat = () => {
    setShowChatArea(true);
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

 

  return (
    <div className="App">
      <title>ADHD Reader</title>
      <header className="App-header">
        {!showReader && <h1>ADHD Reader</h1>}
      </header>
      
      {!showReader && (
  <div>
    <button className="toggle-button" onClick={() => setShowOptions(!showOptions)}>
      {showOptions ? 'Hide Options' : 'Show Options'}
    </button>
  </div>
)}
{!showReader && showOptions && (
  <div className="container">
    <div className="login-land">
      <input
        type="text"
        className="input-field"
        value={loginUsername}
        onChange={(e) => setLoginUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        className="input-field"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="button" onClick={handleLogin}>Login</button>
    </div>

    <div className="input-land">
      <input
        type="text"
        className="input-field"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        type="number"
        className="input-field"
        value={wordSpeed}
        onChange={(e) => setWordSpeed(parseInt(e.target.value))}
        placeholder="Word Speed"
      />
      <button className="button" onClick={handleRegister}>Register</button>
      <button className="button" onClick={handleUpdateSettings}>Update Settings</button>
    </div>
  </div>
)}
   

      {!showReader ? (

        
        
        <div className="input-area">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter text here..."
          />

      
          <button onClick={() => startReading()}>Start Reading</button>
          <button onClick={() => startReading(true)}>Start Audible Reading</button>
     
          <button onClick={handleChat}>Summarize</button>
            
          {summary && <div className="summary">{summary}</div>}
          {response && <div className="response">{response}</div>}
        </div>
        
      ) : (
      <SpeedReader
        text={userInput}
        displaySpeed={wordSpeed}
        audibleReading={audibleReading}
        onQuit={handleQuit}
      />
      )}
      
    </div>
  );
}

export default App;