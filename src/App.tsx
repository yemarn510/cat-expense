import { useState } from "react";
import type { JSX } from "react/jsx-dev-runtime"

import type { Expense } from "./types/expense.models";

import Nav from "./components/Navbar"
import AddExpenseDialog from "./components/dialogs/AddExpenseDialog"
import DeleteExpenseDialog from "./components/dialogs/DeleteExpenseDialog";






export default function App(): JSX.Element {
  const [expeses, setExpenses] = useState<Expense[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState<boolean>(false);
  const [openDeleteExpenseDialog, setOpenDeleteExpenseDialog] = useState<boolean>(false);



  return (
    <main>
      <Nav/>

      <section className="max-w-4xl mx-auto p-10">
        <AddExpenseDialog />
        <DeleteExpenseDialog />
      </section>
    </main>
  )
}
