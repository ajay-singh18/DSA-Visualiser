import type { AlgorithmType, AlgorithmCategory } from '@dsa-visualizer/shared';

export interface AlgoDoc {
  key: AlgorithmType;
  title: string;
  category: AlgorithmCategory;
  shortDesc: string;
  timeComplexity: string;
  spaceComplexity: string;
  content: string; // Markdown content
}

export const ALGORITHM_DOCS: AlgoDoc[] = [
  {
    key: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'sorting',
    shortDesc: 'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    content: `
# Bubble Sort

Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. 
This algorithm is not suitable for large data sets as its average and worst-case time complexity is quite high.

### How it Works
1. Start at the beginning of the array.
2. Compare the first two elements. If the first is greater than the second, swap them.
3. Move to the next pair and repeat until the end of the array.
4. The largest element will "bubble" to the end.
5. Repeat the entire process for the remaining elements.

### Pseudocode
\`\`\`text
procedure bubbleSort( A : list of sortable items )
    n = length(A)
    repeat 
        swapped = false
        for i = 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped = true
            end if
        end for
        n = n - 1
    until not swapped
end procedure
\`\`\`
    `
  },
  {
    key: 'quick-sort',
    title: 'Quick Sort',
    category: 'sorting',
    shortDesc: 'A divide-and-conquer algorithm that picks a pivot element and partitions the given array around the picked pivot.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    content: `
# Quick Sort

QuickSort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.
There are many different versions of quickSort that pick pivot in different ways:
- Always pick the first element as a pivot.
- Always pick the last element as a pivot (implemented here).
- Pick a random element as a pivot.
- Pick median as the pivot.

### Pseudocode
\`\`\`text
function partition(arr, low, high)
    pivot = arr[high]
    i = (low - 1)
    for j = low to high - 1
        if arr[j] < pivot
            i++
            swap arr[i] and arr[j]
    swap arr[i + 1] and arr[high]
    return (i + 1)

function quickSort(arr, low, high)
    if low < high
        pi = partition(arr, low, high)
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)
\`\`\`
    `
  },
  {
    key: 'merge-sort',
    title: 'Merge Sort',
    category: 'sorting',
    shortDesc: 'An efficient, stable, divide-and-conquer sorting algorithm that works by breaking down a list into several sub-lists until each sublist consists of a single element.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    content: `
# Merge Sort

Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.
The merge() function is used for merging two halves. The merge(arr, l, m, r) is a key process that assumes that arr[l..m] and arr[m+1..r] are sorted and merges the two sorted sub-arrays into one.

### Pseudocode
\`\`\`text
function mergeSort(arr, l, r)
    if l < r
        m = l + (r - l) / 2
        mergeSort(arr, l, m)
        mergeSort(arr, m + 1, r)
        merge(arr, l, m, r)
\`\`\`
    `
  },
  {
    key: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'sorting',
    shortDesc: 'Builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into the correct position.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    content: `
# Insertion Sort

Insertion sort is a simple sorting algorithm that builds the final sorted array (or list) one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.

### Advantages
- Simple implementation
- Efficient for (quite) small data sets
- Adaptive, i.e., efficient for data sets that are already substantially sorted
- Stable; i.e., does not change the relative order of elements with equal keys

### Pseudocode
\`\`\`text
i ← 1
while i < length(A)
    x ← A[i]
    j ← i - 1
    while j >= 0 and A[j] > x
        A[j+1] ← A[j]
        j ← j - 1
    end while
    A[j+1] ← x
    i ← i + 1
end while
\`\`\`
    `
  },
  {
    key: 'selection-sort',
    title: 'Selection Sort',
    category: 'sorting',
    shortDesc: 'An in-place comparison algorithm that divides the input list into a sorted and an unsorted region, continuously finding the minimum element from the unsorted part.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    content: `
# Selection Sort

The selection sort algorithm sorts an array by repeatedly finding the minimum element (considering ascending order) from the unsorted part and putting it at the beginning.

The algorithm maintains two subarrays in a given array:
1. The subarray which is already sorted.
2. Remaining subarray which is unsorted.

### Pseudocode
\`\`\`text
repeat (numOfElements - 1) times
    set the first unsorted element as the minimum
    for each of the unsorted elements
        if element < currentMinimum
            set element as new minimum
    swap minimum with first unsorted position
\`\`\`
    `
  },
  {
    key: 'linear-search',
    title: 'Linear Search',
    category: 'searching',
    shortDesc: 'A search algorithm that finds the position of a target value by checking each element of the list until a match is found.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    content: `
# Linear Search

Linear search is the simplest search algorithm. For an array of *n* elements, best case is when the target is matched with the first element, and worst case is when target matches the last element or does not exist at all.

### Pseudocode
\`\`\`text
procedure linear_search (list, value)
    for each item in the list
        if match item == value
            return the item's location
    end for
end procedure
\`\`\`
    `
  },
  {
    key: 'binary-search',
    title: 'Binary Search',
    category: 'searching',
    shortDesc: 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    content: `
# Binary Search

Binary Search is a searching algorithm for finding an element's position in a sorted array.
In this approach, the element is always searched in the middle of a portion of an array.

> **Note**: Binary search can be implemented only on a sorted list of items.

### Pseudocode
\`\`\`text
function binary_search(A, n, T) is
    L := 0
    R := n − 1
    while L ≤ R do
        m := floor((L + R) / 2)
        if A[m] < T then
            L := m + 1
        else if A[m] > T then
            R := m − 1
        else:
            return m
    return unsuccessful
\`\`\`
    `
  },
  {
    key: 'bfs',
    title: 'Breadth-First Search (BFS)',
    category: 'graph',
    shortDesc: 'An algorithm for searching a tree or graph data structure level by level, starting from a given root node.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    content: `
# Breadth-First Search (BFS)

Breadth-First Search is a traversing algorithm where you should start traversing from a selected node (source or starting node) and traverse the graph layerwise thus exploring the neighbour nodes (nodes which are directly connected to source node). You must then move towards the next-level neighbour nodes.

BFS uses a **Queue** data structure to keep track of the nodes to be visited.

### Applications
- Finding the shortest path in an unweighted graph
- Peer to peer networks
- Web crawlers
- Social networking networks (e.g. finding friends within distance d)

### Pseudocode
\`\`\`text
procedure BFS(G, root) is
    let Q be a queue
    label root as explored
    Q.enqueue(root)
    while Q is not empty do
        v := Q.dequeue()
        for all edges from v to w in G.adjacentEdges(v) do
            if w is not labeled as explored then
                label w as explored
                Q.enqueue(w)
\`\`\`
    `
  },
  {
    key: 'dfs',
    title: 'Depth-First Search (DFS)',
    category: 'graph',
    shortDesc: 'An algorithm for traversing or searching tree or graph data structures by exploring as far as possible along each branch before backtracking.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    content: `
# Depth-First Search (DFS)

Depth-First Search is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.

DFS uses a **Stack** data structure (or recursion) to keep track of the path.

### Applications
- Detecting cycles in a graph
- Path finding
- Topological sorting
- Testing if a graph is bipartite
- Solving puzzles like mazes

### Pseudocode
\`\`\`text
procedure DFS(G, v) is
    label v as discovered
    for all directed edges from v to w that are in G.adjacentEdges(v) do
        if vertex w is not labeled as discovered then
            recursively call DFS(G, w)
\`\`\`
    `
  },
  {
    key: 'dijkstra',
    title: "Dijkstra's Algorithm",
    category: 'graph',
    shortDesc: 'An algorithm for finding the shortest paths between nodes in a graph containing non-negative edge weights.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    content: `
# Dijkstra's Algorithm

Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks.
The algorithm maintains a set of unvisited nodes and calculates the tentative distance from the source node to every other node.

> **Note**: Dijkstra's algorithm does not work if the graph contains negative weight edges.

### Applications
- Maps (Google Maps, Apple Maps) routing
- Network routing protocols (OSPF)

### Pseudocode
\`\`\`text
function Dijkstra(Graph, source):
    dist[source] = 0
    create vertex set Q
    for each vertex v in Graph:
        if v ≠ source
            dist[v] = INFINITY
        add v to Q
    while Q is not empty:
        u = vertex in Q with min dist[u]
        remove u from Q
        for each neighbor v of u:
            alt = dist[u] + length(u, v)
            if alt < dist[v]:
                dist[v] = alt
    return dist
\`\`\`
    `
  },
  {
    key: 'prims',
    title: "Prim's Algorithm",
    category: 'graph',
    shortDesc: 'A greedy algorithm that finds a minimum spanning tree for a weighted undirected graph by constantly attaching the cheapest edge from the tree to a vertex not yet in the tree.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    content: `
# Prim's Algorithm

Prim's algorithm is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph. This means it finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.

### How it works
1. Initialize a tree with a single vertex, chosen arbitrarily from the graph.
2. Grow the tree by one edge: of the edges that connect the tree to vertices not yet in the tree, find the minimum-weight edge, and transfer it to the tree.
3. Repeat step 2 (until all vertices are in the tree).

### Pseudocode
\`\`\`text
function PrimMST(Graph):
    for each u in Graph.V:
        key[u] = INFINITY
        parent[u] = NULL
    key[StartNode] = 0
    Q = all vertices in Graph
    while Q is not empty:
        u = Extract-Min(Q)
        for each v adjacent to u:
            if v in Q and weight(u, v) < key[v]:
                parent[v] = u
                key[v] = weight(u, v)
\`\`\`
    `
  },
  {
    key: 'kruskals',
    title: "Kruskal's Algorithm",
    category: 'graph',
    shortDesc: 'A greedy algorithm that finds a minimum spanning tree for a connected weighted graph by sorting all edges and adding them one by one considering cycle formations.',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    content: `
# Kruskal's Algorithm

Kruskal's algorithm finds a minimum spanning forest of an undirected edge-weighted graph. If the graph is connected, it finds a minimum spanning tree. It is a greedy algorithm in graph theory as it finds a minimum spanning tree for a connected weighted graph adding increasing cost arcs at each step.

It uses a Disjoint-Set (Union-Find) data structure to keep track of subsets of vertices to prevent cycle formation.

### How it works
1. Sort all the edges from low weight to high.
2. Take the edge with the lowest weight and add it to the spanning tree. If adding the edge created a cycle, then reject this edge.
3. Keep adding edges until we reach all vertices.

### Pseudocode
\`\`\`text
function KruskalMST(Graph):
    A = empty set
    for each vertex v in Graph.V:
        Make-Set(v)
    sort the edges of Graph.E by non-decreasing weight w
    for each edge (u, v) uniformly chosen in Graph.E:
        if Find-Set(u) != Find-Set(v):
            A = A U {(u, v)}
            Union(u, v)
    return A
\`\`\`
    `
  },
  {
    key: 'bellman-ford',
    title: 'Bellman-Ford Algorithm',
    category: 'graph',
    shortDesc: 'Computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. Accommodates negative edge weights, unlike Dijkstra.',
    timeComplexity: 'O(V * E)',
    spaceComplexity: 'O(V)',
    content: `
# Bellman-Ford Algorithm

The Bellman-Ford algorithm computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra's algorithm for the same problem, but more versatile, as it is capable of handling graphs in which some of the edge weights are negative numbers.

It relaxes all edges $V-1$ times (where V is the number of vertices). If distance values update on the $V$-th pass, it signifies the presence of a negative weight cycle.

### Pseudocode
\`\`\`text
function BellmanFord(Graph, source):
    for each vertex v in Graph:
        dist[v] = INFINITY
    dist[source] = 0
    
    // Relax edges |V| - 1 times
    for i from 1 to |V| - 1:
        for each edge (u, v) with weight w in Graph:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                
    // Check for negative-weight cycles
    for each edge (u, v) with weight w in Graph:
        if dist[u] + w < dist[v]:
            error "Graph contains a negative-weight cycle"
            
    return dist
\`\`\`
    `
  },
  {
    key: 'floyd-warshall',
    title: 'Floyd-Warshall Algorithm',
    category: 'graph',
    shortDesc: 'An algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles) between all pairs of vertices.',
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)',
    content: `
# Floyd-Warshall Algorithm

The Floyd-Warshall algorithm is an algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles). A single execution of the algorithm will find the lengths (summed weights) of shortest paths between **all pairs** of vertices.

It uses dynamic programming to iteratively improve an estimate on the shortest path between two vertices, until the estimate is optimal.

### Pseudocode
\`\`\`text
function FloydWarshall(Graph):
    // Initialize dist matrix
    for each vertex v in Graph:
        dist[v][v] = 0
    for each edge (u, v) in Graph:
        dist[u][v] = weight(u, v)
        
    for k from 1 to |V|: // k is the intermediate vertex
        for i from 1 to |V|:
            for j from 1 to |V|:
                if dist[i][j] > dist[i][k] + dist[k][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    
    return dist
\`\`\`
    `
  },
  {
    key: 'a-star',
    title: 'A* Search',
    category: 'graph',
    shortDesc: 'A graph traversal and path search algorithm, often used in computer science due to its completeness, optimality, and optimal efficiency utilizing heuristics.',
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
    content: `
# A* Search Algorithm

A* (pronounced "A-star") is a graph traversal and path search algorithm. It is arguably the most popular choice for pathfinding because it is fairly flexible and can be used in a wide range of contexts.

A* is an informed search algorithm, meaning that it is formulated in terms of weighted graphs: starting from a specific node of a graph, it aims to find a path to the given goal node having the smallest cost. It does this by maintaining a tree of paths originating at the start node and extending those paths one edge at a time until its termination criterion is satisfied.

A* selects the path that minimizes $f(n) = g(n) + h(n)$:
*   **$n$** is the next node on the path.
*   **$g(n)$** is the cost of the path from the start node to $n$.
*   **$h(n)$** is a heuristic function that estimates the cost of the cheapest path from $n$ to the goal.

### Pseudocode
\`\`\`text
function A_Star(start, goal):
    openSet = {start}
    gScore[start] = 0
    fScore[start] = h(start) // Heuristic estimate
    
    while openSet is not empty:
        current = node in openSet with lowest fScore[]
        if current == goal:
            return reconstruct_path(current)
            
        openSet.remove(current)
        for each neighbor of current:
            tentative_gScore = gScore[current] + weight(current, neighbor)
            if tentative_gScore < gScore[neighbor]:
                cameFrom[neighbor] = current
                gScore[neighbor] = tentative_gScore
                fScore[neighbor] = gScore[neighbor] + h(neighbor)
                if neighbor not in openSet:
                    openSet.add(neighbor)
\`\`\`
    `
  },
  {
    key: 'bst-insert',
    title: 'BST Insertion',
    category: 'tree',
    shortDesc: 'An algorithm to insert a new node into a Binary Search Tree while maintaining the BST property (left < root < right).',
    timeComplexity: 'O(h) where h is tree height',
    spaceComplexity: 'O(1) iteratively, O(h) recursively',
    content: `
# Binary Search Tree (BST) Insertion

A Binary Search Tree is a node-based binary tree data structure with the following properties:
- The left subtree of a node contains only nodes with keys lesser than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- The left and right subtree each must also be a binary search tree.

Inserting a new key always happens at the leaf node. We start searching for a key from the root until we hit a null leaf, and then we insert the new node there.

### Pseudocode
\`\`\`text
function insert(Node root, int key)
    if root == NULL
        return createNode(key)
    if key < root.key
        root.left = insert(root.left, key)
    else if key > root.key
        root.right = insert(root.right, key)
    return root
\`\`\`
    `
  },
  {
    key: 'bst-delete',
    title: 'BST Deletion',
    category: 'tree',
    shortDesc: 'An algorithm to remove a node from a Binary Search Tree. It handles three cases: node is a leaf, has one child, or has two children.',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(h)',
    content: `
# Binary Search Tree (BST) Deletion

Deleting a node from a BST is more complex than insertion. There are three possible cases for the node to be deleted:

1. **Node is a leaf:** Simply remove the node from the tree.
2. **Node has only one child:** Copy the child to the node and delete the child.
3. **Node has two children:** Find the inorder successor of the node. Copy contents of the inorder successor to the node and delete the inorder successor. (You can also use the inorder predecessor).

### Pseudocode
\`\`\`text
function deleteNode(Node root, int key)
    if root is NULL
        return root
    if key < root.key
        root.left = deleteNode(root.left, key)
    else if key > root.key
        root.right = deleteNode(root.right, key)
    else
        // Node found
        if root.left is NULL
            return root.right
        else if root.right is NULL
            return root.left
        
        // Node with two children
        Node temp = minValueNode(root.right)
        root.key = temp.key
        root.right = deleteNode(root.right, temp.key)
    return root
\`\`\`
    `
  },
  {
    key: 'inorder',
    title: 'Inorder Traversal',
    category: 'tree',
    shortDesc: 'A tree traversal method that visits nodes in the order: Left Subtree, Root, Right Subtree. Yields sorted order in a BST.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    content: `
# Inorder Tree Traversal

In an inorder traversal, the left subtree is visited first, then the root and later the right sub-tree. We should always remember that every node may represent a subtree itself.
If a binary tree is traversed inorder, the output will produce sorted key values in an ascending order (for a BST).

### Traversal Order
1. Traverse the left subtree, i.e., call Inorder(left-child)
2. Visit the root.
3. Traverse the right subtree, i.e., call Inorder(right-child)

### Pseudocode
\`\`\`text
procedure inorder(node)
    if node = null
        return
    inorder(node.left)
    print node.value
    inorder(node.right)
\`\`\`
    `
  },
  {
    key: 'preorder',
    title: 'Preorder Traversal',
    category: 'tree',
    shortDesc: 'A tree traversal method that visits nodes in the order: Root, Left Subtree, Right Subtree. Useful to copy a tree.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    content: `
# Preorder Tree Traversal

In a preorder traversal, the root node is visited first, then the left subtree and finally the right subtree.

### Applications
- Used to create a copy of the tree.
- Used to get prefix expression on an expression tree.

### Traversal Order
1. Visit the root.
2. Traverse the left subtree, i.e., call Preorder(left-child)
3. Traverse the right subtree, i.e., call Preorder(right-child)

### Pseudocode
\`\`\`text
procedure preorder(node)
    if node = null
        return
    print node.value
    preorder(node.left)
    preorder(node.right)
\`\`\`
    `
  },
  {
    key: 'postorder',
    title: 'Postorder Traversal',
    category: 'tree',
    shortDesc: 'A tree traversal method that visits nodes in the order: Left Subtree, Right Subtree, Root. Useful to delete a tree.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    content: `
# Postorder Tree Traversal

In a postorder traversal, the root node is visited last, strictly after its left and right subtrees. 

### Applications
- Used to delete the tree. You must delete children before you can delete the parent.
- Used to get the postfix expression of an expression tree.

### Traversal Order
1. Traverse the left subtree, i.e., call Postorder(left-child)
2. Traverse the right subtree, i.e., call Postorder(right-child)
3. Visit the root.

### Pseudocode
\`\`\`text
procedure postorder(node)
    if node = null
        return
    postorder(node.left)
    postorder(node.right)
    print node.value
\`\`\`
    `
  },
  {
    key: 'fibonacci-recursive',
    title: 'Fibonacci (Recursive)',
    category: 'dp',
    shortDesc: 'The naive recursive approach to computing Fibonacci numbers, creating a massive explosion in the call stack.',
    timeComplexity: 'O(2ⁿ)',
    spaceComplexity: 'O(n)',
    content: `
# Fibonacci (Recursive)

The Fibonacci sequence is a series of numbers in which each number is the sum of the two preceding ones, usually starting with 0 and 1.
The naive recursive solution naturally matches the mathematical definition: $F(n) = F(n-1) + F(n-2)$.

However, this is extremely inefficient. As you can see in the visualization, it recalculates the exact same subproblems over and over, resulting in an exponential time complexity.

### Pseudocode
\`\`\`text
function fib(n)
    if n <= 1
        return n
    return fib(n-1) + fib(n-2)
\`\`\`
    `
  },
  {
    key: 'fibonacci-dp',
    title: 'Fibonacci (Dynamic Prog.)',
    category: 'dp',
    shortDesc: 'An optimized approach to computing Fibonacci utilizing a 1D Dynamic Programming memoization table to cache results.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    content: `
# Fibonacci (Dynamic Programming)

To solve the overlapping subproblems issue of the naive recursive Fibonacci, we use Dynamic Programming (DP).
By storing the results of subproblems in an array (a memo table) when they are first computed, we can look them up in $O(1)$ time later instead of recomputing them. This brings the time complexity down from exponential to linear.

### Pseudocode
\`\`\`text
function fibDP(n)
    dp = array of size (n+1) initialized to 0
    dp[0] = 0
    dp[1] = 1
    
    for i = 2 to n
        dp[i] = dp[i-1] + dp[i-2]
        
    return dp[n]
\`\`\`
    `
  },
  {
    key: 'knapsack-dp',
    title: '0/1 Knapsack (DP)',
    category: 'dp',
    shortDesc: 'A classic optimizing problem: given items with values and weights, find the maximum value you can fit in a knapsack of capacity W.',
    timeComplexity: 'O(N × W)',
    spaceComplexity: 'O(N × W)',
    content: `
# 0/1 Knapsack Problem

Given $N$ items, each with a specific weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit $W$ and the total value is as large as possible. 
The "0/1" indicates that you cannot break items; you either take the whole item or don't take it.

We solve this using a 2D DP table where \`dp[i][w]\` represents the maximum value that can be attained from items $1$ to $i$ using a maximum weight capacity of $w$.

### State Transition
- If we do **not** take item $i$: The max value is \`dp[i-1][w]\`.
- If item $i$ **fits** and we **take** it: The max value is $V[i] + \`dp[i-1][w - W[i]]\`.
- We take the maximum of these two choices.

### Pseudocode
\`\`\`text
for i = 1 to N
    for w = 1 to W
        if weight[i-1] <= w
            dp[i][w] = max(value[i-1] + dp[i-1][w - weight[i-1]], dp[i-1][w])
        else
            dp[i][w] = dp[i-1][w]
return dp[N][W]
\`\`\`
    `
  },
  {
    key: 'lcs-dp',
    title: 'Longest Common Subsequence',
    category: 'dp',
    shortDesc: 'Given two strings, find the length of the longest subsequence present in both. Uses a 2D DP table matching characters.',
    timeComplexity: 'O(N × M)',
    spaceComplexity: 'O(N × M)',
    content: `
# Longest Common Subsequence (LCS)

Given two sequences, find the length of longest subsequence present in both of them. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous. For example, "abc", "abg", "bdf", "aeg", "acefg", etc. are subsequences of "abcdefg".

We use a 2D DP table where \`dp[i][j]\` represents the length of the LCS of substrings \`X[0..i-1]\` and \`Y[0..j-1]\`.

### State Transition
- If the characters match ($X[i-1] == Y[j-1]$): $1 + \`dp[i-1][j-1]\`$.
- If they do not match: $\max(\`dp[i-1][j]\`, \`dp[i][j-1]\`)$.

### Pseudocode
\`\`\`text
for i = 1 to N
    for j = 1 to M
        if X[i-1] == Y[j-1]
            dp[i][j] = dp[i-1][j-1] + 1
        else
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            
return dp[N][M]
\`\`\`
    `
  }
];
