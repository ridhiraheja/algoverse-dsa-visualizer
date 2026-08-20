# Python Backtracking Algorithms Step Generator

DEFAULT_SUDOKU_GRID = [
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


def generate_n_queens_steps(n=4, difficulty='easy'):
    if difficulty == 'medium':
        n = 6
    elif difficulty == 'hard':
        n = 8
    else:
        n = 4

    steps = []
    board = [[0] * n for _ in range(n)]

    def is_safe(b, row, col):
        for i in range(col):
            if b[row][i] == 1:
                return False
        for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
            if b[i][j] == 1:
                return False
        for i, j in zip(range(row, n, 1), range(col, -1, -1)):
            if b[i][j] == 1:
                return False
        return True

    def solve(col):
        if col >= n:
            steps.append({
                'board': [row[:] for row in board],
                'currCell': None,
                'action': 'solution',
                'description': f'Valid {n}-Queens placement solution found!'
            })
            return True

        for i in range(n):
            steps.append({
                'board': [row[:] for row in board],
                'currCell': [i, col],
                'action': 'check',
                'description': f'Checking if queen can be placed at row {i}, col {col}'
            })

            if is_safe(board, i, col):
                board[i][col] = 1
                steps.append({
                    'board': [row[:] for row in board],
                    'currCell': [i, col],
                    'action': 'place',
                    'description': f'Placed Queen at row {i}, col {col}'
                })

                if solve(col + 1):
                    return True

                board[i][col] = 0
                steps.append({
                    'board': [row[:] for row in board],
                    'currCell': [i, col],
                    'action': 'backtrack',
                    'description': f'Backtracking: Removed Queen from row {i}, col {col}'
                })

        return False

    steps.append({
        'board': [row[:] for row in board],
        'currCell': None,
        'action': 'start',
        'description': f'Start N-Queens solver on {difficulty.upper()} ({n}x{n} chessboard)'
    })
    solve(0)
    return steps


def generate_sudoku_steps(initial_grid=None):
    if initial_grid is None:
        initial_grid = DEFAULT_SUDOKU_GRID

    grid = [row[:] for row in initial_grid]
    steps = []

    def is_valid(r, c, val):
        for i in range(9):
            if grid[r][i] == val or grid[i][c] == val:
                return False
        box_r, box_c = 3 * (r // 3), 3 * (c // 3)
        for i in range(3):
            for j in range(3):
                if grid[box_r + i][box_c + j] == val:
                    return False
        return True

    def solve():
        for r in range(9):
            for c in range(9):
                if grid[r][c] == 0:
                    for num in range(1, 10):
                        if is_valid(r, c, num):
                            grid[r][c] = num
                            steps.append({
                                'grid': [row[:] for row in grid],
                                'currCell': [r, c],
                                'action': 'place',
                                'description': f'Placed {num} at position ({r + 1}, {c + 1})'
                            })

                            if solve():
                                return True

                            grid[r][c] = 0
                            steps.append({
                                'grid': [row[:] for row in grid],
                                'currCell': [r, c],
                                'action': 'backtrack',
                                'description': f'Backtracking: Cleared cell ({r + 1}, {c + 1})'
                            })

                    return False
        return True

    steps.append({
        'grid': [row[:] for row in grid],
        'currCell': [0, 0],
        'action': 'start',
        'description': 'Start Sudoku Backtracking Solver (9x9 Grid)'
    })
    solve()

    steps.append({
        'grid': [row[:] for row in grid],
        'currCell': None,
        'action': 'complete',
        'description': 'Sudoku Solved Successfully!'
    })

    return steps[:60]  # Return initial 60 solution steps for fast animation performance


def generate_rat_in_maze_steps(maze=None, difficulty='easy'):
    if maze is None:
        if difficulty == 'medium':
            maze = [
                [1, 0, 1, 1, 1, 1],
                [1, 1, 1, 0, 0, 1],
                [0, 1, 0, 1, 1, 1],
                [1, 1, 1, 1, 0, 1],
                [1, 0, 0, 1, 1, 0],
                [1, 1, 1, 0, 1, 1]
            ]
        elif difficulty == 'hard':
            maze = [
                [1, 0, 1, 1, 1, 0, 1, 1],
                [1, 1, 1, 0, 1, 1, 1, 0],
                [0, 0, 1, 1, 0, 0, 1, 1],
                [1, 1, 0, 1, 1, 1, 0, 1],
                [1, 0, 1, 1, 0, 1, 1, 1],
                [1, 1, 1, 0, 1, 0, 0, 1],
                [0, 0, 1, 1, 1, 1, 0, 1],
                [1, 1, 1, 0, 0, 1, 1, 1]
            ]
        else:
            maze = [
                [1, 0, 0, 0],
                [1, 1, 0, 1],
                [0, 1, 0, 0],
                [1, 1, 1, 1]
            ]

    n = len(maze)
    sol = [[0] * n for _ in range(n)]
    steps = []

    def is_safe(x, y):
        return 0 <= x < n and 0 <= y < n and maze[x][y] == 1 and sol[x][y] == 0

    def solve(x, y):
        if x == n - 1 and y == n - 1:
            sol[x][y] = 1
            steps.append({
                'grid': [row[:] for row in maze],
                'sol': [row[:] for row in sol],
                'curr': [x, y],
                'action': 'reached',
                'description': f'REACHED DESTINATION ({x},{y}) on {difficulty.upper()} maze ({n}x{n})!'
            })
            return True

        if is_safe(x, y):
            sol[x][y] = 1
            steps.append({
                'grid': [row[:] for row in maze],
                'sol': [row[:] for row in sol],
                'curr': [x, y],
                'action': 'move',
                'description': f'Move rat to cell ({x}, {y})'
            })

            # Move Down
            if solve(x + 1, y): return True
            # Move Right
            if solve(x, y + 1): return True
            # Move Up
            if solve(x - 1, y): return True
            # Move Left
            if solve(x, y - 1): return True

            sol[x][y] = 0
            steps.append({
                'grid': [row[:] for row in maze],
                'sol': [row[:] for row in sol],
                'curr': [x, y],
                'action': 'backtrack',
                'description': f'Dead end at ({x}, {y}). Backtracking rat'
            })
            return False

        return False

    steps.append({
        'grid': [row[:] for row in maze],
        'sol': [row[:] for row in sol],
        'curr': [0, 0],
        'action': 'start',
        'description': f'Start Rat in a Maze ({difficulty.upper()} {n}x{n} grid)'
    })
    solve(0, 0)
    return steps
