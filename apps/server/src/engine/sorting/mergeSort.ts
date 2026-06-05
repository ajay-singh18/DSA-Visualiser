import type { Snapshot } from "@dsa-visualizer/shared";

export function runMergeSort(input: number[]): {
  snapshots: Snapshot[];
} {
  const arr = [...input];
  const snapshots: Snapshot[] = [];
  const callStack: string[] = [];
  let step = 0;

  snapshots.push({
    stepIndex: step++,
    codeLine: 12, // function mergeSort(arr)
    description: `Starting Merge Sort on array of ${arr.length} elements`,
    arrayState: [...arr],
    highlights: {},
    callStack: [...callStack],
    variables: { length: arr.length },
  });

  function mergeSortHelper(start: number, end: number): void {
    const fnSignature = `mergeSort(start: ${start}, end: ${end})`;
    callStack.push(fnSignature);

    if (start >= end) {
      callStack.pop();
      return;
    }

    let mid = Math.floor((start + end) / 2);

    snapshots.push({
      stepIndex: step++,
      codeLine: 17, // let m = Math.floor(left + (right - left) / 2);
      description: `Dividing subarray [${start}..${end}] at midpoint ${mid}`,
      arrayState: [...arr],
      highlights: {
        comparing: Array.from({ length: end - start + 1 }, (_, k) => start + k),
      },
      callStack: [...callStack],
      variables: { start, end, mid },
    });

    mergeSortHelper(start, mid);
    mergeSortHelper(mid + 1, end);

    // In-place Merge step
    let start1 = start;
    let start2 = mid + 1;

    // If the direct merge is already sorted
    if (arr[mid] <= arr[start2]) {
      snapshots.push({
        stepIndex: step++,
        codeLine: 20, // merge(arr, left, m, right);
        description: `Subarray [${start}..${end}] is already merged`,
        arrayState: [...arr],
        highlights: {
          sorted: Array.from(
            { length: end - start + 1 },
            (_, idx) => start + idx,
          ),
        },
        callStack: [...callStack],
        variables: { start, end, mid, length: end - start + 1 },
      });
      callStack.pop();
      return;
    }

    // Two pointers to maintain start of both arrays to merge
    while (start1 <= mid && start2 <= end) {
      snapshots.push({
        stepIndex: step++,
        codeLine: 6, // return merge(left, right); (abstract merge step)
        description: `Comparing ${arr[start1]} with ${arr[start2]}`,
        arrayState: [...arr],
        highlights: { comparing: [start1, start2] },
        callStack: [...callStack],
        variables: { start, end, mid, start1, start2 },
      });

      if (arr[start1] <= arr[start2]) {
        start1++;
      } else {
        const value = arr[start2];
        let index = start2;

        // Shift all elements between start1 and start2 right by 1
        while (index !== start1) {
          arr[index] = arr[index - 1];
          index--;
        }
        arr[start1] = value;

        snapshots.push({
          stepIndex: step++,
          codeLine: 6, // placed element
          description: `Placed ${value} at index ${start1}`,
          arrayState: [...arr],
          highlights: { swapping: [start1] },
          callStack: [...callStack],
          variables: { start, end, mid, start1, start2 },
        });

        start1++;
        mid++;
        start2++;
      }
    }

    snapshots.push({
      stepIndex: step++,
      codeLine: 20, // merge(arr, left, m, right);
      description: `Merged subarray [${start}..${end}]`,
      arrayState: [...arr],
      highlights: {
        sorted: Array.from(
          { length: end - start + 1 },
          (_, idx) => start + idx,
        ),
      },
      callStack: [...callStack],
      variables: { start, end, mid, length: end - start + 1 },
    });

    callStack.pop();
  }

  mergeSortHelper(0, arr.length - 1);

  snapshots.push({
    stepIndex: step++,
    codeLine: 24, // return arr;
    description: "Merge Sort complete!",
    arrayState: [...arr],
    highlights: { sorted: Array.from({ length: arr.length }, (_, k) => k) },
    callStack: [...callStack],
    variables: {},
  });

  return { snapshots };
}
