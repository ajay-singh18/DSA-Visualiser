import type { Snapshot } from '@dsa-visualizer/shared';

export function runLinearSearch(data: number[], target: number): { snapshots: Snapshot[] } {
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
  addSnapshot(2, `Starting Linear Search for target ${target} in array of size ${n}.`, {});

  for (let i = 0; i < n; i++) {
    addSnapshot(3, `Checking element at index ${i} (value: ${arr[i]}).`, { comparing: [i] });

    if (arr[i] === target) {
      addSnapshot(4, `Found target ${target} at index ${i}!`, { sorted: [i] }); // Use 'sorted' color (green) for found
      
      
      return { snapshots };
    }
  }

  addSnapshot(7, `Target ${target} not found in array.`, {});

  

  return { snapshots };
}
