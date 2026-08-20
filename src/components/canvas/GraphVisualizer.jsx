import React from 'react'
import { motion } from 'framer-motion'
import { DEFAULT_GRAPH } from '../../algorithms/graphs'

export default function GraphVisualizer({ step }) {
  const nodes = (step && step.nodes && step.nodes.length > 0) ? step.nodes : DEFAULT_GRAPH.nodes
  const edges = (step && step.edges && step.edges.length > 0) ? step.edges : DEFAULT_GRAPH.edges

  const {
    currentNode = null,
    visitedNodes = [],
    activeEdge = null,
    visitedEdges = [],
    dist = {}
  } = step || {}

  return (
    <div style={{
      height: '350px',
      width: '100%',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--border-color)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 650 300">
        {/* Render Edges */}
        {edges.map((edge, idx) => {
          const u = nodes.find(n => n.id === edge.from)
          const v = nodes.find(n => n.id === edge.to)
          if (!u || !v) return null

          const isActive = activeEdge && (
            (activeEdge.from === edge.from && activeEdge.to === edge.to) ||
            (activeEdge.from === edge.to && activeEdge.to === edge.from)
          )
          const isMSTorPath = visitedEdges.some(e =>
            (e.from === edge.from && e.to === edge.to) ||
            (e.from === edge.to && e.to === edge.from)
          )

          let strokeColor = 'var(--border-color)'
          let strokeWidth = 2
          if (isMSTorPath) {
            strokeColor = '#10b981' // Emerald path
            strokeWidth = 4
          } else if (isActive) {
            strokeColor = '#f59e0b' // Amber active edge
            strokeWidth = 4
          }

          const midX = (u.x + v.x) / 2
          const midY = (u.y + v.y) / 2

          return (
            <g key={`edge-${idx}`}>
              <line
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={isActive ? '6 4' : 'none'}
              />
              {/* Edge Weight Badge */}
              <rect
                x={midX - 12}
                y={midY - 10}
                width={24}
                height={20}
                rx={4}
                fill="var(--bg-primary)"
                stroke="var(--border-color)"
              />
              <text
                x={midX}
                y={midY + 4}
                fill="var(--text-secondary)"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {edge.weight}
              </text>
            </g>
          )
        })}

        {/* Render Nodes */}
        {nodes.map((node) => {
          const isCurrent = currentNode === node.id
          const isVisited = visitedNodes.includes(node.id)

          let fill = 'var(--bg-primary)'
          let stroke = 'var(--border-color)'
          let glow = 'none'

          if (isCurrent) {
            fill = '#f59e0b'
            stroke = '#fbbf24'
            glow = '0 0 20px rgba(245, 158, 11, 0.8)'
          } else if (isVisited) {
            fill = '#6366f1'
            stroke = '#818cf8'
            glow = '0 0 12px rgba(99, 102, 241, 0.5)'
          }

          const nodeDist = dist[node.id] !== undefined ? (dist[node.id] === Infinity ? '∞' : dist[node.id]) : null

          return (
            <g key={`node-${node.id}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={22}
                fill={fill}
                stroke={stroke}
                strokeWidth={3}
                animate={{ scale: isCurrent ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ filter: glow !== 'none' ? `drop-shadow(${glow})` : 'none' }}
              />
              <text
                x={node.x}
                y={node.y + 5}
                fill={isCurrent || isVisited ? "#fff" : "var(--text-primary)"}
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
                pointerEvents="none"
              >
                {node.id}
              </text>
              {/* Distance label for Dijkstra */}
              {nodeDist !== null && (
                <text
                  x={node.x}
                  y={node.y - 28}
                  fill="#38bdf8"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  d={nodeDist}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
