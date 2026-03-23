import type { Snapshot } from '@dsa-visualizer/shared';



export function runKnapsack(capacity: number, weights: number[], values: number[]): {
  snapshots: Snapshot[];
} {
  const n = weights.length;
  const snapshots: Snapshot[] = [];
  let step = 0;

  // Initialize DP table
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  snapshots.push({
    stepIndex: step++, codeLine: 1, // function knapsack
    description: `0/1 Knapsack: capacity=${capacity}, items=${n}, weights=[${weights}], values=[${values}]`,
    dpTable: dp.map(row => row.map(String)), highlights: {},
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const exclude = dp[i - 1][w];
        dp[i][w] = Math.max(include, exclude);

        snapshots.push({
          stepIndex: step++, codeLine: 7, // dp[i][w] = Math.max...
          description: `Item ${i} (w=${weights[i-1]}, v=${values[i-1]}), cap=${w}: include=${include}, exclude=${exclude} → dp[${i}][${w}]=${dp[i][w]}`,
          dpTable: dp.map(row => row.map(String)), highlights: { activeCell: [i, w] },
        });
      } else {
        dp[i][w] = dp[i - 1][w];

        snapshots.push({
          stepIndex: step++, codeLine: 9, // dp[i][w] = dp[i-1][w]
          description: `Item ${i} (w=${weights[i-1]}) too heavy for cap=${w} → dp[${i}][${w}]=${dp[i][w]}`,
          dpTable: dp.map(row => row.map(String)), highlights: { activeCell: [i, w] },
        });
      }
    }
  }

  snapshots.push({
    stepIndex: step++, codeLine: 13, // return dp[n][W]
    description: `Maximum value = ${dp[n][capacity]}`,
    dpTable: dp.map(row => row.map(String)), highlights: {},
  });

  return { snapshots };
}
