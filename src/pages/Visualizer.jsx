import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ALGORITHMS, ALGORITHM_CATEGORIES } from '../utils/dsaData'
import { fetchAlgorithmSteps } from '../services/api'
import { useStepPlayer } from '../context/StepPlayerContext'
import { useSound } from '../context/SoundContext'

// Canvas Component Imports
import ArrayVisualizer from '../components/canvas/ArrayVisualizer'
import GraphVisualizer from '../components/canvas/GraphVisualizer'
import TreeVisualizer from '../components/canvas/TreeVisualizer'
import GridVisualizer from '../components/canvas/GridVisualizer'
import DPVisualizer from '../components/canvas/DPVisualizer'
import StairsVisualizer from '../components/canvas/StairsVisualizer'

// UI Control Imports
import CodeHighlighter from '../components/common/CodeHighlighter'
import Controls from '../components/common/Controls'
import { RefreshCw, Play, Pause, Dices, Layers, Network, GitBranch, BarChart2, CheckCircle, Zap } from 'lucide-react'

// Local JS Step Generators (Fallback)
import { generateBubbleSortSteps, generateSelectionSortSteps, generateInsertionSortSteps, generateMergeSortSteps, generateQuickSortSteps } from '../algorithms/sorting'
import { generateLinearSearchSteps, generateBinarySearchSteps } from '../algorithms/searching'
import { generateNQueensSteps, generateSudokuSteps, generateRatInMazeSteps } from '../algorithms/backtracking'
import { generateBFSGraphSteps, generateDFSGraphSteps, generateDijkstraSteps, generateAStarSteps, generatePrimsSteps, generateKruskalsSteps, DEFAULT_GRAPH, generateRandomGraph } from '../algorithms/graphs'
import { generateBSTSteps, generateAVLTreeSteps } from '../algorithms/trees'
import { generateKnapsackSteps, generateLCSSteps, generateClimbingStairsSteps, generateFibonacciDPSteps, generateKadanesAlgoSteps } from '../algorithms/dp'
import { generateActivitySelectionSteps, generateFractionalKnapsackSteps, generateBoatsToSavePeopleSteps, generateStonePileSteps } from '../algorithms/greedy'
import { generateTwoSumSortedSteps, generateContainerWithMostWaterSteps, generateTortoiseHareSteps } from '../algorithms/two_pointers'
import { generateSieveSteps } from '../algorithms/math_algos'

const FIXED_NODE_POSITIONS = {
  'A': { x: 100, y: 150 },
  'B': { x: 250, y: 80 },
  'C': { x: 250, y: 220 },
  'D': { x: 400, y: 80 },
  'E': { x: 400, y: 220 },
  'F': { x: 550, y: 150 },
  'G': { x: 320, y: 50 },
  'H': { x: 320, y: 250 }
}

