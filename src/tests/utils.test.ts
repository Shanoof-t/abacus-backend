import { describe, it } from "node:test";
import { calculateBudgetProgress } from "../utils/utils";
import assert from "node:assert";

describe("calculateBudgetProgress", {}, () => {
  it("should return 0% when nothing is spent", () => {
    const progress = calculateBudgetProgress({
      budgetLimit: 1000,
      totalSpentAmount: 0,
    });
    assert.strictEqual(progress, 0);
  });

  it("should calculate correct percentage", () => {
    const result = calculateBudgetProgress({
      budgetLimit: 1000,
      totalSpentAmount: 250,
    });
    assert.strictEqual(result, 25);
  });

  it("should round properly", () => {
    const result = calculateBudgetProgress({
      budgetLimit: 3,
      totalSpentAmount: 2,
    });
    assert.strictEqual(result, 67);
  });

  it("should cap at 100%", () => {
    const result = calculateBudgetProgress({
      budgetLimit: 1000,
      totalSpentAmount: 1500,
    });
    assert.strictEqual(result, 100);
  });
});
