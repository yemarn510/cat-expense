import type { JSX } from "react/jsx-runtime"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { ExpenseTableParams } from "@/types/expense.models"
import { EXPENSE_DICTIONARY } from "@/constants/common.constants"
import { Copy, Pencil } from "lucide-react"

export default function ExpenseTable({
  params,
}: {
  params: ExpenseTableParams
}): JSX.Element {

  const expenses = params.expenses;

  const allSelected =
    expenses.length > 0 &&
    params.selectedRows.size === expenses.length

  const maxAmountIndex = findMaxAmountIndex();

  function toggleCheck(rowIndex: number): void {
    const selectedRows = new Set(params.selectedRows)
    if (selectedRows.has(rowIndex)) selectedRows.delete(rowIndex)
    else selectedRows.add(rowIndex)
    params.setSelectedRows(selectedRows)
  }

  function toggleSelectAll(): void {
    if (allSelected) {
      params.setSelectedRows(new Set())
      return
    }
    params.setSelectedRows(
      new Set(expenses.map((_, index) => index))
    )
  }

  function findMaxAmountIndex(): number | null {
    if (!expenses.length) {
      return null;
    }
    return expenses.reduce(
      (maxIndex, expense, index, arr) =>
        expense.amount > arr[maxIndex].amount ? index : maxIndex,
      0
    )
  }

  return (
    <Table className="min-w-100">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/9">
            <div className="flex items-center gap-2">
              <Checkbox
                id="expense-checkbox-all"
                checked={allSelected}
                className="border border-foreground"
                disabled={expenses.length === 0}
                onCheckedChange={toggleSelectAll}
              />
            </div>
          </TableHead>
          <TableHead className="w-2/5">Item</TableHead>
          <TableHead className="w-1/5 text-center">Category</TableHead>
          <TableHead className="w-1/5 text-center">Amount</TableHead>
          <TableHead className="w-1/5">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              <span>No Expenses so far</span>
            </TableCell>
          </TableRow>
        ) : (
          expenses.map((expense, index) => (
            <TableRow
              key={index}
              className={`${maxAmountIndex === index && "bg-primary/40"}`}
            >
              <TableCell className="text-center">
                <Checkbox
                  id={`expense-checkbox-${index}`}
                  className="border border-foreground"
                  checked={params.selectedRows.has(index)}
                  onCheckedChange={() => toggleCheck(index)}
                />
              </TableCell>
              <TableCell>{expense.item}</TableCell>
              <TableCell className="text-center">
                {EXPENSE_DICTIONARY[expense.category]}
              </TableCell>
              <TableCell className="text-center">
                ${expense.amount.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${expense.item}`}
                    onClick={() => params.startEditExpense(index)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Duplicate ${expense.item}`}
                    onClick={() => params.diplicateIndex(index)}
                  >
                    <Copy />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
