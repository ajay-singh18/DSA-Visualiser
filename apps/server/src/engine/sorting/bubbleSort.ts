import type { Snapshot } from '@dsa-visualizer/shared';





export function runBubbleSort(input: number[]): {
  snapshots: Snapshot[];
} {
  const arr = [...input];
  const n = arr.length;
  const snapshots: Snapshot[] = [];
  let step = 0;

  snapshots.push({
    stepIndex: step++,
    codeLine: 1, // function bubbleSort(arr)
    description: `Starting Bubble Sort on array of ${n} elements`,
    arrayState: [...arr],
    highlights: { sorted: [] },
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing
      snapshots.push({
        stepIndex: step++,
        codeLine: 4, // if (arr[j] > arr[j + 1])
        description: `Comparing arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}`,
        arrayState: [...arr],
        highlights: {
          comparing: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
        },
      });

      if (arr[j] > arr[j + 1]) {
        // Swapping
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        snapshots.push({
          stepIndex: step++,
          codeLine: 5, // [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          description: `Swapped arr[${j}] and arr[${j + 1}]`,
          arrayState: [...arr],
          highlights: {
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          },
        });
      }
    }

    // Mark element as sorted
    snapshots.push({
      stepIndex: step++,
      codeLine: 2, // abstract end of outer loop
      description: `Element at index ${n - 1 - i} is now in its sorted position`,
      arrayState: [...arr],
      highlights: {
        sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      },
    });
  }

  snapshots.push({
    stepIndex: step++,
    codeLine: 10, // return arr;
    description: 'Bubble Sort complete!',
    arrayState: [...arr],
    highlights: { sorted: Array.from({ length: n }, (_, k) => k) },
  });

  return { snapshots };
}
