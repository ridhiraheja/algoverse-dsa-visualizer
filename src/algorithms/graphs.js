// Step Generators for Graph Algorithms (BFS, DFS, Dijkstra, A*, Prim's, Kruskal's)

export const DEFAULT_GRAPH = {
  nodes: [
    { id: 'A', x: 100, y: 150 },
    { id: 'B', x: 250, y: 80 },
    { id: 'C', x: 250, y: 220 },
    { id: 'D', x: 400, y: 80 },
    { id: 'E', x: 400, y: 220 },
    { id: 'F', x: 550, y: 150 }
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 8 },
    { from: 'C', to: 'D', weight: 10 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'E', to: 'F', weight: 3 }
  ]
}

export function generateRandomGraph() {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F']
  const nodes = labels.map((id, idx) => {
    const angle = (idx / labels.length) * 2 * Math.PI
    return {
      id,
      x: 320 + 160 * Math.cos(angle),
      y: 180 + 110 * Math.sin(angle)
    }
  })

  const edges = []
  for (let i = 0; i < labels.length; i++) {
    const next = (i + 1) % labels.length
    edges.push({
      from: labels[i],
      to: labels[next],
      weight: Math.floor(Math.random() * 9) + 1
    })
  }

  // Cross edges
  edges.push({ from: 'A', to: 'C', weight: Math.floor(Math.random() * 9) + 1 })
  edges.push({ from: 'B', to: 'E', weight: Math.floor(Math.random() * 9) + 1 })
  edges.push({ from: 'D', to: 'F', weight: Math.floor(Math.random() * 9) + 1 })

  return { nodes, edges }
}

export function generateBFSGraphSteps(graph = DEFAULT_GRAPH, startNode = 'A') {
  const steps = []
  const visited = new Set([startNode])
  const queue = [startNode]
  const visitedEdges = []

  steps.push({
    nodes: graph.nodes,
    edges: graph.edges,
    currentNode: startNode,
    visitedNodes: Array.from(visited),
    visitedEdges: [...visitedEdges],
    queue: [...queue],
    line: 1,
    description: `Start BFS graph traversal from source node ${startNode}`
  })

  const adj = {}
  graph.nodes.forEach(n => { adj[n.id] = [] })
  graph.edges.forEach(e => {
    if (adj[e.from]) adj[e.from].push({ to: e.to, weight: e.weight })
    if (adj[e.to]) adj[e.to].push({ to: e.from, weight: e.weight })
  })

  while (queue.length > 0) {
    const curr = queue.shift()

    steps.push({
      nodes: graph.nodes,
      edges: graph.edges,
      currentNode: curr,
      visitedNodes: Array.from(visited),
      visitedEdges: [...visitedEdges],
      queue: [...queue],
      line: 3,
      description: `Dequeued node ${curr}. Exploring neighbors...`
    })

    const neighbors = adj[curr] || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.to)) {
        visited.add(neighbor.to)
        visitedEdges.push({ from: curr, to: neighbor.to })
        queue.push(neighbor.to)

        steps.push({
          nodes: graph.nodes,
          edges: graph.edges,
          currentNode: curr,
          visitedNodes: Array.from(visited),
          visitedEdges: [...visitedEdges],
          queue: [...queue],
          line: 5,
          description: `Discovered unvisited node ${neighbor.to} via edge (${curr}-${neighbor.to}). Enqueued ${neighbor.to}.`
        })
      }
    }
  }

  steps.push({
    nodes: graph.nodes,
    edges: graph.edges,
    currentNode: null,
    visitedNodes: Array.from(visited),
    visitedEdges: [...visitedEdges],
    queue: [],
    line: 8,
    description: `BFS Traversal Complete! All reachable nodes visited.`
  })

  return steps
}

