// Step Generators for Backtracking Algorithms (N-Queens, Sudoku Solver, Rat in a Maze)

export const DEFAULT_SUDOKU_GRID = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
]

export function generateNQueensSteps(n = 4, difficulty = 'easy') {
  if (difficulty === 'medium') n = 6
  else if (difficulty === 'hard') n = 8
  else n = 4

  const steps = []
  const board = Array.from({ length: n }, () => Array(n).fill(0))

  function isSafe(b, row, col) {
    for (let i = 0; i < col; i++) if (b[row][i] === 1) return false
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (b[i][j] === 1) return false
    for (let i = row, j = col; i < n && j >= 0; i++, j--) if (b[i][j] === 1) return false
    return true
  }

  function solve(col) {
    if (col >= n) {
      steps.push({
        board: board.map(r => [...r]),
        current: null,
        line: 2,
        description: `Valid ${n}-Queens placement solution found!`
      })
      return true
    }

    for (let i = 0; i < n; i++) {
      steps.push({
        board: board.map(r => [...r]),
        current: [i, col],
        line: 3,
        description: `Checking if queen can be placed at row ${i}, col ${col}`
      })

      if (isSafe(board, i, col)) {
        board[i][col] = 1
        steps.push({
          board: board.map(r => [...r]),
          current: [i, col],
          line: 5,
          description: `Placed Queen at row ${i}, col ${col}`
        })

        if (solve(col + 1)) return true

        board[i][col] = 0
        steps.push({
          board: board.map(r => [...r]),
          current: [i, col],
          line: 8,
          description: `Backtracking: Removed Queen from row ${i}, col ${col}`
        })
      }
    }
    return false
  }

  steps.push({
    board: board.map(r => [...r]),
    current: null,
    line: 1,
    description: `Start N-Queens solver on ${difficulty.toUpperCase()} (${n}x${n} chessboard)`
  })

  solve(0)
  return steps
}

export function generateSudokuSteps(initialGrid = DEFAULT_SUDOKU_GRID) {
  const grid = initialGrid.map(r => [...r])
  const steps = []

  function isValid(r, c, val) {
    for (let i = 0; i < 9; i++) {
      if (grid[r][i] === val || grid[i][c] === val) return false
    }
    const boxR = 3 * Math.floor(r / 3)
    const boxC = 3 * Math.floor(c / 3)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxR + i][boxC + j] === val) return false
      }
    }
    return true
  }

  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(r, c, num)) {
              grid[r][c] = num
              steps.push({
                grid: grid.map(row => [...row]),
                current: [r, c],
                line: 5,
                description: `Placed ${num} at position (${r + 1}, ${c + 1})`
              })

              if (solve()) return true

              grid[r][c] = 0
              steps.push({
                grid: grid.map(row => [...row]),
                current: [r, c],
                line: 8,
                description: `Backtracking: Cleared cell (${r + 1}, ${c + 1})`
              })
            }
          }
          return false
        }
      }
    }
    return true
  }

  steps.push({
    grid: grid.map(r => [...r]),
    current: [0, 0],
    line: 1,
    description: 'Start Sudoku Backtracking Solver (9x9 Grid)'
  })

  solve()

  steps.push({
    grid: grid.map(r => [...r]),
    current: null,
    line: 10,
    description: 'Sudoku Solved Successfully!'
  })

  return steps.slice(0, 60)
}

export function generateRatInMazeSteps(maze = null, difficulty = 'easy') {
  let grid = maze
  if (!grid) {
    if (difficulty === 'medium') {
      grid = [
        [1, 0, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1],
        [0, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 1, 0],
        [1, 1, 1, 0, 1, 1]
      ]
    } else if (difficulty === 'hard') {
      grid = [
        [1, 0, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 0],
        [0, 0, 1, 1, 0, 0, 1, 1],
        [1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 0, 1],
        [0, 0, 1, 1, 1, 1, 0, 1],
        [1, 1, 1, 0, 0, 1, 1, 1]
      ]
    } else {
      grid = [
        [1, 0, 0, 0],
        [1, 1, 0, 1],
        [0, 1, 0, 0],
        [1, 1, 1, 1]
      ]
    }
  }

  const n = grid.length
  const sol = Array.from({ length: n }, () => Array(n).fill(0))
  const steps = []

  function isSafe(x, y) {
    return x >= 0 && x < n && y >= 0 && y < n && grid[x][y] === 1 && sol[x][y] === 0
  }

  function solve(x, y) {
    if (x === n - 1 && y === n - 1) {
      sol[x][y] = 1
      steps.push({
        grid: grid.map(r => [...r]),
        sol: sol.map(r => [...r]),
        current: [x, y],
        line: 2,
        description: `REACHED DESTINATION (${x}, ${y})!`
      })
      return true
    }

    if (isSafe(x, y)) {
      sol[x][y] = 1
      steps.push({
        grid: grid.map(r => [...r]),
        sol: sol.map(r => [...r]),
        current: [x, y],
        line: 4,
        description: `Move rat to cell (${x}, ${y})`
      })

      if (solve(x + 1, y)) return true
      if (solve(x, y + 1)) return true
      if (solve(x - 1, y)) return true
      if (solve(x, y - 1)) return true

      sol[x][y] = 0
      steps.push({
        grid: grid.map(r => [...r]),
        sol: sol.map(r => [...r]),
        current: [x, y],
        line: 8,
        description: `Backtracking from (${x}, ${y})`
      })
      return false
    }
    return false
  }

  steps.push({
    grid: grid.map(r => [...r]),
    sol: sol.map(r => [...r]),
    current: [0, 0],
    line: 1,
    description: `Start Rat in a Maze (${difficulty.toUpperCase()} ${n}x${n} grid)`
  })

  solve(0, 0)
  return steps
}
