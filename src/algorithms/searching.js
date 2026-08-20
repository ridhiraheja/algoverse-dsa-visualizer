// Step Generators for Searching Algorithms

export function generateLinearSearchSteps(initialArray, target) {
  const steps = []
  const arr = [...initialArray]
  const n = arr.length

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: [], found: -1, line: 1, description: `Start Linear Search for target: ${target}` })

  for (let i = 0; i < n; i++) {
    steps.push({
      array: [...arr],
      comparing: [i],
      swapped: false,
      sorted: [],
      found: -1,
      line: 2,
      description: `Checking index ${i}: is arr[${i}] (${arr[i]}) equal to ${target}?`
    })

    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        comparing: [i],
        swapped: false,
        sorted: [i],
        found: i,
        line: 3,
        description: `Target ${target} FOUND at index ${i}!`
      })
      return steps
    }
  }

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: [], found: -1, line: 5, description: `Target ${target} NOT found in the array.` })
  return steps
}

export function generateBinarySearchSteps(initialArray, target) {
  const steps = []
  const arr = [...initialArray].sort((a, b) => a - b) // Ensure array is sorted
  const n = arr.length

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: [], found: -1, line: 1, description: `Start Binary Search for target: ${target} on sorted array` })

  let low = 0, high = n - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    steps.push({
      array: [...arr],
      comparing: [mid],
      range: [low, high],
      swapped: false,
      sorted: [],
      found: -1,
      line: 3,
      description: `Range [${low}, ${high}]. Calculate mid index ${mid} (value: ${arr[mid]})`
    })

    if (arr[mid] === target) {
      steps.push({
        array: [...arr],
        comparing: [mid],
        range: [low, high],
        swapped: false,
        sorted: [mid],
        found: mid,
        line: 4,
        description: `Target ${target} FOUND at mid index ${mid}!`
      })
      return steps
    }

    if (arr[mid] < target) {
      low = mid + 1
      steps.push({
        array: [...arr],
        comparing: [mid],
        range: [low, high],
        swapped: false,
        sorted: [],
        found: -1,
        line: 5,
        description: `${arr[mid]} < ${target}. Target must be in right half. Move low pointer to index ${low}`
      })
    } else {
      high = mid - 1
      steps.push({
        array: [...arr],
        comparing: [mid],
        range: [low, high],
        swapped: false,
        sorted: [],
        found: -1,
        line: 6,
        description: `${arr[mid]} > ${target}. Target must be in left half. Move high pointer to index ${high}`
      })
    }
  }

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: [], found: -1, line: 8, description: `Target ${target} NOT found.` })
  return steps
}
