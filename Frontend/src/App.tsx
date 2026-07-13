import { useState } from "react";
import type { JSX } from "react/jsx-dev-runtime"
import { toast } from "sonner"

import {
  Expense, 
  type DeleteExpenseDialogParams, 
  type EditOrCreateExpenseDialogParams, 
  type ExpenseTableParams
} from "./types/expense.models";
import { initList, saveIntoLocalStorage } from "./utils/common.utils";

import Nav from "./components/Navbar"
import EditOrCreateExpenseDialog from "./components/dialogs/EditOrCreateExpenseDialog"
import DeleteExpenseDialog from "./components/dialogs/DeleteExpenseDialog";
import ExpenseTable from "./components/ExpenseTable";
import { Toaster } from "./components/ui/sonner";
import Footer from "./components/Footer";

export default function App(): JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>(() => initList());
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editOrCreateExpense, setEditOrCreateExpense] = useState<Expense | undefined>(undefined)

  function submitExpenseChange(newExpense: Expense): void {
    const oldAndNewExpenses = [...expenses];
    if (editingIndex !== null) {
      oldAndNewExpenses[editingIndex] = newExpense;
    } else {
      oldAndNewExpenses.push(newExpense)
    }
    setExpenses(oldAndNewExpenses);
    saveIntoLocalStorage(oldAndNewExpenses)
    setEditOrCreateExpense(undefined)
    setEditingIndex(null)
    toast.success(`Successfully ${editingIndex !== null ? 'edited' : 'added'} an item`)
  }

  function deleteExpense(): void {
    if (selectedRows.size === 0) {
      toast.error("Select at least one expense to delete")
      return;
    }
    const deletedCount = selectedRows.size
    const newExpenses = expenses.filter((_, index) => !selectedRows.has(index))
    setExpenses(newExpenses)
    saveIntoLocalStorage(newExpenses)
    setSelectedRows(new Set())
    toast.success(`Deleted ${deletedCount} expense(s)`)
  }

  function startEditExpense(index: number): void {
    const editingExpense = expenses[index];
    setEditOrCreateExpense(editingExpense);
    setEditingIndex(index);
  }

  function diplicateIndex(index: number): void {
    const source = expenses[index]
    if (!source) return

    const duplicate = new Expense({
      item: source.item,
      category: source.category,
      amount: source.amount,
    })

    const nextExpenses = [...expenses, duplicate]
    setExpenses(nextExpenses)
    saveIntoLocalStorage(nextExpenses)
    toast.success(`Duplicated "${source.item}" successfully`)
  }

  const addExpenseDialogParams: EditOrCreateExpenseDialogParams = {
    editingIndex,
    submitExpenseChange,
    editOrCreateExpense,
    setExpense: setEditOrCreateExpense,
  }

  const deleteExpenseDialogParams: DeleteExpenseDialogParams = {
    selectedRows,
    deleteExpense
  }

  const expenseTableParams: ExpenseTableParams = {
    expenses,
    selectedRows,
    setSelectedRows,
    startEditExpense,
    diplicateIndex,
  }

  return (
    <main>
      <Toaster position="bottom-center" theme="light" closeButton={true} />
      <Nav/>

      <section className="max-w-4xl mx-auto p-3 md:p-10 main-content-height">
        <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-auto mb-5 md:mb-10">
          <h2 className="text-2xl">Expense List</h2>

          <div className="flex flex-row gap-3">
            <EditOrCreateExpenseDialog params={addExpenseDialogParams} />
            <DeleteExpenseDialog params={deleteExpenseDialogParams} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 custom-table-height">
          <ExpenseTable params={expenseTableParams} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
