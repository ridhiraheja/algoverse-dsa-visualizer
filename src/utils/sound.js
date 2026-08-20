// Web Audio API Sound Synthesizer Engine

let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export function playTone(frequency = 440, duration = 0.08, type = 'sine', volume = 0.08) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start()
    oscillator.stop(ctx.currentTime + duration)
  } catch (err) {
    // Silently ignore audio context autoplay restrictions
  }
}

export function playClickSound() {
  playTone(400, 0.04, 'square', 0.03)
}

export function playCompareSound(value = 50, maxValue = 100) {
  const norm = Math.max(0, Math.min(1, value / (maxValue || 1)))
  const freq = 180 + norm * 650
  playTone(freq, 0.05, 'sine', 0.06)
}

export function playSwapSound() {
  playTone(750, 0.06, 'triangle', 0.08)
}

export function playSuccessSound() {
  // Arpeggio melody: C5 -> E5 -> G5 -> C6
  const notes = [523.25, 659.25, 783.99, 1046.50]
  notes.forEach((freq, index) => {
    setTimeout(() => {
      playTone(freq, 0.15, 'sine', 0.1)
    }, index * 90)
  })
}

export function playErrorSound() {
  playTone(150, 0.2, 'sawtooth', 0.08)
}
