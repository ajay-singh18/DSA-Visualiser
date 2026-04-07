import type { Snapshot } from '@dsa-visualizer/shared';

export function runBinarySearch(data: number[], target: number): { snapshots: Snapshot[] } {
  // Binary search requires a sorted array
  const arr = [...data].sort((a, b) => a - b);
  const snapshots: Snapshot[] = [];
  let stepIndex = 0;

  function addSnapshot(codeLine: number, description: string, highlights: Snapshot['highlights'], variables: Record<string, string | number> = {}) {
    snapshots.push({
      stepIndex: stepIndex++,
      codeLine,
      description,
      arrayState: [...arr],
      highlights,
      variables,
    });
  }

  addSnapshot(1, `Binary Search requires a sorted array. Array sorted: [${arr.join(', ')}]. Looking for ${target}.`, {}, { target });
  const x = target;
  addSnapshot(1, `Binary Search requires a sorted array. Array sorted: [${arr.join(', ')}]. Looking for ${x}.`, {}, { x });

  let l = 0;
  let r = arr.length - 1;

  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    const mValue = arr[m];

    addSnapshot(3, `Calculated middle index m = floor((${l} + ${r}) / 2) = ${m}.`, { comparing: [m] }, { l, r, m, mValue, x });

    if (mValue === x) {
      addSnapshot(4, `Found target ${x} at index ${m}!`, { sorted: [m] }, { l, r, m, mValue, x, status: 'Found' });
      return { snapshots };
    }

    if (mValue < x) {
      addSnapshot(5, `Since arr[m] (${mValue}) < ${x}, look in the right half.`, { comparing: [m] }, { l, r, m, mValue, x });
      l = m + 1;
      addSnapshot(5, `Updated l to ${l}.`, {}, { l, r, x });
    } else {
      addSnapshot(6, `Since arr[m] (${mValue}) > ${x}, look in the left half.`, { comparing: [m] }, { l, r, m, mValue, x });
      r = m - 1;
      addSnapshot(6, `Updated r to ${r}.`, {}, { l, r, x });
    }
  }

  addSnapshot(8, `Target ${x} not found in the array.`, {}, { x, status: 'Not Found' });

  return { snapshots };
}
