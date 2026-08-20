import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SoundProvider } from './context/SoundContext'
import { StepPlayerProvider } from './context/StepPlayerContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/common/Navbar'
import WelcomeScreen from './pages/WelcomeScreen'
import Home from './pages/Home'
import Visualizer from './pages/Visualizer'
import CustomCodeVisualizer from './pages/CustomCodeVisualizer'
import FunZone from './pages/FunZone'
import NQueensGame from './pages/games/NQueensGame'
import SudokuGame from './pages/games/SudokuGame'
import RatMazeGame from './pages/games/RatMazeGame'
import Benchmark from './pages/Benchmark'
import Compare from './pages/Compare'
import ComplexityPanel from './pages/ComplexityPanel'

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <StepPlayerProvider>
          <Router>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<WelcomeScreen />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/visualizer" element={<Visualizer />} />
                  <Route path="/custom-code" element={<CustomCodeVisualizer />} />
                  <Route path="/fun-zone" element={<FunZone />} />
                  <Route path="/fun-zone/n-queens" element={<NQueensGame />} />
                  <Route path="/fun-zone/sudoku" element={<SudokuGame />} />
                  <Route path="/fun-zone/rat-maze" element={<RatMazeGame />} />
                  <Route path="/benchmark" element={<Benchmark />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/complexity" element={<ComplexityPanel />} />
                </Routes>
              </main>
            </div>
          </Router>
        </StepPlayerProvider>
      </SoundProvider>
    </ThemeProvider>
  )
}
