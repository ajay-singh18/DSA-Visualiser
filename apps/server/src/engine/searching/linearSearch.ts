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
      variables: { ...variables, n, x: target },
    });
  }

  const n = arr.length;
  const x = target;
  addSnapshot(1, `Starting Linear Search for ${x}.`, {}, { x });

  for (let i = 0; i < n; i++) {
    addSnapshot(3, `Comparing arr[${i}] (${arr[i]}) with ${x}.`, { comparing: [i] }, { i, 'arr[i]': arr[i], x });

    if (arr[i] === x) {
      addSnapshot(4, `Found target ${x} at index ${i}!`, { sorted: [i] }, { i, x, found: 'Yes' });
      
      
      return { snapshots };
    }
  }

  addSnapshot(6, `Target ${x} not found in the array.`, {}, { x, found: 'No' });

  

  return { snapshots };
}
