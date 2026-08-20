// Step Generators for Two Pointers Algorithms

export function generateTwoSumSortedSteps(arr = [1, 3, 5, 8, 12, 15, 19], target = 13) {
  const n = arr.length
  let left = 0
  let right = n - 1
  const steps = []

  steps.push({
    array: [...arr],
    comparing: [left, right],
    swapped: false,
    line: 1,
    description: `Start Two Pointers search for Target Sum = ${target}`
  })

  let found = false
  while (left < right) {
    const currSum = arr[left] + arr[right]
    if (currSum === target) {
      steps.push({
        array: [...arr],
        comparing: [left, right],
        swapped: true,
        sorted: [left, right],
        line: 4,
        description: `Found Target Sum! Elements at index ${left} (${arr[left]}) + index ${right} (${arr[right]}) = ${target}`
      })
      found = true
      break
    } else if (currSum < target) {
      steps.push({
        array: [...arr],
        comparing: [left, right],
        swapped: false,
        line: 5,
        description: `Sum (${currSum}) < Target (${target}). Moving LEFT pointer rightward (index ${left} -> ${left + 1})`
      })
      left++
    } else {
      steps.push({
        array: [...arr],
        comparing: [left, right],
        swapped: false,
        line: 6,
        description: `Sum (${currSum}) > Target (${target}). Moving RIGHT pointer leftward (index ${right} -> ${right - 1})`
      })
      right--
    }
  }

  if (!found) {
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: false,
      line: 8,
      description: `No two elements sum to ${target}.`
    })
  }

  return steps
}

export function generateContainerWithMostWaterSteps(heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]) {
  const n = heights.length
  let left = 0
  let right = n - 1
  let maxArea = 0
  let bestPair = [left, right]
  const steps = []

  steps.push({
    array: [...heights],
    comparing: [left, right],
    swapped: false,
    line: 1,
    description: `Container With Most Water: Initial heights ${heights.join(', ')}`
  })

  while (left < right) {
    const w = right - left
    const h = Math.min(heights[left], heights[right])
    const area = w * h

    if (area > maxArea) {
      maxArea = area
      bestPair = [left, right]
    }

    steps.push({
      array: [...heights],
      comparing: [left, right],
      swapped: true,
      sorted: [...bestPair],
      line: 5,
      description: `Width = ${w}, Min Height = ${h} -> Area = ${area}. Max Area so far = ${maxArea}`
    })

    if (heights[left] < heights[right]) left++
    else right--
  }

  steps.push({
    array: [...heights],
    comparing: [],
    swapped: false,
    sorted: [...bestPair],
    line: 10,
    description: `Maximum Water Container Area Found: ${maxArea} between indices ${bestPair[0]} and ${bestPair[1]}`
  })

  return steps
}

export function generateTortoiseHareSteps(arr = [1, 3, 4, 2, 2]) {
  let slow = 0
  let fast = 0
  const steps = []

  steps.push({
    array: [...arr],
    comparing: [slow, fast],
    swapped: false,
    line: 1,
    description: `Floyd's Tortoise and Hare (LeetCode 287/141): Start Cycle Detection`
  })

  let firstStep = true
  while (firstStep || slow !== fast) {
    firstStep = false
    slow = arr[slow]
    fast = arr[arr[fast]]

    steps.push({
      array: [...arr],
      comparing: [slow, fast],
      swapped: false,
      line: 4,
      description: `Tortoise 🐢 at index ${slow} (val ${arr[slow]}), Hare 🐇 at index ${fast} (val ${arr[fast]})`
    })

    if (slow === fast) {
      steps.push({
        array: [...arr],
        comparing: [slow, fast],
        swapped: true,
        sorted: [slow],
        line: 6,
        description: `CYCLE INTERSECTION FOUND! Tortoise 🐢 and Hare 🐇 met at index ${slow}`
      })
      break
    }
  }

  let slow2 = 0
  steps.push({
    array: [...arr],
    comparing: [slow2, slow],
    swapped: false,
    line: 8,
    description: 'Resetting second Tortoise 🐢 to index 0 to locate cycle entrance...'
  })

  while (slow2 !== slow) {
    slow2 = arr[slow2]
    slow = arr[slow]
    steps.push({
      array: [...arr],
      comparing: [slow2, slow],
      swapped: false,
      line: 10,
      description: `Moving both pointers at 1 step: Tortoise 1 at ${slow2}, Tortoise 2 at ${slow}`
    })
  }

  steps.push({
    array: [...arr],
    comparing: [slow],
    swapped: true,
    sorted: [slow],
    line: 12,
    description: `Duplicate Number / Cycle Entrance Found: ${slow}!`
  })

  return steps
}