export default function Visualizer() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const algoFromQuery = queryParams.get('algo')

  const [selectedCategory, setSelectedCategory] = useState('dp')
  const [selectedAlgoId, setSelectedAlgoId] = useState('kadanesAlgo')
  const [inputArray, setInputArray] = useState([-2, 1, -3, 4, -1, 2, 1, -5, 4])
  const [customArrayStr, setCustomArrayStr] = useState('-2, 1, -3, 4, -1, 2, 1, -5, 4')
  const [targetSearchVal, setTargetSearchVal] = useState(34)

  // Custom Graph & Maze / Queens States
  const [customGraph, setCustomGraph] = useState(DEFAULT_GRAPH)
  const [graphEdgeStr, setGraphEdgeStr] = useState('A-B:4, A-C:2, B-D:5, C-E:8, D-F:6, E-F:3')
  const [mazeDifficulty, setMazeDifficulty] = useState('easy')
  const [nQueensDifficulty, setNQueensDifficulty] = useState('easy')

  const [isBackendPowered, setIsBackendPowered] = useState(false)

  const { loadSteps, currentStep } = useStepPlayer()
  const { triggerClick, triggerSuccess } = useSound()

  // Handle URL Query Params on mount
  useEffect(() => {
    if (algoFromQuery && ALGORITHMS[algoFromQuery]) {
      const targetAlgo = ALGORITHMS[algoFromQuery]
      setSelectedCategory(targetAlgo.category || 'dp')
      setSelectedAlgoId(targetAlgo.id)
    }
  }, [algoFromQuery])

  // Active Algorithm metadata
  const currentAlgo = ALGORITHMS[selectedAlgoId] || ALGORITHMS.kadanesAlgo

  // Handle Category Change
  const handleCategorySelect = (catId) => {
    triggerClick()
    setSelectedCategory(catId)
    const firstAlgo = Object.values(ALGORITHMS).find(a => a.category === catId)
    if (firstAlgo) setSelectedAlgoId(firstAlgo.id)
  }

  // Handle Algorithm Change
  const handleAlgoSelect = (algoId) => {
    triggerClick()
    setSelectedAlgoId(algoId)
  }

  // Generate Random Array for Sorting/Searching/Trees/DP
  const generateNewRandomArray = () => {
    triggerClick()
    const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) - 30)
    setInputArray(newArr)
    setCustomArrayStr(newArr.join(', '))
    triggerSuccess()
  }

  // Apply Custom Array Input
  const applyCustomArrayInput = () => {
    triggerClick()
    const parsed = customArrayStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
    if (parsed.length > 0) {
      setInputArray(parsed)
      triggerSuccess()
    }
  }

  // Apply Custom Graph Edges Input
  const applyCustomGraphInput = () => {
    triggerClick()
    const parsedGraph = parseEdgeString(graphEdgeStr)
    if (parsedGraph) {
      setCustomGraph(parsedGraph)
      triggerSuccess()
    }
  }

  // Generate Random Graph
  const generateNewRandomGraph = () => {
    triggerClick()
    const newGraph = generateRandomGraph()
    setCustomGraph(newGraph)
    triggerSuccess()
  }

  // Parse Edges String format "A-B:4, B-C:2" with FIXED node layout
  const parseEdgeString = (str) => {
    try {
      const edges = []
      const nodeSet = new Set(['A', 'B', 'C', 'D', 'E', 'F'])
      const tokens = str.split(',')
      tokens.forEach((t) => {
        const parts = t.trim().split(':')
        const nodes = parts[0].split('-')
        if (nodes.length === 2) {
          const u = nodes[0].trim().toUpperCase()
          const v = nodes[1].trim().toUpperCase()
          const w = parts[1] ? parseInt(parts[1].trim()) : 1
          nodeSet.add(u)
          nodeSet.add(v)
          edges.push({ from: u, to: v, weight: isNaN(w) ? 1 : w })
        }
      })
      const nodeList = Array.from(nodeSet).map((id, idx) => {
        if (FIXED_NODE_POSITIONS[id]) {
          return { id, ...FIXED_NODE_POSITIONS[id] }
        }
        const angle = (idx / nodeSet.size) * 2 * Math.PI
        return {
          id,
          x: 300 + 150 * Math.cos(angle),
          y: 150 + 100 * Math.sin(angle)
        }
      })
      return { nodes: nodeList, edges }
    } catch (e) {
      return null
    }
  }

  // Generate steps from Python FastAPI Backend (with fallback)
  useEffect(() => {
    let isMounted = true

    async function loadBackendOrFallback() {
      const activeDifficulty = selectedAlgoId === 'nQueens' ? nQueensDifficulty : mazeDifficulty
      const backendSteps = await fetchAlgorithmSteps(selectedAlgoId, inputArray, targetSearchVal, customGraph, activeDifficulty)
      if (isMounted && backendSteps && backendSteps.length > 0) {
        setIsBackendPowered(true)
        loadSteps(backendSteps)
        return
      }

      setIsBackendPowered(false)
      let steps = []
      switch (selectedAlgoId) {
        // Sorting
        case 'bubbleSort': steps = generateBubbleSortSteps(inputArray); break;
        case 'selectionSort': steps = generateSelectionSortSteps(inputArray); break;
        case 'insertionSort': steps = generateInsertionSortSteps(inputArray); break;
        case 'mergeSort': steps = generateMergeSortSteps(inputArray); break;
        case 'quickSort': steps = generateQuickSortSteps(inputArray); break;
        // Searching
        case 'linearSearch': steps = generateLinearSearchSteps(inputArray, targetSearchVal); break;
        case 'binarySearch': steps = generateBinarySearchSteps(inputArray, targetSearchVal); break;
        // Backtracking
        case 'nQueens': steps = generateNQueensSteps(4, nQueensDifficulty); break;
        case 'sudokuSolver': steps = generateSudokuSteps(); break;
        case 'ratInMaze': steps = generateRatInMazeSteps(null, mazeDifficulty); break;
        // Graphs
        case 'bfs': steps = generateBFSGraphSteps(customGraph); break;
        case 'dfs': steps = generateDFSGraphSteps(customGraph); break;
        case 'dijkstra': steps = generateDijkstraSteps(customGraph); break;
        case 'aStar': steps = generateAStarSteps(customGraph); break;
        case 'prims': steps = generatePrimsSteps(customGraph); break;
        case 'kruskals': steps = generateKruskalsSteps(customGraph); break;
        // Trees
        case 'bst': steps = generateBSTSteps(inputArray); break;
        case 'avlTree': steps = generateAVLTreeSteps(inputArray); break;
        case 'symmetricTree': steps = generateBSTSteps(inputArray); break;
        // DP
        case 'knapsack': steps = generateKnapsackSteps(); break;
        case 'lcs': steps = generateLCSSteps(); break;
        case 'climbingStairs': steps = generateClimbingStairsSteps(); break;
        case 'fibonacciDP': steps = generateFibonacciDPSteps(); break;
        case 'kadanesAlgo': steps = generateKadanesAlgoSteps(inputArray); break;
        // Greedy
        case 'activitySelection': steps = generateActivitySelectionSteps(); break;
        case 'fractionalKnapsack': steps = generateFractionalKnapsackSteps(); break;
        case 'boatsToSavePeople': steps = generateBoatsToSavePeopleSteps(); break;
        case 'stonePile': steps = generateStonePileSteps(); break;
        // Two Pointers
        case 'twoSumSorted': steps = generateTwoSumSortedSteps(); break;
        case 'containerWater': steps = generateContainerWithMostWaterSteps(); break;
        case 'tortoiseHare': steps = generateTortoiseHareSteps(); break;
        // Math / Number Theory
        case 'sieveEratosthenes': steps = generateSieveSteps(30); break;
        default: steps = generateKadanesAlgoSteps(inputArray);
      }
      loadSteps(steps)
    }

    loadBackendOrFallback()
    return () => { isMounted = false }
  }, [selectedAlgoId, inputArray, targetSearchVal, customGraph, mazeDifficulty, nQueensDifficulty])

  // Render Visualizer Canvas Based on Category & Step Properties
  const renderVisualizerCanvas = () => {
    if (!currentAlgo) return null

    if (selectedAlgoId === 'climbingStairs') {
      return <StairsVisualizer step={currentStep} />
    }

    if (selectedAlgoId === 'kadanesAlgo') {
      return <ArrayVisualizer step={currentStep} />
    }

    switch (currentAlgo.category) {
      case 'sorting':
      case 'searching':
      case 'greedy':
      case 'twoPointers':
      case 'math':
        return <ArrayVisualizer step={currentStep} />
      case 'graphs':
        return <GraphVisualizer step={currentStep} />
      case 'trees':
        return <TreeVisualizer step={currentStep} />
      case 'backtracking':
        return <GridVisualizer step={currentStep} type={selectedAlgoId} />
      case 'dp':
        return currentStep?.dp ? <DPVisualizer step={currentStep} type={selectedAlgoId} /> : <ArrayVisualizer step={currentStep} />
      default:
        return <ArrayVisualizer step={currentStep} />
    }
  }

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Clean Header Bar */}
      <div className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentAlgo.name}</h2>
            {isBackendPowered && (
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
                Python FastAPI Engine
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {currentAlgo.description}
          </p>
        </div>

        {/* Complexity Metadata Badges */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '0.3rem 0.7rem', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.25)', fontWeight: 700 }}>
            Time: {currentAlgo.timeComplexity?.worst || currentAlgo.timeComplexity}
          </span>
          <span style={{ fontSize: '0.8rem', background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', padding: '0.3rem 0.7rem', borderRadius: '6px', border: '1px solid rgba(168, 85, 247, 0.25)', fontWeight: 700 }}>
            Space: {currentAlgo.spaceComplexity}
          </span>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {ALGORITHM_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Algorithm Pills & Controls Bar */}
      <div className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Sub-algorithm selector */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.values(ALGORITHMS)
            .filter(a => a.category === selectedCategory)
            .map((algo) => {
              const isSelected = selectedAlgoId === algo.id
              return (
                <button
                  key={algo.id}
                  onClick={() => handleAlgoSelect(algo.id)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    background: isSelected ? 'var(--accent-secondary)' : 'var(--bg-primary)',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--accent-secondary)' : '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  {algo.name}
                </button>
              )
            })}
        </div>

        {/* Dynamic Controls Bar per Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)' }}>
          
          {/* ARRAY INPUT CONTROLS */}
          {(selectedCategory === 'sorting' || selectedCategory === 'searching' || selectedCategory === 'twoPointers' || selectedCategory === 'greedy' || selectedAlgoId === 'kadanesAlgo') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', width: '100%' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Custom Array:</span>
              <input
                type="text"
                value={customArrayStr}
                onChange={(e) => setCustomArrayStr(e.target.value)}
                placeholder="-2, 1, -3, 4, -1, 2, 1, -5, 4"
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '0.45rem 0.8rem',
                  borderRadius: '6px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.85rem'
                }}
              />
              <button
                onClick={applyCustomArrayInput}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
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
                <span>Apply Array</span>
              </button>
              <button
                onClick={generateNewRandomArray}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <Dices size={14} />
                <span>Random Array</span>
              </button>
            </div>
          )}

          {/* GRAPH CONTROLS */}
          {selectedCategory === 'graphs' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', width: '100%' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Custom Edges (u-v:w):</span>
              <input
                type="text"
                value={graphEdgeStr}
                onChange={(e) => setGraphEdgeStr(e.target.value)}
                placeholder="A-B:4, B-C:2, C-D:7"
                style={{
                  flex: 1,
                  minWidth: '250px',
                  padding: '0.45rem 0.8rem',
                  borderRadius: '6px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.85rem'
                }}
              />
              <button
                onClick={applyCustomGraphInput}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
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
                <span>Apply Edges</span>
              </button>
              <button
                onClick={generateNewRandomGraph}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <Dices size={14} />
                <span>Random Graph</span>
              </button>
            </div>
          )}

          {/* BACKTRACKING (RAT IN A MAZE & N-QUEENS DIFFICULTY) CONTROLS */}
          {selectedCategory === 'backtracking' && selectedAlgoId === 'ratInMaze' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', width: '100%' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>Maze Difficulty:</span>
              {[
                { id: 'easy', label: '🟢 Easy (4x4 Grid)' },
                { id: 'medium', label: '🟡 Medium (6x6 Grid)' },
                { id: 'hard', label: '🔴 Hard (8x8 Grid)' }
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => { triggerClick(); setMazeDifficulty(diff.id); }}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: mazeDifficulty === diff.id ? 700 : 500,
                    background: mazeDifficulty === diff.id ? 'var(--accent-primary)' : 'var(--bg-primary)',
                    color: mazeDifficulty === diff.id ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          )}

          {selectedCategory === 'backtracking' && selectedAlgoId === 'nQueens' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', width: '100%' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>N-Queens Board Size:</span>
              {[
                { id: 'easy', label: '🟢 Easy (4x4 Board)' },
                { id: 'medium', label: '🟡 Medium (6x6 Board)' },
                { id: 'hard', label: '🔴 Hard (8x8 Board)' }
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => { triggerClick(); setNQueensDifficulty(diff.id); }}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: nQueensDifficulty === diff.id ? 700 : 500,
                    background: nQueensDifficulty === diff.id ? 'var(--accent-primary)' : 'var(--bg-primary)',
                    color: nQueensDifficulty === diff.id ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Main Canvas & Code Execution Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Side: Animated Canvas & Player Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {renderVisualizerCanvas()}
          <Controls />
        </div>

        {/* Right Side: Code Execution & Step Explanation */}
        <div>
          <CodeHighlighter
            codeLines={currentAlgo?.code}
            activeLine={currentStep?.line}
            description={currentStep?.description}
          />
        </div>

      </div>

    </div>
  )
}
