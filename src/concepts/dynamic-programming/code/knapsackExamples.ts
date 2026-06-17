import type { SortingCodeExample } from "../../sorting/code/types";

export const knapsackCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "knapsack.c",
    code: `int knapsack(int weights[], int values[], int n, int capacity) {
  int dp[MAX_ITEMS + 1][MAX_CAPACITY + 1] = {0};
  for (int i = 1; i <= n; i++) {
    int weight = weights[i - 1], value = values[i - 1];
    for (int w = 0; w <= capacity; w++) {
      if (weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        int skip = dp[i - 1][w];
        int take = dp[i - 1][w - weight] + value;
        dp[i][w] = skip > take ? skip : take;
      }
    }
  }
  return dp[n][capacity];
}`,
  },
  {
    language: "C++",
    fileName: "knapsack.cpp",
    code: `int knapsack(vector<int> weights, vector<int> values, int capacity) {
  vector<vector<int>> dp(weights.size() + 1, vector<int>(capacity + 1, 0));
  for (int i = 1; i <= weights.size(); i++) {
    int weight = weights[i - 1], value = values[i - 1];
    for (int w = 0; w <= capacity; w++) {
      if (weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        int skip = dp[i - 1][w];
        int take = dp[i - 1][w - weight] + value;
        dp[i][w] = max(skip, take);
      }
    }
  }
  return dp[weights.size()][capacity];
}`,
  },
  {
    language: "Java",
    fileName: "Knapsack.java",
    code: `static int knapsack(int[] weights, int[] values, int capacity) {
  int[][] dp = new int[weights.length + 1][capacity + 1];
  for (int i = 1; i <= weights.length; i++) {
    int weight = weights[i - 1], value = values[i - 1];
    for (int w = 0; w <= capacity; w++) {
      if (weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        int skip = dp[i - 1][w];
        int take = dp[i - 1][w - weight] + value;
        dp[i][w] = Math.max(skip, take);
      }
    }
  }
  return dp[weights.length][capacity];
}`,
  },
  {
    language: "Python",
    fileName: "knapsack.py",
    code: `def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [[0] * (capacity + 1) for _ in range(len(weights) + 1)]
    for i in range(1, len(weights) + 1):
        weight, value = weights[i - 1], values[i - 1]
        for w in range(capacity + 1):
            if weight > w:
                dp[i][w] = dp[i - 1][w]
            else:
                skip = dp[i - 1][w]
                take = dp[i - 1][w - weight] + value
                dp[i][w] = max(skip, take)

    return dp[len(weights)][capacity]`,
  },
  {
    language: "JavaScript",
    fileName: "knapsack.js",
    code: `function knapsack(weights, values, capacity) {
  const dp = Array.from({ length: weights.length + 1 }, () => Array(capacity + 1).fill(0));
  for (let i = 1; i <= weights.length; i++) {
    const weight = weights[i - 1], value = values[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        const skip = dp[i - 1][w];
        const take = dp[i - 1][w - weight] + value;
        dp[i][w] = Math.max(skip, take);
      }
    }
  }
  return dp[weights.length][capacity];
}`,
  },
];
