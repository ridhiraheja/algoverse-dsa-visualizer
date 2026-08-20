# Python Greedy Algorithms Step Generator

def generate_activity_selection_steps(start_times=None, finish_times=None):
    if start_times is None:
        start_times = [1, 3, 0, 5, 8, 5]
    if finish_times is None:
        finish_times = [2, 4, 6, 7, 9, 9]

    n = len(start_times)
    activities = sorted(range(n), key=lambda i: finish_times[i])
    selected = []

    steps = [{
        'array': finish_times,
        'comparing': [],
        'swapped': False,
        'description': 'Activity Selection: Sorting activities by finish time.'
    }]

    last_finish = -1
    for idx in activities:
        st = start_times[idx]
        ft = finish_times[idx]
        if st >= last_finish:
            selected.append(idx)
            last_finish = ft
            steps.append({
                'array': list(finish_times),
                'comparing': [idx],
                'swapped': True,
                'sorted': list(selected),
                'description': f'Selected Activity {idx + 1} (Start: {st}, Finish: {ft})'
            })
        else:
            steps.append({
                'array': list(finish_times),
                'comparing': [idx],
                'swapped': False,
                'sorted': list(selected),
                'description': f'Skipped Activity {idx + 1} (Start: {st} < Last Finish: {last_finish})'
            })

    steps.append({
        'array': list(finish_times),
        'comparing': [],
        'swapped': False,
        'sorted': list(selected),
        'description': f'Greedy Activity Selection Complete! Selected {len(selected)} non-overlapping activities.'
    })
    return steps


def generate_fractional_knapsack_steps(capacity=50):
    weights = [10, 20, 30]
    values = [60, 100, 120]
    ratios = [v / w for v, w in zip(values, weights)]

    steps = [{
        'array': [int(r) for r in ratios],
        'comparing': [],
        'swapped': False,
        'description': 'Fractional Knapsack: Calculate Value-to-Weight ratios.'
    }]

    total_val = 0.0
    curr_cap = capacity

    items = sorted(range(len(weights)), key=lambda i: ratios[i], reverse=True)
    for idx in items:
        w, v = weights[idx], values[idx]
        if w <= curr_cap:
            curr_cap -= w
            total_val += v
            steps.append({
                'array': [60, 100, 120],
                'comparing': [idx],
                'swapped': True,
                'description': f'Took 100% of Item {idx+1} (Weight: {w}, Value: {v}). Remaining Capacity: {curr_cap}'
            })
        else:
            fraction = curr_cap / w
            total_val += v * fraction
            steps.append({
                'array': [60, 100, 120],
                'comparing': [idx],
                'swapped': True,
                'description': f'Took {int(fraction*100)}% of Item {idx+1} (Weight: {curr_cap}/{w}, Value: {v * fraction:.1f}). Capacity full.'
            })
            break

    steps.append({
        'array': [60, 100, 120],
        'comparing': [],
        'swapped': False,
        'sorted': [0, 1, 2],
        'description': f'Fractional Knapsack Complete! Total Maximum Value: {total_val:.1f}'
    })
    return steps


def generate_boats_to_save_people_steps(people=None, limit=3):
    if people is None:
        people = [3, 2, 2, 1]

    people_sorted = sorted(people)
    n = len(people_sorted)
    left, right = 0, n - 1
    boats = 0

    steps = [{
        'array': list(people_sorted),
        'comparing': [left, right],
        'swapped': False,
        'description': f'Boats to Save People (LeetCode 881): Sorted people weights {people_sorted}, Boat Limit = {limit}'
    }]

    while left <= right:
        if left == right:
            boats += 1
            steps.append({
                'array': list(people_sorted),
                'comparing': [left],
                'swapped': True,
                'description': f'Boat #{boats}: Single remaining person weight {people_sorted[left]} placed in boat.'
            })
            break

        if people_sorted[left] + people_sorted[right] <= limit:
            boats += 1
            steps.append({
                'array': list(people_sorted),
                'comparing': [left, right],
                'swapped': True,
                'description': f'Boat #{boats}: Paired Person {people_sorted[left]} + Person {people_sorted[right]} = {people_sorted[left] + people_sorted[right]} <= {limit}'
            })
            left += 1
            right -= 1
        else:
            boats += 1
            steps.append({
                'array': list(people_sorted),
                'comparing': [right],
                'swapped': False,
                'description': f'Boat #{boats}: Heaviest person weight {people_sorted[right]} exceeds pair limit. Placed alone.'
            })
            right -= 1

    steps.append({
        'array': list(people_sorted),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(n)),
        'description': f'Greedy Boats Assignment Complete! Minimum Boats Required: {boats}'
    })
    return steps


def generate_stone_pile_steps(piles=None):
    if piles is None:
        piles = [5, 4, 9]

    piles_curr = list(piles)
    steps = [{
        'array': list(piles_curr),
        'comparing': [],
        'swapped': False,
        'description': f'Stone Piles (LeetCode 1962): Initial stone piles {piles_curr}'
    }]

    for step_num in range(1, 4):
        max_idx = piles_curr.index(max(piles_curr))
        orig_val = piles_curr[max_idx]
        reduced_val = orig_val - (orig_val // 2)
        piles_curr[max_idx] = reduced_val

        steps.append({
            'array': list(piles_curr),
            'comparing': [max_idx],
            'swapped': True,
            'description': f'Greedy Operation #{step_num}: Picked max pile {orig_val} at index {max_idx}. Reduced to {reduced_val} stones.'
        })

    steps.append({
        'array': list(piles_curr),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(len(piles_curr))),
        'description': f'Stone Piles Minimization Complete! Final total stones: {sum(piles_curr)}'
    })
    return steps
