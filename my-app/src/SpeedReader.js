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

    const speak = useCallback((word) => {
        if (audibleReading) {
            const utterance = new SpeechSynthesisUtterance(word);
            const rate = parseFloat(voiceSpeed);
            utterance.rate = rate >= 0.1 && rate <= 10 ? rate : 1;
            window.speechSynthesis.speak(utterance);
        }
    }, [voiceSpeed, audibleReading]);

    useEffect(() => {
        let interval;
        if (!showAllWords && words.length > 0) {
            interval = setInterval(() => {
                setCurrentWordIndex(prevIndex => {
                    const nextWordIndex = prevIndex + 1;
                    if (nextWordIndex < words.length) {
                        if (audibleReading) {
                            speak(words[nextWordIndex]);
                        }
                        return nextWordIndex;
                    } else {
                        clearInterval(interval);
                        return prevIndex;
                    }
                });
            }, displaySpeed);
        }
        return () => {
            clearInterval(interval);
            window.speechSynthesis.cancel();
        };
    }, [words, displaySpeed, showAllWords, speak, audibleReading]);

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

    const summarizeText = () => {
        const params = new URLSearchParams({ text }).toString();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/summarize?${params}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                setSummary(data.summary);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleChat = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, { prompt: text });
            setSummary(res.data);
        } catch (error) {
            console.error('Error during chat:', error.message);
        }
    };

    return (
        <div className="speed-reader-backdrop">
            {!showAllWords ? (
                <>
                    <div className="word-display">{words[currentWordIndex]}</div>
                    <button className="back-button" onClick={() => setShowAllWords(true)}>Look Back</button>
                    <button className="quit-button" onClick={handleQuit}>Quit</button>
                    {/*<button onClick={summarizeText}>Summarize Text</button>*/}
                    {/*<button onClick={handleChat}>Chat</button>*/}
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
            {summary && <div className="summary">{summary}</div>}
        </div>
    );
}

export default SpeedReader;
