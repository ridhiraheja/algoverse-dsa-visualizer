// LocalStorage Game Statistics & High Score Manager

const STORAGE_KEY = 'algoverse_game_scores'

export function getHighScores() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (err) {
    return {}
  }
}

export function getGameHighScore(gameName) {
  const scores = getHighScores()
  return scores[gameName] || null
}

export function saveGameScore(gameName, scoreData) {
  try {
    const scores = getHighScores()
    const existing = scores[gameName]

    // Determine if new score is better (lower time / fewer moves / higher score)
    let isNewBest = false

    if (!existing) {
      isNewBest = true
    } else if (scoreData.timeInSeconds !== undefined && existing.timeInSeconds !== undefined) {
      if (scoreData.timeInSeconds < existing.timeInSeconds) isNewBest = true
    } else if (scoreData.moves !== undefined && existing.moves !== undefined) {
      if (scoreData.moves < existing.moves) isNewBest = true
    } else if (scoreData.score !== undefined && existing.score !== undefined) {
      if (scoreData.score > existing.score) isNewBest = true
    }

    if (isNewBest) {
      scores[gameName] = {
        ...scoreData,
        timestamp: new Date().toLocaleDateString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
      return true // New high score achieved!
    }
  } catch (err) {
    console.error('Failed to save score:', err)
  }
  return false
}

export function clearGameScores() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('Failed to clear scores:', err)
  }
}
