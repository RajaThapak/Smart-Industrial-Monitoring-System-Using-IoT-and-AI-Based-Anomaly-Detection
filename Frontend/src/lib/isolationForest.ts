// Lightweight Isolation Forest implementation for browser use.
// Trained online on a rolling window of recent telemetry samples and used
// to predict whether the latest sample is an anomaly.

export type Sample = number[];

type Node =
  | { type: "leaf"; size: number }
  | { type: "split"; feature: number; value: number; left: Node; right: Node };

function c(n: number): number {
  if (n <= 1) return 0;
  return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1)) / n;
}

function buildTree(data: Sample[], depth: number, maxDepth: number): Node {
  if (depth >= maxDepth || data.length <= 1) {
    return { type: "leaf", size: data.length };
  }
  const nFeatures = data[0].length;
  // try a few features to find one with non-zero range
  let feature = -1;
  let min = 0;
  let max = 0;
  for (let attempt = 0; attempt < nFeatures; attempt++) {
    const f = Math.floor(Math.random() * nFeatures);
    let lo = Infinity, hi = -Infinity;
    for (const s of data) {
      if (s[f] < lo) lo = s[f];
      if (s[f] > hi) hi = s[f];
    }
    if (hi > lo) { feature = f; min = lo; max = hi; break; }
  }
  if (feature === -1) return { type: "leaf", size: data.length };

  const value = min + Math.random() * (max - min);
  const left: Sample[] = [];
  const right: Sample[] = [];
  for (const s of data) (s[feature] < value ? left : right).push(s);

  return {
    type: "split",
    feature,
    value,
    left: buildTree(left, depth + 1, maxDepth),
    right: buildTree(right, depth + 1, maxDepth),
  };
}

function pathLength(node: Node, sample: Sample, depth: number): number {
  if (node.type === "leaf") return depth + c(node.size);
  const next = sample[node.feature] < node.value ? node.left : node.right;
  return pathLength(next, sample, depth + 1);
}

export class IsolationForest {
  private trees: Node[] = [];
  private cN = 1;

  fit(data: Sample[], nTrees = 60, subsample = 64) {
    if (data.length < 8) { this.trees = []; return; }
    const psi = Math.min(subsample, data.length);
    this.cN = c(psi);
    const maxDepth = Math.ceil(Math.log2(psi));
    this.trees = [];
    for (let i = 0; i < nTrees; i++) {
      const sample: Sample[] = [];
      for (let j = 0; j < psi; j++) {
        sample.push(data[Math.floor(Math.random() * data.length)]);
      }
      this.trees.push(buildTree(sample, 0, maxDepth));
    }
  }

  /** Returns anomaly score in [0,1]; >0.5 typically anomalous, >0.6 strong. */
  score(sample: Sample): number {
    if (!this.trees.length) return 0;
    let sum = 0;
    for (const t of this.trees) sum += pathLength(t, sample, 0);
    const avg = sum / this.trees.length;
    return Math.pow(2, -avg / this.cN);
  }
}
