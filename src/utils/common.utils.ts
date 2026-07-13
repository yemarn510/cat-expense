import { EXPENSES_STORAGE_KEY } from "@/constants/common.constants"
import { Expense, type StoredExpense } from "@/types/expense.models"

export function initList(): Expense[] {
  const raw = localStorage.getItem(EXPENSES_STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.map((entry) => {
      const item = entry as StoredExpense
      return new Expense({
        item: typeof item.item === "string" ? item.item : "",
        category: typeof item.category === "string" ? item.category : "",
        amount: typeof item.amount === "number" ? item.amount : 0,
      })
    })
  } catch {
    return []
  }
}

export function saveIntoLocalStorage(nextExpenses: Expense[]): void {
  const payload = nextExpenses.map(({ item, category, amount }) => ({
    item,
    category,
    amount,
  }))
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(payload))
}
