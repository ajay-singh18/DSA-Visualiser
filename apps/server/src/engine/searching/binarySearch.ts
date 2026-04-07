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

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    addSnapshot(3, `Search space is between indices ${left} and ${right}.`, { swapping: [left, right] }, { left, right, mid, target });
    
    addSnapshot(4, `Checking index ${mid} (value: ${arr[mid]}).`, { comparing: [mid], swapping: [left, right] }, { left, right, mid, target, 'arr[mid]': arr[mid] });

    if (arr[mid] === target) {
      addSnapshot(5, `Target ${target} found at index ${mid}!`, { sorted: [mid] }, { left, right, mid, target, found: 'Yes' });
      break;
    }

    if (arr[mid] < target) {
      addSnapshot(6, `${arr[mid]} < ${target}, searching right half.`, { comparing: [mid] }, { left, right, mid, target, action: 'Move Left' });
      left = mid + 1;
    } else {
      addSnapshot(7, `${arr[mid]} > ${target}, searching left half.`, { comparing: [mid] }, { left, right, mid, target, action: 'Move Right' });
      right = mid - 1;
    }
  }

  if (left > right) {
    addSnapshot(9, `Search space exhausted. Target ${target} not found.`, {}, { left, right, target, found: 'No' });
  }

  

  return { snapshots };
}
