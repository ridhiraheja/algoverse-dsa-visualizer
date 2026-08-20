# Python Graph Algorithms Step Generator
from collections import deque
import heapq

FIXED_NODE_POSITIONS = {
    'A': {'x': 100, 'y': 150},
    'B': {'x': 250, 'y': 80},
    'C': {'x': 250, 'y': 220},
    'D': {'x': 400, 'y': 80},
    'E': {'x': 400, 'y': 220},
    'F': {'x': 550, 'y': 150},
    'G': {'x': 320, 'y': 50},
    'H': {'x': 320, 'y': 250}
}

DEFAULT_GRAPH = {
    'nodes': [
        {'id': 'A', 'x': 100, 'y': 150},
        {'id': 'B', 'x': 250, 'y': 80},
        {'id': 'C', 'x': 250, 'y': 220},
        {'id': 'D', 'x': 400, 'y': 80},
        {'id': 'E', 'x': 400, 'y': 220},
        {'id': 'F', 'x': 550, 'y': 150}
    ],
    'edges': [
        {'from': 'A', 'to': 'B', 'weight': 4},
        {'from': 'A', 'to': 'C', 'weight': 2},
        {'from': 'B', 'to': 'C', 'weight': 1},
        {'from': 'B', 'to': 'D', 'weight': 5},
        {'from': 'C', 'to': 'E', 'weight': 8},
        {'from': 'C', 'to': 'D', 'weight': 10},
        {'from': 'D', 'to': 'E', 'weight': 2},
        {'from': 'D', 'to': 'F', 'weight': 6},
        {'from': 'E', 'to': 'F', 'weight': 3}
    ]
}


def normalize_graph_nodes(graph):
    if not graph or 'nodes' not in graph:
        return DEFAULT_GRAPH['nodes'], DEFAULT_GRAPH['edges']

    nodes = graph['nodes']
    edges = graph['edges']

    # Enforce fixed node positions so graph layout shape NEVER distorts
    for n in nodes:
        node_id = n.get('id')
        if node_id in FIXED_NODE_POSITIONS:
            n['x'] = FIXED_NODE_POSITIONS[node_id]['x']
            n['y'] = FIXED_NODE_POSITIONS[node_id]['y']

    return nodes, edges


