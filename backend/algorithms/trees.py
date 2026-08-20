# Python Tree Algorithms Step Generator

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

    def to_dict(self):
        return {
            'value': self.val,
            'left': self.left.to_dict() if self.left else None,
            'right': self.right.to_dict() if self.right else None
        }


def generate_bst_steps(values=None):
    if values is None:
        values = [50, 30, 70, 20, 40, 60, 80]
    steps = []
    root = None

    def insert(node, val):
        if not node:
            steps.append({
                'activeVal': val,
                'action': 'insert',
                'description': f'Created new tree node with value {val}'
            })
            return TreeNode(val)

        steps.append({
            'activeVal': node.val,
            'action': 'compare',
            'description': f'Compare {val} with node value {node.val}'
        })

        if val < node.val:
            node.left = insert(node.left, val)
        else:
            node.right = insert(node.right, val)
        return node

    steps.append({
        'activeVal': None,
        'action': 'start',
        'description': f'Start Binary Search Tree insertion for sequence: {values}'
    })

    for v in values:
        root = insert(root, v)
        steps.append({
            'tree': root.to_dict() if root else None,
            'activeVal': v,
            'action': 'complete_insert',
            'description': f'Successfully inserted {v} into BST'
        })

    return steps


def generate_symmetric_tree_steps():
    tree = {
        'id': 1,
        'key': 1,
        'left': {
            'id': 2,
            'key': 2,
            'left': {'id': 4, 'key': 3, 'left': None, 'right': None},
            'right': {'id': 5, 'key': 4, 'left': None, 'right': None}
        },
        'right': {
            'id': 3,
            'key': 2,
            'left': {'id': 6, 'key': 4, 'left': None, 'right': None},
            'right': {'id': 7, 'key': 3, 'left': None, 'right': None}
        }
    }

    dp_matrix = [
        ['Left Subtree Node', 'Right Subtree Node', 'Symmetric Match?'],
        ['Node (2)', 'Node (2)', '✅ MATCH (2 == 2)'],
        ['Left.Left (3)', 'Right.Right (3)', '✅ MATCH (3 == 3)'],
        ['Left.Right (4)', 'Right.Left (4)', '✅ MATCH (4 == 4)']
    ]

    return [
        {
            'tree': tree,
            'activeNodes': [1],
            'mirrorAxis': True,
            'dp': dp_matrix,
            'line': 1,
            'description': 'Start Symmetric Tree Check: Verify if left & right subtrees are mirror images around center axis.'
        },
        {
            'tree': tree,
            'activeNodes': [2, 3],
            'mirrorAxis': True,
            'dp': dp_matrix,
            'currCell': [1, 2],
            'line': 2,
            'description': 'Compare Level 1: Left child (val: 2) vs Right child (val: 2) -> Match!'
        },
        {
            'tree': tree,
            'activeNodes': [4, 7],
            'mirrorAxis': True,
            'dp': dp_matrix,
            'currCell': [2, 2],
            'line': 3,
            'description': 'Compare Outer Sub-branches: Left.Left (val: 3) vs Right.Right (val: 3) -> Match!'
        },
        {
            'tree': tree,
            'activeNodes': [5, 6],
            'mirrorAxis': True,
            'dp': dp_matrix,
            'currCell': [3, 2],
            'line': 4,
            'description': 'Compare Inner Sub-branches: Left.Right (val: 4) vs Right.Left (val: 4) -> Match!'
        },
        {
            'tree': tree,
            'activeNodes': [1, 2, 3, 4, 5, 6, 7],
            'mirrorAxis': True,
            'dp': dp_matrix,
            'done': True,
            'line': 5,
            'description': 'Result: Binary Tree is 100% SYMMETRIC (Perfect Mirror Image)!'
        }
    ]
