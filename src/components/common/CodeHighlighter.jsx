import React, { useState } from 'react'

export default function CodeHighlighter({ codeLines = [], activeLine = null, description = '' }) {
  const [selectedLang, setSelectedLang] = useState('javascript')

  // Support both array of strings OR multi-language code object
  let linesToDisplay = []
  if (Array.isArray(codeLines)) {
    linesToDisplay = codeLines
  } else if (typeof codeLines === 'object' && codeLines !== null) {
    linesToDisplay = codeLines[selectedLang] || codeLines.javascript || []
  }

  return (
    <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', height: '100%' }}>
      
      {/* Header & Language Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Code Execution</h3>
          <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
            Line {activeLine !== null ? activeLine : '-'}
          </span>
        </div>

        {/* Multi-Language Selector Tabs */}
        {typeof codeLines === 'object' && !Array.isArray(codeLines) && (
          <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--bg-primary)', padding: '0.2rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'javascript', name: 'JS' },
              { id: 'python', name: 'Py' },
              { id: 'cpp', name: 'C++' },
              { id: 'java', name: 'Java' },
              { id: 'c', name: 'C' }
            ].map((langItem) => (
              <button
                key={langItem.id}
                onClick={() => setSelectedLang(langItem.id)}
                style={{
                  padding: '0.15rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: selectedLang === langItem.id ? 700 : 500,
                  borderRadius: '3px',
                  background: selectedLang === langItem.id ? 'var(--accent-primary)' : 'transparent',
                  color: selectedLang === langItem.id ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {langItem.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step Description */}
      <div style={{
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--border-radius-sm)',
        background: 'var(--bg-primary)',
        borderLeft: '4px solid var(--accent-secondary)',
        fontSize: '0.85rem',
        color: 'var(--text-primary)',
        fontWeight: 500,
        minHeight: '2.4rem',
        border: '1px solid var(--border-color)'
      }}>
        {description || 'Ready to start visualization.'}
      </div>

      {/* Code Lines Display */}
      <div style={{
        fontFamily: 'var(--font-code)',
        fontSize: '0.83rem',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius-sm)',
        padding: '0.8rem',
        overflowX: 'auto',
        maxHeight: '280px',
        overflowY: 'auto',
        border: '1px solid var(--border-color)'
      }}>
        {linesToDisplay.map((lineText, idx) => {
          const lineNumber = idx + 1
          const isActive = lineNumber === activeLine
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 400
              }}
            >
              <span style={{ color: 'var(--text-muted)', minWidth: '24px', textAlign: 'right', userSelect: 'none' }}>
                {lineNumber}
              </span>
              <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', color: 'inherit' }}>
                {lineText}
              </pre>
            </div>
          )
        })}
      </div>
    </div>
  )
}
