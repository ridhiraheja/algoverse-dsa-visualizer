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