def generate_bfs_steps(graph=None, start='A'):
    nodes, edges = normalize_graph_nodes(graph)
    steps = []

    adj = {n['id']: [] for n in nodes}
    for edge in edges:
        if edge['from'] in adj:
            adj[edge['from']].append((edge['to'], edge))
        if edge['to'] in adj:
            adj[edge['to']].append((edge['from'], edge))

    visited = set([start])
    queue = deque([start])
    visited_edges = []

    steps.append({
        'nodes': nodes,
        'edges': edges,
        'currentNode': start,
        'visitedNodes': list(visited),
        'activeEdge': None,
        'visitedEdges': [],
        'queue': list(queue),
        'line': 1,
        'description': f'Start BFS from node {start}'
    })

    while queue:
        curr = queue.popleft()
        steps.append({
            'nodes': nodes,
            'edges': edges,
            'currentNode': curr,
            'visitedNodes': list(visited),
            'activeEdge': None,
            'visitedEdges': list(visited_edges),
            'queue': list(queue),
            'line': 3,
            'description': f'Dequeued node {curr}. Exploring neighbors'
        })

        for neighbor, edge in adj.get(curr, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                visited_edges.append(edge)
                steps.append({
                    'nodes': nodes,
                    'edges': edges,
                    'currentNode': neighbor,
                    'visitedNodes': list(visited),
                    'activeEdge': edge,
                    'visitedEdges': list(visited_edges),
                    'queue': list(queue),
                    'line': 6,
                    'description': f'Discovered unvisited neighbor {neighbor}. Enqueued {neighbor}'
                })

    steps.append({
        'nodes': nodes,
        'edges': edges,
        'currentNode': None,
        'visitedNodes': list(visited),
        'activeEdge': None,
        'visitedEdges': list(visited_edges),
        'queue': [],
        'line': 8,
        'description': 'BFS Traversal Complete!'
    })
    return steps


def generate_dfs_steps(graph=None, start='A'):
    nodes, edges = normalize_graph_nodes(graph)
    steps = []

    adj = {n['id']: [] for n in nodes}
    for edge in edges:
        if edge['from'] in adj:
            adj[edge['from']].append((edge['to'], edge))
        if edge['to'] in adj:
            adj[edge['to']].append((edge['from'], edge))

    visited = set()
    visited_edges = []

    steps.append({
        'nodes': nodes,
        'edges': edges,
        'currentNode': start,
        'visitedNodes': [],
        'activeEdge': None,
        'visitedEdges': [],
        'line': 1,
        'description': f'Start DFS from node {start}'
    })

    def dfs(node):
        visited.add(node)
        steps.append({
            'nodes': nodes,
            'edges': edges,
            'currentNode': node,
            'visitedNodes': list(visited),
            'activeEdge': None,
            'visitedEdges': list(visited_edges),
            'line': 2,
            'description': f'Visit node {node}'
        })

        for neighbor, edge in adj.get(node, []):
            if neighbor not in visited:
                visited_edges.append(edge)
                steps.append({
                    'nodes': nodes,
                    'edges': edges,
                    'currentNode': node,
                    'visitedNodes': list(visited),
                    'activeEdge': edge,
                    'visitedEdges': list(visited_edges),
                    'line': 4,
                    'description': f'Traverse edge ({edge["from"]}-{edge["to"]}) to unvisited node {neighbor}'
                })
                dfs(neighbor)

    dfs(start)
    steps.append({
        'nodes': nodes,
        'edges': edges,
        'currentNode': None,
        'visitedNodes': list(visited),
        'activeEdge': None,
        'visitedEdges': list(visited_edges),
        'line': 6,
        'description': 'DFS Traversal Complete!'
    })
    return steps


def generate_dijkstra_steps(graph=None, start='A'):
    nodes, edges = normalize_graph_nodes(graph)
    steps = []

    adj = {n['id']: [] for n in nodes}
    for edge in edges:
        if edge['from'] in adj:
            adj[edge['from']].append((edge['to'], edge['weight'], edge))
        if edge['to'] in adj:
            adj[edge['to']].append((edge['from'], edge['weight'], edge))

    dist = {n['id']: float('inf') for n in nodes}
    dist[start] = 0
    pq = [(0, start)]
    visited = set()
    visited_edges = []

    steps.append({
        'nodes': nodes,
        'edges': edges,
        'currentNode': start,
        'dist': {k: (v if v != float('inf') else '∞') for k, v in dist.items()},
        'visitedNodes': [],
        'activeEdge': None,
        'visitedEdges': [],
        'line': 1,
        'description': f"Start Dijkstra's algorithm from source node {start}"
    })

    while pq:
        d, curr = heapq.heappop(pq)
        if curr in visited:
            continue
        visited.add(curr)

        steps.append({
            'nodes': nodes,
            'edges': edges,
            'currentNode': curr,
            'dist': {k: (v if v != float('inf') else '∞') for k, v in dist.items()},
            'visitedNodes': list(visited),
            'activeEdge': None,
            'visitedEdges': list(visited_edges),
            'line': 3,
            'description': f'Extracted minimum distance node {curr} with distance {d}'
        })

        for neighbor, weight, edge in adj.get(curr, []):
            if neighbor not in visited:
                alt = dist[curr] + weight
                if alt < dist[neighbor]:
                    dist[neighbor] = alt
                    heapq.heappush(pq, (alt, neighbor))
                    visited_edges.append(edge)
                    steps.append({
                        'nodes': nodes,
                        'edges': edges,
                        'currentNode': neighbor,
                        'dist': {k: (v if v != float('inf') else '∞') for k, v in dist.items()},
                        'visitedNodes': list(visited),
                        'activeEdge': edge,
                        'visitedEdges': list(visited_edges),
                        'line': 6,
                        'description': f'Updated shortest distance to {neighbor} via {curr}: {dist[neighbor]}'
                    })

    steps.append({
        'nodes': nodes,
        'edges': edges,
        'currentNode': None,
        'dist': {k: (v if v != float('inf') else '∞') for k, v in dist.items()},
        'visitedNodes': list(visited),
        'activeEdge': None,
        'visitedEdges': list(visited_edges),
        'line': 8,
        'description': "Dijkstra's Shortest Paths Complete!"
    })
    return steps
