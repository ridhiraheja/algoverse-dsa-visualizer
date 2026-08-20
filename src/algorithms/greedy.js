// Step Generators for Greedy Algorithms

export function generateActivitySelectionSteps(startTimes = [1, 3, 0, 5, 8, 5], finishTimes = [2, 4, 6, 7, 9, 9]) {
  const n = startTimes.length
  const activities = Array.from({ length: n }, (_, i) => i).sort((a, b) => finishTimes[a] - finishTimes[b])
  const selected = []
  const steps = []

  steps.push({
    array: finishTimes,
    comparing: [],
    swapped: false,
    line: 1,
    description: 'Activity Selection: Sorting activities by finish time.'
  })

  let lastFinish = -1
  for (const idx of activities) {
    const st = startTimes[idx]
    const ft = finishTimes[idx]
    if (st >= lastFinish) {
      selected.push(idx)
      lastFinish = ft
      steps.push({
        array: [...finishTimes],
        comparing: [idx],
        swapped: true,
        sorted: [...selected],
        line: 4,
        description: `Selected Activity ${idx + 1} (Start: ${st}, Finish: ${ft})`
      })
    } else {
      steps.push({
        array: [...finishTimes],
        comparing: [idx],
        swapped: false,
        sorted: [...selected],
        line: 6,
        description: `Skipped Activity ${idx + 1} (Start: ${st} < Last Finish: ${lastFinish})`
      })
    }
  }

  steps.push({
    array: [...finishTimes],
    comparing: [],
    swapped: false,
    sorted: [...selected],
    line: 8,
    description: `Greedy Activity Selection Complete! Selected ${selected.length} non-overlapping activities.`
  })

  return steps
}

export function generateFractionalKnapsackSteps() {
  const weights = [10, 20, 30]
  const values = [60, 100, 120]
  const ratios = values.map((v, i) => v / weights[i])
  const capacity = 50
  let totalVal = 0
  let currCap = capacity
  const steps = []

  steps.push({
    array: [60, 100, 120],
    comparing: [],
    swapped: false,
    line: 1,
    description: 'Fractional Knapsack: Calculate Value-to-Weight ratios.'
  })

  const items = [0, 1, 2].sort((a, b) => ratios[b] - ratios[a])
  for (const idx of items) {
    const w = weights[idx]
    const v = values[idx]
    if (w <= currCap) {
      currCap -= w
      totalVal += v
      steps.push({
        array: [60, 100, 120],
        comparing: [idx],
        swapped: true,
        line: 4,
        description: `Took 100% of Item ${idx + 1} (Weight: ${w}, Value: ${v}). Remaining Capacity: ${currCap}`
      })
    } else {
      const fraction = currCap / w
      totalVal += v * fraction
      steps.push({
        array: [60, 100, 120],
        comparing: [idx],
        swapped: true,
        line: 6,
        description: `Took ${Math.floor(fraction * 100)}% of Item ${idx + 1} (Weight: ${currCap}/${w}, Value: ${Math.floor(v * fraction)}). Capacity full.`
      })
      break
    }
  }

  steps.push({
    array: [60, 100, 120],
    comparing: [],
    swapped: false,
    sorted: [0, 1, 2],
    line: 8,
    description: `Fractional Knapsack Complete! Total Maximum Value: ${totalVal}`
  })

  return steps
}

export function generateBoatsToSavePeopleSteps(people = [3, 2, 2, 1], limit = 3) {
  const peopleSorted = [...people].sort((a, b) => a - b)
  const n = peopleSorted.length
  let left = 0
  let right = n - 1
  let boats = 0
  const steps = []

  steps.push({
    array: [...peopleSorted],
    comparing: [left, right],
    swapped: false,
    line: 1,
    description: `Boats to Save People (LeetCode 881): Sorted people weights ${peopleSorted.join(', ')}, Boat Limit = ${limit}`
  })

  while (left <= right) {
    if (left === right) {
      boats++
      steps.push({
        array: [...peopleSorted],
        comparing: [left],
        swapped: true,
        line: 3,
        description: `Boat #${boats}: Single remaining person weight ${peopleSorted[left]} placed in boat.`
      })
      break
    }

    if (peopleSorted[left] + peopleSorted[right] <= limit) {
      boats++
      steps.push({
        array: [...peopleSorted],
        comparing: [left, right],
        swapped: true,
        line: 5,
        description: `Boat #${boats}: Paired Person ${peopleSorted[left]} + Person ${peopleSorted[right]} = ${peopleSorted[left] + peopleSorted[right]} <= ${limit}`
      })
      left++
      right--
    } else {
      boats++
      steps.push({
        array: [...peopleSorted],
        comparing: [right],
        swapped: false,
        line: 7,
        description: `Boat #${boats}: Heaviest person weight ${peopleSorted[right]} exceeds pair limit. Placed alone.`
      })
      right--
    }
  }

  steps.push({
    array: [...peopleSorted],
    comparing: [],
    swapped: false,
    sorted: Array.from({ length: n }, (_, i) => i),
    line: 10,
    description: `Greedy Boats Assignment Complete! Minimum Boats Required: ${boats}`
  })

  return steps
}

export function generateStonePileSteps(piles = [5, 4, 9]) {
  const pilesCurr = [...piles]
  const steps = []

  steps.push({
    array: [...pilesCurr],
    comparing: [],
    swapped: false,
    line: 1,
    description: `Stone Piles (LeetCode 1962): Initial stone piles ${pilesCurr.join(', ')}`
  })

  for (let stepNum = 1; stepNum <= 3; stepNum++) {
    const maxVal = Math.max(...pilesCurr)
    const maxIdx = pilesCurr.indexOf(maxVal)
    const reducedVal = maxVal - Math.floor(maxVal / 2)
    pilesCurr[maxIdx] = reducedVal

    steps.push({
      array: [...pilesCurr],
      comparing: [maxIdx],
      swapped: true,
      line: 4,
      description: `Greedy Operation #${stepNum}: Picked max pile ${maxVal} at index ${maxIdx}. Reduced to ${reducedVal} stones.`
    })
  }

  steps.push({
    array: [...pilesCurr],
    comparing: [],
    swapped: false,
    sorted: Array.from({ length: pilesCurr.length }, (_, i) => i),
    line: 8,
    description: `Stone Piles Minimization Complete! Final total stones: ${pilesCurr.reduce((a, b) => a + b, 0)}`
  })

  return steps
}
