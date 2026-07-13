import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EXPENSE_CATEGORIES } from "@/constants/common.constants"
import { Expense, type AddExpenseDialogParams, type ExpenseErrors } from "@/types/expense.models"
import { useState, type JSX } from 'react'

export default function AddExpenseDialog({
  params,
}: {
  params: AddExpenseDialogParams
}): JSX.Element {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [error, setError] = useState<ExpenseErrors>({} as ExpenseErrors);
  const [expense, setExpense] = useState<Expense>(new Expense({}))
  

  function openDialog(): void {
    setExpense(new Expense({}));
    setIsOpen(true)
    setError({} as ExpenseErrors)
  }

  function addExpense(): void {
    if (!expense.isValid()) {
      setError(expense.error)
      return;
    }
    params.addExpense(expense);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} 
            onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={() => openDialog() }>
          Add Expense
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add Expenses for your cat to track
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          {/* Item Name  */}
          <Field>
            <Label htmlFor="item">Name</Label>
            <Input
              id="item"
              name="item"
              placeholder="Item Name"
              value={expense.item}
              onChange={(e) =>
                setExpense(new Expense({ ...expense, item: e.target.value }))
              }
            />
            {
              error['item'] &&
              <small className="text-destructive">This fields cannot be blank*</small>
            }
          </Field>

          {/* Category */}
          <Field>
            <Label htmlFor="category">Category</Label>
            <Select
              value={expense.category}
              onValueChange={(category) =>
                setExpense(new Expense({ ...expense, category: category ?? '' }))
              }
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {
              error['category'] &&
              <small className="text-destructive">This fields cannot be blank*</small>
            }
          </Field>

          {/* Amount */}
          <Field>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="1"
              placeholder="Item amount"
              value={expense.amount || ''}
              onChange={(e) =>
                setExpense(
                  new Expense({
                    ...expense,
                    amount: e.target.value === '' ? 0 : Number(e.target.value),
                  })
                )
              }
            />
            {
              error['amount'] &&
              <small className="text-destructive">This fields cannot be blank*</small>
            }
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={() => addExpense() }>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
