import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Volume2, VolumeX, Play, Code2, Gamepad2, BarChart3, GitCompare, BookOpen, Sparkles, Sun, Moon, Home as HomeIcon } from 'lucide-react'
import { useSound } from '../../context/SoundContext'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const location = useLocation()
  const { isMuted, toggleMute, triggerClick } = useSound()
  const { theme, toggleTheme } = useTheme()

  const navLinks = [
    { path: '/home', label: 'Home', icon: HomeIcon },
    { path: '/visualizer', label: 'Visualizer', icon: Play },
    { path: '/custom-code', label: 'Custom Code', icon: Code2 },
    { path: '/fun-zone', label: 'Fun Zone', icon: Gamepad2 },
    { path: '/benchmark', label: 'Benchmark', icon: BarChart3 },
    { path: '/compare', label: 'Compare', icon: GitCompare },
    { path: '/complexity', label: 'Complexity', icon: BookOpen }
  ]

  return (
    <header className="glass-nav sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo in Vibrant Emerald Green */}
        <Link to="/" onClick={triggerClick} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <span
              style={{
                fontSize: '1.45rem',
                fontWeight: 900,
                fontFamily: 'var(--font-heading)',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 60%, #047857 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                display: 'block'
              }}
            >
              AlgoVerse
            </span>
            <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--text-muted)', marginTop: '-4px', fontWeight: 500 }}>
              Notebook DSA Visualizer &amp; Playground
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={triggerClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Header Right Action Buttons: Theme Toggle & Sound Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* Theme Toggle Button (Light/Dark Mode) */}
          <button
            onClick={() => { toggleTheme(); triggerClick(); }}
            title={theme === 'dark' ? 'Switch to Light Notebook Mode' : 'Switch to Dark Notebook Mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--border-radius-sm)',
              background: theme === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: theme === 'dark' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
              color: theme === 'dark' ? '#fbbf24' : '#059669',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Audio Sound Toggle Button */}
          <button
            onClick={() => { toggleMute(); triggerClick(); }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--border-radius-sm)',
              background: isMuted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: isMuted ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
              color: isMuted ? 'var(--danger)' : 'var(--success)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

        </div>

      </div>
    </header>
  )
}
