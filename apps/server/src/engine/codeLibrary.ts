import { AlgorithmType } from '@dsa-visualizer/shared';

export interface CodeSnippets {
  cpp: string;
  java: string;
  python: string;
  javascript: string;
}

const COMMON_PLACEHOLDER = {
  cpp: `// Implementation intentionally left simple or omitted for brevity
void solve() {

}`,
  java: `class Solution {
  public void solve() {

  }
}`,
  python: `def solve():
    pass`,
  javascript: `function solve() {

}`
};

export const CODE_LIBRARY: Record<AlgorithmType, CodeSnippets> = {
  'bubble-sort': {
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
}`,
    java: `class Solution {
    public void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - i - 1; j++)
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
    }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
    javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`
  },
  'selection-sort': {
    cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`,
    java: `class Solution {
    public void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++)
                if (arr[j] < arr[minIdx])
                    minIdx = j;
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }
}`,
    python: `def selection_sort(arr):
    for i in range(len(arr) - 1):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`
  },
  'insertion-sort': {
    cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    java: `class Solution {
    public void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
    javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`
  },
  'merge-sort': {
    cpp: `void merge(int arr[], int l, int m, int r) {
  // merge portions...
}
void mergeSort(int arr[], int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
    java: `class Solution {
    public void mergeSort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            mergeSort(arr, l, m);
            mergeSort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }
}`,
    python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        # merge logic...`,
    javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}`
  },
  'quick-sort': {
    cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    java: `class Solution {
    public void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
}`,
    python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}`
  },
  'linear-search': {
    cpp: `int linearSearch(int arr[], int n, int x) {
    for (int i = 0; i < n; i++)
        if (arr[i] == x)
            return i;
    return -1;
}`,
    java: `class Solution {
    public int linearSearch(int[] arr, int x) {
        for (int i = 0; i < arr.length; i++)
            if (arr[i] == x)
                return i;
        return -1;
    }
}`,
    python: `def linear_search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x:
            return i
    return -1`,
    javascript: `function linearSearch(arr, x) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === x) return i;
    }
    return -1;
}`
  },
  'binary-search': {
    cpp: `int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
    java: `class Solution {
    public int binarySearch(int[] arr, int x) {
        int l = 0, r = arr.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (arr[m] == x) return m;
            if (arr[m] < x) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }
}`,
    python: `def binary_search(arr, l, r, x):
    while l <= r:
        m = l + (r - l) // 2
        if arr[m] == x:
            return m
        elif arr[m] < x:
            l = m + 1
        else:
            r = m - 1
    return -1`,
    javascript: `function binarySearch(arr, x) {
    let l = 0, r = arr.length - 1;
    while (l <= r) {
        let m = Math.floor(l + (r - l) / 2);
        if (arr[m] === x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
  },
  'bfs': {
    cpp: `void BFS(int s, vector<vector<int>>& adj) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    visited[s] = true;
    q.push(s);
    while(!q.empty()) {
        int u = q.front();
        q.pop();
        for(int v : adj[u]) {
            if(!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
    java: `class Solution {
    void BFS(int s, List<List<Integer>> adj) {
        boolean[] visited = new boolean[adj.size()];
        Queue<Integer> q = new LinkedList<>();
        visited[s] = true;
        q.add(s);
        while(q.size() != 0) {
            s = q.poll();
            for(int n : adj.get(s)) {
                if(!visited[n]) {
                    visited[n] = true;
                    q.add(n);
                }
            }
        }
    }
}`,
    python: `def bfs(graph, start):
    visited = [False] * len(graph)
    queue = [start]
    visited[start] = True
    while queue:
        s = queue.pop(0)
        for i in graph[s]:
            if not visited[i]:
                queue.append(i)
                visited[i] = True`,
    javascript: `function bfs(graph, start) {
    const visited = new Set([start]);
    const queue = [start];
    while (queue.length > 0) {
        const v = queue.shift();
        for (const nei of graph[v]) {
            if (!visited.has(nei)) {
                visited.add(nei);
                queue.push(nei);
            }
        }
    }
}`
  },
  'dfs': {
    cpp: `void DFSUtil(int v, vector<bool>& visited, vector<vector<int>>& adj) {
    visited[v] = true;
    for (int i : adj[v])
        if (!visited[i])
            DFSUtil(i, visited, adj);
}
void DFS(int v, vector<vector<int>>& adj) {
    vector<bool> visited(adj.size(), false);
    DFSUtil(v, visited, adj);
}`,
    java: `class Solution {
    void DFSUtil(int v, boolean[] visited, List<List<Integer>> adj) {
        visited[v] = true;
        for (int n : adj.get(v)) {
            if (!visited[n])
                DFSUtil(n, visited, adj);
        }
    }
}`,
    python: `def dfs(graph, v, visited=None):
    if visited is None:
        visited = set()
    visited.add(v)
    for neighbour in graph[v]:
        if neighbour not in visited:
            dfs(graph, neighbour, visited)`,
    javascript: `function dfs(graph, v, visited = new Set()) {
    visited.add(v);
    for (const nei of graph[v]) {
        if (!visited.has(nei)) {
            dfs(graph, nei, visited);
        }
    }
}`
  },
  'dijkstra': {
    cpp: `void dijkstra(vector<vector<pair<int,int>>>& adj, int V, int src) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    vector<int> dist(V, INT_MAX);
    pq.push(make_pair(0, src));
    dist[src] = 0;
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        for (auto x : adj[u]) {
            int v = x.first;
            int weight = x.second;
            if (dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                pq.push(make_pair(dist[v], v));
            }
        }
    }
}`,
    java: `class Solution {
    void dijkstra(List<List<Node>> adj, int V, int src) {
        PriorityQueue<Node> pq = new PriorityQueue<>(V, new Node());
        int[] dist = new int[V];
        for (int i = 0; i < V; i++) dist[i] = Integer.MAX_VALUE;
        pq.add(new Node(src, 0));
        dist[src] = 0;
        while (!pq.isEmpty()) {
            int u = pq.poll().node;
            for (Node e : adj.get(u)) {
                if (dist[u] + e.cost < dist[e.node]) {
                    dist[e.node] = dist[u] + e.cost;
                    pq.add(new Node(e.node, dist[e.node]));
                }
            }
        }
    }
}`,
    python: `import heapq
def dijkstra(graph, start):
    distances = {node: float("inf") for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    while pq:
        current_distance, current_node = heapq.heappop(pq)
        if current_distance > distances[current_node]:
            continue
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))`,
    javascript: `function dijkstra(graph, start) {
    const dist = {};
    for (let node in graph) dist[node] = Infinity;
    dist[start] = 0;
    const pq = [[0, start]]; // Ideally use a min-heap
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [cost, u] = pq.shift();
        if (cost > dist[u]) continue;
        for (let [v, w] of graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push([dist[v], v]);
            }
        }
    }
    return dist;
}`
  },
  'bst-insert': {
    cpp: `Node* insert(Node* node, int key) {
    if (node == NULL) return new Node(key);
    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);
    return node;
}`,
    java: `class Solution {
    Node insert(Node root, int key) {
        if (root == null)
            return new Node(key);
        if (key < root.key)
            root.left = insert(root.left, key);
        else if (key > root.key)
            root.right = insert(root.right, key);
        return root;
    }
}`,
    python: `def insert(root, key):
    if root is None:
        return Node(key)
    else:
        if root.val < key:
            root.right = insert(root.right, key)
        else:
            root.left = insert(root.left, key)
    return root`,
    javascript: `function insert(node, key) {
    if (node === null) return new Node(key);
    if (key < node.key) {
        node.left = insert(node.left, key);
    } else if (key > node.key) {
        node.right = insert(node.right, key);
    }
    return node;
}`
  },
  'bst-delete': COMMON_PLACEHOLDER,
  'inorder': {
    cpp: `void inorder(Node *root) {
    if (root != NULL) {
        inorder(root->left);
        cout << root->key << " ";
        inorder(root->right);
    }
}`,
    java: `class Solution {
    void inorder(Node root) {
        if (root != null) {
            inorder(root.left);
            System.out.print(root.key + " ");
            inorder(root.right);
        }
    }
}`,
    python: `def inorder(root):
    if root:
        inorder(root.left)
        print(root.val)
        inorder(root.right)`,
    javascript: `function inorder(root) {
    if (root !== null) {
        inorder(root.left);
        console.log(root.val);
        inorder(root.right);
    }
}`
  },
  'preorder': {
    cpp: `void preorder(Node *root) {
    if (root != NULL) {
        cout << root->key << " ";
        preorder(root->left);
        preorder(root->right);
    }
}`,
    java: `class Solution {
    void preorder(Node root) {
        if (root != null) {
            System.out.print(root.key + " ");
            preorder(root.left);
            preorder(root.right);
        }
    }
}`,
    python: `def preorder(root):
    if root:
        print(root.val)
        preorder(root.left)
        preorder(root.right)`,
    javascript: `function preorder(root) {
    if (root !== null) {
        console.log(root.val);
        preorder(root.left);
        preorder(root.right);
    }
}`
  },
  'postorder': {
    cpp: `void postorder(Node *root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        cout << root->key << " ";
    }
}`,
    java: `class Solution {
    void postorder(Node root) {
        if (root != null) {
            postorder(root.left);
            postorder(root.right);
            System.out.print(root.key + " ");
        }
    }
}`,
    python: `def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.val)`,
    javascript: `function postorder(root) {
    if (root !== null) {
        postorder(root.left);
        postorder(root.right);
        console.log(root.val);
    }
}`
  },
  'fibonacci-recursive': {
    cpp: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}`,
    java: `class Solution {
    int fib(int n) {
        if (n <= 1) return n;
        return fib(n-1) + fib(n-2);
    }
}`,
    python: `def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)`,
    javascript: `function fib(n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}`
  },
  'fibonacci-dp': {
    cpp: `int fib(int n) {
    int f[n + 2];
    f[0] = 0; f[1] = 1;
    for (int i = 2; i <= n; i++)
        f[i] = f[i - 1] + f[i - 2];
    return f[n];
}`,
    java: `class Solution {
    int fib(int n) {
        int f[] = new int[n + 2];
        f[0] = 0; f[1] = 1;
        for (int i = 2; i <= n; i++)
            f[i] = f[i - 1] + f[i - 2];
        return f[n];
    }
}`,
    python: `def fib(n):
    f = [0]*(n+2)
    f[0], f[1] = 0, 1
    for i in range(2, n+1):
        f[i] = f[i-1] + f[i-2]
    return f[n]`,
    javascript: `function fib(n) {
    const f = new Array(n + 2);
    f[0] = 0; f[1] = 1;
    for (let i = 2; i <= n; i++) {
        f[i] = f[i - 1] + f[i - 2];
    }
    return f[n];
}`
  },
  'knapsack-dp': {
    cpp: `int knapSack(int W, int wt[], int val[], int n) {
    int K[n + 1][W + 1];
    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (i == 0 || w == 0) K[i][w] = 0;
            else if (wt[i - 1] <= w)
                K[i][w] = max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
            else K[i][w] = K[i - 1][w];
        }
    }
    return K[n][W];
}`,
    java: `class Solution {
    int knapSack(int W, int wt[], int val[], int n) {
        int K[][] = new int[n + 1][W + 1];
        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                if (i == 0 || w == 0) K[i][w] = 0;
                else if (wt[i - 1] <= w)
                    K[i][w] = Math.max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
                else K[i][w] = K[i - 1][w];
            }
        }
        return K[n][W];
    }
}`,
    python: `def knapSack(W, wt, val, n):
    K = [[0 for x in range(W + 1)] for x in range(n + 1)]
    for i in range(n + 1):
        for w in range(W + 1):
            if i == 0 or w == 0:
                K[i][w] = 0
            elif wt[i-1] <= w:
                K[i][w] = max(val[i-1] + K[i-1][w-wt[i-1]], K[i-1][w])
            else:
                K[i][w] = K[i-1][w]
    return K[n][W]`,
    javascript: `function knapSack(W, wt, val, n) {
    let K = new Array(n + 1).fill().map(() => new Array(W + 1).fill(0));
    for (let i = 0; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
            if (i === 0 || w === 0) K[i][w] = 0;
            else if (wt[i - 1] <= w)
                K[i][w] = Math.max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
            else K[i][w] = K[i - 1][w];
        }
    }
    return K[n][W];
}`
  },
  'lcs-dp': {
    cpp: `int lcs(char *X, char *Y, int m, int n) {
    int L[m + 1][n + 1];
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i == 0 || j == 0) L[i][j] = 0;
            else if (X[i - 1] == Y[j - 1]) L[i][j] = L[i - 1][j - 1] + 1;
            else L[i][j] = max(L[i - 1][j], L[i][j - 1]);
        }
    }
    return L[m][n];
}`,
    java: `class Solution {
    int lcs(char[] X, char[] Y, int m, int n) {
        int L[][] = new int[m+1][n+1];
        for (int i=0; i<=m; i++) {
            for (int j=0; j<=n; j++) {
                if (i == 0 || j == 0) L[i][j] = 0;
                else if (X[i-1] == Y[j-1]) L[i][j] = L[i-1][j-1] + 1;
                else L[i][j] = Math.max(L[i-1][j], L[i][j-1]);
            }
        }
        return L[m][n];
    }
}`,
    python: `def lcs(X, Y):
    m = len(X)
    n = len(Y)
    L = [[0]*(n+1) for i in range(m+1)]
    for i in range(m+1):
        for j in range(n+1):
            if i == 0 or j == 0:
                L[i][j] = 0
            elif X[i-1] == Y[j-1]:
                L[i][j] = L[i-1][j-1] + 1
            else:
                L[i][j] = max(L[i-1][j], L[i][j-1])
    return L[m][n]`,
    javascript: `function lcs(X, Y) {
    let m = X.length, n = Y.length;
    let L = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0 || j === 0) L[i][j] = 0;
            else if (X[i - 1] === Y[j - 1]) L[i][j] = L[i - 1][j - 1] + 1;
            else L[i][j] = Math.max(L[i - 1][j], L[i][j - 1]);
        }
    }
    return L[m][n];
}`
  }
};
