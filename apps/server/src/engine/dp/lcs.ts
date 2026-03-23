import type { Snapshot } from '@dsa-visualizer/shared';



export function runLCS(str1: string, str2: string): {
  snapshots: Snapshot[];
} {
  const m = str1.length;
  const n = str2.length;
  const snapshots: Snapshot[] = [];
  let step = 0;

  // Initialize DP table with headers
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Build header row for display
  const headerRow = ['', ...str2.split('')];
  const displayTable = (): (string | number)[][] => {
    const table: (string | number)[][] = [headerRow.map(String)];
    for (let i = 0; i <= m; i++) {
      const label = i === 0 ? '' : str1[i - 1];
      table.push([label, ...dp[i].map(String)]);
    }
    return table;
  };

  snapshots.push({
    stepIndex: step++, codeLine: 1, // function lcs
    description: `LCS of "${str1}" and "${str2}"`,
    dpTable: displayTable(), highlights: {},
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        snapshots.push({
          stepIndex: step++, codeLine: 8, // dp[i][j] = dp[i-1][j-1] + 1
          description: `Match: "${str1[i-1]}" === "${str2[j-1]}" → dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`,
          dpTable: displayTable(), highlights: { activeCell: [i + 1, j + 1] }, // +1 for header row/col
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        snapshots.push({
          stepIndex: step++, codeLine: 10, // dp[i][j] = Math.max...
          description: `No match: "${str1[i-1]}" ≠ "${str2[j-1]}" → dp[${i}][${j}] = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`,
          dpTable: displayTable(), highlights: { activeCell: [i + 1, j + 1] },
        });
      }
    }
  }

  snapshots.push({
    stepIndex: step++, codeLine: 14, // return dp[m][n]
    description: `LCS length = ${dp[m][n]}`,
    dpTable: displayTable(), highlights: {},
  });

  return { snapshots };
}
