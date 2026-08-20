import React from 'react'

export default function GridVisualizer({ step, type = 'nQueens' }) {
  if (!step) {
    return (
      <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No Grid Data
      </div>
    )
  }

  // N-Queens Visualizer
  if (type === 'nQueens' && step.board) {
    const board = step.board
    const n = board.length
    const current = step.current || []

    return (
      <div style={{
        height: '350px',
        width: '100%',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gap: '4px',
          width: '280px',
          height: '280px'
        }}>
          {board.map((row, r) =>
            row.map((val, c) => {
              const isDark = (r + c) % 2 === 1
              const isCurrent = current[0] === r && current[1] === c
              const isQueen = val === 1

              let bg = isDark ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-primary)'
              let border = '1px solid var(--border-color)'

              if (isCurrent) {
                bg = 'rgba(245, 158, 11, 0.4)'
                border = '2px solid var(--warning)'
              } else if (isQueen) {
                bg = 'rgba(99, 102, 241, 0.4)'
                border = '2px solid var(--accent-primary)'
              }

              return (
                <div
                  key={`cell-${r}-${c}`}
                  style={{
                    background: bg,
                    border,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: n > 6 ? '1.2rem' : '1.6rem'
                  }}
                >
                  {isQueen ? '👑' : ''}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  // Sudoku Visualizer
  if (type === 'sudokuSolver' && step.grid) {
    const grid = step.grid
    const current = step.current || []

    return (
      <div style={{
        height: '350px',
        width: '100%',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: '2px',
          width: '320px',
          height: '320px',
          border: '2px solid var(--accent-primary)',
          background: 'var(--bg-primary)',
          padding: '2px'
        }}>
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isCurrent = current[0] === r && current[1] === c
              const isThickRight = (c + 1) % 3 === 0 && c < 8
              const isThickBottom = (r + 1) % 3 === 0 && r < 8

              return (
                <div
                  key={`sudoku-${r}-${c}`}
                  style={{
                    background: isCurrent ? 'rgba(245, 158, 11, 0.4)' : 'var(--bg-primary)',
                    marginRight: isThickRight ? '3px' : '0',
                    marginBottom: isThickBottom ? '3px' : '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: val > 0 ? (isCurrent ? '#fbbf24' : 'var(--accent-primary)') : 'transparent'
                  }}
                >
                  {val > 0 ? val : ''}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  // Rat in a Maze Visualizer
  if (type === 'ratInMaze' && step.grid) {
    const grid = step.grid
    const sol = step.sol || []
    const current = step.current || []

    return (
      <div style={{
        height: '350px',
        width: '100%',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
          gap: '6px',
          width: '280px',
          height: '280px'
        }}>
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isWall = val === 0
              const isPath = sol[r] && sol[r][c] === 1
              const isRat = current[0] === r && current[1] === c
              const isDest = r === grid.length - 1 && c === grid.length - 1

              let bg = 'var(--bg-primary)'
              let icon = ''

              if (isWall) {
                bg = 'rgba(15, 23, 42, 0.25)'
                icon = '🧱'
              } else if (isRat) {
                bg = 'rgba(245, 158, 11, 0.5)'
                icon = '🐀'
              } else if (isDest) {
                bg = 'rgba(16, 185, 129, 0.4)'
                icon = '🧀'
              } else if (isPath) {
                bg = 'rgba(99, 102, 241, 0.4)'
                icon = '🐾'
              }

              return (
                <div
                  key={`maze-${r}-${c}`}
                  style={{
                    background: bg,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {icon}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return null
}
