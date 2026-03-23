import type { Snapshot } from '@dsa-visualizer/shared';

export function runBinarySearch(data: number[], target: number): { snapshots: Snapshot[] } {
  // Binary search requires a sorted array
  const arr = [...data].sort((a, b) => a - b);
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

  addSnapshot(1, `Binary Search requires a sorted array. Array sorted: [${arr.join(', ')}]. Looking for ${target}.`, {});

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    addSnapshot(3, `Search space is between indices ${left} and ${right}.`, { swapping: [left, right] }); // Highlight boundaries
    
    const mid = Math.floor((left + right) / 2);
    addSnapshot(4, `Calculating mid point: index ${mid} (value: ${arr[mid]}).`, { comparing: [mid], swapping: [left, right] });

    if (arr[mid] === target) {
      addSnapshot(5, `Target ${target} found at index ${mid}!`, { sorted: [mid] });
      break;
    }

    if (arr[mid] < target) {
      addSnapshot(6, `${arr[mid]} is less than ${target}, moving left pointer to ${mid + 1}.`, { comparing: [mid] });
      left = mid + 1;
    } else {
      addSnapshot(7, `${arr[mid]} is greater than ${target}, moving right pointer to ${mid - 1}.`, { comparing: [mid] });
      right = mid - 1;
    }
  }

  if (left > right) {
    addSnapshot(9, `Search space exhausted. Target ${target} not found.`, {});
  }

  

  return { snapshots };
}
