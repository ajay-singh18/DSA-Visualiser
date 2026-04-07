import type { Snapshot } from '@dsa-visualizer/shared';

export function runSelectionSort(data: number[]): { snapshots: Snapshot[] } {
  const arr = [...data];
  const snapshots: Snapshot[] = [];
  let stepIndex = 0;

  function addSnapshot(codeLine: number, description: string, highlights: Snapshot['highlights'], variables: Record<string, string | number> = {}) {
    snapshots.push({
      stepIndex: stepIndex++,
      codeLine,
      description,
      arrayState: [...arr],
      highlights,
      variables: { ...variables, n },
    });
  }

  const n = arr.length;
  const sorted: number[] = [];

  addSnapshot(1, `Starting Selection Sort on array of size ${n}.`, {}, { i: 0 });

  for (let i = 0; i < n - 1; i++) {
    addSnapshot(3, `Finding the smallest element in the unsorted portion (indices ${i} to ${n-1}).`, { sorted: [...sorted] }, { i });
    
    let minIdx = i;
    addSnapshot(4, `Assuming element at index ${i} is the minimum.`, { comparing: [i], sorted: [...sorted] }, { i, minIdx });

    for (let j = i + 1; j < n; j++) {
      addSnapshot(5, `Comparing arr[${j}] with current minimum arr[${minIdx}].`, { comparing: [j, minIdx], sorted: [...sorted] }, { i, j, minIdx });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        addSnapshot(5, `Found new minimum at index ${minIdx}.`, { comparing: [minIdx], sorted: [...sorted] }, { i, j, minIdx });
      }
    }

    if (minIdx !== i) {
      addSnapshot(7, `Swapping current element arr[${i}] with minimum arr[${minIdx}].`, { swapping: [i, minIdx], sorted: [...sorted] }, { i, minIdx, swapping: 'Yes' });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      addSnapshot(7, `Swap complete.`, { sorted: [...sorted, i] }, { i, minIdx, swapped: 'Yes' });
    } else {
      addSnapshot(7, `Element at index ${i} is already the minimum, no swap needed.`, { sorted: [...sorted, i] }, { i, minIdx, status: 'Already min' });
    }
    sorted.push(i);
  }
  
  // Last element is implicitly sorted
  sorted.push(n - 1);
  addSnapshot(10, `Array is fully sorted.`, { sorted: [...sorted] }, { status: 'Complete' });

  

  return { snapshots };
}
