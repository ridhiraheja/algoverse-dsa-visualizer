import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { playClickSound, playCompareSound, playSwapSound, playSuccessSound } from '../utils/sound'

const StepPlayerContext = createContext()

export function StepPlayerProvider({ children }) {
  const [steps, setSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(300) // Delay in ms (10ms to 1000ms)
  const timerRef = useRef(null)

  // Sound triggers on step change
  useEffect(() => {
    try {
      if (!steps || steps.length === 0) return
      const step = steps[currentStepIndex]
      if (!step) return

      if (currentStepIndex === steps.length - 1 && steps.length > 1) {
        playSuccessSound()
      } else if (step.swapped || step.action === 'swap' || step.action === 'backtrack' || step.action === 'move') {
        playSwapSound()
      } else if (step.comparing && step.comparing.length > 0) {
        const val = (step.array && typeof step.array[step.comparing[0]] === 'number') ? step.array[step.comparing[0]] : 50
        playCompareSound(val, 100)
      } else if (step.currentNode || step.currNode || step.activeVal || step.currCell || step.curr) {
        playCompareSound(60, 100)
      } else {
        playClickSound()
      }
    } catch (e) {
      // Audio API fallback
    }
  }, [currentStepIndex, steps])

  // Auto-play interval effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          if (prevIndex >= steps.length - 1) {
            setIsPlaying(false)
            return prevIndex
          }
          return prevIndex + 1
        })
      }, speed)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, speed, steps.length])

  const loadSteps = (newSteps) => {
    setIsPlaying(false)
    setSteps(newSteps)
    setCurrentStepIndex(0)
  }

  const play = () => {
    playClickSound()
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0)
    }
    setIsPlaying(true)
  }

  const pause = () => {
    playClickSound()
    setIsPlaying(false)
  }

  const stepNext = () => {
    playClickSound()
    setIsPlaying(false)
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const stepPrev = () => {
    playClickSound()
    setIsPlaying(false)
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const reset = () => {
    playClickSound()
    setIsPlaying(false)
    setCurrentStepIndex(0)
  }

  const currentStep = steps[currentStepIndex] || null

  return (
    <StepPlayerContext.Provider value={{
      steps,
      currentStepIndex,
      currentStep,
      isPlaying,
      speed,
      setSpeed,
      loadSteps,
      play,
      pause,
      stepNext,
      stepPrev,
      reset,
      setCurrentStepIndex
    }}>
      {children}
    </StepPlayerContext.Provider>
  )
}

export function useStepPlayer() {
  return useContext(StepPlayerContext)
}
