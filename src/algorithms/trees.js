// Step Generators for Trees (Binary Search Tree, AVL Tree & Symmetric Tree)

export function generateBSTSteps(keys = [50, 30, 70, 20, 40, 60, 80]) {
  const steps = []

  let tree = null
  let nextId = 1

  function createNode(key) {
    return { id: nextId++, key, left: null, right: null, height: 1 }
  }

  function cloneTree(node) {
    if (!node) return null
    return {
      id: node.id,
      key: node.key,
      left: cloneTree(node.left),
      right: cloneTree(node.right),
      height: node.height
    }
  }

  steps.push({
    tree: null,
    activeKey: null,
    activeNodeId: null,
    line: 1,
    description: 'Initialize Binary Search Tree (BST)'
  })

  function insert(node, key) {
    if (!node) {
      const newNode = createNode(key)
      steps.push({
        tree: cloneTree(newNode), // Inserted
        activeKey: key,
        activeNodeId: newNode.id,
        line: 2,
        description: `Created new leaf node with key ${key}`
      })
      return newNode
    }

    steps.push({
      tree: cloneTree(tree),
      activeKey: key,
      activeNodeId: node.id,
      line: 3,
      description: `Compare insertion key ${key} with current node ${node.key}`
    })

    if (key < node.key) {
      node.left = insert(node.left, key)
    } else if (key > node.key) {
      node.right = insert(node.right, key)
    }
    return node
  }

  keys.forEach(k => {
    steps.push({
      tree: cloneTree(tree),
      activeKey: k,
      activeNodeId: null,
      line: 1,
      description: `Insert key ${k} into BST`
    })
    tree = insert(tree, k)
  })

  steps.push({
    tree: cloneTree(tree),
    activeKey: null,
    activeNodeId: null,
    line: 5,
    description: 'BST Insertion Sequence Complete!'
  })

  return steps
}

export function generateAVLTreeSteps(keys = [10, 20, 30, 40, 50, 25]) {
  const steps = []
  let tree = null
  let nextId = 1

  function createNode(key) {
    return { id: nextId++, key, left: null, right: null, height: 1 }
  }

  function getHeight(node) {
    return node ? node.height : 0
  }

  function getBalance(node) {
    return node ? getHeight(node.left) - getHeight(node.right) : 0
  }

  function updateHeight(node) {
    if (node) {
      node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right))
    }
  }

  function cloneTree(node) {
    if (!node) return null
    return {
      id: node.id,
      key: node.key,
      left: cloneTree(node.left),
      right: cloneTree(node.right),
      height: node.height
    }
  }

  function rightRotate(y) {
    const x = y.left
    const T2 = x.right
    x.right = y
    y.left = T2
    updateHeight(y)
    updateHeight(x)
    return x
  }

  function leftRotate(x) {
    const y = x.right
    const T2 = y.left
    y.left = x
    x.right = T2
    updateHeight(x)
    updateHeight(y)
    return y
  }

  function insert(node, key) {
    if (!node) return createNode(key)

    if (key < node.key) node.left = insert(node.left, key)
    else if (key > node.key) node.right = insert(node.right, key)
    else return node

    updateHeight(node)
    const balance = getBalance(node)

    // Left Left Case
    if (balance > 1 && key < node.left.key) {
      steps.push({
        tree: cloneTree(tree),
        activeNodeId: node.id,
        rotation: 'Right Rotation',
        line: 4,
        description: `Unbalanced node ${node.key} (balance ${balance}). Perform Right Rotation!`
      })
      return rightRotate(node)
    }

    // Right Right Case
    if (balance < -1 && key > node.right.key) {
      steps.push({
        tree: cloneTree(tree),
        activeNodeId: node.id,
        rotation: 'Left Rotation',
        line: 5,
        description: `Unbalanced node ${node.key} (balance ${balance}). Perform Left Rotation!`
      })
      return leftRotate(node)
    }

    // Left Right Case
    if (balance > 1 && key > node.left.key) {
      steps.push({
        tree: cloneTree(tree),
        activeNodeId: node.id,
        rotation: 'Left-Right Rotation',
        line: 6,
        description: `Unbalanced node ${node.key}. Perform Left Rotation on left child then Right Rotation!`
      })
      node.left = leftRotate(node.left)
      return rightRotate(node)
    }

    // Right Left Case
    if (balance < -1 && key < node.right.key) {
      steps.push({
        tree: cloneTree(tree),
        activeNodeId: node.id,
        rotation: 'Right-Left Rotation',
        line: 7,
        description: `Unbalanced node ${node.key}. Perform Right Rotation on right child then Left Rotation!`
      })
      node.right = rightRotate(node.right)
      return leftRotate(node)
    }

    return node
  }

  keys.forEach(k => {
    steps.push({
      tree: cloneTree(tree),
      activeKey: k,
      activeNodeId: null,
      line: 1,
      description: `Insert key ${k} into self-balancing AVL Tree`
    })
    tree = insert(tree, k)
    steps.push({
      tree: cloneTree(tree),
      activeKey: k,
      activeNodeId: null,
      line: 2,
      description: `AVL Tree re-balanced after inserting ${k}`
    })
  })

  steps.push({
    tree: cloneTree(tree),
    activeKey: null,
    activeNodeId: null,
    line: 8,
    description: 'AVL Tree Sequence Complete!'
  })

  return steps
}

