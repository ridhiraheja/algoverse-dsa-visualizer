import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Grid, RotateCcw, Lightbulb, CheckCircle2, Trophy, AlertTriangle } from 'lucide-react'
import { useSound } from '../../context/SoundContext'
import { saveGameScore, getGameHighScore } from '../../utils/gameState'

const PUZZLES = {
  easy: [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ],
  medium: [
    [0,0,0,2,6,0,7,0,1],
    [6,8,0,0,7,0,0,9,0],
    [1,9,0,0,0,4,5,0,0],
    [8,2,0,1,0,0,0,4,0],
    [0,0,4,6,0,2,9,0,0],
    [0,5,0,0,0,3,0,2,8],
    [0,0,9,3,0,0,0,7,4],
    [0,4,0,0,5,0,0,3,6],
    [7,0,3,0,1,8,0,0,0]
  ],
  hard: [
    [0,2,0,6,0,8,0,0,0],
    [5,8,0,0,0,9,7,0,0],
    [0,0,0,0,4,0,0,0,0],
    [3,7,0,0,0,0,5,0,0],
    [6,0,0,0,0,0,0,0,4],
    [0,0,8,0,0,0,0,1,3],
    [0,0,0,0,2,0,0,0,0],
    [0,0,9,8,0,0,0,3,6],
    [0,0,0,3,0,6,0,9,0]
  ]
}

const SOLUTIONS = {
  easy: [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ]
}

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState('easy')
  const [grid, setGrid] = useState([])
  const [initialMask, setInitialMask] = useState([])
  const [selectedCell, setSelectedCell] = useState(null) // [r, c]
  const [conflicts, setConflicts] = useState([])
  const [timer, setTimer] = useState(0)
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)
  const [bestScore, setBestScore] = useState(getGameHighScore('sudoku'))

  const { triggerClick, triggerSuccess, triggerError } = useSound()

  // Initialize board
  useEffect(() => {
    resetBoard()
  }, [difficulty])

  // Timer effect
  useEffect(() => {
    if (isWon) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [isWon])

  const resetBoard = () => {
    const base = PUZZLES[difficulty] || PUZZLES.easy
    const newGrid = base.map(row => [...row])
    const mask = base.map(row => row.map(val => val > 0))
    setGrid(newGrid)
    setInitialMask(mask)
    setSelectedCell(null)
    setConflicts([])
    setTimer(0)
    setMoves(0)
    setIsWon(false)
  }

  const validateCell = (r, c, val, g) => {
    if (val === 0) return true
    for (let i = 0; i < 9; i++) {
      if (i !== c && g[r][i] === val) return false
      if (i !== r && g[i][c] === val) return false
      const subR = 3 * Math.floor(r / 3) + Math.floor(i / 3)
      const subC = 3 * Math.floor(c / 3) + i % 3
      if ((subR !== r || subC !== c) && g[subR][subC] === val) return false
    }
    return true
  }

  const handleNumberInput = (num) => {
    if (!selectedCell || isWon) return
    const [r, c] = selectedCell
    if (initialMask[r][c]) return // Cannot edit prefilled cell

    triggerClick()
    setMoves(m => m + 1)

    const newGrid = grid.map(row => [...row])
    newGrid[r][c] = num
    setGrid(newGrid)

    // Conflict check
    const isValid = validateCell(r, c, num, newGrid)
    if (!isValid && num > 0) {
      setConflicts([...conflicts, `${r}-${c}`])
      triggerError()
    } else {
      setConflicts(conflicts.filter(key => key !== `${r}-${c}`))
    }

    // Check full solution win
    let isFull = true
    let isAllValid = true
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newGrid[i][j] === 0) isFull = false
        if (!validateCell(i, j, newGrid[i][j], newGrid)) isAllValid = false
      }
    }

    if (isFull && isAllValid) {
      setIsWon(true)
      triggerSuccess()
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
      saveGameScore('sudoku', { timeInSeconds: timer, moves })
      setBestScore(getGameHighScore('sudoku'))
    }
  }

  const giveHint = () => {
    if (!selectedCell || isWon) return
    const [r, c] = selectedCell
    if (initialMask[r][c]) return

    const solution = SOLUTIONS[difficulty] || SOLUTIONS.easy
    const correctVal = solution[r][c]
    if (correctVal) {
      handleNumberInput(correctVal)
    }
  }

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
            <Grid size={20} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Sudoku Challenge</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Fill the 9x9 grid so every row, column, and 3x3 box contains digits 1-9 without duplicates.
          </p>
        </div>

        {/* Difficulty Selector */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['easy', 'medium', 'hard'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => { setDifficulty(lvl); triggerClick(); }}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '6px',
                background: difficulty === lvl ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: difficulty === lvl ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'capitalize'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Sudoku Grid */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(9, 1fr)',
            gap: '2px',
            width: '320px',
            height: '320px',
            border: '2px solid var(--accent-primary)',
            background: '#0b0f19',
            padding: '2px',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c
                const isFixed = initialMask[r] && initialMask[r][c]
                const isConflicted = conflicts.includes(`${r}-${c}`)
                const isThickRight = (c + 1) % 3 === 0 && c < 8
                const isThickBottom = (r + 1) % 3 === 0 && r < 8

                let bg = isFixed ? 'rgba(255,255,255,0.04)' : '#131b2e'
                if (isSelected) bg = 'rgba(99, 102, 241, 0.4)'
                if (isConflicted) bg = 'rgba(239, 68, 68, 0.4)'

                return (
                  <button
                    key={`sudoku-cell-${r}-${c}`}
                    onClick={() => { setSelectedCell([r, c]); triggerClick(); }}
                    style={{
                      background: bg,
                      marginRight: isThickRight ? '3px' : '0',
                      marginBottom: isThickBottom ? '3px' : '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: isFixed ? 800 : 600,
                      fontSize: '1.05rem',
                      color: isFixed ? '#f1f5f9' : (isConflicted ? '#ef4444' : '#38bdf8'),
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid transparent'
                    }}
                  >
                    {val > 0 ? val : ''}
                  </button>
                )
              })
            )}
          </div>

          {/* Keypad 1-9 */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleNumberInput(0)}
              style={{
                padding: '0 0.8rem',
                height: '34px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: 'var(--danger)',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Stats & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Game Stats</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Timer:</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-code)' }}>{timer}s</span>
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
                <span style={{ fontWeight: 700 }}>{bestScore.timeInSeconds}s</span>
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
              <CheckCircle2 size={20} />
              <span>Sudoku Solved! Time: {timer}s ({moves} moves)</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={giveHint}
              style={{
                flex: 1,
                padding: '0.7rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: 'var(--warning)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Lightbulb size={16} />
              <span>Get Hint</span>
            </button>

            <button
              onClick={() => { resetBoard(); triggerClick(); }}
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
              <span>Reset Game</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}
