// Step Generators for Number Theory / Math Algorithms

export function generateSieveSteps(limit = 30) {
  const isPrime = Array(limit + 1).fill(true)
  isPrime[0] = false
  isPrime[1] = false

  const candidates = Array.from({ length: limit - 1 }, (_, i) => i + 2)
  const steps = []

  steps.push({
    array: candidates,
    comparing: [],
    swapped: false,
    line: 1,
    description: `Sieve of Eratosthenes: Initialize prime candidate list from 2 to ${limit}.`
  })

  let p = 2
  while (p * p <= limit) {
    if (isPrime[p]) {
      steps.push({
        array: [...candidates],
        comparing: [p - 2],
        swapped: true,
        line: 3,
        description: `Found Prime Number ${p}. Marking all multiples of ${p} as composite (non-prime).`
      })

      for (let i = p * p; i <= limit; i += p) {
        isPrime[i] = false
        steps.push({
          array: [...candidates],
          comparing: [p - 2, i - 2],
          swapped: false,
          line: 5,
          description: `Marking multiple ${i} (divisible by ${p}) as COMPOSITE.`
        })
      }
    }
    p++
  }

  const primes = candidates.filter(num => isPrime[num])

  steps.push({
    array: primes,
    comparing: [],
    swapped: false,
    sorted: Array.from({ length: primes.length }, (_, i) => i),
    line: 8,
    description: `Sieve of Eratosthenes Complete! Found ${primes.length} prime numbers up to ${limit}: ${primes.join(', ')}`
  })

  return steps
}
