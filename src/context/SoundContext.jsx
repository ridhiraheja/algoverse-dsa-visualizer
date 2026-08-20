import React, { createContext, useContext, useState } from 'react'
import { playClickSound, playCompareSound, playSwapSound, playSuccessSound, playErrorSound } from '../utils/sound'

const SoundContext = createContext()

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  const triggerClick = () => {
    if (!isMuted) playClickSound()
  }

  const triggerCompare = (value, maxValue) => {
    if (!isMuted) playCompareSound(value, maxValue)
  }

  const triggerSwap = () => {
    if (!isMuted) playSwapSound()
  }

  const triggerSuccess = () => {
    if (!isMuted) playSuccessSound()
  }

  const triggerError = () => {
    if (!isMuted) playErrorSound()
  }

  return (
    <SoundContext.Provider value={{
      isMuted,
      toggleMute,
      triggerClick,
      triggerCompare,
      triggerSwap,
      triggerSuccess,
      triggerError
    }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  return useContext(SoundContext)
}
