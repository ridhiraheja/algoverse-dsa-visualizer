# Python Dynamic Programming Algorithms Step Generator

def generate_knapsack_steps(capacity=50, weights=None, values=None):
    if weights is None:
        weights = [10, 20, 30]
    if values is None:
        values = [60, 100, 120]

    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    steps = []

    steps.append({
        'dp': [row[:] for row in dp],
        'currCell': [0, 0],
        'action': 'init',
        'description': f'Initialize 0/1 Knapsack DP table ({n + 1}x{capacity + 1})'
    })

    for i in range(1, n + 1):
        w_i, v_i = weights[i - 1], values[i - 1]
        for w in range(1, capacity + 1):
            if w_i <= w:
                include_val = v_i + dp[i - 1][w - w_i]
                exclude_val = dp[i - 1][w]
                dp[i][w] = max(include_val, exclude_val)
                description = f'Item {i} (wt:{w_i}, val:{v_i}) fits in cap {w}. Max(Include: {include_val}, Exclude: {exclude_val}) = {dp[i][w]}'
            else:
                dp[i][w] = dp[i - 1][w]
                description = f'Item {i} (wt:{w_i}) exceeds cap {w}. Carry over dp[{i - 1}][{w}] = {dp[i][w]}'

            if w % 10 == 0 or w == capacity:
                steps.append({
                    'dp': [row[:] for row in dp],
                    'currCell': [i, w],
                    'action': 'update',
                    'description': description
                })

    steps.append({
        'dp': [row[:] for row in dp],
        'currCell': [n, capacity],
        'action': 'complete',
        'description': f'0/1 Knapsack Complete! Max Profit: {dp[n][capacity]}'
    })
    return steps


def generate_lcs_steps(text1="ABCBDAB", text2="BDCABA"):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    steps = []

    steps.append({
        'dp': [row[:] for row in dp],
        'currCell': [0, 0],
        'action': 'init',
        'description': f'Start LCS DP for "{text1}" vs "{text2}"'
    })

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                desc = f'Match! "{text1[i - 1]}" == "{text2[j - 1]}". dp[{i}][{j}] = 1 + dp[{i - 1}][{j - 1}] = {dp[i][j]}'
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                desc = f'Mismatch "{text1[i - 1]}" != "{text2[j - 1]}". dp[{i}][{j}] = max({dp[i - 1][j]}, {dp[i][j - 1]}) = {dp[i][j]}'

            if (i * n + j) % 3 == 0 or (i == m and j == n):
                steps.append({
                    'dp': [row[:] for row in dp],
                    'currCell': [i, j],
                    'action': 'update',
                    'description': desc
                })

    steps.append({
        'dp': [row[:] for row in dp],
        'currCell': [m, n],
        'action': 'complete',
        'description': f'LCS Complete! Longest Common Subsequence Length = {dp[m][n]}'
    })
    return steps


def generate_climbing_stairs_steps(n=5):
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1
    steps = []

    steps.append({
        'dp': [[0] * (n + 1), dp[:]],
        'currCell': [1, 1],
        'action': 'init',
        'description': f'Climbing Stairs: Initialize base cases dp[0] = 1, dp[1] = 1'
    })

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
        steps.append({
            'dp': [[0] * (n + 1), dp[:]],
            'currCell': [1, i],
            'action': 'update',
            'description': f'Step {i}: dp[{i}] = dp[{i - 1}] ({dp[i - 1]}) + dp[{i - 2}] ({dp[i - 2]}) = {dp[i]} ways'
        })

    steps.append({
        'dp': [[0] * (n + 1), dp[:]],
        'currCell': [1, n],
        'action': 'complete',
        'description': f'Climbing Stairs Complete! Total ways to climb {n} stairs = {dp[n]}'
    })
    return steps


def generate_fibonacci_dp_steps(n=7):
    dp = [0] * (n + 1)
    dp[0] = 0
    if n >= 1:
        dp[1] = 1

    steps = []
    steps.append({
        'dp': [[0] * (n + 1), dp[:]],
        'currCell': [1, 1],
        'action': 'init',
        'description': f'Fibonacci DP: Initialize base cases F(0) = 0, F(1) = 1'
    })

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
        steps.append({
            'dp': [[0] * (n + 1), dp[:]],
            'currCell': [1, i],
            'action': 'update',
            'description': f'Term {i}: F({i}) = F({i - 1}) ({dp[i - 1]}) + F({i - 2}) ({dp[i - 2]}) = {dp[i]}'
        })

    steps.append({
        'dp': [[0] * (n + 1), dp[:]],
        'currCell': [1, n],
        'action': 'complete',
        'description': f'Fibonacci DP Complete! {n}-th Fibonacci Term = {dp[n]}'
    })
    return steps


def generate_kadanes_algo_steps(arr=None):
    if arr is None:
        arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

    n = len(arr)
    max_so_far = arr[0]
    curr_max = arr[0]
    start_idx = 0
    end_idx = 0
    temp_start = 0

    steps = [{
        'array': list(arr),
        'comparing': [0],
        'swapped': False,
        'description': f'Kadane\'s Algorithm (LeetCode 53): Start Max Subarray Sum search on {arr}'
    }]

    for i in range(1, n):
        val = arr[i]
        if val > curr_max + val:
            curr_max = val
            temp_start = i
        else:
            curr_max += val

        if curr_max > max_so_far:
            max_so_far = curr_max
            start_idx = temp_start
            end_idx = i

        steps.append({
            'array': list(arr),
            'comparing': list(range(temp_start, i + 1)),
            'swapped': True,
            'sorted': list(range(start_idx, end_idx + 1)),
            'description': f'Index {i} (val {val}): Current Subarray Sum = {curr_max}. Max Subarray Sum = {max_so_far}'
        })

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(start_idx, end_idx + 1)),
        'description': f'Kadane\'s Algorithm Complete! Maximum Subarray Sum: {max_so_far} (Subarray indices {start_idx} to {end_idx})'
    })
    return steps
