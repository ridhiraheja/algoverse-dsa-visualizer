# Python Number Theory / Math Algorithms Step Generator

def generate_sieve_steps(limit=30):
    is_prime = [True] * (limit + 1)
    is_prime[0] = False
    is_prime[1] = False

    steps = [{
        'array': [i for i in range(2, limit + 1)],
        'comparing': [],
        'swapped': False,
        'description': f'Sieve of Eratosthenes: Initialize prime candidate list from 2 to {limit}.'
    }]

    p = 2
    while p * p <= limit:
        if is_prime[p]:
            steps.append({
                'array': [i for i in range(2, limit + 1)],
                'comparing': [p - 2],
                'swapped': True,
                'description': f'Found Prime Number {p}. Marking all multiples of {p} as composite (non-prime).'
            })

            for i in range(p * p, limit + 1, p):
                is_prime[i] = False
                steps.append({
                    'array': [i for i in range(2, limit + 1)],
                    'comparing': [p - 2, i - 2],
                    'swapped': False,
                    'description': f'Marking multiple {i} (divisible by {p}) as COMPOSITE.'
                })
        p += 1

    primes = [i for i in range(2, limit + 1) if is_prime[i]]

    steps.append({
        'array': primes,
        'comparing': [],
        'swapped': False,
        'sorted': list(range(len(primes))),
        'description': f'Sieve of Eratosthenes Complete! Found {len(primes)} prime numbers up to {limit}: {primes}'
    })

    return steps
