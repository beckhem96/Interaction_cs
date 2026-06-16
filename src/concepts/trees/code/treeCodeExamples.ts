import type { SortingCodeExample } from "../../sorting/code/types";

export const binarySearchTreeCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "binarySearchTree.c",
    code: `TreeNode* insert(TreeNode* node, int value) {
  if (node == NULL) return createNode(value);

  if (value < node->value) {
    node->left = insert(node->left, value);
  } else {
    node->right = insert(node->right, value);
  }

  return node;
}

TreeNode* search(TreeNode* node, int target) {
  if (node == NULL) return NULL;
  if (node->value == target) return node;
  if (target < node->value) return search(node->left, target);
  return search(node->right, target);
}

void inorder(TreeNode* node, Vector* output) {
  if (node == NULL) return;
  inorder(node->left, output);
  vectorPush(output, node->value);
  inorder(node->right, output);
}`
  },
  {
    language: "C++",
    fileName: "binarySearchTree.cpp",
    code: `TreeNode* insert(TreeNode* node, int value) {
  if (node == nullptr) return new TreeNode(value);

  if (value < node->value) {
    node->left = insert(node->left, value);
  } else {
    node->right = insert(node->right, value);
  }

  return node;
}

TreeNode* search(TreeNode* node, int target) {
  if (node == nullptr) return nullptr;
  if (node->value == target) return node;
  if (target < node->value) return search(node->left, target);
  return search(node->right, target);
}

void inorder(TreeNode* node, vector<int>& output) {
  if (node == nullptr) return;
  inorder(node->left, output);
  output.push_back(node->value);
  inorder(node->right, output);
}`
  },
  {
    language: "Java",
    fileName: "BinarySearchTree.java",
    code: `TreeNode insert(TreeNode node, int value) {
  if (node == null) return new TreeNode(value);

  if (value < node.value) {
    node.left = insert(node.left, value);
  } else {
    node.right = insert(node.right, value);
  }

  return node;
}

TreeNode search(TreeNode node, int target) {
  if (node == null) return null;
  if (node.value == target) return node;
  if (target < node.value) return search(node.left, target);
  return search(node.right, target);
}

void inorder(TreeNode node, List<Integer> output) {
  if (node == null) return;
  inorder(node.left, output);
  output.add(node.value);
  inorder(node.right, output);
}`
  },
  {
    language: "Python",
    fileName: "binary_search_tree.py",
    code: `def insert(node, value):
    if node is None: return TreeNode(value)

    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)

    return node

def search(node, target):
    if node is None: return None
    if node.value == target: return node
    if target < node.value: return search(node.left, target)
    return search(node.right, target)

def inorder(node, output):
    if node is None: return
    inorder(node.left, output)
    output.append(node.value)
    inorder(node.right, output)`
  },
  {
    language: "JavaScript",
    fileName: "binarySearchTree.js",
    code: `function insert(node, value) {
  if (node === null) return { value, left: null, right: null };

  if (value < node.value) {
    node.left = insert(node.left, value);
  } else {
    node.right = insert(node.right, value);
  }

  return node;
}

function search(node, target) {
  if (node === null) return null;
  if (node.value === target) return node;
  if (target < node.value) return search(node.left, target);
  return search(node.right, target);
}

function inorder(node, output) {
  if (node === null) return;
  inorder(node.left, output);
  output.push(node.value);
  inorder(node.right, output);
}`
  }
];

