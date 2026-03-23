import type { Snapshot } from '@dsa-visualizer/shared';

// ── Fibonacci Recursive ──



export function runFibonacciRecursive(n: number): { snapshots: Snapshot[]; } {
  const snapshots: Snapshot[] = [];
  let step = 0;

  snapshots.push({
    stepIndex: step++, codeLine: 1, // function fib(n)
    description: `Computing Fibonacci(${n}) recursively`,
    callStack: [], highlights: {}, variables: { n },
  });

  function fib(val: number, stack: string[]): number {
    const currentStack = [...stack, `fib(${val})`];

    snapshots.push({
      stepIndex: step++, codeLine: 1,
      description: `Call fib(${val})`,
      callStack: currentStack, highlights: {}, variables: { val },
    });

    if (val <= 1) {
      snapshots.push({
        stepIndex: step++, codeLine: 2, // if (n <= 1) return n;
        description: `Base case: fib(${val}) = ${val}`,
        callStack: currentStack, highlights: {}, variables: { val },
      });
      return val;
    }

    snapshots.push({
      stepIndex: step++, codeLine: 3, // return fib(n - 1) + fib(n - 2);
      description: `fib(${val}) = fib(${val - 1}) + fib(${val - 2})`,
      callStack: currentStack, highlights: {}, variables: { val },
    });

    const left = fib(val - 1, currentStack);
    const right = fib(val - 2, currentStack);
    const result = left + right;

    snapshots.push({
      stepIndex: step++, codeLine: 3, // returns
      description: `fib(${val}) = ${left} + ${right} = ${result}`,
      callStack: stack, highlights: {}, variables: { val, left, right, result },
    });

    return result;
  }

  // Limit recursion depth to avoid explosion
  const safeN = Math.min(n, 10);
  const result = fib(safeN, []);

  snapshots.push({
    stepIndex: step++, codeLine: 4, // end func
    description: `Fibonacci(${safeN}) = ${result}`,
    callStack: [], highlights: {}, variables: { result },
  });

  return { snapshots };
}

// ── Fibonacci DP ──



export function runFibonacciDP(n: number): { snapshots: Snapshot[]; } {
  const snapshots: Snapshot[] = [];
  let step = 0;
  const safeN = Math.min(n, 30);

  const dp: number[] = new Array(safeN + 1).fill(0);
  dp[1] = 1;

  snapshots.push({
    stepIndex: step++, codeLine: 1, // function fibDP
    description: `Computing Fibonacci(${safeN}) using DP table`,
    dpTable: [dp.map(String)], highlights: {}, variables: { n: safeN },
  });

  snapshots.push({
    stepIndex: step++, codeLine: 3, // dp init
    description: `Set dp[0] = 0, dp[1] = 1 (base cases)`,
    dpTable: [dp.map(String)], highlights: { activeCell: [0, 1] }, variables: { n: safeN },
  });

  for (let i = 2; i <= safeN; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];

    snapshots.push({
      stepIndex: step++, codeLine: 6, // dp[i] = dp[i-1] + dp[i-2]
      description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
      dpTable: [dp.map(String)], highlights: { activeCell: [0, i] }, variables: { i, "dp[i]": dp[i] },
    });
  }

  snapshots.push({
    stepIndex: step++, codeLine: 9, // return dp[n]
    description: `Fibonacci(${safeN}) = ${dp[safeN]}`,
    dpTable: [dp.map(String)], highlights: {}, variables: { result: dp[safeN] },
  });

  return { snapshots };
}