export function generateSymmetricTreeSteps() {
  const steps = []

  // Create a 100% symmetric tree
  const tree = {
    id: 1,
    key: 1,
    left: {
      id: 2,
      key: 2,
      left: { id: 4, key: 3, left: null, right: null },
      right: { id: 5, key: 4, left: null, right: null }
    },
    right: {
      id: 3,
      key: 2,
      left: { id: 6, key: 4, left: null, right: null },
      right: { id: 7, key: 3, left: null, right: null }
    }
  }

  const symmetryMatrix = [
    ['Left Subtree Node', 'Right Subtree Node', 'Symmetric Match?'],
    ['Node (2)', 'Node (2)', '✅ MATCH (2 == 2)'],
    ['Left.Left (3)', 'Right.Right (3)', '✅ MATCH (3 == 3)'],
    ['Left.Right (4)', 'Right.Left (4)', '✅ MATCH (4 == 4)']
  ]

  steps.push({
    tree,
    activeNodes: [1],
    mirrorAxis: true,
    dp: symmetryMatrix,
    line: 1,
    description: 'Start Symmetric Tree Check: Verify if left & right subtrees are mirror images around center axis.'
  })

  steps.push({
    tree,
    activeNodes: [2, 3],
    mirrorAxis: true,
    dp: symmetryMatrix,
    currCell: [1, 2],
    line: 2,
    description: 'Compare Level 1: Left child (val: 2) vs Right child (val: 2) -> Match!'
  })

  steps.push({
    tree,
    activeNodes: [4, 7],
    mirrorAxis: true,
    dp: symmetryMatrix,
    currCell: [2, 2],
    line: 3,
    description: 'Compare Outer Sub-branches: Left.Left (val: 3) vs Right.Right (val: 3) -> Match!'
  })

  steps.push({
    tree,
    activeNodes: [5, 6],
    mirrorAxis: true,
    dp: symmetryMatrix,
    currCell: [3, 2],
    line: 4,
    description: 'Compare Inner Sub-branches: Left.Right (val: 4) vs Right.Left (val: 4) -> Match!'
  })

  steps.push({
    tree,
    activeNodes: [1, 2, 3, 4, 5, 6, 7],
    mirrorAxis: true,
    dp: symmetryMatrix,
    done: true,
    line: 5,
    description: 'Result: Binary Tree is 100% SYMMETRIC (Perfect Mirror Image)!'
  })

  return steps
}