export const avlTreeCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "avlTree.c",
    code: `AvlNode* insert(AvlNode* node, int value) {
  if (node == NULL) return createNode(value);

  if (value < node->value) {
    node->left = insert(node->left, value);
  } else {
    node->right = insert(node->right, value);
  }

  updateHeight(node);
  int balance = height(node->left) - height(node->right);

  if (balance > 1 && value < node->left->value) return rotateRight(node);
  if (balance < -1 && value > node->right->value) return rotateLeft(node);
  if (balance > 1 && value > node->left->value) {
    node->left = rotateLeft(node->left);
    return rotateRight(node);
  }
  if (balance < -1 && value < node->right->value) {
    node->right = rotateRight(node->right);
    return rotateLeft(node);
  }

  return node;
}`
  },
  {
    language: "C++",
    fileName: "avlTree.cpp",
    code: `AvlNode* insert(AvlNode* node, int value) {
  if (node == nullptr) return new AvlNode(value);

  if (value < node->value) {
    node->left = insert(node->left, value);
  } else {
    node->right = insert(node->right, value);
  }

  updateHeight(node);
  int balance = height(node->left) - height(node->right);

  if (balance > 1 && value < node->left->value) return rotateRight(node);
  if (balance < -1 && value > node->right->value) return rotateLeft(node);
  if (balance > 1 && value > node->left->value) {
    node->left = rotateLeft(node->left);
    return rotateRight(node);
  }
  if (balance < -1 && value < node->right->value) {
    node->right = rotateRight(node->right);
    return rotateLeft(node);
  }

  return node;
}`
  },
  {
    language: "Java",
    fileName: "AvlTree.java",
    code: `AvlNode insert(AvlNode node, int value) {
  if (node == null) return new AvlNode(value);

  if (value < node.value) {
    node.left = insert(node.left, value);
  } else {
    node.right = insert(node.right, value);
  }

  updateHeight(node);
  int balance = height(node.left) - height(node.right);

  if (balance > 1 && value < node.left.value) return rotateRight(node);
  if (balance < -1 && value > node.right.value) return rotateLeft(node);
  if (balance > 1 && value > node.left.value) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  if (balance < -1 && value < node.right.value) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }

  return node;
}`
  },
  {
    language: "Python",
    fileName: "avl_tree.py",
    code: `def insert(node, value):
    if node is None: return AvlNode(value)

    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)

    update_height(node)
    balance = height(node.left) - height(node.right)

    if balance > 1 and value < node.left.value: return rotate_right(node)
    if balance < -1 and value > node.right.value: return rotate_left(node)
    if balance > 1 and value > node.left.value:
        node.left = rotate_left(node.left)
        return rotate_right(node)
    if balance < -1 and value < node.right.value:
        node.right = rotate_right(node.right)
        return rotate_left(node)

    return node`
  },
  {
    language: "JavaScript",
    fileName: "avlTree.js",
    code: `function insert(node, value) {
  if (node === null) return createNode(value);

  if (value < node.value) {
    node.left = insert(node.left, value);
  } else {
    node.right = insert(node.right, value);
  }

  updateHeight(node);
  const balance = height(node.left) - height(node.right);

  if (balance > 1 && value < node.left.value) return rotateRight(node);
  if (balance < -1 && value > node.right.value) return rotateLeft(node);
  if (balance > 1 && value > node.left.value) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  if (balance < -1 && value < node.right.value) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }

  return node;
}`
  }
];

export const redBlackTreeCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "redBlackTree.c",
    code: `RBNode* insert(RBNode* root, int value) {
  RBNode* node = createNode(value, RED);
  root = bstInsert(root, node);
  while (node->parent != NULL && node->parent->color == RED) {
    RBNode* parent = node->parent;
    RBNode* grandparent = parent->parent;
    RBNode* uncle = siblingOf(parent);
    if (uncle != NULL && uncle->color == RED) {
      parent->color = BLACK;
      uncle->color = BLACK;
      grandparent->color = RED;
      node = grandparent;
      continue;
    }
    if (isTriangle(node, parent, grandparent)) {
      rotateTowardLine(parent);
    }
    node->parent->color = BLACK;
    node->parent->parent->color = RED;
    rotateGrandparent(node->parent->parent);
  }
  root->color = BLACK;
  return root;
}`
  },
  {
    language: "C++",
    fileName: "redBlackTree.cpp",
    code: `RBNode* insert(RBNode* root, int value) {
  RBNode* node = new RBNode(value, Red);
  root = bstInsert(root, node);
  while (node->parent && node->parent->color == Red) {
    RBNode* parent = node->parent;
    RBNode* grandparent = parent->parent;
    RBNode* uncle = siblingOf(parent);
    if (uncle && uncle->color == Red) {
      parent->color = Black;
      uncle->color = Black;
      grandparent->color = Red;
      node = grandparent;
      continue;
    }
    if (isTriangle(node, parent, grandparent)) {
      rotateTowardLine(parent);
    }
    node->parent->color = Black;
    node->parent->parent->color = Red;
    rotateGrandparent(node->parent->parent);
  }
  root->color = Black;
  return root;
}`
  },
  {
    language: "Java",
    fileName: "RedBlackTree.java",
    code: `RBNode insert(RBNode root, int value) {
  RBNode node = new RBNode(value, RED);
  root = bstInsert(root, node);
  while (node.parent != null && node.parent.color == RED) {
    RBNode parent = node.parent;
    RBNode grandparent = parent.parent;
    RBNode uncle = siblingOf(parent);
    if (uncle != null && uncle.color == RED) {
      parent.color = BLACK;
      uncle.color = BLACK;
      grandparent.color = RED;
      node = grandparent;
      continue;
    }
    if (isTriangle(node, parent, grandparent)) {
      rotateTowardLine(parent);
    }
    node.parent.color = BLACK;
    node.parent.parent.color = RED;
    rotateGrandparent(node.parent.parent);
  }
  root.color = BLACK;
  return root;
}`
  },
  {
    language: "Python",
    fileName: "red_black_tree.py",
    code: `def insert(root, value):
    node = RBNode(value, RED)
    root = bst_insert(root, node)
    while node.parent is not None and node.parent.color == RED:
        parent = node.parent
        grandparent = parent.parent
        uncle = sibling_of(parent)
        if uncle is not None and uncle.color == RED:
            parent.color = BLACK
            uncle.color = BLACK
            grandparent.color = RED
            node = grandparent
            continue
        if is_triangle(node, parent, grandparent):
            rotate_toward_line(parent)
        node.parent.color = BLACK
        node.parent.parent.color = RED
        rotate_grandparent(node.parent.parent)
    root.color = BLACK
    return root`
  },
  {
    language: "JavaScript",
    fileName: "redBlackTree.js",
    code: `function insert(root, value) {
  let node = new RBNode(value, "red");
  root = bstInsert(root, node);
  while (node.parent?.color === "red") {
    const parent = node.parent;
    const grandparent = parent.parent;
    const uncle = siblingOf(parent);
    if (uncle?.color === "red") {
      parent.color = "black";
      uncle.color = "black";
      grandparent.color = "red";
      node = grandparent;
      continue;
    }
    if (isTriangle(node, parent, grandparent)) {
      rotateTowardLine(parent);
    }
    node.parent.color = "black";
    node.parent.parent.color = "red";
    rotateGrandparent(node.parent.parent);
  }
  root.color = "black";
  return root;
}`
  }
];

