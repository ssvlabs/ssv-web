export interface IMerkleData {
  version: string,
  network: string,
  tree: IMerkleTree
}

export interface IMerkleTree {
  root: string,
  data: IMerkleTreeData
}

export interface IMerkleTree {
  root: string,
  data: IMerkleTreeData
}

export interface IMerkleTreeData {
  address: string,
  amount: string,
  proof: string[]
}
