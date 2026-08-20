import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Grid, Compass, Trophy, Play, ArrowRight, Trash2 } from 'lucide-react'
import { getHighScores, clearGameScores } from '../utils/gameState'
import { useSound } from '../context/SoundContext'

export default function FunZone() {
  const [scores, setScores] = useState({})
  const { triggerClick } = useSound()

  useEffect(() => {
    setScores(getHighScores())
  }, [])

  const handleClearScores = () => {
    clearGameScores()
    setScores({})
    triggerClick()
  }

  const games = [
    {
      id: 'nqueens',
      title: 'N-Queens Placement Puzzle',
      path: '/fun-zone/n-queens',
      desc: 'Place N queens on an N×N board such that no two queens attack each other. Real-time conflict feedback!',
      icon: Crown,
      color: '#f59e0b',
      badge: 'Backtracking'
    },
    {
      id: 'sudoku',
      title: 'Sudoku Challenge',
      path: '/fun-zone/sudoku',
      desc: 'Playable 9x9 Sudoku puzzle. Pick difficulty, track moves & time, test hints, and validate entries.',
      icon: Grid,
      color: '#38bdf8',
      badge: 'Grid Logic'
    },
    {
      id: 'ratmaze',
      title: 'Rat in a Maze Runner',
      path: '/fun-zone/rat-maze',
      desc: 'Navigate the rat through a maze to reach the cheese! Race against the computer algorithm path.',
      icon: Compass,
      color: '#10b981',
      badge: 'Pathfinding'
    }
  ]

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Fun Zone Header */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <Trophy size={16} />
            <span>DSA Arcade & Gaming Hub</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Algorithm Fun Zone</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Play interactive games based on classic algorithm problems. Test your logic, set high scores, and race solvers!
          </p>
        </div>

        {Object.keys(scores).length > 0 && (
          <button
            onClick={handleClearScores}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Trash2 size={14} />
            <span>Reset High Scores</span>
          </button>
        )}
      </div>

      {/* Game Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {games.map((game, idx) => {
          const Icon = game.icon
          const highScore = scores[game.id]

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Link
                to={game.path}
                onClick={triggerClick}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  padding: '1.8rem',
                  height: '100%',
                  textDecoration: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: `${game.color}20`,
                    border: `1px solid ${game.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={28} color={game.color} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {game.badge}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {game.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {game.desc}
                  </p>
                </div>

                {/* LocalStorage High Score Banner */}
                <div style={{
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Trophy size={16} color="var(--warning)" />
                    <span>Best Record:</span>
                  </div>
                  <span style={{ fontWeight: 700, color: highScore ? 'var(--warning)' : 'var(--text-muted)' }}>
                    {highScore ? (
                      highScore.timeInSeconds !== undefined ? `${highScore.timeInSeconds}s (${highScore.moves} moves)` : `${highScore.moves} moves`
                    ) : 'No score set yet'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: game.color, fontWeight: 700, fontSize: '0.9rem', marginTop: 'auto' }}>
                  <Play size={16} fill={game.color} />
                  <span>Play Game Now</span>
                  <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}
