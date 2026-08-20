import React, { useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { BarChart3, Play, RefreshCw, Zap } from 'lucide-react'
import { fetchBenchmark } from '../services/api'
import { generateBubbleSortSteps, generateSelectionSortSteps, generateInsertionSortSteps, generateMergeSortSteps, generateQuickSortSteps } from '../algorithms/sorting'
import { generateBFSGraphSteps, generateDFSGraphSteps, DEFAULT_GRAPH } from '../algorithms/graphs'
import { useSound } from '../context/SoundContext'

export default function Benchmark() {
  const [selectedAlgos, setSelectedAlgos] = useState(['bfs', 'dfs', 'quickSort', 'bubbleSort'])
  const [inputSizes] = useState([10, 20, 40, 80, 150])
  const [results, setResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPythonPowered, setIsPythonPowered] = useState(false)

  const { triggerClick, triggerSuccess } = useSound()

  const algoOptions = [
    { id: 'bfs', name: 'BFS (Breadth-First Search)', color: '#10b981' },
    { id: 'dfs', name: 'DFS (Depth-First Search)', color: '#a855f7' },
    { id: 'quickSort', name: 'Quick Sort', color: '#6366f1' },
    { id: 'mergeSort', name: 'Merge Sort', color: '#38bdf8' },
    { id: 'bubbleSort', name: 'Bubble Sort', color: '#f43f5e' },
    { id: 'selectionSort', name: 'Selection Sort', color: '#f59e0b' },
    { id: 'insertionSort', name: 'Insertion Sort', color: '#eab308' }
  ]

  const toggleAlgoSelect = (id) => {
    triggerClick()
    if (selectedAlgos.includes(id)) {
      if (selectedAlgos.length > 1) {
        setSelectedAlgos(selectedAlgos.filter(a => a !== id))
      }
    } else {
      setSelectedAlgos([...selectedAlgos, id])
    }
  }

  const runBenchmark = async () => {
    triggerClick()
    setIsRunning(true)

    const benchmarkData = []

    for (const size of inputSizes) {
      const dataPoint = { size }
      const testArr = Array.from({ length: size }, () => Math.floor(Math.random() * 1000))

      for (const algoId of selectedAlgos) {
        if (algoId === 'bfs' || algoId === 'dfs') {
          let graphSteps = algoId === 'bfs' ? generateBFSGraphSteps(DEFAULT_GRAPH) : generateDFSGraphSteps(DEFAULT_GRAPH)
          dataPoint[algoId] = graphSteps.length * (size / 10)
        } else {
          const pythonRes = await fetchBenchmark(algoId, size)
          if (pythonRes && pythonRes.totalSteps) {
            setIsPythonPowered(true)
            dataPoint[algoId] = pythonRes.totalSteps
          } else {
            setIsPythonPowered(false)
            let steps = []
            if (algoId === 'bubbleSort') steps = generateBubbleSortSteps(testArr)
            if (algoId === 'selectionSort') steps = generateSelectionSortSteps(testArr)
            if (algoId === 'insertionSort') steps = generateInsertionSortSteps(testArr)
            if (algoId === 'mergeSort') steps = generateMergeSortSteps(testArr)
            if (algoId === 'quickSort') steps = generateQuickSortSteps(testArr)
            dataPoint[algoId] = steps.length
          }
        }
      }
      benchmarkData.push(dataPoint)
    }

    setResults(benchmarkData)
    setIsRunning(false)
    triggerSuccess()
  }

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--success)' }}>
              <BarChart3 size={22} />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Performance Benchmark</h2>
              {isPythonPowered && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#4ade80',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Zap size={12} />
                  Python 3 FastAPI Benchmark
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Benchmark operation counts and theoretical time scaling for BFS, DFS, and Sorting algorithms across variable input sizes.
            </p>
          </div>

          <button
            onClick={runBenchmark}
            disabled={isRunning}
            className="glow-emerald"
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'var(--success)',
              color: '#000',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} fill="#000" />}
            <span>{isRunning ? 'Running Benchmark...' : 'Run Benchmark'}</span>
          </button>
        </div>

        {/* Algorithm Checkbox Selector */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select Algorithms to Benchmark:</span>
          {algoOptions.map((algo) => {
            const isChecked = selectedAlgos.includes(algo.id)
            return (
              <button
                key={algo.id}
                onClick={() => toggleAlgoSelect(algo.id)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  background: isChecked ? `${algo.color}30` : 'rgba(255,255,255,0.05)',
                  border: isChecked ? `2px solid ${algo.color}` : '1px solid transparent',
                  color: isChecked ? algo.color : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {algo.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '420px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Operation Steps vs Input Size (N)</h3>

        {results ? (
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                <XAxis dataKey="size" stroke="var(--text-muted)" label={{ value: 'Array / Node Input Size (N)', position: 'insideBottom', offset: -5, fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" label={{ value: 'Operations Count', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: '#0b0f19', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600 }} />
                <Legend wrapperStyle={{ paddingTop: '10px', fontWeight: 700 }} />
                {selectedAlgos.map((algoId) => {
                  const meta = algoOptions.find(a => a.id === algoId)
                  return (
                    <Line
                      key={algoId}
                      type="monotone"
                      dataKey={algoId}
                      name={meta ? meta.name : algoId}
                      stroke={meta ? meta.color : '#fff'}
                      strokeWidth={5}
                      dot={{ r: 6, fill: meta ? meta.color : '#fff' }}
                      activeDot={{ r: 9 }}
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '0.5rem' }}>
            <Zap size={32} color="var(--accent-secondary)" />
            <p>Click "Run Benchmark" to execute comparison analysis.</p>
          </div>
        )}
      </div>

    </div>
  )
}