export const bTreeCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "bTree.c",
    code: `const int MAX_KEYS = 3;

BTreeNode* insert(BTreeNode* root, int key) {
  if (root->keyCount == MAX_KEYS) {
    BTreeNode* newRoot = createBTreeNode(false);
    attachChild(newRoot, root);
    splitChild(newRoot, 0);
    root = newRoot;
  }
  insertNonFull(root, key);
  return root;
}

void splitChild(BTreeNode* parent, int index) {
  BTreeNode* child = parent->children[index];
  int median = child->keys[1];
  BTreeNode* right = createBTreeNode(child->leaf);
  moveRightKeys(child, right, 2);
  removeLastKey(child);
  insertKey(parent, index, median);
  insertChild(parent, index + 1, right);
}

void insertNonFull(BTreeNode* node, int key) {
  if (node->leaf) {
    insertSorted(node, key);
    return;
  }
  int index = findChildIndex(node, key);
  if (node->children[index]->keyCount == MAX_KEYS) {
    splitChild(node, index);
    if (key > node->keys[index]) index++;
  }
  insertNonFull(node->children[index], key);
}

BTreeNode* search(BTreeNode* node, int key) {
  int index = lowerBound(node, key);
  if (index < node->keyCount && node->keys[index] == key) return node;
  if (node->leaf) return NULL;
  return search(node->children[index], key);
}`
  },
  {
    language: "C++",
    fileName: "bTree.cpp",
    code: `const int MAX_KEYS = 3;

BTreeNode* insert(BTreeNode* root, int key) {
  if (root->keys.size() == MAX_KEYS) {
    BTreeNode* newRoot = new BTreeNode(false);
    newRoot->children.push_back(root);
    splitChild(newRoot, 0);
    root = newRoot;
  }
  insertNonFull(root, key);
  return root;
}

void splitChild(BTreeNode* parent, int index) {
  BTreeNode* child = parent->children[index];
  int median = child->keys[1];
  BTreeNode* right = new BTreeNode(child->leaf);
  moveRightKeys(child, right, 2);
  child->keys.pop_back();
  parent->keys.insert(parent->keys.begin() + index, median);
  parent->children.insert(parent->children.begin() + index + 1, right);
}

void insertNonFull(BTreeNode* node, int key) {
  if (node->leaf) {
    insertSorted(node->keys, key);
    return;
  }
  int index = findChildIndex(node->keys, key);
  if (node->children[index]->keys.size() == MAX_KEYS) {
    splitChild(node, index);
    if (key > node->keys[index]) index++;
  }
  insertNonFull(node->children[index], key);
}

BTreeNode* search(BTreeNode* node, int key) {
  int index = lowerBound(node->keys, key);
  if (index < node->keys.size() && node->keys[index] == key) return node;
  if (node->leaf) return nullptr;
  return search(node->children[index], key);
}`
  },
  {
    language: "Java",
    fileName: "BTree.java",
    code: `static final int MAX_KEYS = 3;

BTreeNode insert(BTreeNode root, int key) {
  if (root.keys.size() == MAX_KEYS) {
    BTreeNode newRoot = new BTreeNode(false);
    newRoot.children.add(root);
    splitChild(newRoot, 0);
    root = newRoot;
  }
  insertNonFull(root, key);
  return root;
}

void splitChild(BTreeNode parent, int index) {
  BTreeNode child = parent.children.get(index);
  int median = child.keys.get(1);
  BTreeNode right = new BTreeNode(child.leaf);
  moveRightKeys(child, right, 2);
  child.keys.removeLast();
  parent.keys.add(index, median);
  parent.children.add(index + 1, right);
}

void insertNonFull(BTreeNode node, int key) {
  if (node.leaf) {
    insertSorted(node.keys, key);
    return;
  }
  int index = findChildIndex(node.keys, key);
  if (node.children.get(index).keys.size() == MAX_KEYS) {
    splitChild(node, index);
    if (key > node.keys.get(index)) index++;
  }
  insertNonFull(node.children.get(index), key);
}

BTreeNode search(BTreeNode node, int key) {
  int index = lowerBound(node.keys, key);
  if (index < node.keys.size() && node.keys.get(index) == key) return node;
  if (node.leaf) return null;
  return search(node.children.get(index), key);
}`
  },
  {
    language: "Python",
    fileName: "b_tree.py",
    code: `MAX_KEYS = 3

def insert(root, key):
    if len(root.keys) == MAX_KEYS:
        new_root = BTreeNode(False)
        new_root.children.append(root)
        split_child(new_root, 0)
        root = new_root
    insert_non_full(root, key)
    return root

def split_child(parent, index):
    child = parent.children[index]
    median = child.keys[1]
    right = BTreeNode(child.leaf)
    right.keys = child.keys[2:]
    child.keys = child.keys[:1]
    parent.keys.insert(index, median)
    parent.children.insert(index + 1, right)

def insert_non_full(node, key):
    if node.leaf:
        insert_sorted(node.keys, key)
        return
    index = find_child_index(node.keys, key)
    if len(node.children[index].keys) == MAX_KEYS:
        split_child(node, index)
        if key > node.keys[index]: index += 1
    insert_non_full(node.children[index], key)

def search(node, key):
    index = lower_bound(node.keys, key)
    if index < len(node.keys) and node.keys[index] == key: return node
    if node.leaf: return None
    return search(node.children[index], key)`
  },
  {
    language: "JavaScript",
    fileName: "bTree.js",
    code: `const MAX_KEYS = 3;

function insert(root, key) {
  if (root.keys.length === MAX_KEYS) {
    const newRoot = new BTreeNode(false);
    newRoot.children.push(root);
    splitChild(newRoot, 0);
    root = newRoot;
  }
  insertNonFull(root, key);
  return root;
}

function splitChild(parent, index) {
  const child = parent.children[index];
  const median = child.keys[1];
  const right = new BTreeNode(child.leaf);
  right.keys = child.keys.splice(2);
  child.keys.pop();
  parent.keys.splice(index, 0, median);
  parent.children.splice(index + 1, 0, right);
}

function insertNonFull(node, key) {
  if (node.leaf) {
    insertSorted(node.keys, key);
    return;
  }
  let index = findChildIndex(node.keys, key);
  if (node.children[index].keys.length === MAX_KEYS) {
    splitChild(node, index);
    if (key > node.keys[index]) index++;
  }
  insertNonFull(node.children[index], key);
}

function search(node, key) {
  const index = lowerBound(node.keys, key);
  if (node.keys[index] === key) return node;
  if (node.leaf) return null;
  return search(node.children[index], key);
}`
  }
];

