// Step Generators for Trees (Binary Search Tree & AVL Tree)

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
