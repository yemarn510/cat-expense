import type { JSX } from "react/jsx-runtime"
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
import type { DeleteExpenseDialogParams } from "@/types/expense.models"
import { useState } from "react"

export default function DeleteExpenseDialog({
  params,
}: {
  params: DeleteExpenseDialogParams
}): JSX.Element {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedCount = params.selectedRows.size

  function confirmDelete(): void {
    params.deleteExpense();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen}
            onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button
          className="w-1/2 md:w-auto"
          variant="destructive">
          Delete Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Confirmation</DialogTitle>
          <DialogDescription>
            {selectedCount === 0
              ? "No expenses are selected."
              : `Delete ${selectedCount} selected expense${selectedCount === 1 ? "" : "s"}?`}
          </DialogDescription>
        </DialogHeader>

        <p className="p-5">
          Are you sure to delete the selected items?
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant='destructive' onClick={() => confirmDelete() }>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
