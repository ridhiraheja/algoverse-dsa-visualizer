import React from 'react'
import { motion } from 'framer-motion'

export default function TreeVisualizer({ step }) {
  if (!step || !step.tree) {
    return (
      <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Tree is Empty. Insert elements to construct binary search tree.
      </div>
    )
  }

  const { tree, activeNodeId, rotation } = step

  // Recursively calculate coordinates for tree nodes
  const nodesToRender = []
  const edgesToRender = []

  function calculatePositions(node, x, y, offset) {
    if (!node) return
    nodesToRender.push({ ...node, x, y })

    if (node.left) {
      const childX = x - offset
      const childY = y + 60
      edgesToRender.push({ x1: x, y1: y, x2: childX, y2: childY })
      calculatePositions(node.left, childX, childY, offset * 0.55)
    }
    if (node.right) {
      const childX = x + offset
      const childY = y + 60
      edgesToRender.push({ x1: x, y1: y, x2: childX, y2: childY })
      calculatePositions(node.right, childX, childY, offset * 0.55)
    }
  }

  calculatePositions(tree, 320, 45, 140)

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
      {rotation && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid var(--warning)',
          color: 'var(--warning)',
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '0.85rem',
          fontWeight: 700
        }}>
          ⚡ {rotation}
        </div>
      )}

      <svg width="100%" height="100%" viewBox="0 0 640 340">
        {/* Render Tree Branches */}
        {edgesToRender.map((edge, idx) => (
          <line
            key={`tree-edge-${idx}`}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="var(--border-color)"
            strokeWidth={2}
          />
        ))}

        {/* Render Tree Nodes */}
        {nodesToRender.map((node) => {
          const isActive = activeNodeId === node.id

          return (
            <g key={`tree-node-${node.id}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill={isActive ? '#f59e0b' : '#6366f1'}
                stroke={isActive ? '#fbbf24' : '#818cf8'}
                strokeWidth={3}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
              <text
                x={node.x}
                y={node.y + 5}
                fill="#fff"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                {node.key}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
