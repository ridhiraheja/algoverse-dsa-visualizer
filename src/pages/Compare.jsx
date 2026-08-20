import React, { useState, useEffect } from 'react'
import { ALGORITHMS } from '../utils/dsaData'
import { fetchAlgorithmSteps } from '../services/api'
import { generateBubbleSortSteps, generateSelectionSortSteps, generateInsertionSortSteps, generateMergeSortSteps, generateQuickSortSteps } from '../algorithms/sorting'
import { generateBFSGraphSteps, generateDFSGraphSteps, generateDijkstraSteps, DEFAULT_GRAPH } from '../algorithms/graphs'
import ArrayVisualizer from '../components/canvas/ArrayVisualizer'
import GraphVisualizer from '../components/canvas/GraphVisualizer'
import CodeHighlighter from '../components/common/CodeHighlighter'
import { Play, Pause, RotateCcw, GitCompare, Zap, Dices, CheckCircle } from 'lucide-react'
import { useSound } from '../context/SoundContext'

export default function Compare() {
  const [algo1, setAlgo1] = useState('bfs')
  const [algo2, setAlgo2] = useState('dfs')
  
  // Custom Input Data States
  const [inputArrayStr, setInputArrayStr] = useState('50, 20, 80, 10, 90, 30, 70, 40, 60')
  const [customGraphStr, setCustomGraphStr] = useState('A-B:4, A-C:2, B-D:5, C-E:8, D-F:6')
  const [activeArray, setActiveArray] = useState([50, 20, 80, 10, 90, 30, 70, 40, 60])
  const [activeGraph, setActiveGraph] = useState(DEFAULT_GRAPH)

  const [steps1, setSteps1] = useState([])
  const [steps2, setSteps2] = useState([])
  const [stepIdx1, setStepIdx1] = useState(0)
  const [stepIdx2, setStepIdx2] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPythonPowered, setIsPythonPowered] = useState(false)

  const { triggerClick, triggerSuccess } = useSound()

  const algoList = [
    { id: 'bfs', name: 'Breadth-First Search (BFS)', category: 'graphs' },
    { id: 'dfs', name: 'Depth-First Search (DFS)', category: 'graphs' },
    { id: 'dijkstra', name: "Dijkstra's Shortest Path", category: 'graphs' },
    { id: 'quickSort', name: 'Quick Sort', category: 'sorting' },
    { id: 'bubbleSort', name: 'Bubble Sort', category: 'sorting' },
    { id: 'mergeSort', name: 'Merge Sort', category: 'sorting' },
    { id: 'selectionSort', name: 'Selection Sort', category: 'sorting' },
    { id: 'insertionSort', name: 'Insertion Sort', category: 'sorting' }
  ]

  const parseArrayInput = (str) => {
    const nums = str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
    return nums.length > 0 ? nums : [50, 20, 80, 10, 90, 30, 70]
  }

  const handleApplyArrayInput = () => {
    triggerClick()
    const parsed = parseArrayInput(inputArrayStr)
    setActiveArray(parsed)
  }

  const handleRandomArray = () => {
    triggerClick()
    const randArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10)
    setInputArrayStr(randArr.join(', '))
    setActiveArray(randArr)
  }

  const getFallbackSteps = (id, arr, graphData) => {
    switch (id) {
      case 'bfs': return generateBFSGraphSteps(graphData)
      case 'dfs': return generateDFSGraphSteps(graphData)
      case 'dijkstra': return generateDijkstraSteps(graphData)
      case 'bubbleSort': return generateBubbleSortSteps(arr)
      case 'selectionSort': return generateSelectionSortSteps(arr)
      case 'insertionSort': return generateInsertionSortSteps(arr)
      case 'mergeSort': return generateMergeSortSteps(arr)
      case 'quickSort': return generateQuickSortSteps(arr)
      default: return generateBFSGraphSteps(graphData)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadBothSteps() {
      const backendSteps1 = await fetchAlgorithmSteps(algo1, activeArray, null, activeGraph)
      const backendSteps2 = await fetchAlgorithmSteps(algo2, activeArray, null, activeGraph)

      if (isMounted) {
        if (backendSteps1 && backendSteps2) {
          setIsPythonPowered(true)
          setSteps1(backendSteps1)
          setSteps2(backendSteps2)
        } else {
          setIsPythonPowered(false)
          setSteps1(getFallbackSteps(algo1, activeArray, activeGraph))
          setSteps2(getFallbackSteps(algo2, activeArray, activeGraph))
        }
        setStepIdx1(0)
        setStepIdx2(0)
        setIsPlaying(false)
      }
    }

    loadBothSteps()
    return () => { isMounted = false }
  }, [algo1, algo2, activeArray, activeGraph])

  useEffect(() => {
    let timer = null
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIdx1(prev => (prev < steps1.length - 1 ? prev + 1 : prev))
        setStepIdx2(prev => (prev < steps2.length - 1 ? prev + 1 : prev))
      }, 300)
    }
    return () => { if (timer) clearInterval(timer) }
  }, [isPlaying, steps1.length, steps2.length])

  const meta1 = ALGORITHMS[algo1]
  const meta2 = ALGORITHMS[algo2]

  const renderCanvasForAlgo = (algoId, step) => {
    const meta = ALGORITHMS[algoId]
    if (meta && meta.category === 'graphs') {
      return <GraphVisualizer step={step} />
    }
    return <ArrayVisualizer step={step} />
  }

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Dual Controls */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#38bdf8' }}>
              <GitCompare size={22} />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Dual Algorithm Comparison</h2>
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
                  Python FastAPI Powered
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Compare any two algorithms (BFS vs DFS, Quick Sort vs Bubble Sort) side-by-side with custom input data!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={() => { setIsPlaying(!isPlaying); triggerClick(); }}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: 'var(--border-radius-sm)',
                background: isPlaying ? 'var(--warning)' : 'var(--accent-primary)',
                color: isPlaying ? '#000' : '#fff',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={16} fill="#000" /> : <Play size={16} fill="#fff" />}
              <span>{isPlaying ? 'Pause Both' : 'Play Both'}</span>
            </button>

            <button
              onClick={() => { setStepIdx1(0); setStepIdx2(0); setIsPlaying(false); triggerClick(); }}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Custom Input Data Bar for Comparison */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.8rem', borderTop: '1px solid var(--border-color)', background: 'rgba(9, 13, 22, 0.6)', padding: '0.8rem 1rem', borderRadius: 'var(--border-radius-sm)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
            Comparison Input Data:
          </span>
          <input
            type="text"
            value={inputArrayStr}
            onChange={(e) => setInputArrayStr(e.target.value)}
            placeholder="50, 20, 80, 10, 90, 30, 70"
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '0.45rem 0.8rem',
              borderRadius: '4px',
              background: '#090d16',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontFamily: 'var(--font-code)',
              fontSize: '0.85rem'
            }}
          />
          <button
            onClick={handleApplyArrayInput}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '4px',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer'
            }}
          >
            <CheckCircle size={14} />
            <span>Apply Data</span>
          </button>
          <button
            onClick={handleRandomArray}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '4px',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#818cf8',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer'
            }}
          >
            <Dices size={14} />
            <span>Random Data</span>
          </button>
        </div>
      </div>

      {/* Side by Side Dual Visualizers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        
        {/* Visualizer 1 */}
        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <select
              value={algo1}
              onChange={(e) => setAlgo1(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                background: '#090d16',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontWeight: 700
              }}
            >
              {algoList.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Step {stepIdx1 + 1} of {steps1.length}
            </span>
          </div>

          {renderCanvasForAlgo(algo1, steps1[stepIdx1])}
          
          <CodeHighlighter
            codeLines={meta1?.code}
            activeLine={steps1[stepIdx1]?.line}
            description={steps1[stepIdx1]?.description}
          />
        </div>

        {/* Visualizer 2 */}
        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <select
              value={algo2}
              onChange={(e) => setAlgo2(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                background: '#090d16',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontWeight: 700
              }}
            >
              {algoList.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Step {stepIdx2 + 1} of {steps2.length}
            </span>
          </div>

          {renderCanvasForAlgo(algo2, steps2[stepIdx2])}

          <CodeHighlighter
            codeLines={meta2?.code}
            activeLine={steps2[stepIdx2]?.line}
            description={steps2[stepIdx2]?.description}
          />
        </div>

      </div>

    </div>
  )
}
