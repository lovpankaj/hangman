import React, { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, push } from 'firebase/database'
import { auth, database } from './firebase'
import Auth from './components/Auth'
import Hangman from './components/Hangman'
import Results from './components/Results'
import { DIFFICULTIES } from './wordList'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('menu')
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleGameEnd = async (result) => {
    if (!user) return

    try {
      const scoresRef = ref(database, `${user.uid}/Scores`)
      await push(scoresRef, result)
      setCurrentPage('results')
    } catch (error) {
      console.error('Error saving result:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setCurrentPage('menu')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth onAuthSuccess={() => setCurrentPage('menu')} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'menu':
        return (
          <div className="container">
            <h1>🎮 Hangman Game</h1>
            <div className="card">
              <h2>Welcome, {user.email}!</h2>
              <p style={{ marginBottom: '30px', color: '#666' }}>Choose a difficulty level to start playing</p>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                {Object.entries(DIFFICULTIES).map(([key, diff]) => (
                  <button
                    key={diff.key}
                    onClick={() => {
                      setSelectedDifficulty(diff.key)
                      setCurrentPage('game')
                    }}
                    style={{
                      padding: '20px',
                      fontSize: '16px',
                      marginTop: '0',
                      background: `linear-gradient(135deg, ${
                        diff.key === 'easy'
                          ? '#27ae60'
                          : diff.key === 'medium'
                          ? '#f39c12'
                          : '#e74c3c'
                      }, ${
                        diff.key === 'easy'
                          ? '#229954'
                          : diff.key === 'medium'
                          ? '#d68910'
                          : '#c0392b'
                      })`
                    }}
                  >
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>{diff.label}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
                      Rarity: {diff.rarityPercent}%
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage('results')}
                style={{ background: '#9b59b6', marginTop: '20px' }}
              >
                📊 View My Results
              </button>

              <button
                onClick={handleLogout}
                style={{ background: '#e74c3c', marginTop: '10px' }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )

      case 'game':
        return (
          <div className="container">
            <h1>🎮 Hangman Game</h1>
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setCurrentPage('menu')}
                style={{ background: '#9b59b6', marginTop: '0' }}
              >
                ← Back to Menu
              </button>
            </div>
            <Hangman
              difficulty={selectedDifficulty}
              onGameEnd={handleGameEnd}
              userId={user.uid}
            />
          </div>
        )

      case 'results':
        return (
          <div className="container">
            <h1>🎮 Hangman Game</h1>
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setCurrentPage('menu')}
                style={{ background: '#9b59b6', marginTop: '0' }}
              >
                ← Back to Menu
              </button>
            </div>
            <Results userId={user.uid} />
          </div>
        )

      default:
        return null
    }
  }

  return renderPage()
}
