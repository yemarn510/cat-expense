import { useState } from "react";
import type { JSX } from "react/jsx-dev-runtime"

import type { AddExpenseDialogParams, DeleteExpenseDialogParams, Expense, ExpenseTableParams } from "./types/expense.models";

import Nav from "./components/Navbar"
import AddExpenseDialog from "./components/dialogs/AddExpenseDialog"
import DeleteExpenseDialog from "./components/dialogs/DeleteExpenseDialog";
import ExpenseTable from "./components/ExpenseTable";


export default function App(): JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  function addExpense(newExpense: Expense): void {
    const oldAndNewExpenses = [...expenses, newExpense];
    setExpenses(oldAndNewExpenses);
  }

  function deleteExpense(): void {
    if (selectedRows.size === 0) {
      // add toaster;
      return;
    }
    const newExpenses = expenses.filter((_, index) => !selectedRows.has(index))
    setExpenses(newExpenses)
    setSelectedRows(new Set())
  }


  const addExpenseDialogParams: AddExpenseDialogParams = {
    addExpense,
  }

  const deleteExpenseDialogParams: DeleteExpenseDialogParams = {
    selectedRows,
    deleteExpense
  }

  const expenseTableParams: ExpenseTableParams = {
    expenses,
    selectedRows,
    setSelectedRows,
  }

  return (
    <main>
      <Nav/>

      <section className="max-w-4xl mx-auto p-10">
        <div className="flex flex-row justify-between mb-10">
          <h2 className="text-2xl">Expense List</h2>

          <div className="flex flex-row gap-3">
            <AddExpenseDialog params={addExpenseDialogParams} />
            <DeleteExpenseDialog params={deleteExpenseDialogParams} />
          </div>
        </div>

        <ExpenseTable params={expenseTableParams} />
      </section>
    </main>
  )
}
