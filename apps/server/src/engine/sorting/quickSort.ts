import type { Snapshot } from '@dsa-visualizer/shared';





export function runQuickSort(input: number[]): {
  snapshots: Snapshot[];
} {
  const arr = [...input];
  const snapshots: Snapshot[] = [];
  const sortedIndices = new Set<number>();
  const callStack: string[] = [];
  let step = 0;

  snapshots.push({
    stepIndex: step++,
    codeLine: 1, // function quickSort
    description: `Starting Quick Sort on array of ${arr.length} elements`,
    arrayState: [...arr],
    highlights: {},
    callStack: [...callStack],
    variables: { length: arr.length },
  });

  function quickSortHelper(low: number, high: number): void {
    const fnSignature = `quickSort(low: ${low}, high: ${high})`;
    callStack.push(fnSignature);

    if (low >= high) {
      if (low === high) sortedIndices.add(low);
      callStack.pop();
      return;
    }

    const pivot = arr[high];
    snapshots.push({
      stepIndex: step++,
      codeLine: 3, // let pi = partition(...) abstract location
      description: `Pivot chosen: arr[${high}]=${pivot}`,
      arrayState: [...arr],
      highlights: { comparing: [high], sorted: [...sortedIndices] },
      callStack: [...callStack],
      variables: { low, high, pivot },
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      snapshots.push({
        stepIndex: step++,
        codeLine: 3, // comparing to pivot
        description: `Comparing arr[${j}]=${arr[j]} with pivot ${pivot}`,
        arrayState: [...arr],
        highlights: { comparing: [j, high], sorted: [...sortedIndices] },
        callStack: [...callStack],
        variables: { low, high, pivot, i, j },
      });

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        snapshots.push({
          stepIndex: step++,
          codeLine: 3, // swapping
          description: `Swapped arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}`,
          arrayState: [...arr],
          highlights: { swapping: [i, j], sorted: [...sortedIndices] },
          callStack: [...callStack],
          variables: { low, high, pivot, i, j },
        });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pi = i + 1;
    sortedIndices.add(pi);

    snapshots.push({
      stepIndex: step++,
      codeLine: 3, // pivot placed
      description: `Pivot ${pivot} placed at sorted position ${pi}`,
      arrayState: [...arr],
      highlights: { swapping: [pi, high], sorted: [...sortedIndices] },
      callStack: [...callStack],
      variables: { low, high, pivot, pi },
    });

    quickSortHelper(low, pi - 1);
    quickSortHelper(pi + 1, high);
    
    callStack.pop();
  }

  quickSortHelper(0, arr.length - 1);

  snapshots.push({
    stepIndex: step++,
    codeLine: 7, // return arr;
    description: 'Quick Sort complete!',
    arrayState: [...arr],
    highlights: { sorted: Array.from({ length: arr.length }, (_, k) => k) },
    callStack: [...callStack],
    variables: {},
  });

  return { snapshots };
}
