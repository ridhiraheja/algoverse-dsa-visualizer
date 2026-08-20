// Step Generators for 5 Sorting Algorithms

export function generateBubbleSortSteps(initialArray) {
  const steps = []
  const arr = [...initialArray]
  const n = arr.length

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: [], line: 1, description: 'Start Bubble Sort' })

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: false,
        sorted: getSortedIndices(n, i),
        line: 3,
        description: `Compare element ${arr[j]} at index ${j} and ${arr[j + 1]} at index ${j + 1}`
      })

      if (arr[j] > arr[j + 1]) {
        let temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp

        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapped: true,
          sorted: getSortedIndices(n, i),
          line: 4,
          description: `Swap ${arr[j + 1]} and ${arr[j]} since ${arr[j + 1]} > ${arr[j]}`
        })
      }
    }
  }

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: Array.from({ length: n }, (_, i) => i), line: 8, description: 'Sorting Complete!' })
  return steps
}

function getSortedIndices(n, i) {
  const sorted = []
  for (let idx = n - i; idx < n; idx++) {
    if (idx >= 0) sorted.push(idx)
  }
  return sorted
}

export function generateSelectionSortSteps(initialArray) {
  const steps = []
  const arr = [...initialArray]
  const n = arr.length

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: [], line: 1, description: 'Start Selection Sort' })

  for (let i = 0; i < n; i++) {
    let minIdx = i
    steps.push({ array: [...arr], comparing: [i], swapped: false, sorted: Array.from({ length: i }, (_, k) => k), line: 2, description: `Assume minimum is element ${arr[i]} at index ${i}` })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparing: [minIdx, j],
        swapped: false,
        sorted: Array.from({ length: i }, (_, k) => k),
        line: 4,
        description: `Compare element at index ${j} (${arr[j]}) with current min (${arr[minIdx]})`
      })

      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          array: [...arr],
          comparing: [minIdx],
          swapped: false,
          sorted: Array.from({ length: i }, (_, k) => k),
          line: 5,
          description: `New minimum found: ${arr[minIdx]} at index ${minIdx}`
        })
      }
    }

    if (minIdx !== i) {
      let temp = arr[i]
      arr[i] = arr[minIdx]
      arr[minIdx] = temp

      steps.push({
        array: [...arr],
        comparing: [i, minIdx],
        swapped: true,
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        line: 7,
        description: `Swap element at index ${i} (${arr[minIdx]}) with min (${arr[i]})`
      })
    }
  }

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: Array.from({ length: n }, (_, i) => i), line: 9, description: 'Selection Sort Complete!' })
  return steps
}

export function generateInsertionSortSteps(initialArray) {
  const steps = []
  const arr = [...initialArray]
  const n = arr.length

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: [0], line: 1, description: 'Start Insertion Sort' })

  for (let i = 1; i < n; i++) {
    let key = arr[i]
    let j = i - 1

    steps.push({
      array: [...arr],
      comparing: [i],
      swapped: false,
      sorted: Array.from({ length: i }, (_, k) => k),
      line: 2,
      description: `Pick key element ${key} at index ${i}`
    })

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: false,
        sorted: Array.from({ length: i }, (_, k) => k),
        line: 4,
        description: `Compare arr[${j}] (${arr[j]}) with key (${key}). ${arr[j]} > ${key}, move right.`
      })

      arr[j + 1] = arr[j]
      steps.push({
        array: [...arr],
        comparing: [j + 1],
        swapped: true,
        sorted: Array.from({ length: i }, (_, k) => k),
        line: 5,
        description: `Shift element ${arr[j]} right to index ${j + 1}`
      })

      j--
    }

    arr[j + 1] = key
    steps.push({
      array: [...arr],
      comparing: [j + 1],
      swapped: true,
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      line: 8,
      description: `Insert key ${key} at index ${j + 1}`
    })
  }

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: Array.from({ length: n }, (_, i) => i), line: 9, description: 'Insertion Sort Complete!' })
  return steps
}

export function generateMergeSortSteps(initialArray) {
  const steps = []
  const arr = [...initialArray]

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: [], line: 1, description: 'Start Merge Sort' })

  function merge(l, mid, r) {
    const left = arr.slice(l, mid + 1)
    const right = arr.slice(mid + 1, r + 1)
    let i = 0, j = 0, k = l

    while (i < left.length && j < right.length) {
      steps.push({
        array: [...arr],
        comparing: [l + i, mid + 1 + j],
        swapped: false,
        sorted: [],
        line: 5,
        description: `Compare element ${left[i]} from left half and ${right[j]} from right half`
      })

      if (left[i] <= right[j]) {
        arr[k] = left[i]
        i++
      } else {
        arr[k] = right[j]
        j++
      }

      steps.push({
        array: [...arr],
        comparing: [k],
        swapped: true,
        sorted: [],
        line: 6,
        description: `Placed smaller element ${arr[k]} into merged position index ${k}`
      })
      k++
    }

    while (i < left.length) {
      arr[k] = left[i]
      steps.push({ array: [...arr], comparing: [k], swapped: true, sorted: [], line: 6, description: `Placed remaining left element ${arr[k]} into index ${k}` })
      i++; k++
    }

    while (j < right.length) {
      arr[k] = right[j]
      steps.push({ array: [...arr], comparing: [k], swapped: true, sorted: [], line: 6, description: `Placed remaining right element ${arr[k]} into index ${k}` })
      j++; k++
    }
  }

  function sort(l, r) {
    if (l >= r) return
    const mid = Math.floor((l + r) / 2)
    sort(l, mid)
    sort(mid + 1, r)
    merge(l, mid, r)
  }

  sort(0, arr.length - 1)

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: Array.from({ length: arr.length }, (_, i) => i), line: 7, description: 'Merge Sort Complete!' })
  return steps
}

export function generateQuickSortSteps(initialArray) {
  const steps = []
  const arr = [...initialArray]

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: [], line: 1, description: 'Start Quick Sort' })

  function partition(low, high) {
    const pivot = arr[high]
    let i = low - 1

    steps.push({
      array: [...arr],
      comparing: [high],
      swapped: false,
      sorted: [],
      line: 3,
      description: `Chosen pivot element ${pivot} at index ${high}`
    })

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapped: false,
        sorted: [],
        line: 4,
        description: `Compare element arr[${j}] (${arr[j]}) with pivot (${pivot})`
      })

      if (arr[j] < pivot) {
        i++
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp

        steps.push({
          array: [...arr],
          comparing: [i, j],
          swapped: true,
          sorted: [],
          line: 5,
          description: `Swap arr[${i}] (${arr[i]}) and arr[${j}] (${arr[j]}) since ${arr[i]} < pivot`
        })
      }
    }

    let temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp

    steps.push({
      array: [...arr],
      comparing: [i + 1, high],
      swapped: true,
      sorted: [i + 1],
      line: 6,
      description: `Place pivot ${pivot} into its correct sorted position index ${i + 1}`
    })

    return i + 1
  }

  function sort(low, high) {
    if (low < high) {
      const pi = partition(low, high)
      sort(low, pi - 1)
      sort(pi + 1, high)
    }
  }

  sort(0, arr.length - 1)

  steps.push({ array: [...arr], comparing: [], swapped: false, sorted: Array.from({ length: arr.length }, (_, i) => i), line: 7, description: 'Quick Sort Complete!' })
  return steps
}
