import { describe, it } from "node:test";
import assert from "node:assert";
import statisticsHelper from "../statistics-helper";

describe("createPastMonthIncomePercentage", {}, () => {
  it("should return 0%", () => {
    const result = statisticsHelper.createPastMonthIncomePercentage({
      income: 0,
      pastMonthIncome: 1000,
    });
    assert.strictEqual(result, 100);
  });
  it("should cap at 100%", () => {
    const result = statisticsHelper.createPastMonthIncomePercentage({
      income: 1000,
      pastMonthIncome: 0,
    });
    assert.strictEqual(result, 100);
  });
});
