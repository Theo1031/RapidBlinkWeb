import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SpeedReader = ({ onQuit, text, displaySpeed, voiceSpeed, audibleReading }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [words, setWords] = useState([]);
    const [showAllWords, setShowAllWords] = useState(false);
    const [summary, setSummary] = useState('');

    useEffect(() => {
        setWords(text.split(' '));
    }, [text]);

   
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback((word) => {
        if (audibleReading && !isSpeaking) {
            setIsSpeaking(true); 
            const utterance = new SpeechSynthesisUtterance(word);
            const rate = parseFloat(voiceSpeed);
            utterance.rate = isNaN(rate) ? 1.5 : rate; 

            utterance.onend = () => {
                setIsSpeaking(false); 
                setCurrentWordIndex(currentIndex => currentIndex + 1);
            };

            window.speechSynthesis.speak(utterance);
        }
    }, [voiceSpeed, audibleReading, isSpeaking]);


    useEffect(() => {
        let interval;
        if (!showAllWords && words.length > 0) {
            interval = setInterval(() => {
                setCurrentWordIndex(prevIndex => {
                    const nextWordIndex = prevIndex + 1;
                    if (nextWordIndex < words.length) {
                        if (!audibleReading) {
                            return nextWordIndex;  
                        }
                    } else {
                        clearInterval(interval);  
                    }
                    return prevIndex;  
                });
            }, 1000 / displaySpeed);
        }
        return () => clearInterval(interval);
    }, [displaySpeed, showAllWords, words, audibleReading]);

    useEffect(() => {
        if (audibleReading && currentWordIndex < words.length && !isSpeaking) {
            speak(words[currentWordIndex]);
        }
    }, [currentWordIndex, words, speak, audibleReading, isSpeaking]);


    const handleWordSelect = (index) => {
        setCurrentWordIndex(index);
        setShowAllWords(false);
        if (audibleReading) {
            speak(words[index]);
        }
    };

    const handleQuit = () => {
        window.speechSynthesis.cancel();
        onQuit();
    };

    return (
        <div 
            className="speed-reader-backdrop" 
            style={{ 
                backgroundColor: audibleReading || !showAllWords ? 'black' : 'transparent',
                color: 'white', 
          
            }}
        >
            {!showAllWords ? (
                <>
                    <div className="word-display">{words[currentWordIndex]}</div>
                    <button className="back-button" onClick={() => setShowAllWords(true)}>Look Back</button>
                    <button className="quit-button" onClick={handleQuit}>Quit</button>
                </>
            ) : (
                <div className="word-list">
                    {words.map((word, index) => (
                        <span
                            key={index}
                            onClick={() => handleWordSelect(index)}
                            style={index === currentWordIndex ? { backgroundColor: 'rgba(0, 0, 255, 0.8)' } : {}}
                        >
                            {word + ' '}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
    
    
    
}

export default SpeedReader;
