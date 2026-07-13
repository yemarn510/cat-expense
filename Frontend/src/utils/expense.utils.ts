import type { Expense } from "@/types/expense.models"

export function findMaxAmountIndex(
  expenses: Pick<Expense, "amount">[],
): number | null {
  if (!expenses.length) {
    return null
  }

  return expenses.reduce(
    (maxIndex, expense, index, arr) =>
      expense.amount > arr[maxIndex].amount ? index : maxIndex,
    0,
  )
}
