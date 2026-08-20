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

  const { tree, activeNodeId, activeNodes = [], rotation, mirrorAxis = false, dp = null } = step

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      
      {/* Tree Canvas */}
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

        {mirrorAxis && (
          <div style={{
            position: 'absolute',
            top: '0.8rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '0.25rem 0.65rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            zIndex: 10
          }}>
            🪞 Central Mirror Axis
          </div>
        )}

        <svg width="100%" height="100%" viewBox="0 0 640 340">
          
          {/* Vertical Center Mirror Axis Line */}
          {mirrorAxis && (
            <line
              x1="320"
              y1="20"
              x2="320"
              y2="320"
              stroke="var(--success)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}

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
            const isActive = activeNodeId === node.id || activeNodes.includes(node.id)

            let fill = '#6366f1'
            let stroke = '#818cf8'

            if (isActive) {
              fill = '#f59e0b'
              stroke = '#fbbf24'
            } else if (step.done) {
              fill = '#10b981'
              stroke = '#34d399'
            }

            return (
              <g key={`tree-node-${node.id}`}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={3}
                  animate={{ scale: isActive ? 1.25 : 1 }}
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

      {/* Symmetry Verification Matrix Table (If available) */}
      {dp && (
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            🪞 Symmetry Verification Table
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
                {dp[0].map((colTitle, i) => (
                  <th key={i} style={{ padding: '0.5rem 0.8rem', textAlign: 'left', border: '1px solid var(--border-color)' }}>
                    {colTitle}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.slice(1).map((row, rIdx) => (
                <tr key={rIdx} style={{ background: 'var(--bg-primary)' }}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '0.5rem 0.8rem', border: '1px solid var(--border-color)', color: cIdx === 2 ? 'var(--success)' : 'var(--text-primary)', fontWeight: cIdx === 2 ? 700 : 500 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}
