import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALGORITHMS, ALGORITHM_CATEGORIES } from '../utils/dsaData'
import { BookOpen, Search, Code, ExternalLink, Play } from 'lucide-react'
import { useSound } from '../context/SoundContext'

export default function ComplexityPanel() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [selectedLang, setSelectedLang] = useState('cpp') // C++ Default as requested
  const { triggerClick, triggerSuccess } = useSound()

  const filteredAlgos = Object.values(ALGORITHMS).filter((algo) => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = selectedCat === 'all' || algo.category === selectedCat
    return matchesSearch && matchesCat
  })

  const openCodeInIDE = (algo, langKey) => {
    triggerSuccess()
    const targetCodeArray = Array.isArray(algo.code)
      ? algo.code
      : (algo.code?.[langKey] || algo.code?.cpp || algo.code?.javascript || [])
    
    const fullCodeString = targetCodeArray.join('\n')

    navigate('/custom-code', {
      state: {
        algoId: algo.id,
        algoName: algo.name,
        code: fullCodeString,
        lang: langKey
      }
    })
  }

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Filter Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)' }}>
            <BookOpen size={24} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Algorithm Complexity Handbook</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Complete educational cheat-sheet listing Big-O time &amp; space complexity metrics and C++ implementation code. Click any code box to run it in the C++ IDE!
          </p>
        </div>

        {/* Search Bar, Language Selector, & Category Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search algorithm name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.9rem 0.5rem 2.4rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Language Selector */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Code Language:</span>
            {[
              { id: 'cpp', label: 'C++ (Default)' },
              { id: 'java', label: 'Java' },
              { id: 'python', label: 'Python 3' },
              { id: 'javascript', label: 'JS' },
              { id: 'c', label: 'C' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => { triggerClick(); setSelectedLang(lang.id); }}
                style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: '4px',
                  background: selectedLang === lang.id ? 'var(--accent-secondary)' : 'var(--bg-primary)',
                  color: selectedLang === lang.id ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => { triggerClick(); setSelectedCat('all'); }}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              background: selectedCat === 'all' ? 'var(--accent-primary)' : 'var(--bg-primary)',
              color: selectedCat === 'all' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              border: '1px solid var(--border-color)'
            }}
          >
            All Algorithms ({Object.keys(ALGORITHMS).length})
          </button>
          {ALGORITHM_CATEGORIES.map((cat) => {
            const count = Object.values(ALGORITHMS).filter(a => a.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => { triggerClick(); setSelectedCat(cat.id); }}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  background: selectedCat === cat.id ? 'var(--accent-primary)' : 'var(--bg-primary)',
                  color: selectedCat === cat.id ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  border: '1px solid var(--border-color)'
                }}
              >
                {cat.name} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Complexity Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {filteredAlgos.map((algo) => {
          const timeBest = typeof algo.timeComplexity === 'object' ? algo.timeComplexity.best : algo.timeComplexity
          const timeAvg = typeof algo.timeComplexity === 'object' ? algo.timeComplexity.average : algo.timeComplexity
          const timeWorst = typeof algo.timeComplexity === 'object' ? algo.timeComplexity.worst : algo.timeComplexity
          const spaceComp = algo.spaceComplexity || 'O(1)'

          // Code lines array safely retrieved for selected language (C++ default)
          const codeLines = Array.isArray(algo.code)
            ? algo.code
            : (algo.code?.[selectedLang] || algo.code?.cpp || algo.code?.javascript || [])

          return (
            <div key={algo.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{algo.name}</h3>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(99,102,241,0.2)', color: 'var(--accent-primary)', textTransform: 'capitalize', fontWeight: 700 }}>
                    {algo.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{algo.description}</p>
              </div>

              {/* Metrics Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', background: 'var(--bg-primary)', padding: '0.9rem', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Best Time:</span>
                  <p style={{ color: 'var(--success)', fontWeight: 800, fontFamily: 'var(--font-code)' }}>{timeBest}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Average Time:</span>
                  <p style={{ color: 'var(--warning)', fontWeight: 800, fontFamily: 'var(--font-code)' }}>{timeAvg}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Worst Time:</span>
                  <p style={{ color: 'var(--danger)', fontWeight: 800, fontFamily: 'var(--font-code)' }}>{timeWorst}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Space Complexity:</span>
                  <p style={{ color: '#38bdf8', fontWeight: 800, fontFamily: 'var(--font-code)' }}>{spaceComp}</p>
                </div>
              </div>

              {/* Multi-language Code Snippet with Click-to-Run IDE Button */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Code size={14} />
                    {selectedLang.toUpperCase()} Implementation:
                  </span>
                  <button
                    onClick={() => openCodeInIDE(algo, selectedLang)}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '4px',
                      background: 'var(--accent-primary)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    <Play size={12} fill="#fff" />
                    <span>Run in IDE</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                <div
                  onClick={() => openCodeInIDE(algo, selectedLang)}
                  title="Click to open and run in IDE"
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <pre style={{
                    background: 'var(--bg-primary)',
                    padding: '0.9rem',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-code)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    overflowX: 'auto',
                    border: '1px solid var(--border-color)',
                    margin: 0,
                    lineHeight: 1.4,
                    transition: 'all 0.2s ease'
                  }}>
                    {codeLines.join('\n')}
                  </pre>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
