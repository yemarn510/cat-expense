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
  },
  {
    value: 'cleaning',
    label: 'Cleaning'
  },
  {
    value: 'toys',
    label: 'Toys'
  }
]

export const DEFAULT_EXPENSE: string = EXPENSE_CATEGORIES[0].value;