// Step Generators for Dynamic Programming Algorithms

export function generateKnapsackSteps() {
  const W = 50
  const wt = [10, 20, 30]
  const val = [60, 100, 120]
  const n = wt.length
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0))
  const steps = []

  steps.push({
    dp: dp.map(r => [...r]),
    currentCell: [0, 0],
    line: 1,
    description: `Initialize 0/1 Knapsack DP table (${n + 1}x${W + 1})`
  })

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (wt[i - 1] <= w) {
        dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])
      } else {
        dp[i][w] = dp[i - 1][w]
      }

      if (w % 10 === 0 || w === W) {
        steps.push({
          dp: dp.map(r => [...r]),
          currentCell: [i, w],
          line: 5,
          description: `Item ${i} (wt:${wt[i - 1]}, val:${val[i - 1]}). Max profit at capacity ${w} = ${dp[i][w]}`
        })
      }
    }
  }

  steps.push({
    dp: dp.map(r => [...r]),
    currentCell: [n, W],
    line: 10,
    description: `0/1 Knapsack Complete! Max Profit: ${dp[n][W]}`
  })

  return steps
}

export function generateLCSSteps(text1 = 'ABCBDAB', text2 = 'BDCABA') {
  const m = text1.length
  const n = text2.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  const steps = []

  steps.push({
    dp: dp.map(r => [...r]),
    currentCell: [0, 0],
    line: 1,
    description: `Start LCS DP for "${text1}" vs "${text2}"`
  })

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }

      if ((i * n + j) % 3 === 0 || (i === m && j === n)) {
        steps.push({
          dp: dp.map(r => [...r]),
          currentCell: [i, j],
          line: 5,
          description: text1[i - 1] === text2[j - 1]
            ? `Match! "${text1[i - 1]}" == "${text2[j - 1]}". Length = ${dp[i][j]}`
            : `Mismatch "${text1[i - 1]}" != "${text2[j - 1]}". Max length = ${dp[i][j]}`
        })
      }
    }
  }

  steps.push({
    dp: dp.map(r => [...r]),
    currentCell: [m, n],
    line: 10,
    description: `LCS Complete! Longest Common Subsequence Length = ${dp[m][n]}`
  })

  return steps
}

export function generateClimbingStairsSteps(n = 5) {
  const dp = Array(n + 1).fill(0)
  dp[0] = 1
  dp[1] = 1
  const steps = []

  steps.push({
    dp: [Array(n + 1).fill(0), [...dp]],
    currentCell: [1, 1],
    line: 1,
    description: 'Climbing Stairs: Initialize base cases dp[0] = 1, dp[1] = 1'
  })

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
    steps.push({
      dp: [Array(n + 1).fill(0), [...dp]],
      currentCell: [1, i],
      line: 4,
      description: `Step ${i}: dp[${i}] = dp[${i - 1}] (${dp[i - 1]}) + dp[${i - 2}] (${dp[i - 2]}) = ${dp[i]} ways`
    })
  }

  steps.push({
    dp: [Array(n + 1).fill(0), [...dp]],
    currentCell: [1, n],
    line: 6,
    description: `Climbing Stairs Complete! Total ways to climb ${n} stairs = ${dp[n]}`
  })

  return steps
}

export function generateFibonacciDPSteps(n = 7) {
  const dp = Array(n + 1).fill(0)
  dp[0] = 0
  if (n >= 1) dp[1] = 1
  const steps = []

  steps.push({
    dp: [Array(n + 1).fill(0), [...dp]],
    currentCell: [1, 1],
    line: 1,
    description: 'Fibonacci DP: Initialize base cases F(0) = 0, F(1) = 1'
  })

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
    steps.push({
      dp: [Array(n + 1).fill(0), [...dp]],
      currentCell: [1, i],
      line: 4,
      description: `Term ${i}: F(${i}) = F(${i - 1}) (${dp[i - 1]}) + F(${i - 2}) (${dp[i - 2]}) = ${dp[i]}`
    })
  }

  steps.push({
    dp: [Array(n + 1).fill(0), [...dp]],
    currentCell: [1, n],
    line: 6,
    description: `Fibonacci DP Complete! ${n}-th Fibonacci Term = ${dp[n]}`
  })

  return steps
}

export function generateKadanesAlgoSteps(arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) {
  const n = arr.length
  let maxSoFar = arr[0]
  let currMax = arr[0]
  let startIdx = 0
  let endIdx = 0
  let tempStart = 0
  const steps = []

  steps.push({
    array: [...arr],
    comparing: [0],
    swapped: false,
    line: 1,
    description: `Kadane's Algorithm (LeetCode 53): Start Max Subarray Sum search on ${arr.join(', ')}`
  })

  for (let i = 1; i < n; i++) {
    const val = arr[i]
    if (val > currMax + val) {
      currMax = val
      tempStart = i
    } else {
      currMax += val
    }

    if (currMax > maxSoFar) {
      maxSoFar = currMax
      startIdx = tempStart
      endIdx = i
    }

    steps.push({
      array: [...arr],
      comparing: Array.from({ length: i - tempStart + 1 }, (_, idx) => tempStart + idx),
      swapped: true,
      sorted: Array.from({ length: endIdx - startIdx + 1 }, (_, idx) => startIdx + idx),
      line: 4,
      description: `Index ${i} (val ${val}): Current Subarray Sum = ${currMax}. Max Subarray Sum = ${maxSoFar}`
    })
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: false,
    sorted: Array.from({ length: endIdx - startIdx + 1 }, (_, idx) => startIdx + idx),
    line: 8,
    description: `Kadane's Algorithm Complete! Maximum Subarray Sum: ${maxSoFar} (Subarray indices ${startIdx} to ${endIdx})`
  })

  return steps
}
