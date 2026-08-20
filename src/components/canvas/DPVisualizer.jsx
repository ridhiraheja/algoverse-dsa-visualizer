import React from 'react'

export default function DPVisualizer({ step, type = 'knapsack' }) {
  if (!step || !step.dp) {
    return (
      <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No Dynamic Programming Table Data
      </div>
    )
  }

  const { dp } = step
  const activeCell = step.currCell || step.current || step.curr || null

  const getTitle = () => {
    switch (type) {
      case 'knapsack': return '0/1 Knapsack Dynamic Programming Table'
      case 'lcs': return 'Longest Common Subsequence (LCS) Matrix Table'
      case 'climbingStairs': return 'Climbing Stairs Dynamic Programming Table'
      case 'fibonacciDP': return 'Fibonacci Series Dynamic Programming Table'
      default: return 'Dynamic Programming Table'
    }
  }

  return (
    <div style={{
      height: '350px',
      width: '100%',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--border-color)',
      padding: '1.5rem',
      overflowX: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
        {getTitle()}
      </h4>

      <table style={{ borderCollapse: 'collapse', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
        <tbody>
          {dp.map((row, r) => (
            <tr key={`dp-row-${r}`}>
              {row.map((val, c) => {
                const isCurrent = activeCell && activeCell[0] === r && activeCell[1] === c

                let bg = 'var(--bg-primary)'
                let border = '1px solid var(--border-color)'
                let color = 'var(--text-primary)'

                if (isCurrent) {
                  bg = 'rgba(245, 158, 11, 0.25)'
                  border = '2px solid var(--warning)'
                  color = 'var(--warning)'
                } else if (r === 0) {
                  bg = 'rgba(99, 102, 241, 0.12)'
                  color = 'var(--accent-primary)'
                }

                return (
                  <td
                    key={`dp-cell-${r}-${c}`}
                    style={{
                      padding: '0.6rem 0.9rem',
                      textAlign: 'center',
                      background: bg,
                      border,
                      color,
                      fontWeight: isCurrent ? 700 : 500,
                      minWidth: '40px'
                    }}
                  >
                    {val}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
