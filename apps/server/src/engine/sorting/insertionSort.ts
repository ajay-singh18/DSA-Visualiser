import type { Snapshot } from '@dsa-visualizer/shared';

export function runInsertionSort(data: number[]): { snapshots: Snapshot[] } {
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
  const sorted: number[] = [0];

  addSnapshot(1, `Starting Insertion Sort. The first element arr[0] is trivially sorted.`, { sorted: [...sorted] }, { i: 0 });

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    addSnapshot(3, `Taking element arr[${i}] (${key}) to place in the sorted portion.`, { comparing: [i], sorted: [...sorted] }, { i, key });

    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      addSnapshot(5, `Comparing ${key} with arr[${j}] (${arr[j]}). Since ${arr[j]} > ${key}, shifting ${arr[j]} right.`, { comparing: [j, j + 1], sorted: [...sorted] }, { i, j, key });
      arr[j + 1] = arr[j];
      addSnapshot(6, `Shifted arr[${j}] right.`, { swapping: [j, j + 1], sorted: [...sorted] }, { i, j, key, shifting: 'Yes' });
      j--;
    }

    addSnapshot(9, `Found correct position for ${key} at index ${j + 1}. Inserting it.`, { swapping: [j + 1], sorted: [...sorted] }, { i, j, key, insertionIndex: j + 1 });
    arr[j + 1] = key;
    
    sorted.push(i);
    addSnapshot(9, `Inserted ${key}.`, { sorted: [...sorted] }, { i, key, inserted: 'Yes' });
  }

  addSnapshot(11, `Array is fully sorted.`, { sorted: [...sorted] }, { status: 'Complete' });


  

  return { snapshots };
}
