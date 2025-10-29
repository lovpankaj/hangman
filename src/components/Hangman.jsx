import React, { useState, useEffect, useCallback } from 'react'
import { getRandomWord, DIFFICULTIES } from '../wordList'

const HANGMAN_STAGES = [
  '😊',
  '😐',
  '😕',
  '😟',
  '😢',
  '😫',
  '💀'
]

export default function Hangman({ difficulty, onGameEnd, userId }) {
  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameStatus, setGameStatus] = useState('playing')
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const newWord = getRandomWord(difficulty)
    setWord(newWord)
  }, [difficulty])

  const handleKeyPress = useCallback((event) => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      const letter = event.key.toUpperCase()
      if (/^[A-Z]$/.test(letter)) {
        handleGuess(letter)
      }
    }
  }, [guessedLetters, word, gameStatus])

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [handleKeyPress])

  const displayWord = word
    .split('')
    .map(letter => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ')

  const isWon = word && word.split('').every(letter => guessedLetters.has(letter))
  const isLost = wrongGuesses >= HANGMAN_STAGES.length - 1

  useEffect(() => {
    if (isWon) {
      setGameStatus('won')
    } else if (isLost) {
      setGameStatus('lost')
    }
  }, [isWon, isLost])

  const handleGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return

    const newGuessed = new Set(guessedLetters)
    newGuessed.add(letter)
    setGuessedLetters(newGuessed)

    if (!word.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1)
    }
  }

  const handleGameEnd = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const result = {
      word,
      outcome: gameStatus === 'won' ? 'won' : 'lost',
      timeTaken,
      difficulty,
      dateTime: new Date().toISOString(),
      timestamp: Date.now()
    }
    onGameEnd(result)
  }

  const handlePlayAgain = () => {
    window.location.reload()
  }

  if (!word) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="card">
      <h2>Playing: {DIFFICULTIES[difficulty.toUpperCase()].label}</h2>
      <div className="game-board">
        <div className="hangman-display">{HANGMAN_STAGES[wrongGuesses]}</div>
        <div className="word-display">{displayWord}</div>
        <div className="stats">
          <div className="stat-box">
            <div className="stat-label">Wrong Guesses</div>
            <div className="stat-value">{wrongGuesses}/{HANGMAN_STAGES.length - 1}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Time (sec)</div>
            <div className="stat-value">{Math.round((Date.now() - startTime) / 1000)}</div>
          </div>
        </div>

        <div className="guessed-letters">
          {letters.map(letter => (
            <button
              key={letter}
              className={`letter-btn ${
                guessedLetters.has(letter)
                  ? word.includes(letter)
                    ? 'correct'
                    : 'wrong'
                  : ''
              }`}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter) || gameStatus !== 'playing'}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {gameStatus !== 'playing' && (
        <div className="result-box">
          <div className="result-icon">{gameStatus === 'won' ? '🎉' : '💔'}</div>
          <div className="result-message">
            {gameStatus === 'won' ? 'You Won!' : 'Game Over!'}
          </div>
          <div style={{ marginBottom: '10px' }}>
            The word was: <strong>{word}</strong>
          </div>
          <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
            Time taken: {Math.round((Date.now() - startTime) / 1000)} seconds
          </div>
          <button onClick={handleGameEnd} style={{ marginBottom: '10px' }}>
            Save Result & Continue
          </button>
          <button onClick={handlePlayAgain} style={{ background: '#764ba2' }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}
