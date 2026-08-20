import React from 'react'

export default function StairsVisualizer({ step }) {
  if (!step) {
    return (
      <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No Climbing Stairs Data
      </div>
    )
  }

  // Handle both DP array format step and custom stair step
  const dpValues = (step.dp && step.dp[1]) ? step.dp[1] : [1, 1, 2, 3, 5, 8, 13]
  const currentStepIdx = step.currCell ? step.currCell[1] : (step.stepIndex || 0)
  const totalStairs = dpValues.length - 1

  return (
    <div style={{
      height: '350px',
      width: '100%',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--border-color)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Title & Description Header */}
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
          🪜 Climbing Stairs Visualizer
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          {step.description || `Step ${currentStepIdx}: Total Ways = ${dpValues[currentStepIdx]}`}
        </p>
      </div>

      {/* Ascending Physical Staircase Canvas */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        height: '220px',
        paddingBottom: '10px'
      }}>
        {Array.from({ length: totalStairs + 1 }, (_, i) => {
          const stepHeight = 30 + i * 22
          const isCurrent = currentStepIdx === i
          const isPrev1 = currentStepIdx - 1 === i
          const isPrev2 = currentStepIdx - 2 === i
          const isVisited = i <= currentStepIdx

          let bg = 'var(--bg-primary)'
          let border = '1px solid var(--border-color)'
          let textColor = 'var(--text-muted)'

          if (isCurrent) {
            bg = 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)'
            border = '2px solid #fbbf24'
            textColor = '#fff'
          } else if (isPrev1 || isPrev2) {
            bg = 'rgba(99, 102, 241, 0.25)'
            border = '1px dashed var(--accent-primary)'
            textColor = 'var(--accent-primary)'
          } else if (isVisited) {
            bg = 'rgba(16, 185, 129, 0.25)'
            border = '1px solid rgba(16, 185, 129, 0.5)'
            textColor = 'var(--success)'
          }

          return (
            <div
              key={`stair-step-${i}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: `${Math.max(45, 300 / (totalStairs + 1))}px`,
                height: `${stepHeight}px`,
                background: bg,
                border,
                borderRadius: '8px 8px 0 0',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: isCurrent ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none'
              }}
            >
              {/* Climber Icon on Current Step */}
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: '-32px',
                  fontSize: '1.5rem',
                  animation: 'bounce 0.6s infinite alternate'
                }}>
                  🏃‍♂️
                </div>
              )}

              {/* Step Index Label */}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '6px', color: textColor }}>
                Stair {i}
              </span>

              {/* Ways Value Badge */}
              <div style={{
                marginTop: 'auto',
                marginBottom: '8px',
                padding: '2px 6px',
                borderRadius: '10px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: textColor
              }}>
                {dpValues[i]} {dpValues[i] === 1 ? 'way' : 'ways'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recurrence Relation Formula Bar */}
      <div style={{
        fontSize: '0.8rem',
        background: 'var(--bg-primary)',
        padding: '0.3rem 0.8rem',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-code)'
      }}>
        dp[{currentStepIdx}] = dp[{Math.max(0, currentStepIdx - 1)}] ({dpValues[Math.max(0, currentStepIdx - 1)] || 0}) + dp[{Math.max(0, currentStepIdx - 2)}] ({dpValues[Math.max(0, currentStepIdx - 2)] || 0})
      </div>

    </div>
  )
}
