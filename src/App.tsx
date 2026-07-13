import { useState } from "react";
import type { JSX } from "react/jsx-dev-runtime"
import { toast } from "sonner"

import type { AddExpenseDialogParams, DeleteExpenseDialogParams, Expense, ExpenseTableParams } from "./types/expense.models";

import Nav from "./components/Navbar"
import AddExpenseDialog from "./components/dialogs/AddExpenseDialog"
import DeleteExpenseDialog from "./components/dialogs/DeleteExpenseDialog";
import ExpenseTable from "./components/ExpenseTable";
import { Toaster } from "./components/ui/sonner";


export default function App(): JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  function addExpense(newExpense: Expense): void {
    const oldAndNewExpenses = [...expenses, newExpense];
    setExpenses(oldAndNewExpenses);
  }

  function deleteExpense(): void {
    if (selectedRows.size === 0) {
      toast.error("Select at least one expense to delete")
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
      <Toaster />
      <Nav/>

      <section className="max-w-4xl mx-auto p-5 md:p-10 main-content-height">
        <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-auto mb-5 md:mb-10">
          <h2 className="text-2xl">Expense List</h2>

          <div className="flex flex-row gap-3">
            <AddExpenseDialog params={addExpenseDialogParams} />
            <DeleteExpenseDialog params={deleteExpenseDialogParams} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3">
          <ExpenseTable params={expenseTableParams} />
        </div>
      </section>
    </main>
  )
}
