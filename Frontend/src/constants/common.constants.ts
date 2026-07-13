import type { ExpenseCategory } from "@/types/expense.models";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    value: 'food',
    label: 'Food',
  },
  {
    value: 'furniture',
    label: 'Furniture',
  },
  {
    value: 'accessory',
    label: 'Accessory',
  }
]

export const DEFAULT_EXPENSE: string = EXPENSE_CATEGORIES[0].value;

export const EXPENSE_DICTIONARY = EXPENSE_CATEGORIES.reduce(
  (acc, curr) => {
    acc[curr.value] = curr.label
    return acc
  },
  {} as Record<string, string>)


export const EXPENSES_STORAGE_KEY = "expenses"

export const DEFAULT_FACT = 'Cats can be taught to walk on a leash, but a lot of time and patience is required to teach them. The younger the cat is, the easier it will be for them to learn.';