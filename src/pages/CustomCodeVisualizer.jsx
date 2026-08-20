import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { generateCustomSteps } from '../utils/customCodeTracker'
import { executeCode } from '../services/api'
import { useStepPlayer } from '../context/StepPlayerContext'
import { useSound } from '../context/SoundContext'
import ArrayVisualizer from '../components/canvas/ArrayVisualizer'
import Controls from '../components/common/Controls'
import { Play, AlertTriangle, Code, Zap, Cpu, Sparkles, Dices, ArrowLeft } from 'lucide-react'

const TEMPLATES = {
  c: `// C11 Implementation Code
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    printf("Executing C Algorithm on Array of size %d\\n", n);
    for(int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}
`,
  cpp: `// C++17 Algorithm Implementation
#include <iostream>
#include <vector>
#include <algorithm>

void solveAlgorithm(std::vector<int>& arr) {
    int n = arr.size();
    std::cout << "Running C++ Algorithm on array size " << n << std::endl;
    for (int i = 0; i < n; i++) {
        std::cout << "Element [" << i << "]: " << arr[i] << std::endl;
    }
}

int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    solveAlgorithm(arr);
    return 0;
}
`,
  java: `// Java 21 Algorithm Implementation
import java.util.Arrays;

public class Solution {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Running Java Algorithm: " + Arrays.toString(arr));
    }
}
`,
  python: `# Python 3 Algorithm Implementation
def solve_algorithm(arr):
    print("Running Python Algorithm on:", arr)
    return sorted(arr)

arr = [64, 34, 25, 12, 22, 11, 90]
res = solve_algorithm(arr)
print("Result:", res)
`,
  javascript: `// JavaScript Algorithm Implementation
function solveAlgorithm(arr) {
  console.log("Running JS Algorithm on:", arr);
  return arr.sort((a, b) => a - b);
}

let arr = [64, 34, 25, 12, 22, 11, 90];
solveAlgorithm(arr);
`
}

function detectInputType(codeText) {
  const lower = (codeText || '').toLowerCase()

  if (lower.includes('palindrome') || lower.includes('scanf') || lower.includes('cin >>') || lower.includes('input(')) {
    return {
      type: 'palindrome',
      label: 'Input Value (Number / String):',
      placeholder: '12321 or madam',
      description: 'Single number or string for palindrome check'
    }
  }

  if (lower.includes('fibonacci') || lower.includes('factorial') || lower.includes('prime') || lower.includes('int n') || lower.includes('def fib') || lower.includes('terms')) {
    return {
      type: 'single_number',
      label: 'Parameter (n):',
      placeholder: '10',
      description: 'Single integer parameter (n)'
    }
  }

  if (lower.includes('str1') || lower.includes('string') || lower.includes('lcs') || lower.includes('text1')) {
    return {
      type: 'dual_strings',
      label: 'String Inputs (s1, s2):',
      placeholder: 'STONE, LONGEST',
      description: 'Dual string sequence inputs'
    }
  }

  if (lower.includes('graph') || lower.includes('edges') || lower.includes('dijkstra') || lower.includes('bfs')) {
    return {
      type: 'graph',
      label: 'Graph Edges (u-v:w):',
      placeholder: 'A-B:4, A-C:2, B-D:5',
      description: 'Weighted edge list'
    }
  }

  return {
    type: 'array',
    label: 'Input Array:',
    placeholder: '64, 34, 25, 12, 22, 11, 90',
    description: 'Array dataset'
  }
}