export const bPlusTreeCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "bPlusTree.c",
    code: `const int MAX_KEYS = 3;

BPlusNode* insert(BPlusNode* root, int key) {
  Split split = insertRecursive(root, key);
  if (split.exists) {
    BPlusNode* newRoot = createBPlusNode(false);
    addKey(newRoot, split.separator);
    setChildren(newRoot, root, split.right);
    root = newRoot;
  }
  return root;
}

Split insertRecursive(BPlusNode* node, int key) {
  if (node->leaf) {
    insertSorted(node, key);
    if (node->keyCount <= MAX_KEYS) return noSplit();
    return splitLeaf(node);
  }
  int index = findChildIndex(node, key);
  Split split = insertRecursive(node->children[index], key);
  if (!split.exists) return noSplit();
  insertKey(node, index, split.separator);
  insertChild(node, index + 1, split.right);
  if (node->keyCount <= MAX_KEYS) return noSplit();
  return splitInternal(node);
}

Split splitLeaf(BPlusNode* leaf) {
  BPlusNode* right = createBPlusNode(true);
  moveUpperHalf(leaf, right);
  right->next = leaf->next;
  leaf->next = right;
  return makeSplit(right->keys[0], right);
}

Vector rangeScan(BPlusNode* root, int start, int end) {
  BPlusNode* leaf = findLeaf(root, start);
  Vector result = vectorCreate();
  while (leaf != NULL) {
    appendRangeKeys(&result, leaf, start, end);
    if (hasKeyGreaterThan(leaf, end)) break;
    leaf = leaf->next;
  }
  return result;
}`
  },
  {
    language: "C++",
    fileName: "bPlusTree.cpp",
    code: `const int MAX_KEYS = 3;

BPlusNode* insert(BPlusNode* root, int key) {
  optional<Split> split = insertRecursive(root, key);
  if (split) {
    BPlusNode* newRoot = new BPlusNode(false);
    newRoot->keys = {split->separator};
    newRoot->children = {root, split->right};
    root = newRoot;
  }
  return root;
}

optional<Split> insertRecursive(BPlusNode* node, int key) {
  if (node->leaf) {
    insertSorted(node->keys, key);
    if (node->keys.size() <= MAX_KEYS) return nullopt;
    return splitLeaf(node);
  }
  int index = findChildIndex(node->keys, key);
  optional<Split> split = insertRecursive(node->children[index], key);
  if (!split) return nullopt;
  node->keys.insert(node->keys.begin() + index, split->separator);
  node->children.insert(node->children.begin() + index + 1, split->right);
  if (node->keys.size() <= MAX_KEYS) return nullopt;
  return splitInternal(node);
}

Split splitLeaf(BPlusNode* leaf) {
  BPlusNode* right = new BPlusNode(true);
  moveUpperHalf(leaf, right);
  right->next = leaf->next;
  leaf->next = right;
  return {right->keys[0], right};
}

vector<int> rangeScan(BPlusNode* root, int start, int end) {
  BPlusNode* leaf = findLeaf(root, start);
  vector<int> result;
  while (leaf != nullptr) {
    appendRangeKeys(result, leaf, start, end);
    if (hasKeyGreaterThan(leaf, end)) break;
    leaf = leaf->next;
  }
  return result;
}`
  },
  {
    language: "Java",
    fileName: "BPlusTree.java",
    code: `static final int MAX_KEYS = 3;

BPlusNode insert(BPlusNode root, int key) {
  Split split = insertRecursive(root, key);
  if (split != null) {
    BPlusNode newRoot = new BPlusNode(false);
    newRoot.keys.add(split.separator);
    newRoot.children.addAll(List.of(root, split.right));
    root = newRoot;
  }
  return root;
}

Split insertRecursive(BPlusNode node, int key) {
  if (node.leaf) {
    insertSorted(node.keys, key);
    if (node.keys.size() <= MAX_KEYS) return null;
    return splitLeaf(node);
  }
  int index = findChildIndex(node.keys, key);
  Split split = insertRecursive(node.children.get(index), key);
  if (split == null) return null;
  node.keys.add(index, split.separator);
  node.children.add(index + 1, split.right);
  if (node.keys.size() <= MAX_KEYS) return null;
  return splitInternal(node);
}

Split splitLeaf(BPlusNode leaf) {
  BPlusNode right = new BPlusNode(true);
  moveUpperHalf(leaf, right);
  right.next = leaf.next;
  leaf.next = right;
  return new Split(right.keys.get(0), right);
}

List<Integer> rangeScan(BPlusNode root, int start, int end) {
  BPlusNode leaf = findLeaf(root, start);
  List<Integer> result = new ArrayList<>();
  while (leaf != null) {
    appendRangeKeys(result, leaf, start, end);
    if (hasKeyGreaterThan(leaf, end)) break;
    leaf = leaf.next;
  }
  return result;
}`
  },
  {
    language: "Python",
    fileName: "b_plus_tree.py",
    code: `MAX_KEYS = 3

def insert(root, key):
    split = insert_recursive(root, key)
    if split:
        new_root = BPlusNode(False)
        new_root.keys = [split.separator]
        new_root.children = [root, split.right]
        root = new_root
    return root

def insert_recursive(node, key):
    if node.leaf:
        insert_sorted(node.keys, key)
        if len(node.keys) <= MAX_KEYS: return None
        return split_leaf(node)
    index = find_child_index(node.keys, key)
    split = insert_recursive(node.children[index], key)
    if not split: return None
    node.keys.insert(index, split.separator)
    node.children.insert(index + 1, split.right)
    if len(node.keys) <= MAX_KEYS: return None
    return split_internal(node)

def split_leaf(leaf):
    right = BPlusNode(True)
    move_upper_half(leaf, right)
    right.next = leaf.next
    leaf.next = right
    return Split(right.keys[0], right)

def range_scan(root, start, end):
    leaf = find_leaf(root, start)
    result = []
    while leaf:
        result.extend(key for key in leaf.keys if start <= key <= end)
        if any(key > end for key in leaf.keys): break
        leaf = leaf.next
    return result`
  },
  {
    language: "JavaScript",
    fileName: "bPlusTree.js",
    code: `const MAX_KEYS = 3;

function insert(root, key) {
  const split = insertRecursive(root, key);
  if (split) {
    const newRoot = new BPlusNode(false);
    newRoot.keys = [split.separator];
    newRoot.children = [root, split.right];
    root = newRoot;
  }
  return root;
}

function insertRecursive(node, key) {
  if (node.leaf) {
    insertSorted(node.keys, key);
    if (node.keys.length <= MAX_KEYS) return null;
    return splitLeaf(node);
  }
  const index = findChildIndex(node.keys, key);
  const split = insertRecursive(node.children[index], key);
  if (!split) return null;
  node.keys.splice(index, 0, split.separator);
  node.children.splice(index + 1, 0, split.right);
  if (node.keys.length <= MAX_KEYS) return null;
  return splitInternal(node);
}

function splitLeaf(leaf) {
  const right = new BPlusNode(true);
  right.keys = leaf.keys.splice(Math.ceil(leaf.keys.length / 2));
  right.next = leaf.next;
  leaf.next = right;
  return { separator: right.keys[0], right };
}

function rangeScan(root, start, end) {
  let leaf = findLeaf(root, start);
  const result = [];
  while (leaf) {
    result.push(...leaf.keys.filter((key) => start <= key && key <= end));
    if (leaf.keys.some((key) => key > end)) break;
    leaf = leaf.next;
  }
  return result;
}`
  }
];

