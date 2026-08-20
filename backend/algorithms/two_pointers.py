# Python Two Pointers Algorithms Step Generator

def generate_two_sum_sorted_steps(arr=None, target=13):
    if arr is None:
        arr = [1, 3, 5, 8, 12, 15, 19]

    n = len(arr)
    left, right = 0, n - 1
    steps = []

    steps.append({
        'array': list(arr),
        'comparing': [left, right],
        'swapped': False,
        'description': f'Start Two Pointers search for Target Sum = {target}'
    })

    found = False
    while left < right:
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            steps.append({
                'array': list(arr),
                'comparing': [left, right],
                'swapped': True,
                'sorted': [left, right],
                'description': f'Found Target Sum! Elements at index {left} ({arr[left]}) + index {right} ({arr[right]}) = {target}'
            })
            found = True
            break
        elif curr_sum < target:
            steps.append({
                'array': list(arr),
                'comparing': [left, right],
                'swapped': False,
                'description': f'Sum ({curr_sum}) < Target ({target}). Moving LEFT pointer rightward (index {left} -> {left + 1})'
            })
            left += 1
        else:
            steps.append({
                'array': list(arr),
                'comparing': [left, right],
                'swapped': False,
                'description': f'Sum ({curr_sum}) > Target ({target}). Moving RIGHT pointer leftward (index {right} -> {right - 1})'
            })
            right -= 1

    if not found:
        steps.append({
            'array': list(arr),
            'comparing': [],
            'swapped': False,
            'description': f'No two elements sum to {target}.'
        })

    return steps


def generate_container_with_most_water_steps(heights=None):
    if heights is None:
        heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]

    n = len(heights)
    left, right = 0, n - 1
    max_area = 0
    best_pair = (left, right)
    steps = []

    steps.append({
        'array': list(heights),
        'comparing': [left, right],
        'swapped': False,
        'description': f'Container With Most Water: Initial heights {heights}'
    })

    while left < right:
        w = right - left
        h = min(heights[left], heights[right])
        area = w * h

        if area > max_area:
            max_area = area
            best_pair = (left, right)

        steps.append({
            'array': list(heights),
            'comparing': [left, right],
            'swapped': True,
            'sorted': list(best_pair),
            'description': f'Width = {w}, Min Height = {h} -> Area = {area}. Max Area so far = {max_area}'
        })

        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1

    steps.append({
        'array': list(heights),
        'comparing': [],
        'swapped': False,
        'sorted': list(best_pair),
        'description': f'Maximum Water Container Area Found: {max_area} between indices {best_pair[0]} and {best_pair[1]}'
    })
    return steps


def generate_tortoise_hare_steps(arr=None):
    if arr is None:
        arr = [1, 3, 4, 2, 2]

    n = len(arr)
    slow, fast = 0, 0
    steps = []

    steps.append({
        'array': list(arr),
        'comparing': [slow, fast],
        'swapped': False,
        'description': f'Floyd\'s Tortoise and Hare (LeetCode 287/141): Start Cycle Detection with array {arr}'
    })

    # Step 1: Detect cycle meeting point
    first_step = True
    while first_step or slow != fast:
        first_step = False
        slow = arr[slow]
        fast = arr[arr[fast]]

        steps.append({
            'array': list(arr),
            'comparing': [slow, fast],
            'swapped': False,
            'description': f'Tortoise 🐢 at index {slow} (val {arr[slow]}), Hare 🐇 at index {fast} (val {arr[fast]})'
        })

        if slow == fast:
            steps.append({
                'array': list(arr),
                'comparing': [slow, fast],
                'swapped': True,
                'sorted': [slow],
                'description': f'CYCLE INTERSECTION FOUND! Tortoise 🐢 and Hare 🐇 met at index {slow}'
            })
            break

    # Step 2: Find entrance to cycle (duplicate number)
    slow2 = 0
    steps.append({
        'array': list(arr),
        'comparing': [slow2, slow],
        'swapped': False,
        'description': 'Resetting second Tortoise 🐢 to index 0 to locate cycle entrance...'
    })

    while slow2 != slow:
        slow2 = arr[slow2]
        slow = arr[slow]
        steps.append({
            'array': list(arr),
            'comparing': [slow2, slow],
            'swapped': False,
            'description': f'Moving both pointers at 1 step: Tortoise 1 at {slow2}, Tortoise 2 at {slow}'
        })

    steps.append({
        'array': list(arr),
        'comparing': [slow],
        'swapped': True,
        'sorted': [slow],
        'description': f'Duplicate Number / Cycle Entrance Found: {slow}!'
    })

    return steps
