import { DEFAULT_EXPENSE } from "@/constants/common.constants";

export interface ExpenseCategory {
  value: string;
  label: string;
}

export class Expense {
  item: string;
  category: string;
  amount: number;
  error: ExpenseErrors;

  constructor({
    item = '',
    category = DEFAULT_EXPENSE,
    amount = 0,
    errors = {} as ExpenseErrors
  }) {
    this.item = item;
    this.category = category;
    this.amount = amount;
    this.error = errors;
  }

  isValid(): boolean {
    this.error = {} as ExpenseErrors;
    if (!this.item) {
      this.error['item'] = true;
    }
    if (!this.category) {
      this.error['category'] = true;
    }
    if (!this.amount) {
      this.error['amount'] = true;
    }

    return Object.values(this.error).length === 0;
  }
}

export type ExpenseErrors = {
  [key in keyof Expense]: boolean
}

export type EditOrCreateExpenseDialogParams = {
  submitExpenseChange: (newExpense: Expense) => void,
  setExpense: (newExpense?: Expense) => void,
  editingIndex: number | null,
  editOrCreateExpense?: Expense,
}

export type DeleteExpenseDialogParams = {
  selectedRows: Set<number>
  deleteExpense: () => void
}

export type ExpenseTableParams = {
  expenses: Expense[]
  selectedRows: Set<number>
  setSelectedRows: (rows: Set<number>) => void
  startEditExpense: (index: number) => void
}

export type CatFactResponse = {
  fact: string
  length: number
}

export type StoredExpense = {
  item?: unknown
  category?: unknown
  amount?: unknown
}