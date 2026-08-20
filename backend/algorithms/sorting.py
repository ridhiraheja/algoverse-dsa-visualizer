# Python Sorting Algorithms Step Generator

def generate_bubble_sort_steps(initial_array):
    steps = []
    arr = list(initial_array)
    n = len(arr)

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': [],
        'line': 1,
        'description': 'Start Bubble Sort'
    })

    for i in range(n):
        for j in range(n - i - 1):
            sorted_indices = list(range(n - i, n))
            steps.append({
                'array': list(arr),
                'comparing': [j, j + 1],
                'swapped': False,
                'sorted': sorted_indices,
                'line': 3,
                'description': f'Compare element {arr[j]} at index {j} and {arr[j + 1]} at index {j + 1}'
            })

            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                steps.append({
                    'array': list(arr),
                    'comparing': [j, j + 1],
                    'swapped': True,
                    'sorted': sorted_indices,
                    'line': 4,
                    'description': f'Swap {arr[j + 1]} and {arr[j]} since {arr[j + 1]} > {arr[j]}'
                })

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(n)),
        'line': 8,
        'description': 'Bubble Sort Complete!'
    })
    return steps


def generate_selection_sort_steps(initial_array):
    steps = []
    arr = list(initial_array)
    n = len(arr)

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': [],
        'line': 1,
        'description': 'Start Selection Sort'
    })

    for i in range(n):
        min_idx = i
        steps.append({
            'array': list(arr),
            'comparing': [i],
            'swapped': False,
            'sorted': list(range(i)),
            'line': 2,
            'description': f'Assume minimum is element {arr[i]} at index {i}'
        })

        for j in range(i + 1, n):
            steps.append({
                'array': list(arr),
                'comparing': [min_idx, j],
                'swapped': False,
                'sorted': list(range(i)),
                'line': 4,
                'description': f'Compare element at index {j} ({arr[j]}) with current min ({arr[min_idx]})'
            })

            if arr[j] < arr[min_idx]:
                min_idx = j
                steps.append({
                    'array': list(arr),
                    'comparing': [min_idx],
                    'swapped': False,
                    'sorted': list(range(i)),
                    'line': 5,
                    'description': f'New minimum found: {arr[min_idx]} at index {min_idx}'
                })

        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            steps.append({
                'array': list(arr),
                'comparing': [i, min_idx],
                'swapped': True,
                'sorted': list(range(i + 1)),
                'line': 7,
                'description': f'Swap element at index {i} ({arr[min_idx]}) with min ({arr[i]})'
            })

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(n)),
        'line': 9,
        'description': 'Selection Sort Complete!'
    })
    return steps


def generate_insertion_sort_steps(initial_array):
    steps = []
    arr = list(initial_array)
    n = len(arr)

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': [0],
        'line': 1,
        'description': 'Start Insertion Sort'
    })

    for i in range(1, n):
        key = arr[i]
        j = i - 1

        steps.append({
            'array': list(arr),
            'comparing': [i],
            'swapped': False,
            'sorted': list(range(i)),
            'line': 2,
            'description': f'Pick key element {key} at index {i}'
        })

        while j >= 0 and arr[j] > key:
            steps.append({
                'array': list(arr),
                'comparing': [j, j + 1],
                'swapped': False,
                'sorted': list(range(i)),
                'line': 4,
                'description': f'Compare arr[{j}] ({arr[j]}) with key ({key}). {arr[j]} > {key}, move right.'
            })

            arr[j + 1] = arr[j]
            steps.append({
                'array': list(arr),
                'comparing': [j + 1],
                'swapped': True,
                'sorted': list(range(i)),
                'line': 5,
                'description': f'Shift element {arr[j]} right to index {j + 1}'
            })

            j -= 1

        arr[j + 1] = key
        steps.append({
            'array': list(arr),
            'comparing': [j + 1],
            'swapped': True,
            'sorted': list(range(i + 1)),
            'line': 8,
            'description': f'Insert key {key} at index {j + 1}'
        })

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(n)),
        'line': 9,
        'description': 'Insertion Sort Complete!'
    })
    return steps


def generate_merge_sort_steps(initial_array):
    steps = []
    arr = list(initial_array)

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': [],
        'line': 1,
        'description': 'Start Merge Sort'
    })

    def merge(l, mid, r):
        left = arr[l:mid + 1]
        right = arr[mid + 1:r + 1]
        i = j = 0
        k = l

        while i < len(left) and j < len(right):
            steps.append({
                'array': list(arr),
                'comparing': [l + i, mid + 1 + j],
                'swapped': False,
                'sorted': [],
                'line': 5,
                'description': f'Compare element {left[i]} from left half and {right[j]} from right half'
            })

            if left[i] <= right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1

            steps.append({
                'array': list(arr),
                'comparing': [k],
                'swapped': True,
                'sorted': [],
                'line': 6,
                'description': f'Placed smaller element {arr[k]} into merged position index {k}'
            })
            k += 1

        while i < len(left):
            arr[k] = left[i]
            steps.append({
                'array': list(arr),
                'comparing': [k],
                'swapped': True,
                'sorted': [],
                'line': 6,
                'description': f'Placed remaining left element {arr[k]} into index {k}'
            })
            i += 1
            k += 1

        while j < len(right):
            arr[k] = right[j]
            steps.append({
                'array': list(arr),
                'comparing': [k],
                'swapped': True,
                'sorted': [],
                'line': 6,
                'description': f'Placed remaining right element {arr[k]} into index {k}'
            })
            j += 1
            k += 1

    def sort(l, r):
        if l >= r:
            return
        mid = (l + r) // 2
        sort(l, mid)
        sort(mid + 1, r)
        merge(l, mid, r)

    sort(0, len(arr) - 1)

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(len(arr))),
        'line': 7,
        'description': 'Merge Sort Complete!'
    })
    return steps


def generate_quick_sort_steps(initial_array):
    steps = []
    arr = list(initial_array)

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': [],
        'line': 1,
        'description': 'Start Quick Sort'
    })

    def partition(low, high):
        pivot = arr[high]
        i = low - 1

        steps.append({
            'array': list(arr),
            'comparing': [high],
            'swapped': False,
            'sorted': [],
            'line': 3,
            'description': f'Chosen pivot element {pivot} at index {high}'
        })

        for j in range(low, high):
            steps.append({
                'array': list(arr),
                'comparing': [j, high],
                'swapped': False,
                'sorted': [],
                'line': 4,
                'description': f'Compare arr[{j}] ({arr[j]}) with pivot ({pivot})'
            })

            if arr[j] < pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                steps.append({
                    'array': list(arr),
                    'comparing': [i, j],
                    'swapped': True,
                    'sorted': [],
                    'line': 5,
                    'description': f'Swap arr[{i}] ({arr[i]}) and arr[{j}] ({arr[j]}) since {arr[i]} < pivot'
                })

        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        steps.append({
            'array': list(arr),
            'comparing': [i + 1, high],
            'swapped': True,
            'sorted': [i + 1],
            'line': 6,
            'description': f'Place pivot {pivot} into its correct sorted position index {i + 1}'
        })

        return i + 1

    def sort(low, high):
        if low < high:
            pi = partition(low, high)
            sort(low, pi - 1)
            sort(pi + 1, high)

    sort(0, len(arr) - 1)

    steps.append({
        'array': list(arr),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(len(arr))),
        'line': 7,
        'description': 'Quick Sort Complete!'
    })
    return steps
