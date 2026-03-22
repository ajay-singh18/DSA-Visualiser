import type { Snapshot } from '@dsa-visualizer/shared';





export function runMergeSort(input: number[]): {
  snapshots: Snapshot[];
} {
  const arr = [...input];
  const snapshots: Snapshot[] = [];
  let step = 0;

  snapshots.push({
    stepIndex: step++,
    codeLine: 1,
    description: `Starting Merge Sort on array of ${arr.length} elements`,
    arrayState: [...arr],
    highlights: {},
  });

  function mergeSortHelper(start: number, end: number): void {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    snapshots.push({
      stepIndex: step++,
      codeLine: 3,
      description: `Dividing subarray [${start}..${end}] at midpoint ${mid}`,
      arrayState: [...arr],
      highlights: { comparing: Array.from({ length: end - start + 1 }, (_, k) => start + k) },
    });

    mergeSortHelper(start, mid);
    mergeSortHelper(mid + 1, end);

    // Merge step
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      snapshots.push({
        stepIndex: step++,
        codeLine: 12,
        description: `Comparing ${left[i]} (left) with ${right[j]} (right)`,
        arrayState: [...arr],
        highlights: { comparing: [start + i, mid + 1 + j] },
      });

      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }

      snapshots.push({
        stepIndex: step++,
        codeLine: 14,
        description: `Placed ${arr[k - 1]} at index ${k - 1}`,
        arrayState: [...arr],
        highlights: { swapping: [k - 1] },
      });
    }

    while (i < left.length) {
      arr[k++] = left[i++];
    }
    while (j < right.length) {
      arr[k++] = right[j++];
    }

    snapshots.push({
      stepIndex: step++,
      codeLine: 19,
      description: `Merged subarray [${start}..${end}]`,
      arrayState: [...arr],
      highlights: {
        sorted: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
      },
    });
  }

  mergeSortHelper(0, arr.length - 1);

  snapshots.push({
    stepIndex: step++,
    codeLine: 1,
    description: 'Merge Sort complete!',
    arrayState: [...arr],
    highlights: { sorted: Array.from({ length: arr.length }, (_, k) => k) },
  });

  return { snapshots };
}
