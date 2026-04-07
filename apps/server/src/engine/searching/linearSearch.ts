import type { Snapshot } from '@dsa-visualizer/shared';

export function runLinearSearch(data: number[], target: number): { snapshots: Snapshot[] } {
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
      variables: { ...variables, n, target },
    });
  }

  const n = arr.length;
  addSnapshot(1, `Starting Linear Search for target ${target} in array of size ${n}.`, {}, { i: 'N/A' });

  for (let i = 0; i < n; i++) {
    addSnapshot(2, `Checking element at index ${i} (value: ${arr[i]}).`, { comparing: [i] }, { i, 'arr[i]': arr[i] });

    if (arr[i] === target) {
      addSnapshot(3, `Found target ${target} at index ${i}!`, { sorted: [i] }, { i, 'arr[i]': arr[i], found: 'Yes' });
      
      
      return { snapshots };
    }
  }

  addSnapshot(5, `Target ${target} not found in array.`, {}, { i: n, found: 'No' });

  

  return { snapshots };
}
