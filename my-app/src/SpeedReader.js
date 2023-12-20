import React, { useState, useEffect } from 'react';

const SpeedReader = ({ onQuit, text, readingSpeed }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [reading, setReading] = useState(false);
  const [showAllWords, setShowAllWords] = useState(false);

  useEffect(() => {
    setWords(text.split(' '));
  }, [text]);

  useEffect(() => {
    let interval;
    if (reading && words.length > 0 && !showAllWords) {
      interval = setInterval(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex((prevIndex) => prevIndex + 1);
        } else {
          clearInterval(interval);
          setReading(false); // Stop reading at the end
        }
      }, readingSpeed);
    }
    return () => clearInterval(interval);
  }, [reading, words, readingSpeed, currentWordIndex, showAllWords]);

  const handleWordSelect = (index) => {
    setCurrentWordIndex(index);
    setShowAllWords(false);
    setReading(true);
  };

  return (
    <div className="speed-reader-backdrop">
      {!showAllWords ? (
        <>
          <div className="word-display">{words[currentWordIndex]}</div>
          <button onClick={() => setReading(!reading)}>{reading ? 'Pause' : 'Start'}</button>
          <button onClick={() => setShowAllWords(true)}>Back</button>
          <button onClick={onQuit}>Quit</button>
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
