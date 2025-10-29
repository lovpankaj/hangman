import React, { useState, useEffect } from 'react'
import { ref, query, orderByChild, onValue } from 'firebase/database'
import { database } from '../firebase'
import { getDifficultyByKey, DIFFICULTIES } from '../wordList'

export default function Results({ userId }) {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('easy')

  useEffect(() => {
    if (!userId) return

    const resultsRef = ref(database, `${userId}/Scores`)
    const resultsQuery = query(resultsRef, orderByChild('timestamp'))

    const unsubscribe = onValue(
      resultsQuery,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const grouped = {
            easy: [],
            medium: [],
            hard: []
          }

          Object.values(data).forEach(result => {
            const difficulty = result.difficulty.toLowerCase()
            if (grouped[difficulty]) {
              grouped[difficulty].push(result)
            }
          })

          Object.keys(grouped).forEach(key => {
            grouped[key].reverse()
          })

          setResults(grouped)
        }
        setLoading(false)
      },
      (error) => {
        console.error('Error loading results:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userId])

  const formatDateTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getDifficultyLabel = (difficulty) => {
    const diff = getDifficultyByKey(difficulty.toLowerCase())
    return diff ? diff.label : difficulty
  }

  const renderTable = (difficulty) => {
    const data = results[difficulty] || []

    if (data.length === 0) {
      return <div className="empty-message">No games played yet at this difficulty.</div>
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Word</th>
            <th>Outcome</th>
            <th>Time (sec)</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((result, idx) => (
            <tr key={idx}>
              <td><strong>{result.word}</strong></td>
              <td>
                <span className={`difficulty-badge difficulty-${result.outcome === 'won' ? 'easy' : 'hard'}`}>
                  {result.outcome.toUpperCase()}
                </span>
              </td>
              <td>{result.timeTaken}s</td>
              <td>{formatDateTime(result.dateTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Game Results</h2>
      <div className="tabs">
        {Object.entries(DIFFICULTIES).map(([key, diff]) => (
          <button
            key={diff.key}
            className={`tab-btn ${activeTab === diff.key ? 'active' : ''}`}
            onClick={() => setActiveTab(diff.key)}
          >
            {diff.label}
          </button>
        ))}
      </div>

      {renderTable(activeTab)}
    </div>
  )
}
