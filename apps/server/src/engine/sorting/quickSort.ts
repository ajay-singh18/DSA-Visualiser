import type { Snapshot } from '@dsa-visualizer/shared';





export function runQuickSort(input: number[]): {
  snapshots: Snapshot[];
} {
  const arr = [...input];
  const snapshots: Snapshot[] = [];
  const sortedIndices = new Set<number>();
  let step = 0;

  snapshots.push({
    stepIndex: step++,
    codeLine: 1,
    description: `Starting Quick Sort on array of ${arr.length} elements`,
    arrayState: [...arr],
    highlights: {},
  });

  function quickSortHelper(low: number, high: number): void {
    if (low >= high) {
      if (low === high) sortedIndices.add(low);
      return;
    }

    const pivot = arr[high];
    snapshots.push({
      stepIndex: step++,
      codeLine: 10,
      description: `Pivot chosen: arr[${high}]=${pivot}`,
      arrayState: [...arr],
      highlights: { comparing: [high], sorted: [...sortedIndices] },
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      snapshots.push({
        stepIndex: step++,
        codeLine: 13,
        description: `Comparing arr[${j}]=${arr[j]} with pivot ${pivot}`,
        arrayState: [...arr],
        highlights: { comparing: [j, high], sorted: [...sortedIndices] },
      });

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        snapshots.push({
          stepIndex: step++,
          codeLine: 15,
          description: `Swapped arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}`,
          arrayState: [...arr],
          highlights: { swapping: [i, j], sorted: [...sortedIndices] },
        });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pi = i + 1;
    sortedIndices.add(pi);

    snapshots.push({
      stepIndex: step++,
      codeLine: 18,
      description: `Pivot ${pivot} placed at sorted position ${pi}`,
      arrayState: [...arr],
      highlights: { swapping: [pi, high], sorted: [...sortedIndices] },
    });

    quickSortHelper(low, pi - 1);
    quickSortHelper(pi + 1, high);
  }

  quickSortHelper(0, arr.length - 1);

  snapshots.push({
    stepIndex: step++,
    codeLine: 1,
    description: 'Quick Sort complete!',
    arrayState: [...arr],
    highlights: { sorted: Array.from({ length: arr.length }, (_, k) => k) },
  });

  return { snapshots };
}
