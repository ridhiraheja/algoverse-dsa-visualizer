import React from 'react'
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap } from 'lucide-react'
import { useStepPlayer } from '../../context/StepPlayerContext'
import { useSound } from '../../context/SoundContext'

export default function Controls() {
  const {
    steps,
    currentStepIndex,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    stepNext,
    stepPrev,
    reset,
    setCurrentStepIndex
  } = useStepPlayer()
  const { triggerClick } = useSound()

  const totalSteps = steps.length
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0

  return (
    <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
          <span>Step {totalSteps > 0 ? currentStepIndex + 1 : 0} of {totalSteps}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
            transition: 'width 0.15s ease'
          }} />
        </div>
      </div>

      {/* Main Playback Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* Reset */}
          <button
            onClick={() => { reset(); triggerClick(); }}
            title="Reset"
            style={{
              padding: '0.6rem 0.9rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>

          {/* Previous Step */}
          <button
            onClick={() => { stepPrev(); triggerClick(); }}
            disabled={currentStepIndex <= 0}
            title="Previous Step"
            style={{
              padding: '0.6rem 0.9rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: currentStepIndex <= 0 ? 'var(--text-muted)' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              opacity: currentStepIndex <= 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <SkipBack size={16} />
            <span>Prev</span>
          </button>

          {/* Play / Pause Toggle */}
          {isPlaying ? (
            <button
              onClick={() => { pause(); triggerClick(); }}
              title="Pause"
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'var(--warning)',
                color: '#000',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
              }}
            >
              <Pause size={18} fill="#000" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={() => { play(); triggerClick(); }}
              title="Play"
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'var(--accent-primary)',
                color: '#fff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
              }}
            >
              <Play size={18} fill="#fff" />
              <span>Play</span>
            </button>
          )}

          {/* Next Step */}
          <button
            onClick={() => { stepNext(); triggerClick(); }}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Next Step"
            style={{
              padding: '0.6rem 0.9rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: currentStepIndex >= totalSteps - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              opacity: currentStepIndex >= totalSteps - 1 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>Next</span>
            <SkipForward size={16} />
          </button>
        </div>

        {/* Animation Speed Controller */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Zap size={16} color="var(--accent-secondary)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Speed:</span>
          <input
            type="range"
            min="10"
            max="800"
            step="10"
            value={810 - speed} // Inverse so slider right is faster
            onChange={(e) => setSpeed(810 - Number(e.target.value))}
            style={{
              cursor: 'pointer',
              accentColor: 'var(--accent-primary)'
            }}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, minWidth: '45px' }}>
            {Math.round(1000 / speed)}x
          </span>
        </div>

      </div>
    </div>
  )
}
