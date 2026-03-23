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
  addSnapshot(1, `Starting Linear Search for target ${target} in array of size ${n}.`, {});

  for (let i = 0; i < n; i++) {
    addSnapshot(2, `Checking element at index ${i} (value: ${arr[i]}).`, { comparing: [i] });

    if (arr[i] === target) {
      addSnapshot(3, `Found target ${target} at index ${i}!`, { sorted: [i] }); // Use 'sorted' color (green) for found
      
      
      return { snapshots };
    }
  }

  addSnapshot(5, `Target ${target} not found in array.`, {});

  

  return { snapshots };
}