export const heapTreeCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "maxHeap.c",
    code: `void pushMaxHeap(Vector* heap, int value) {
  vectorPush(heap, value);
  int index = heap->length - 1;
  while (index > 0) {
    int parent = (index - 1) / 2;
    if (heapAt(heap, parent) >= heapAt(heap, index)) break;
    swapHeap(heap, parent, index);
    index = parent;
  }
}

int extractMax(Vector* heap) {
  int max = heapAt(heap, 0);
  setHeap(heap, 0, vectorPop(heap));
  int index = 0;
  while (hasChild(heap, index)) {
    int child = largerChildIndex(heap, index);
    if (heapAt(heap, index) >= heapAt(heap, child)) break;
    swapHeap(heap, index, child);
    index = child;
  }
  return max;
}`
  },
  {
    language: "C++",
    fileName: "maxHeap.cpp",
    code: `void pushMaxHeap(vector<int>& heap, int value) {
  heap.push_back(value);
  int index = heap.size() - 1;
  while (index > 0) {
    int parent = (index - 1) / 2;
    if (heap[parent] >= heap[index]) break;
    swap(heap[parent], heap[index]);
    index = parent;
  }
}

int extractMax(vector<int>& heap) {
  int max = heap[0];
  heap[0] = heap.back();
  heap.pop_back();
  int index = 0;
  while (hasChild(heap, index)) {
    int child = largerChildIndex(heap, index);
    if (heap[index] >= heap[child]) break;
    swap(heap[index], heap[child]);
    index = child;
  }
  return max;
}`
  },
  {
    language: "Java",
    fileName: "MaxHeap.java",
    code: `void pushMaxHeap(List<Integer> heap, int value) {
  heap.add(value);
  int index = heap.size() - 1;
  while (index > 0) {
    int parent = (index - 1) / 2;
    if (heap.get(parent) >= heap.get(index)) break;
    swap(heap, parent, index);
    index = parent;
  }
}

int extractMax(List<Integer> heap) {
  int max = heap.get(0);
  heap.set(0, heap.removeLast());
  int index = 0;
  while (hasChild(heap, index)) {
    int child = largerChildIndex(heap, index);
    if (heap.get(index) >= heap.get(child)) break;
    swap(heap, index, child);
    index = child;
  }
  return max;
}`
  },
  {
    language: "Python",
    fileName: "max_heap.py",
    code: `def push_max_heap(heap, value):
    heap.append(value)
    index = len(heap) - 1
    while index > 0:
        parent = (index - 1) // 2
        if heap[parent] >= heap[index]: break
        heap[parent], heap[index] = heap[index], heap[parent]
        index = parent

def extract_max(heap):
    max_value = heap[0]
    heap[0] = heap.pop()
    index = 0
    while has_child(heap, index):
        child = larger_child_index(heap, index)
        if heap[index] >= heap[child]: break
        heap[index], heap[child] = heap[child], heap[index]
        index = child
    return max_value`
  },
  {
    language: "JavaScript",
    fileName: "maxHeap.js",
    code: `function pushMaxHeap(heap, value) {
  heap.push(value);
  let index = heap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (heap[parent] >= heap[index]) break;
    swap(heap, parent, index);
    index = parent;
  }
}

function extractMax(heap) {
  const max = heap[0];
  heap[0] = heap.pop();
  let index = 0;
  while (hasChild(heap, index)) {
    const child = largerChildIndex(heap, index);
    if (heap[index] >= heap[child]) break;
    swap(heap, index, child);
    index = child;
  }
  return max;
}`
  }
];

