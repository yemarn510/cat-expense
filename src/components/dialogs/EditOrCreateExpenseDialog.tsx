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
import { CatService } from "@/services/cat-facts.service"
import { Expense, type EditOrCreateExpenseDialogParams, type ExpenseErrors } from "@/types/expense.models"
import { useState, type JSX } from 'react'

const catService = new CatService()

export default function AddExpenseDialog({
  params,
}: {
  params: EditOrCreateExpenseDialogParams
}): JSX.Element {

  const expense = params.editOrCreateExpense;
  const [error, setError] = useState<ExpenseErrors>({} as ExpenseErrors)
  const [catFact, setCatFact] = useState<string>("")
  const [catFactLoading, setCatFactLoading] = useState<boolean>(false)
  const [randomCatImage, setRandomCatImage] = useState<number>(1)

  async function loadCatFact(): Promise<void> {
    setCatFactLoading(true)
    setCatFact("")
    try {
      const data = await catService.getCatFact()
      setCatFact(data.fact)
    } catch (err) {
      setCatFact("Could not load a cat fact right now. - " + err)
    } finally {
      setCatFactLoading(false)
    }
  }

  function submitExpense(): void {
    if (!expense) {
      return;
    }
    if (!expense.isValid()) {
      setError(expense.error)
      return
    }
    setError({} as ExpenseErrors)
    params.submitExpenseChange(expense)
  }

  function clearData(): void {
    setError({} as ExpenseErrors)
    loadCatFact()
    setRandomCatImage(Math.floor(Math.random() * 4) + 1)
  }

  function toggleDialog(isOpen: boolean): void {
    clearData();
    if (!isOpen) {
      params.setExpense(undefined);
    }
  }

  return (
    <Dialog open={!!expense}
            onOpenChange={(open) => toggleDialog(open) }>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-1/2 md:w-auto"
          onClick={() => params.setExpense(new Expense({})) }>
          Add Expense
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ params.editingIndex !== undefined ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
          <DialogDescription>
            Note down expense detils for your cat to track
          </DialogDescription>
        </DialogHeader>

        {
          expense &&
          <div className="grid gap-6 sm:grid-cols-2 items-center">
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
                    params.setExpense(new Expense({ ...expense, item: e.target.value }))
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
                    params.setExpense(new Expense({ ...expense, category: category ?? '' }))
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
                    params.setExpense(
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

            <aside className="rounded-lg bg-muted/50 p-4 relative min-h-40">
              <p className="mb-2 font-medium text-primary">Random cat fact:</p>
              <p className="text-sm text-muted-foreground italic">
                {catFactLoading ? "Loading..." : catFact}
              </p>

              <img
                src={`/images/${randomCatImage}.svg`}
                alt="cat facts"
                className="absolute bottom-0 right-0 max-h-30 w-auto -z-10"
              />
            </aside>
          </div>
        }

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={() => submitExpense() }>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