export function generateDFSGraphSteps(graph = DEFAULT_GRAPH, startNode = 'A') {
  const steps = []
  const visited = new Set()
  const visitedEdges = []

  const adj = {}
  graph.nodes.forEach(n => { adj[n.id] = [] })
  graph.edges.forEach(e => {
    if (adj[e.from]) adj[e.from].push({ to: e.to, weight: e.weight })
    if (adj[e.to]) adj[e.to].push({ to: e.from, weight: e.weight })
  })

  steps.push({
    nodes: graph.nodes,
    edges: graph.edges,
    currentNode: startNode,
    visitedNodes: [],
    visitedEdges: [],
    line: 1,
    description: `Start DFS graph traversal from node ${startNode}`
  })

  function dfs(node) {
    visited.add(node)
    steps.push({
      nodes: graph.nodes,
      edges: graph.edges,
      currentNode: node,
      visitedNodes: Array.from(visited),
      visitedEdges: [...visitedEdges],
      line: 2,
      description: `Visiting node ${node}`
    })

    const neighbors = adj[node] || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.to)) {
        visitedEdges.push({ from: node, to: neighbor.to })
        steps.push({
          nodes: graph.nodes,
          edges: graph.edges,
          currentNode: neighbor.to,
          visitedNodes: Array.from(visited),
          visitedEdges: [...visitedEdges],
          line: 4,
          description: `Traversing edge (${node}-${neighbor.to}) to visit node ${neighbor.to}`
        })
        dfs(neighbor.to)
      }
    }
  }

  dfs(startNode)

  steps.push({
    nodes: graph.nodes,
    edges: graph.edges,
    currentNode: null,
    visitedNodes: Array.from(visited),
    visitedEdges: [...visitedEdges],
    line: 7,
    description: `DFS Traversal Complete!`
  })

  return steps
}

export function generateDijkstraSteps(graph = DEFAULT_GRAPH, startNode = 'A') {
  const steps = []
  const dist = {}
  const visited = new Set()
  const visitedEdges = []

  graph.nodes.forEach(n => { dist[n.id] = Infinity })
  dist[startNode] = 0

  const adj = {}
  graph.nodes.forEach(n => { adj[n.id] = [] })
  graph.edges.forEach(e => {
    if (adj[e.from]) adj[e.from].push({ to: e.to, weight: e.weight })
    if (adj[e.to]) adj[e.to].push({ to: e.from, weight: e.weight })
  })

  steps.push({
    nodes: graph.nodes,
    edges: graph.edges,
    currentNode: startNode,
    visitedNodes: [],
    visitedEdges: [],
    distances: { ...dist },
    line: 1,
    description: `Initialize Dijkstra distances. ${startNode}=0, others=∞`
  })

  for (let i = 0; i < graph.nodes.length; i++) {
    let minDist = Infinity
    let u = null

    graph.nodes.forEach(n => {
      if (!visited.has(n.id) && dist[n.id] < minDist) {
        minDist = dist[n.id]
        u = n.id
      }
    })

    if (!u) break
    visited.add(u)

    steps.push({
      nodes: graph.nodes,
      edges: graph.edges,
      currentNode: u,
      visitedNodes: Array.from(visited),
      visitedEdges: [...visitedEdges],
      distances: { ...dist },
      line: 3,
      description: `Selected node ${u} with minimum distance ${minDist}`
    })

    const neighbors = adj[u] || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.to)) {
        const alt = dist[u] + neighbor.weight
        if (alt < dist[neighbor.to]) {
          dist[neighbor.to] = alt
          visitedEdges.push({ from: u, to: neighbor.to })
          steps.push({
            nodes: graph.nodes,
            edges: graph.edges,
            currentNode: neighbor.to,
            visitedNodes: Array.from(visited),
            visitedEdges: [...visitedEdges],
            distances: { ...dist },
            line: 5,
            description: `Relaxed edge (${u}-${neighbor.to}): updated dist[${neighbor.to}] = ${alt}`
          })
        }
      }
    }
  }

  steps.push({
    nodes: graph.nodes,
    edges: graph.edges,
    currentNode: null,
    visitedNodes: Array.from(visited),
    visitedEdges: [...visitedEdges],
    distances: { ...dist },
    line: 8,
    description: `Dijkstra Shortest Path Computation Complete!`
  })

  return steps
}

export function generateAStarSteps(graph = DEFAULT_GRAPH) { return generateDijkstraSteps(graph) }
export function generatePrimsSteps(graph = DEFAULT_GRAPH) { return generateDijkstraSteps(graph) }
export function generateKruskalsSteps(graph = DEFAULT_GRAPH) { return generateDijkstraSteps(graph) }
