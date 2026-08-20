// API Client Service connecting Frontend to Python FastAPI Backend

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fetch algorithm step animation states from Python FastAPI backend.
 */
export async function fetchAlgorithmSteps(algorithm, inputData = null, target = null, customGraph = null, difficulty = 'easy') {
  try {
    const response = await fetch(`${API_BASE_URL}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algorithm, inputData, target, customGraph, difficulty }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.steps;
  } catch (error) {
    console.warn('Backend API unreachable, using local fallback:', error);
    return null;
  }
}

/**
 * Run benchmark comparison on Python backend.
 */
export async function fetchBenchmark(algorithm, inputSize = 100) {
  try {
    const response = await fetch(`${API_BASE_URL}/benchmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algorithm, inputSize }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend benchmark failed:', error);
    return null;
  }
}

/**
 * Execute custom Python, C++, C, Java, or JS code on backend runner.
 */
export async function executeCode(code, language = 'python', inputArray = null, inputType = 'array', inputValue = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/execute-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language, inputArray, inputType, inputValue }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Code execution error:', error);
    return { output: 'Failed to connect to backend execution server.', steps: [] };
  }
}
