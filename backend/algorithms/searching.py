# Python Searching Algorithms Step Generator

def generate_linear_search_steps(initial_array, target):
    steps = []
    arr = list(initial_array)
    n = len(arr)

    steps.append({
        'array': list(arr),
        'comparing': [],
        'found': -1,
        'line': 1,
        'description': f'Start Linear Search for target: {target}'
    })

    for i in range(n):
        steps.append({
            'array': list(arr),
            'comparing': [i],
            'found': -1,
            'line': 2,
            'description': f'Checking index {i} (Value: {arr[i]})'
        })

        if arr[i] == target:
            steps.append({
                'array': list(arr),
                'comparing': [i],
                'found': i,
                'line': 3,
                'description': f'Target {target} found at index {i}!'
            })
            return steps

    steps.append({
        'array': list(arr),
        'comparing': [],
        'found': -1,
        'line': 5,
        'description': f'Target {target} not found in array.'
    })
    return steps


def generate_binary_search_steps(initial_array, target):
    steps = []
    arr = sorted(list(initial_array))
    n = len(arr)
    low = 0
    high = n - 1

    steps.append({
        'array': list(arr),
        'comparing': [],
        'found': -1,
        'low': low,
        'high': high,
        'mid': -1,
        'line': 1,
        'description': f'Start Binary Search for target: {target} (Array must be sorted)'
    })

    while low <= high:
        mid = (low + high) // 2

        steps.append({
            'array': list(arr),
            'comparing': [mid],
            'found': -1,
            'low': low,
            'high': high,
            'mid': mid,
            'line': 3,
            'description': f'Calculated mid index: {mid} (Value: {arr[mid]}). Search space: [{low}, {high}]'
        })

        if arr[mid] == target:
            steps.append({
                'array': list(arr),
                'comparing': [mid],
                'found': mid,
                'low': low,
                'high': high,
                'mid': mid,
                'line': 4,
                'description': f'Target {target} found at index {mid}!'
            })
            return steps
        elif arr[mid] < target:
            low = mid + 1
            steps.append({
                'array': list(arr),
                'comparing': [],
                'found': -1,
                'low': low,
                'high': high,
                'mid': mid,
                'line': 5,
                'description': f'{arr[mid]} < {target}. Target lies in right half. Setting low = {low}'
            })
        else:
            high = mid - 1
            steps.append({
                'array': list(arr),
                'comparing': [],
                'found': -1,
                'low': low,
                'high': high,
                'mid': mid,
                'line': 6,
                'description': f'{arr[mid]} > {target}. Target lies in left half. Setting high = {high}'
            })

    steps.append({
        'array': list(arr),
        'comparing': [],
        'found': -1,
        'low': low,
        'high': high,
        'mid': -1,
        'line': 8,
        'description': f'Target {target} not found.'
    })
    return steps
