import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { Crown, RotateCcw, Trophy, CheckCircle, AlertCircle, Play } from 'lucide-react'
import { useSound } from '../../context/SoundContext'
import { saveGameScore, getGameHighScore } from '../../utils/gameState'

export default function NQueensGame() {
  const [boardSize, setBoardSize] = useState(4)
  const [queens, setQueens] = useState([]) // Array of [r, c]
  const [conflicts, setConflicts] = useState([])
  const [isWon, setIsWon] = useState(false)
  const [moves, setMoves] = useState(0)
  const [bestScore, setBestScore] = useState(getGameHighScore('nqueens'))

  const { triggerClick, triggerSuccess, triggerError } = useSound()

  // Reset board on size change
  useEffect(() => {
    resetGame()
  }, [boardSize])

  // Check conflicts whenever queens array changes
  useEffect(() => {
    const conflictList = []
    for (let i = 0; i < queens.length; i++) {
      for (let j = i + 1; j < queens.length; j++) {
        const [r1, c1] = queens[i]
        const [r2, c2] = queens[j]

        // Same row, col, or diagonal
        if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
          conflictList.push(`${r1}-${c1}`)
          conflictList.push(`${r2}-${c2}`)
        }
      }
    }
    setConflicts([...new Set(conflictList)])

    // Win condition: N queens placed with 0 conflicts
    if (queens.length === boardSize && conflictList.length === 0) {
      setIsWon(true)
      triggerSuccess()
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      saveGameScore('nqueens', { moves, boardSize })
      setBestScore(getGameHighScore('nqueens'))
    }
  }, [queens, boardSize])

  const handleCellClick = (r, c) => {
    if (isWon) return
    triggerClick()
    setMoves(m => m + 1)

    const existingIndex = queens.findIndex(([qR, qC]) => qR === r && qC === c)
    if (existingIndex >= 0) {
      // Remove queen
      setQueens(queens.filter((_, idx) => idx !== existingIndex))
    } else {
      if (queens.length >= boardSize) {
        triggerError()
        return
      }
      // Place queen
      setQueens([...queens, [r, c]])
    }
  }

  const resetGame = () => {
    setQueens([])
    setConflicts([])
    setIsWon(false)
    setMoves(0)
  }

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
            <Crown size={20} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>N-Queens Game</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Place {boardSize} queens on the {boardSize}x{boardSize} chessboard with zero conflicting rows, columns, or diagonals.
          </p>
        </div>

        {/* Board Size Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Board Size:</span>
          {[4, 5, 6, 7, 8].map((size) => (
            <button
              key={size}
              onClick={() => { setBoardSize(size); triggerClick(); }}
              style={{
                padding: '0.35rem 0.7rem',
                borderRadius: '6px',
                background: boardSize === size ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: boardSize === size ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              {size}x{size}
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Arena */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Chessboard Grid */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gap: '4px',
            width: '320px',
            height: '320px',
            border: '2px solid var(--border-color)',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#0b0f19',
            padding: '4px'
          }}>
            {Array.from({ length: boardSize }).map((_, r) =>
              Array.from({ length: boardSize }).map((_, c) => {
                const isDark = (r + c) % 2 === 1
                const isQueen = queens.some(([qR, qC]) => qR === r && qC === c)
                const isConflicted = conflicts.includes(`${r}-${c}`)

                let bg = isDark ? '#1e293b' : '#334155'
                let border = '1px solid transparent'

                if (isConflicted) {
                  bg = 'rgba(239, 68, 68, 0.4)'
                  border = '2px solid var(--danger)'
                } else if (isQueen) {
                  bg = 'rgba(99, 102, 241, 0.4)'
                  border = '2px solid var(--accent-primary)'
                }

                return (
                  <button
                    key={`cell-${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    style={{
                      background: bg,
                      border,
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: boardSize > 6 ? '1.2rem' : '1.6rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isQueen ? '👑' : ''}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Game Stats & Solver Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Game Status</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Queens Placed:</span>
              <span style={{ fontWeight: 700, color: queens.length === boardSize ? 'var(--success)' : 'var(--accent-secondary)' }}>
                {queens.length} / {boardSize}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Conflicts Detected:</span>
              <span style={{ fontWeight: 700, color: conflicts.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                {conflicts.length / 2}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Moves:</span>
              <span style={{ fontWeight: 700 }}>{moves}</span>
            </div>

            {bestScore && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Trophy size={14} /> Best Record:
                </span>
                <span style={{ fontWeight: 700 }}>{bestScore.moves} moves</span>
              </div>
            )}
          </div>

          {isWon && (
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid var(--success)',
              color: 'var(--success)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <CheckCircle size={20} />
              <span>Congratulations! Solved in {moves} moves!</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={() => { resetGame(); triggerClick(); }}
              style={{
                flex: 1,
                padding: '0.7rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <RotateCcw size={16} />
              <span>Reset Board</span>
            </button>

            <Link
              to="/visualizer"
              onClick={triggerClick}
              style={{
                flex: 1,
                padding: '0.7rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'var(--accent-primary)',
                color: '#fff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                textDecoration: 'none'
              }}
            >
              <Play size={16} fill="#fff" />
              <span>Show Algorithm</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  )
}
