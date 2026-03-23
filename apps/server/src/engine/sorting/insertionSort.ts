import type { Snapshot } from '@dsa-visualizer/shared';

export function runInsertionSort(data: number[]): { snapshots: Snapshot[] } {
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
  const sorted: number[] = [0];

  addSnapshot(1, `Starting Insertion Sort. The first element arr[0] is trivially sorted.`, { sorted: [...sorted] });

  for (let i = 1; i < n; i++) {
    let current = arr[i];
    addSnapshot(3, `Taking element arr[${i}] (${current}) to place in the sorted portion.`, { comparing: [i], sorted: [...sorted] });

    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      addSnapshot(5, `Comparing ${current} with arr[${j}] (${arr[j]}). Since ${arr[j]} > ${current}, shifting ${arr[j]} right.`, { comparing: [j, j + 1], sorted: [...sorted] });
      arr[j + 1] = arr[j];
      addSnapshot(6, `Shifted arr[${j}] right.`, { swapping: [j, j + 1], sorted: [...sorted] });
      j--;
    }

    addSnapshot(9, `Found correct position for ${current} at index ${j + 1}. Inserting it.`, { swapping: [j + 1], sorted: [...sorted] });
    arr[j + 1] = current;
    
    sorted.push(i);
    addSnapshot(9, `Inserted ${current}.`, { sorted: [...sorted] });
  }

  addSnapshot(11, `Array is fully sorted.`, { sorted: [...sorted] });


  

  return { snapshots };
}
