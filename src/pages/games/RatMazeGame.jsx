import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Compass, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Flag } from 'lucide-react'
import { useSound } from '../../context/SoundContext'
import { saveGameScore, getGameHighScore } from '../../utils/gameState'

const MAZES = {
  easy: [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ],
  medium: [
    [1, 1, 0, 1, 1, 1],
    [0, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 1]
  ],
  hard: [
    [1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 0, 0, 1],
    [0, 0, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 0, 0, 1, 1, 1]
  ]
}

export default function RatMazeGame() {
  const [difficulty, setDifficulty] = useState('easy')
  const [grid, setGrid] = useState(MAZES.easy)
  const [ratPos, setRatPos] = useState([0, 0])
  const [pathHistory, setPathHistory] = useState([[0, 0]])
  const [algoPath, setAlgoPath] = useState([])
  const [isRaceMode, setIsRaceMode] = useState(false)
  const [timer, setTimer] = useState(0)
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)
  const [bestScore, setBestScore] = useState(getGameHighScore('ratmaze'))

  const { triggerClick, triggerSuccess, triggerError } = useSound()

  const n = grid.length
  const destPos = [n - 1, n - 1]

  const handleDifficultyChange = (diff) => {
    triggerClick()
    setDifficulty(diff)
    setGrid(MAZES[diff] || MAZES.easy)
    setRatPos([0, 0])
    setPathHistory([[0, 0]])
    setAlgoPath([])
    setIsRaceMode(false)
    setTimer(0)
    setMoves(0)
    setIsWon(false)
  }

  // Timer
  useEffect(() => {
    if (isWon) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [isWon])

  // Keyboard arrow listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        if (e.key === 'ArrowUp') moveRat(-1, 0)
        if (e.key === 'ArrowDown') moveRat(1, 0)
        if (e.key === 'ArrowLeft') moveRat(0, -1)
        if (e.key === 'ArrowRight') moveRat(0, 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [ratPos, isWon, grid])

  const moveRat = (dr, dc) => {
    if (isWon) return
    const [r, c] = ratPos
    const nr = r + dr
    const nc = c + dc

    if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 1) {
      triggerClick()
      setRatPos([nr, nc])
      setMoves(m => m + 1)
      setPathHistory(prev => [...prev, [nr, nc]])

      if (nr === destPos[0] && nc === destPos[1]) {
        setIsWon(true)
        triggerSuccess()
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
        saveGameScore('ratmaze', { timeInSeconds: timer, moves })
        setBestScore(getGameHighScore('ratmaze'))
      }
    } else {
      triggerError()
    }
  }

  const computeAlgoPath = () => {
    const queue = [[[0, 0]]]
    const visited = new Set(['0-0'])

    while (queue.length > 0) {
      const path = queue.shift()
      const [r, c] = path[path.length - 1]

      if (r === destPos[0] && c === destPos[1]) {
        setAlgoPath(path)
        setIsRaceMode(true)
        return
      }

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      for (const [dr, dc] of dirs) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 1 && !visited.has(`${nr}-${nc}`)) {
          visited.add(`${nr}-${nc}`)
          queue.push([...path, [nr, nc]])
        }
      }
    }
  }

  const resetMaze = () => {
    setRatPos([0, 0])
    setPathHistory([[0, 0]])
    setAlgoPath([])
    setIsRaceMode(false)
    setTimer(0)
    setMoves(0)
    setIsWon(false)
  }

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
            <Compass size={20} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Rat in a Maze Runner</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Use Keyboard Arrow Keys or D-pad to guide the rat 🐀 to the cheese 🧀 at the bottom-right corner!
          </p>
        </div>

        <button
          onClick={() => { computeAlgoPath(); triggerClick(); }}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius-sm)',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            color: '#818cf8',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Flag size={16} />
          <span>Race Algorithm Path</span>
        </button>
      </div>

      {/* Maze Difficulty Selector */}
      <div className="glass-card" style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>Select Game Difficulty:</span>
        {[
          { id: 'easy', label: '🟢 Easy (4x4 Grid)' },
          { id: 'medium', label: '🟡 Medium (6x6 Grid)' },
          { id: 'hard', label: '🔴 Hard (8x8 Grid)' }
        ].map((diff) => (
          <button
            key={diff.id}
            onClick={() => handleDifficultyChange(diff.id)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: difficulty === diff.id ? 700 : 500,
              background: difficulty === diff.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: difficulty === diff.id ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            {diff.label}
          </button>
        ))}
      </div>

      {/* Main Game Stage & D-Pad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Maze Grid Display */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${n}, 1fr)`,
            gap: '4px',
            width: '320px',
            height: '320px',
            background: '#0b0f19',
            padding: '4px',
            borderRadius: '10px'
          }}>
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isWall = val === 0
                const isRat = ratPos[0] === r && ratPos[1] === c
                const isCheese = destPos[0] === r && destPos[1] === c
                const isTrail = pathHistory.some(([pR, pC]) => pR === r && pC === c)
                const isOptimalAlgo = isRaceMode && algoPath.some(([aR, aC]) => aR === r && aC === c)

                let bg = '#1e293b'
                let icon = ''

                if (isWall) {
                  bg = '#0f172a'
                  icon = '🧱'
                } else if (isRat) {
                  bg = 'rgba(245, 158, 11, 0.5)'
                  icon = '🐀'
                } else if (isCheese) {
                  bg = 'rgba(16, 185, 129, 0.4)'
                  icon = '🧀'
                } else if (isOptimalAlgo) {
                  bg = 'rgba(56, 189, 248, 0.4)'
                  icon = '⭐'
                } else if (isTrail) {
                  bg = 'rgba(99, 102, 241, 0.3)'
                  icon = '🐾'
                }

                return (
                  <div
                    key={`rat-cell-${r}-${c}`}
                    style={{
                      background: bg,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: n > 6 ? '1rem' : '1.3rem'
                    }}
                  >
                    {icon}
                  </div>
                )
              })
            )}
          </div>

          {/* D-Pad Controls */}
          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
            <button
              onClick={() => moveRat(-1, 0)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}
            >
              <ArrowUp size={18} />
            </button>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={() => moveRat(0, -1)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => moveRat(1, 0)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}
              >
                <ArrowDown size={18} />
              </button>
              <button
                onClick={() => moveRat(0, 1)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Maze Stats</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Timer:</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-code)' }}>{timer}s</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Steps Taken:</span>
              <span style={{ fontWeight: 700 }}>{moves}</span>
            </div>

            {isRaceMode && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#38bdf8' }}>
                <span>Optimal Algo Steps:</span>
                <span style={{ fontWeight: 700 }}>{algoPath.length - 1} steps</span>
              </div>
            )}

            {bestScore && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Trophy size={14} /> Best Record:
                </span>
                <span style={{ fontWeight: 700 }}>{bestScore.timeInSeconds}s ({bestScore.moves} steps)</span>
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
              fontWeight: 700
            }}>
              🎉 Maze Solved! Time: {timer}s in {moves} steps!
            </div>
          )}

          <button
            onClick={() => { resetMaze(); triggerClick(); }}
            style={{
              padding: '0.7rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={16} />
            <span>Reset Maze</span>
          </button>

        </div>

      </div>

    </div>
  )
}
