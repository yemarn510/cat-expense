import { DEFAULT_EXPENSE } from "@/constants/common.constants";

export interface ExpenseCategory {
  value: string;
  label: string;
}

export class Expense {
  item: string;
  category: string;
  amount: number;

  constructor({
    item = '',
    category = DEFAULT_EXPENSE,
    amount = 0
  }) {
    this.item = item;
    this.category = category;
    this.amount = amount;
  }
}