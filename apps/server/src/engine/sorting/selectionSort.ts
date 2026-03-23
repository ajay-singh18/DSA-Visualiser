import type { Snapshot } from '@dsa-visualizer/shared';

export function runSelectionSort(data: number[]): { snapshots: Snapshot[] } {
  const arr = [...data];
  const snapshots: Snapshot[] = [];
  let stepIndex = 0;

  function addSnapshot(codeLine: number, description: string, highlights: Snapshot['highlights']) {
    snapshots.push({
      stepIndex: stepIndex++,
      codeLine,
      description,
      arrayState: [...arr],
      highlights,
    });
  }

  const n = arr.length;
  const sorted: number[] = [];

  addSnapshot(1, `Starting Selection Sort on array of size ${n}.`, {});

  for (let i = 0; i < n - 1; i++) {
    addSnapshot(3, `Finding the smallest element in the unsorted portion (indices ${i} to ${n-1}).`, { sorted: [...sorted] });
    
    let minIdx = i;
    addSnapshot(4, `Assuming element at index ${i} is the minimum.`, { comparing: [i], sorted: [...sorted] });

    for (let j = i + 1; j < n; j++) {
      addSnapshot(5, `Comparing arr[${j}] with current minimum arr[${minIdx}].`, { comparing: [j, minIdx], sorted: [...sorted] });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        addSnapshot(5, `Found new minimum at index ${minIdx}.`, { comparing: [minIdx], sorted: [...sorted] });
      }
    }

    if (minIdx !== i) {
      addSnapshot(7, `Swapping current element arr[${i}] with minimum arr[${minIdx}].`, { swapping: [i, minIdx], sorted: [...sorted] });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      addSnapshot(7, `Swap complete.`, { sorted: [...sorted, i] });
    } else {
      addSnapshot(7, `Element at index ${i} is already the minimum, no swap needed.`, { sorted: [...sorted, i] });
    }
    sorted.push(i);
  }
  
  // Last element is implicitly sorted
  sorted.push(n - 1);
  addSnapshot(10, `Array is fully sorted.`, { sorted: [...sorted] });

  

  return { snapshots };
}
