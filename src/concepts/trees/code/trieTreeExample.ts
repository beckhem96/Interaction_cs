export const trieTreeCodeExample = {
  language: "TypeScript",
  fileName: "trie.ts",
  code: `function insert(root: TrieNode, word: string) {
  let node = root;
  for (const ch of word) {
    if (!node.children.has(ch)) {
      node.children.set(ch, new TrieNode(ch));
    }
    node = node.children.get(ch)!;
  }
  node.isWord = true;
}

function searchPrefix(root: TrieNode, prefix: string): string[] {
  let node = root;
  for (const ch of prefix) {
    if (!node.children.has(ch)) return [];
    node = node.children.get(ch)!;
  }
  return collectWords(node, prefix);
}`
};