export const trieTreeCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "trie.c",
    code: `void insert(TrieNode* root, const char* word) {
  TrieNode* node = root;
  for (int i = 0; word[i] != '\\0'; i++) {
    if (!hasChild(node, word[i])) {
      setChild(node, word[i], createTrieNode(word[i]));
    }
    node = getChild(node, word[i]);
  }
  node->isWord = true;
}

Vector searchPrefix(TrieNode* root, const char* prefix) {
  TrieNode* node = root;
  for (int i = 0; prefix[i] != '\\0'; i++) {
    if (!hasChild(node, prefix[i])) return vectorCreate();
    node = getChild(node, prefix[i]);
  }
  return collectWords(node, prefix);
}`
  },
  {
    language: "C++",
    fileName: "trie.cpp",
    code: `void insert(TrieNode* root, const string& word) {
  TrieNode* node = root;
  for (char ch : word) {
    if (!node->children.count(ch)) {
      node->children[ch] = new TrieNode(ch);
    }
    node = node->children[ch];
  }
  node->isWord = true;
}

vector<string> searchPrefix(TrieNode* root, const string& prefix) {
  TrieNode* node = root;
  for (char ch : prefix) {
    if (!node->children.count(ch)) return {};
    node = node->children[ch];
  }
  return collectWords(node, prefix);
}`
  },
  {
    language: "Java",
    fileName: "Trie.java",
    code: `void insert(TrieNode root, String word) {
  TrieNode node = root;
  for (char ch : word.toCharArray()) {
    if (!node.children.containsKey(ch)) {
      node.children.put(ch, new TrieNode(ch));
    }
    node = node.children.get(ch);
  }
  node.isWord = true;
}

List<String> searchPrefix(TrieNode root, String prefix) {
  TrieNode node = root;
  for (char ch : prefix.toCharArray()) {
    if (!node.children.containsKey(ch)) return List.of();
    node = node.children.get(ch);
  }
  return collectWords(node, prefix);
}`
  },
  {
    language: "Python",
    fileName: "trie.py",
    code: `def insert(root, word):
    node = root
    for ch in word:
        if ch not in node.children:
            node.children[ch] = TrieNode(ch)
        node = node.children[ch]
    node.is_word = True

def search_prefix(root, prefix):
    node = root
    for ch in prefix:
        if ch not in node.children: return []
        node = node.children[ch]
    return collect_words(node, prefix)`
  },
  {
    language: "JavaScript",
    fileName: "trie.js",
    code: `function insert(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children.has(ch)) {
      node.children.set(ch, new TrieNode(ch));
    }
    node = node.children.get(ch);
  }
  node.isWord = true;
}

function searchPrefix(root, prefix) {
  let node = root;
  for (const ch of prefix) {
    if (!node.children.has(ch)) return [];
    node = node.children.get(ch);
  }
  return collectWords(node, prefix);
}`
  }
];

