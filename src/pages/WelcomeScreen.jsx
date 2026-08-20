import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Play, Code2, Zap, Sun, Moon, CheckCircle2, BarChart2, Layers, Gamepad2, Cpu } from 'lucide-react'
import { useSound } from '../context/SoundContext'
import { useTheme } from '../context/ThemeContext'

export default function WelcomeScreen() {
  const navigate = useNavigate()
  const { triggerSuccess, triggerClick } = useSound()
  const { theme, toggleTheme } = useTheme()

  const handleStart = () => {
    triggerSuccess()
    navigate('/home')
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 2rem',
        background: 'var(--bg-primary)'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}
      >
        
        {/* LEFT COLUMN: Logo, Header, & "Let's Start" Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingRight: '1rem' }}>
          
          {/* Top Logo & Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Sparkles size={28} color="#fff" />
              </div>
            </div>

            <h1
              style={{
                fontSize: '4rem',
                fontWeight: 800,
                fontFamily: "'Georgia', 'Playfair Display', serif",
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                color: 'var(--text-primary)'
              }}
            >
              AlgoVerse
            </h1>
            <p
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginTop: '0.6rem'
              }}
            >
              YOUR TRUSTED SOURCE FOR ALGORITHM VISUALIZATION
            </p>
          </div>

          {/* Center Card replacing login box with "Let's Start" action */}
          <div
            className="glass-card"
            style={{
              padding: '2.2rem',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Welcome to AlgoVerse
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.5 }}>
                Master Data Structures &amp; Algorithms with real-time interactive animations, multi-language code IDE execution, and complexity analysis.
              </p>
            </div>

            {/* Quick Feature Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'Interactive Step-by-Step Canvas Animations',
                'Live C++, Java, Python & JS IDE Compiler',
                'Dynamic Programming, Sorting & Graph Visualizers'
              ].map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Main "Let's Start" Action Button */}
            <button
              onClick={handleStart}
              style={{
                width: '100%',
                padding: '1.05rem 1.8rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#fff',
                fontSize: '1.15rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>Let's Start</span>
              <ArrowRight size={20} />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Large Rounded GREEN Gradient Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 40%, #059669 80%, #10b981 100%)',
            borderRadius: '28px',
            padding: '3rem 2.8rem',
            color: '#fff',
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(4, 120, 87, 0.35)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Top Header Badge & Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Sparkles size={14} />
              Interactive DSA Visualizer
            </span>

            <button
              onClick={() => { toggleTheme(); triggerClick(); }}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Center Main Feature Text */}
          <div style={{ margin: '2rem 0' }}>
            <h2
              style={{
                fontSize: '3.6rem',
                fontWeight: 800,
                fontFamily: "'Georgia', 'Playfair Display', serif",
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginBottom: '1.2rem',
                color: '#ffffff'
              }}
            >
              Algorithm Visualizer
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '480px'
              }}
            >
              Visualize your Data Structures &amp; Algorithms here. Don't let complex concepts overwhelm you. Get instant, step-by-step interactive animations and code executions for any algorithm.
            </p>
          </div>

          {/* NEW REPLACED SECTION: Platform Feature Highlights Grid (Replaces old QuickSort & Kadane blocks) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}
          >
            {[
              { title: '9 Categories', sub: 'Sorting, DP, Graphs & Trees', icon: Layers },
              { title: 'Multi-Language IDE', sub: 'C++, Java, Python & JS', icon: Cpu },
              { title: 'Big-O Handbook', sub: 'Time & Space Complexity', icon: BarChart2 },
              { title: 'Fun Zone Games', sub: 'N-Queens, Sudoku & Maze', icon: Gamepad2 }
            ].map((stat, idx) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    padding: '1rem 1.2rem',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconComponent size={16} color="#34d399" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                      {stat.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    {stat.sub}
                  </span>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </div>
  )
}
