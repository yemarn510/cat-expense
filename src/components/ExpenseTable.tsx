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
import type { ExpenseTableParams } from "@/types/expense.models"
import { EXPENSE_CATEGORIES } from "@/constants/common.constants"

export default function ExpenseTable({
  params,
}: {
  params: ExpenseTableParams
}): JSX.Element {

  const categoryDictionary = EXPENSE_CATEGORIES.reduce(
    (acc, curr) => {
      acc[curr.value] = curr.label
      return acc
    },
    {} as Record<string, string>
  )

  function toggleCheck(rowIndex: number): void {
    const selectedRows = new Set(params.selectedRows)
    if (selectedRows.has(rowIndex)) selectedRows.delete(rowIndex)
    else selectedRows.add(rowIndex)
    params.setSelectedRows(selectedRows)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/9"></TableHead>
          <TableHead className="w-3/5">Item</TableHead>
          <TableHead className="w-1/5 text-center">Category</TableHead>
          <TableHead className="w-1/5 text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {params.expenses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              <span>No Expenses so far</span>
            </TableCell>
          </TableRow>
        ) : (
          params.expenses.map((expense, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  id={`expense-checkbox-${index}`}
                  checked={params.selectedRows.has(index)}
                  onCheckedChange={() => toggleCheck(index)}
                />
              </TableCell>
              <TableCell>{expense.item}</TableCell>
              <TableCell className="text-center">
                {categoryDictionary[expense.category]}
              </TableCell>
              <TableCell className="text-right">
                ${expense.amount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