export const segmentTreeCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "segmentTree.c",
    code: `int build(int node, int left, int right) {
  if (left == right) {
    tree[node] = values[left];
    return tree[node];
  }
  int mid = (left + right) / 2;
  tree[node] = build(node * 2, left, mid)
    + build(node * 2 + 1, mid + 1, right);
  return tree[node];
}

int query(int node, int left, int right, int ql, int qr) {
  if (qr < left || right < ql) return 0;
  if (ql <= left && right <= qr) return tree[node];
  int mid = (left + right) / 2;
  return query(node * 2, left, mid, ql, qr)
    + query(node * 2 + 1, mid + 1, right, ql, qr);
}

int update(int node, int left, int right, int index, int value) {
  if (left == right) {
    tree[node] = value;
    return tree[node];
  }
  int mid = (left + right) / 2;
  if (index <= mid) update(node * 2, left, mid, index, value);
  else update(node * 2 + 1, mid + 1, right, index, value);
  tree[node] = tree[node * 2] + tree[node * 2 + 1];
  return tree[node];
}`
  },
  {
    language: "C++",
    fileName: "segmentTree.cpp",
    code: `int build(int node, int left, int right) {
  if (left == right) {
    tree[node] = values[left];
    return tree[node];
  }
  int mid = (left + right) / 2;
  tree[node] = build(node * 2, left, mid)
    + build(node * 2 + 1, mid + 1, right);
  return tree[node];
}

int query(int node, int left, int right, int ql, int qr) {
  if (qr < left || right < ql) return 0;
  if (ql <= left && right <= qr) return tree[node];
  int mid = (left + right) / 2;
  return query(node * 2, left, mid, ql, qr)
    + query(node * 2 + 1, mid + 1, right, ql, qr);
}

int update(int node, int left, int right, int index, int value) {
  if (left == right) {
    tree[node] = value;
    return tree[node];
  }
  int mid = (left + right) / 2;
  if (index <= mid) update(node * 2, left, mid, index, value);
  else update(node * 2 + 1, mid + 1, right, index, value);
  tree[node] = tree[node * 2] + tree[node * 2 + 1];
  return tree[node];
}`
  },
  {
    language: "Java",
    fileName: "SegmentTree.java",
    code: `int build(int node, int left, int right) {
  if (left == right) {
    tree[node] = values[left];
    return tree[node];
  }
  int mid = (left + right) / 2;
  tree[node] = build(node * 2, left, mid)
    + build(node * 2 + 1, mid + 1, right);
  return tree[node];
}

int query(int node, int left, int right, int ql, int qr) {
  if (qr < left || right < ql) return 0;
  if (ql <= left && right <= qr) return tree[node];
  int mid = (left + right) / 2;
  return query(node * 2, left, mid, ql, qr)
    + query(node * 2 + 1, mid + 1, right, ql, qr);
}

int update(int node, int left, int right, int index, int value) {
  if (left == right) {
    tree[node] = value;
    return tree[node];
  }
  int mid = (left + right) / 2;
  if (index <= mid) update(node * 2, left, mid, index, value);
  else update(node * 2 + 1, mid + 1, right, index, value);
  tree[node] = tree[node * 2] + tree[node * 2 + 1];
  return tree[node];
}`
  },
  {
    language: "Python",
    fileName: "segment_tree.py",
    code: `def build(node, left, right):
    if left == right:
        tree[node] = values[left]
        return tree[node]
    mid = (left + right) // 2
    tree[node] = build(node * 2, left, mid) \\
        + build(node * 2 + 1, mid + 1, right)
    return tree[node]

def query(node, left, right, ql, qr):
    if qr < left or right < ql: return 0
    if ql <= left and right <= qr: return tree[node]
    mid = (left + right) // 2
    return query(node * 2, left, mid, ql, qr) \\
        + query(node * 2 + 1, mid + 1, right, ql, qr)

def update(node, left, right, index, value):
    if left == right:
        tree[node] = value
        return tree[node]
    mid = (left + right) // 2
    if index <= mid: update(node * 2, left, mid, index, value)
    else: update(node * 2 + 1, mid + 1, right, index, value)
    tree[node] = tree[node * 2] + tree[node * 2 + 1]
    return tree[node]`
  },
  {
    language: "JavaScript",
    fileName: "segmentTree.js",
    code: `function build(node, left, right) {
  if (left === right) {
    tree[node] = values[left];
    return tree[node];
  }
  const mid = Math.floor((left + right) / 2);
  tree[node] = build(node * 2, left, mid)
    + build(node * 2 + 1, mid + 1, right);
  return tree[node];
}

function query(node, left, right, ql, qr) {
  if (qr < left || right < ql) return 0;
  if (ql <= left && right <= qr) return tree[node];
  const mid = Math.floor((left + right) / 2);
  return query(node * 2, left, mid, ql, qr)
    + query(node * 2 + 1, mid + 1, right, ql, qr);
}

function update(node, left, right, index, value) {
  if (left === right) {
    tree[node] = value;
    return tree[node];
  }
  const mid = Math.floor((left + right) / 2);
  if (index <= mid) update(node * 2, left, mid, index, value);
  else update(node * 2 + 1, mid + 1, right, index, value);
  tree[node] = tree[node * 2] + tree[node * 2 + 1];
  return tree[node];
}`
  }
];

export const binarySearchTreeDeletionCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "binarySearchTreeDeletion.c",
    code: `TreeNode* removeNode(TreeNode* node, int target) {
  if (node == NULL) return NULL;
  if (target < node->value) {
    node->left = removeNode(node->left, target);
    return node;
  }
  if (target > node->value) {
    node->right = removeNode(node->right, target);
    return node;
  }
  if (node->left == NULL && node->right == NULL) return NULL;
  if (node->left == NULL) return node->right;
  if (node->right == NULL) return node->left;
  TreeNode* successor = findMin(node->right);
  node->value = successor->value;
  node->right = removeNode(node->right, successor->value);
  return node;
}

TreeNode* findMin(TreeNode* node) {
  while (node->left != NULL) node = node->left;
  return node;
}`
  },
  {
    language: "C++",
    fileName: "binarySearchTreeDeletion.cpp",
    code: `TreeNode* removeNode(TreeNode* node, int target) {
  if (node == nullptr) return nullptr;
  if (target < node->value) {
    node->left = removeNode(node->left, target);
    return node;
  }
  if (target > node->value) {
    node->right = removeNode(node->right, target);
    return node;
  }
  if (node->left == nullptr && node->right == nullptr) return nullptr;
  if (node->left == nullptr) return node->right;
  if (node->right == nullptr) return node->left;
  TreeNode* successor = findMin(node->right);
  node->value = successor->value;
  node->right = removeNode(node->right, successor->value);
  return node;
}

TreeNode* findMin(TreeNode* node) {
  while (node->left != nullptr) node = node->left;
  return node;
}`
  },
  {
    language: "Java",
    fileName: "BinarySearchTreeDeletion.java",
    code: `TreeNode removeNode(TreeNode node, int target) {
  if (node == null) return null;
  if (target < node.value) {
    node.left = removeNode(node.left, target);
    return node;
  }
  if (target > node.value) {
    node.right = removeNode(node.right, target);
    return node;
  }
  if (node.left == null && node.right == null) return null;
  if (node.left == null) return node.right;
  if (node.right == null) return node.left;
  TreeNode successor = findMin(node.right);
  node.value = successor.value;
  node.right = removeNode(node.right, successor.value);
  return node;
}

TreeNode findMin(TreeNode node) {
  while (node.left != null) node = node.left;
  return node;
}`
  },
  {
    language: "Python",
    fileName: "binary_search_tree_deletion.py",
    code: `def remove_node(node, target):
    if node is None: return None
    if target < node.value:
        node.left = remove_node(node.left, target)
        return node
    if target > node.value:
        node.right = remove_node(node.right, target)
        return node
    if node.left is None and node.right is None: return None
    if node.left is None: return node.right
    if node.right is None: return node.left
    successor = find_min(node.right)
    node.value = successor.value
    node.right = remove_node(node.right, successor.value)
    return node

def find_min(node):
    while node.left is not None: node = node.left
    return node`
  },
  {
    language: "JavaScript",
    fileName: "binarySearchTreeDeletion.js",
    code: `function removeNode(node, target) {
  if (node === null) return null;
  if (target < node.value) {
    node.left = removeNode(node.left, target);
    return node;
  }
  if (target > node.value) {
    node.right = removeNode(node.right, target);
    return node;
  }
  if (node.left === null && node.right === null) return null;
  if (node.left === null) return node.right;
  if (node.right === null) return node.left;
  const successor = findMin(node.right);
  node.value = successor.value;
  node.right = removeNode(node.right, successor.value);
  return node;
}

function findMin(node) {
  while (node.left !== null) node = node.left;
  return node;
}`
  }
];
