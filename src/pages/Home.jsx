import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Code2, Gamepad2, BarChart3, Layers, GitBranch, ArrowRight, Sparkles, BookOpen, Calculator, ArrowRightLeft, ShieldAlert } from 'lucide-react'
import { useSound } from '../context/SoundContext'
import { ALGORITHM_CATEGORIES } from '../utils/dsaData'

export default function Home() {
  const { triggerClick } = useSound()

  const quickFeatureCards = [
    {
      title: 'Interactive DSA Visualizer',
      desc: 'Step-by-step graphical animations for Sorting, Graphs, Trees, Dynamic Programming, Greedy & Backtracking.',
      icon: Play,
      link: '/visualizer',
      badge: 'Core Visualizer',
      color: '#6366f1'
    },
    {
      title: 'Custom Code Execution',
      desc: 'Write custom C++, Java, Python, or JS code and step through variable traces dynamically.',
      icon: Code2,
      link: '/custom-code',
      badge: 'Code IDE',
      color: '#06b6d4'
    },
    {
      title: 'DSA Fun Zone & Games',
      desc: 'Play interactive N-Queens, Sudoku, and Rat in a Maze puzzle games with live step solvers.',
      icon: Gamepad2,
      link: '/fun-zone',
      badge: 'Interactive Games',
      color: '#f59e0b'
    },
    {
      title: 'Algorithm Benchmark',
      desc: 'Run real-time execution benchmarks across array sizes to compare time and space performance.',
      icon: BarChart3,
      link: '/benchmark',
      badge: 'Real-time Stats',
      color: '#10b981'
    }
  ]

  const categoryCards = [
    { id: 'sorting', name: 'Sorting Algorithms', count: '5 Algorithms', desc: 'Bubble, Selection, Insertion, Merge, Quick Sort', icon: BarChart2Icon, color: '#6366f1' },
    { id: 'searching', name: 'Searching Algorithms', count: '2 Algorithms', desc: 'Linear & Binary Search', icon: SearchIcon, color: '#38bdf8' },
    { id: 'dp', name: 'Dynamic Programming', count: '5 Algorithms', desc: 'Knapsack, LCS, Climbing Stairs, Fibonacci, Kadane\'s', icon: Layers, color: '#f59e0b' },
    { id: 'graphs', name: 'Graph Algorithms', count: '6 Algorithms', desc: 'BFS, DFS, Dijkstra, A* Search, Prim\'s & Kruskal\'s', icon: NetworkIcon, color: '#a855f7' },
    { id: 'backtracking', name: 'Backtracking', count: '3 Solvers', desc: 'N-Queens, Sudoku Solver, Rat in a Maze', icon: GitBranch, color: '#ef4444' },
    { id: 'greedy', name: 'Greedy Algorithms', count: '4 Algorithms', desc: 'Activity Selection, Knapsack, Boats to Save, Stone Piles', icon: ZapIcon, color: '#eab308' },
    { id: 'twoPointers', name: 'Two Pointers', count: '3 Algorithms', desc: 'Two Sum, Container With Most Water, Tortoise & Hare', icon: ArrowRightLeft, color: '#06b6d4' },
    { id: 'math', name: 'Number Theory / Math', count: '1 Algorithm', desc: 'Sieve of Eratosthenes Prime Generator', icon: Calculator, color: '#10b981' }
  ]

  return (
    <div className="app-container" style={{ padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Hero Header Banner */}
      <section className="glass-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Spiral Notebook Ring Binder Decorative Top Header */}
        <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px' }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--notebook-margin)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)' }} />
          ))}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.2rem' }}>
          <Sparkles size={16} />
          <span>Interactive DSA Notebook & Algorithm Visualizer</span>
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '1rem' }}>
          Master Data Structures & Algorithms <br />
          <span className="gradient-text">Visualized Step-by-Step</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          Experience algorithm animation with real-time state changes, multi-language code highlighting (C++, Java, Python, JS), step audio queues, and interactive game solvers!
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/visualizer"
            onClick={triggerClick}
            style={{
              padding: '0.9rem 2rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
            }}
          >
            <span>Launch Visualizer</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/fun-zone"
            onClick={triggerClick}
            style={{
              padding: '0.9rem 2rem',
              borderRadius: 'var(--border-radius-sm)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Gamepad2 size={18} color="var(--accent-secondary)" />
            <span>Play DSA Games</span>
          </Link>
        </div>
      </section>

      {/* Feature Navigation Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {quickFeatureCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              to={card.link}
              onClick={triggerClick}
              className="glass-card"
              style={{ padding: '1.8rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', textDecoration: 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${card.color}20`, border: `1px solid ${card.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} color={card.color} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: card.color, background: `${card.color}15`, padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                  {card.badge}
                </span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{card.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: card.color, fontSize: '0.85rem', fontWeight: 700, marginTop: 'auto' }}>
                <span>Explore</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          )
        })}
      </section>

      {/* Algorithm Categories Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Algorithm Categories</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Click any category to jump straight to step-by-step visual execution</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
          {categoryCards.map((cat) => (
            <Link
              key={cat.id}
              to={`/visualizer?algo=${cat.id}`}
              onClick={triggerClick}
              className="glass-card"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', textDecoration: 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: cat.color, background: `${cat.color}15`, padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                  {cat.count}
                </span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{cat.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{cat.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.4rem' }}>
                <span>Visualize Algorithms</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}

function BarChart2Icon(props) { return <BarChart3 {...props} /> }
function SearchIcon(props) { return <BookOpen {...props} /> }
function NetworkIcon(props) { return <Layers {...props} /> }
function ZapIcon(props) { return <Sparkles {...props} /> }