export default function CustomCodeVisualizer() {
  const location = useLocation()
  const passedState = location.state || {}

  const [lang, setLang] = useState(passedState.lang || 'cpp')
  const [code, setCode] = useState(passedState.code || TEMPLATES.cpp)
  const [algoTitle, setAlgoTitle] = useState(passedState.algoName || '')

  const [overrideType, setOverrideType] = useState('auto')
  const [singleNumVal, setSingleNumVal] = useState('12321')
  const [arraySizeVal, setArraySizeVal] = useState('7')
  const [arrayElementsVal, setArrayElementsVal] = useState('64, 34, 25, 12, 22, 11, 90')
  const [dualStringsVal, setDualStringsVal] = useState('STONE, LONGEST')
  const [graphEdgesVal, setGraphEdgesVal] = useState('A-B:4, A-C:2, B-D:5, C-E:8')

  const [error, setError] = useState(null)
  const [outputConsole, setOutputConsole] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)

  const { loadSteps, currentStep } = useStepPlayer()
  const { triggerClick } = useSound()

  // Handle passed location state on mount
  useEffect(() => {
    if (location.state?.code) {
      setCode(location.state.code)
      setLang(location.state.lang || 'cpp')
      if (location.state.algoName) setAlgoTitle(location.state.algoName)
    }
  }, [location.state])

  const detectedConfig = detectInputType(code)
  const activeInputType = overrideType === 'auto' ? detectedConfig.type : overrideType

  const handleTypeSelect = (newType) => {
    triggerClick()
    setOverrideType(newType)
    if (newType === 'array' && !arrayElementsVal) {
      generateRandomArrayForSize(parseInt(arraySizeVal) || 7)
    }
  }

  const generateRandomArrayForSize = (size) => {
    triggerClick()
    const sz = Math.max(1, Math.min(20, size || 7))
    const newArr = Array.from({ length: sz }, () => Math.floor(Math.random() * 90) + 10)
    setArraySizeVal(sz.toString())
    setArrayElementsVal(newArr.join(', '))
  }

  const handleArraySizeChange = (newSizeStr) => {
    setArraySizeVal(newSizeStr)
    const sz = parseInt(newSizeStr)
    if (!isNaN(sz) && sz > 0 && sz <= 30) {
      generateRandomArrayForSize(sz)
    }
  }

  const parseInputArray = () => {
    return arrayElementsVal
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n))
  }

  const handleLangChange = (newLang) => {
    triggerClick()
    setLang(newLang)
    setCode(TEMPLATES[newLang] || TEMPLATES.cpp)
  }

  const runAndVisualize = async () => {
    triggerClick()
    setError(null)
    setOutputConsole('')
    setIsExecuting(true)
    const parsedArr = parseInputArray()
    const sendVal = (activeInputType === 'single_number' || activeInputType === 'palindrome') ? singleNumVal : (activeInputType === 'array' ? arrayElementsVal : (activeInputType === 'dual_strings' ? dualStringsVal : graphEdgesVal))

    if (lang === 'javascript') {
      try {
        const { success, steps, error: trackerErr } = generateCustomSteps(code, parsedArr.length > 0 ? parsedArr : [64, 34, 25, 12, 22])
        setIsExecuting(false)
        if (success && steps) {
          setError(null)
          loadSteps(steps)
          setOutputConsole('JavaScript program executed successfully.')
        } else {
          setError(trackerErr || 'Failed to execute custom JS code.')
        }
      } catch (err) {
        setIsExecuting(false)
        setError(err.message)
      }
    } else {
      const result = await executeCode(
        code,
        lang,
        parsedArr.length > 0 ? parsedArr : [64, 34, 25, 12, 22],
        activeInputType,
        sendVal
      )
      setIsExecuting(false)
      if (result) {
        if (result.output) setOutputConsole(result.output)
        if (result.steps && result.steps.length > 0) {
          setError(null)
          loadSteps(result.steps)
        } else if (result.output && result.output.includes('Error')) {
          setError('Compilation / Execution error. Check details in output console below.')
        }
      } else {
        setError('Failed to connect to execution server.')
      }
    }
  }

  useEffect(() => {
    runAndVisualize()
  }, [lang])

  const getMonacoLang = () => {
    if (lang === 'cpp') return 'cpp'
    if (lang === 'c') return 'c'
    if (lang === 'java') return 'java'
    if (lang === 'python') return 'python'
    return 'javascript'
  }

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                {algoTitle ? `IDE Playground - ${algoTitle}` : 'Custom Code Visualizer & IDE'}
              </h2>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={12} />
                {lang.toUpperCase()} Compiler Active
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Edit and execute code in <strong>C++ (g++)</strong>, <strong>Java (javac)</strong>, <strong>C (gcc)</strong>, <strong>Python 3</strong>, or <strong>JavaScript</strong>. See live step execution animations and terminal output console!
            </p>
          </div>

          {/* Multi-Language Selector Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-primary)', padding: '0.3rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {[
              { id: 'cpp', name: 'C++', icon: Cpu, color: '#f43f5e' },
              { id: 'java', name: 'Java', icon: Code, color: '#f59e0b' },
              { id: 'c', name: 'C', icon: Cpu, color: '#a855f7' },
              { id: 'python', name: 'Python 3', icon: Zap, color: '#38bdf8' },
              { id: 'javascript', name: 'JavaScript', icon: Code, color: '#eab308' }
            ].map((item) => {
              const IconComp = item.icon
              const isSel = lang === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleLangChange(item.id)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: isSel ? 700 : 500,
                    background: isSel ? 'var(--accent-primary)' : 'transparent',
                    color: isSel ? '#fff' : 'var(--text-secondary)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer'
                  }}
                >
                  <IconComp size={13} color={isSel ? '#fff' : item.color} />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Adaptive Dynamic Input Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem', background: 'var(--bg-primary)', padding: '0.8rem 1rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
          
          {/* Palindrome & Single Number Mode */}
          {(activeInputType === 'single_number' || activeInputType === 'palindrome') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                {activeInputType === 'palindrome' ? 'Input Value (Number / String):' : 'Input Parameter (n):'}
              </span>
              <input
                type="text"
                value={singleNumVal}
                onChange={(e) => setSingleNumVal(e.target.value)}
                placeholder="12321 or madam"
                style={{
                  minWidth: '160px',
                  padding: '0.5rem 0.8rem',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          )}

          {/* Array Mode */}
          {activeInputType === 'array' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>Array Size (N):</span>
                <input
                  type="number"
                  value={arraySizeVal}
                  onChange={(e) => handleArraySizeChange(e.target.value)}
                  style={{
                    width: '65px',
                    padding: '0.45rem 0.6rem',
                    borderRadius: '4px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-code)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: '220px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>Elements:</span>
                <input
                  type="text"
                  value={arrayElementsVal}
                  onChange={(e) => setArrayElementsVal(e.target.value)}
                  placeholder="64, 34, 25, 12, 22, 11, 90"
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.8rem',
                    borderRadius: '4px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-code)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <button
                onClick={() => generateRandomArrayForSize(parseInt(arraySizeVal) || 7)}
                style={{
                  padding: '0.45rem 0.8rem',
                  borderRadius: '4px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <Dices size={13} />
                <span>Random Array</span>
              </button>
            </div>
          )}

          {/* Dual Strings Mode */}
          {activeInputType === 'dual_strings' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>String Inputs (s1, s2):</span>
              <input
                type="text"
                value={dualStringsVal}
                onChange={(e) => setDualStringsVal(e.target.value)}
                placeholder="STONE, LONGEST"
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          )}

          {/* Graph Edges Mode */}
          {activeInputType === 'graph' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>Graph Edges (u-v:w):</span>
              <input
                type="text"
                value={graphEdgesVal}
                onChange={(e) => setGraphEdgesVal(e.target.value)}
                placeholder="A-B:4, A-C:2, B-D:5"
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          )}

          {/* Input Type Selector Dropdown */}
          <select
            value={overrideType}
            onChange={(e) => handleTypeSelect(e.target.value)}
            style={{
              padding: '0.5rem 0.8rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="auto">Select Input Data Type</option>
            <option value="palindrome">Palindrome (Number / String)</option>
            <option value="single_number">Single Number (n)</option>
            <option value="array">Array (arr)</option>
            <option value="dual_strings">Dual Strings (s1, s2)</option>
            <option value="graph">Graph Edges</option>
          </select>

          <button
            onClick={runAndVisualize}
            disabled={isExecuting}
            className="glow-primary"
            style={{
              padding: '0.5rem 1.4rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Play size={16} fill="#fff" />
            <span>Run {lang.toUpperCase()} Code</span>
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.15)', padding: '0.6rem 0.9rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.85rem' }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Code Editor & Canvas Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        
        {/* Monaco Editor */}
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', height: '460px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              {lang.toUpperCase()} Code Editor
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {lang === 'cpp' && 'Compiler: g++ (ucrt64)'}
              {lang === 'c' && 'Compiler: gcc (ucrt64)'}
              {lang === 'java' && 'Compiler: javac (JDK 21)'}
              {lang === 'python' && 'FastAPI Execution Engine'}
              {lang === 'javascript' && 'Client JS Sandbox'}
            </span>
          </div>
          <div style={{ flex: 1, borderRadius: 'var(--border-radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <Editor
              height="100%"
              language={getMonacoLang()}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'Fira Code',
                scrollBeyondLastLine: false
              }}
            />
          </div>
          {outputConsole && (
            <div style={{ background: 'var(--bg-primary)', padding: '0.6rem 0.9rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-code)', fontSize: '0.78rem', color: '#4ade80', maxHeight: '90px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
              <strong>Execution Output:</strong>
              <div>{outputConsole}</div>
            </div>
          )}
        </div>

        {/* Animated Canvas & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ArrayVisualizer step={currentStep} />
          <Controls />
        </div>

      </div>

    </div>
  )
}
