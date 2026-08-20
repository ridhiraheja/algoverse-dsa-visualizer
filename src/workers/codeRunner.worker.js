// Web Worker for safe, non-blocking execution of user code with infinite loop protection

self.onmessage = function (e) {
  const { userCode, inputArray } = e.data
  try {
    // Construct function safely in worker scope
    const fn = new Function('arr', `${userCode}; if (typeof customSort === 'function') { return customSort(arr); } return arr;`)
    const result = fn([...inputArray])
    self.postMessage({ success: true, result })
  } catch (err) {
    self.postMessage({ success: false, error: err.message })
  }
}
