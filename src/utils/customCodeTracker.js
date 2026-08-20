// Custom Code Visualizer - JS Proxy Array Access & Mutation Tracker

export function createTrackedArray(initialArray) {
  const steps = []
  const array = [...initialArray]

  // Record initial state
  steps.push({
    array: [...array],
    comparing: [],
    swapped: false,
    done: false,
    line: 1,
    description: 'Initial array state'
  })

  const handler = {
    get(target, prop) {
      if (typeof prop === 'string' && !isNaN(prop)) {
        const index = Number(prop)
        const lastStep = steps[steps.length - 1]
        // Avoid duplicate log if comparing exact same single element in a row
        steps.push({
          array: [...target],
          comparing: [index],
          swapped: false,
          done: false,
          line: 2,
          description: `Reading element at index ${index} (value: ${target[index]})`
        })
      }
      return target[prop]
    },
    set(target, prop, value) {
      target[prop] = value
      if (typeof prop === 'string' && !isNaN(prop)) {
        const index = Number(prop)
        steps.push({
          array: [...target],
          comparing: [index],
          swapped: true,
          done: false,
          line: 3,
          description: `Set element at index ${index} to ${value}`
        })
      }
      return true
    }
  }

  const proxy = new Proxy(array, handler)

  return { proxy, steps }
}

export function generateCustomSteps(userCode, inputArray) {
  try {
    const { proxy, steps } = createTrackedArray(inputArray)
    // Create clean evaluation scope
    const fn = new Function('arr', `${userCode}\n return typeof customSort === 'function' ? customSort(arr) : arr;`)
    const result = fn(proxy)

    // Add final sorted state
    const finalArr = Array.isArray(result) ? result : [...proxy]
    steps.push({
      array: [...finalArr],
      comparing: [],
      swapped: false,
      done: true,
      line: 4,
      description: 'Sorting complete!'
    })

    return { success: true, steps, result: finalArr }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
