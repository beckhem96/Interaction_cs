import { describe, expect, it } from "vitest";

import {
  TRIE_PREFIX_TARGET,
  TRIE_WORDS,
  generateTrieTrace
} from "../algorithms/trieTree";

describe("generateTrieTrace", () => {
  it("generates shared-prefix insertion and prefix search steps", () => {
    const trace = generateTrieTrace();

    expect(trace[0]).toMatchObject({
      id: "trie-start",
      title: "빈 트라이 준비",
      state: {
        operation: "insert",
        motion: "idle",
        targetText: TRIE_WORDS[0]
      },
      pseudoCodeLine: 1
    });

    expect(trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "trie-insert-cat-c",
          state: expect.objectContaining({
            insertedNodeId: "trie-node-c",
            targetText: "cat"
          })
        }),
        expect.objectContaining({
          id: "trie-descend-car-ca",
          state: expect.objectContaining({
            motion: "descend",
            pathNodeIds: ["trie-root", "trie-node-c", "trie-node-ca"]
          })
        }),
        expect.objectContaining({
          id: "trie-mark-word-car",
          state: expect.objectContaining({
            foundNodeId: "trie-node-car",
            terminalNodeIds: expect.arrayContaining([
              "trie-node-cat",
              "trie-node-car"
            ])
          })
        }),
        expect.objectContaining({
          id: "trie-prefix-found-car",
          state: expect.objectContaining({
            operation: "search",
            motion: "found",
            foundNodeId: "trie-node-car",
            targetText: TRIE_PREFIX_TARGET,
            wordResults: ["car", "cart"]
          })
        })
      ])
    );

    const finalStep = trace.at(-1)!;

    expect(finalStep).toMatchObject({
      id: "trie-complete",
      state: {
        motion: "complete",
        wordResults: ["car", "cart"],
        terminalNodeIds: expect.arrayContaining([
          "trie-node-cat",
          "trie-node-car",
          "trie-node-cart",
          "trie-node-dog",
          "trie-node-dot"
        ])
      },
      pseudoCodeLine: 8
    });
    expect(finalStep.state.nodes.map((node) => node.label)).toEqual(
      expect.arrayContaining(["루트", "c", "a", "r", "t", "d", "o", "g"])
    );
    expect(finalStep.state.nodes.length).toBeGreaterThan(TRIE_WORDS.length);
  });
});
