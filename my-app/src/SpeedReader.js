import React, { useState, useEffect, useCallback } from 'react';

const SpeedReader = ({ onQuit, text, displaySpeed, voiceSpeed, audibleReading }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [showAllWords, setShowAllWords] = useState(false);

  useEffect(() => {
    setWords(text.split(' '));
  }, [text]);

  const speak = useCallback((word) => {
    if (audibleReading) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = parseFloat(voiceSpeed);
      window.speechSynthesis.speak(utterance);
    }
  }, [voiceSpeed, audibleReading]);

  useEffect(() => {
    let interval;
    if (!showAllWords && words.length > 0) {
      interval = setInterval(() => {
        const nextWordIndex = currentWordIndex + 1;
        if (nextWordIndex < words.length) {
          setCurrentWordIndex(nextWordIndex);
          if (audibleReading) {
            speak(words[nextWordIndex]);
          }
        } else {
          clearInterval(interval);
        }
      }, displaySpeed);
    }
    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel(); // Stop speaking when component unmounts or updates
    };
  }, [currentWordIndex, words, displaySpeed, showAllWords, speak, audibleReading]);

  const handleWordSelect = (index) => {
    setCurrentWordIndex(index);
    setShowAllWords(false);
    if (audibleReading) {
      speak(words[index]);
    }
  };

  const handleQuit = () => {
    window.speechSynthesis.cancel(); // Stop speaking when quitting
    onQuit();
  };

  return (
    <div className="speed-reader-backdrop">
      {!showAllWords ? (
        <>
          <div className="word-display">{words[currentWordIndex]}</div>
          <button className="back-button" onClick={() => setShowAllWords(true)}>Look Back</button>
          <button className="quit-button" onClick={handleQuit}>Quit</button>
        </>
      ) : (
        <div className="word-list">
          {words.map((word, index) => (
            <span key={index} onClick={() => handleWordSelect(index)}>
              {word + ' '}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpeedReader;
