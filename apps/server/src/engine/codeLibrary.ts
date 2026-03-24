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
  },
  'prims': {
    cpp: `void primMST(vector<vector<pair<int,int>>>& adj, int V) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    vector<int> key(V, INT_MAX);
    vector<int> parent(V, -1);
    vector<bool> inMST(V, false);
    
    pq.push({0, 0});
    key[0] = 0;
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        if (inMST[u]) continue;
        inMST[u] = true;
        
        for (auto x : adj[u]) {
            int v = x.first;
            int weight = x.second;
            if (inMST[v] == false && key[v] > weight) {
                key[v] = weight;
                pq.push({key[v], v});
                parent[v] = u;
            }
        }
    }
}`,
    java: `class Solution {
    void primMST(List<List<Node>> adj, int V) {
        PriorityQueue<Node> pq = new PriorityQueue<>(V, new Node());
        int[] key = new int[V];
        int[] parent = new int[V];
        boolean[] inMST = new boolean[V];
        Arrays.fill(key, Integer.MAX_VALUE);
        Arrays.fill(parent, -1);
        
        pq.add(new Node(0, 0));
        key[0] = 0;
        
        while (!pq.isEmpty()) {
            int u = pq.poll().node;
            if (inMST[u]) continue;
            inMST[u] = true;
            
            for (Node e : adj.get(u)) {
                int v = e.node;
                int weight = e.cost;
                if (!inMST[v] && key[v] > weight) {
                    key[v] = weight;
                    pq.add(new Node(v, key[v]));
                    parent[v] = u;
                }
            }
        }
    }
}`,
    python: `import heapq
def primMST(graph, V):
    key = [float('inf')] * V
    parent = [-1] * V
    inMST = [False] * V
    
    pq = [(0, 0)]
    key[0] = 0
    
    while pq:
        weight, u = heapq.heappop(pq)
        if inMST[u]: continue
        inMST[u] = True
        
        for v, w in graph[u]:
            if not inMST[v] and key[v] > w:
                key[v] = w
                parent[v] = u
                heapq.heappush(pq, (key[v], v))`,
    javascript: `function primMST(graph, V) {
    const key = new Array(V).fill(Infinity);
    const parent = new Array(V).fill(-1);
    const inMST = new Array(V).fill(false);
    
    const pq = [[0, 0]]; // Min-heap simulated
    key[0] = 0;
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [weight, u] = pq.shift();
        if (inMST[u]) continue;
        inMST[u] = true;
        
        for (const [v, w] of graph[u]) {
            if (!inMST[v] && key[v] > w) {
                key[v] = w;
                parent[v] = u;
                pq.push([key[v], v]);
            }
        }
    }
    return parent;
}`
  },
  'kruskals': {
    cpp: `struct Edge { int src, dest, weight; };
int find(vector<int>& parent, int i) {
    if (parent[i] == -1) return i;
    return parent[i] = find(parent, parent[i]);
}
void Union(vector<int>& parent, int x, int y) {
    int xset = find(parent, x);
    int yset = find(parent, y);
    if (xset != yset) parent[xset] = yset;
}
void kruskalMST(vector<Edge>& edges, int V) {
    sort(edges.begin(), edges.end(), [](Edge a, Edge b) { return a.weight < b.weight; });
    vector<int> parent(V, -1);
    for (auto edge : edges) {
        int x = find(parent, edge.src);
        int y = find(parent, edge.dest);
        if (x != y) {
            Union(parent, x, y);
        }
    }
}`,
    java: `class Solution {
    class Edge implements Comparable<Edge> {
        int src, dest, weight;
        public int compareTo(Edge compareEdge) {
            return this.weight - compareEdge.weight;
        }
    }
    int find(int[] parent, int i) {
        if (parent[i] == -1) return i;
        return parent[i] = find(parent, parent[i]);
    }
    void union(int[] parent, int x, int y) {
        int xset = find(parent, x);
        int yset = find(parent, y);
        if (xset != yset) parent[xset] = yset;
    }
    void kruskalMST(Edge[] edges, int V) {
        Arrays.sort(edges);
        int[] parent = new int[V];
        Arrays.fill(parent, -1);
        for (Edge edge : edges) {
            int x = find(parent, edge.src);
            int y = find(parent, edge.dest);
            if (x != y) {
                union(parent, x, y);
            }
        }
    }
}`,
    python: `class Graph:
    def find(self, parent, i):
        if parent[i] == -1: return i
        return self.find(parent, parent[i])
    def union(self, parent, x, y):
        xset = self.find(parent, x)
        yset = self.find(parent, y)
        if xset != yset:
            parent[xset] = yset
    def kruskalMST(self, edges, V):
        edges = sorted(edges, key=lambda item: item[2])
        parent = [-1] * V
        for u, v, w in edges:
            x = self.find(parent, u)
            y = self.find(parent, v)
            if x != y:
                self.union(parent, x, y)`,
    javascript: `function find(parent, i) {
    if (parent[i] === -1) return i;
    return parent[i] = find(parent, parent[i]);
}
function merge(parent, x, y) {
    let xset = find(parent, x);
    let yset = find(parent, y);
    if (xset !== yset) parent[xset] = yset;
}
function kruskalMST(edges, V) {
    edges.sort((a, b) => a[2] - b[2]);
    const parent = new Array(V).fill(-1);
    for (const [u, v, w] of edges) {
        let x = find(parent, u);
        let y = find(parent, v);
        if (x !== y) {
            merge(parent, x, y);
        }
    }
}`
  },
  'bellman-ford': {
    cpp: `void bellmanFord(vector<Edge>& edges, int V, int src) {
    vector<int> dist(V, INT_MAX);
    dist[src] = 0;
    
    for (int i = 1; i <= V - 1; i++) {
        for (auto edge : edges) {
            int u = edge.src;
            int v = edge.dest;
            int weight = edge.weight;
            if (dist[u] != INT_MAX && dist[u] + weight < dist[v])
                dist[v] = dist[u] + weight;
        }
    }
    
    for (auto edge : edges) {
        if (dist[edge.src] != INT_MAX && dist[edge.src] + edge.weight < dist[edge.dest]) {
            cout << "Graph contains negative weight cycle";
            return;
        }
    }
}`,
    java: `class Solution {
    void bellmanFord(Edge[] edges, int V, int src) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        
        for (int i = 1; i < V; i++) {
            for (Edge edge : edges) {
                if (dist[edge.src] != Integer.MAX_VALUE && dist[edge.src] + edge.weight < dist[edge.dest])
                    dist[edge.dest] = dist[edge.src] + edge.weight;
            }
        }
        
        for (Edge edge : edges) {
            if (dist[edge.src] != Integer.MAX_VALUE && dist[edge.src] + edge.weight < dist[edge.dest]) {
                System.out.println("Graph contains negative weight cycle");
                return;
            }
        }
    }
}`,
    python: `def bellman_ford(edges, V, src):
    dist = [float("Inf")] * V
    dist[src] = 0
    
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] != float("Inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                
    for u, v, w in edges:
        if dist[u] != float("Inf") and dist[u] + w < dist[v]:
            print("Graph contains negative weight cycle")
            return`,
    javascript: `function bellmanFord(edges, V, src) {
    const dist = new Array(V).fill(Infinity);
    dist[src] = 0;
    
    for (let i = 0; i < V - 1; i++) {
        for (const [u, v, w] of edges) {
            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    for (const [u, v, w] of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
            console.log("Graph contains negative weight cycle");
            return;
        }
    }
    return dist;
}`
  },
  'floyd-warshall': {
    cpp: `void floydWarshall(vector<vector<int>>& dist, int V) {
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX && dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }
}`,
    java: `class Solution {
    void floydWarshall(int[][] dist, int V) {
        for (int k = 0; k < V; k++) {
            for (int i = 0; i < V; i++) {
                for (int j = 0; j < V; j++) {
                    if (dist[i][k] != Integer.MAX_VALUE && dist[k][j] != Integer.MAX_VALUE && dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }
}`,
    python: `def floyd_warshall(dist, V):
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] != float('inf') and dist[k][j] != float('inf'):
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`,
    javascript: `function floydWarshall(dist, V) {
    for (let k = 0; k < V; k++) {
        for (let i = 0; i < V; i++) {
            for (let j = 0; j < V; j++) {
                if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    return dist;
}`
  },
  'a-star': {
    cpp: `// A* uses a heuristic distance (h) to guide Dijkstra's search
void aStar(vector<vector<pair<int,int>>>& adj, vector<int>& h, int V, int src, int target) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    vector<int> g(V, INT_MAX);
    vector<int> f(V, INT_MAX);
    
    g[src] = 0;
    f[src] = h[src];
    pq.push({f[src], src});
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        if (u == target) return; // Path found
        
        for (auto x : adj[u]) {
            int v = x.first;
            int weight = x.second;
            
            if (g[u] + weight < g[v]) {
                g[v] = g[u] + weight;
                f[v] = g[v] + h[v];
                pq.push({f[v], v});
            }
        }
    }
}`,
    java: `class Solution {
    void aStar(List<List<Node>> adj, int[] h, int V, int src, int target) {
        PriorityQueue<Node> pq = new PriorityQueue<>(V, new Node());
        int[] g = new int[V];
        int[] f = new int[V];
        Arrays.fill(g, Integer.MAX_VALUE);
        Arrays.fill(f, Integer.MAX_VALUE);
        
        g[src] = 0;
        f[src] = h[src];
        pq.add(new Node(src, f[src]));
        
        while (!pq.isEmpty()) {
            int u = pq.poll().node;
            if (u == target) return;
            
            for (Node e : adj.get(u)) {
                int v = e.node;
                int weight = e.cost;
                if (g[u] + weight < g[v]) {
                    g[v] = g[u] + weight;
                    f[v] = g[v] + h[v];
                    pq.add(new Node(v, f[v]));
                }
            }
        }
    }
}`,
    python: `import heapq
def a_star(graph, h, V, src, target):
    g = {node: float('inf') for node in graph}
    f = {node: float('inf') for node in graph}
    
    g[src] = 0
    f[src] = h[src]
    pq = [(f[src], src)]
    
    while pq:
        _, u = heapq.heappop(pq)
        if u == target: return
        
        for v, w in graph[u].items():
            if g[u] + w < g[v]:
                g[v] = g[u] + w
                f[v] = g[v] + h[v]
                heapq.heappush(pq, (f[v], v))`,
    javascript: `function aStar(graph, heuristics, V, src, target) {
    const g = {}, f = {};
    for (let node in graph) { g[node] = Infinity; f[node] = Infinity; }
    
    g[src] = 0;
    f[src] = heuristics[src] || 0;
    const pq = [[f[src], src]];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [_, u] = pq.shift();
        
        if (u === target) return g;
        
        for (const [v, w] of graph[u]) {
            if (g[u] + w < g[v]) {
                g[v] = g[u] + w;
                f[v] = g[v] + (heuristics[v] || 0);
                pq.push([f[v], v]);
            }
        }
    }
    return g;
}`
  }
};
