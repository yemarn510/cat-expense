import { test, expect } from '@playwright/test'
import {
  confirmDelete,
  expectStoredExpenses,
  expectToast,
  getStoredExpenses,
  gotoApp,
  itemCell,
  openDeleteDialog,
  seedExpenses,
  seedLocalStorage,
  selectAllExpenses,
  selectExpenseRow,
} from './helpers/expenses'

test.describe('Deleting expenses', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page, seedExpenses)
    await gotoApp(page)
    await expect(itemCell(page, 'Cat Food')).toBeVisible()
  })

  test('14. deletes a single selected expense with toast and localStorage update', async ({
    page,
  }) => {
    await selectExpenseRow(page, 0)
    await confirmDelete(page)

    await expectToast(page, 'Deleted 1 expense(s)')
    await expect(itemCell(page, 'Cat Food')).toHaveCount(0)
    await expectStoredExpenses(page, [seedExpenses[1], seedExpenses[2]])
  })

  test('15. deletes multiple selected expenses and toast shows the count', async ({
    page,
  }) => {
    await selectExpenseRow(page, 0)
    await selectExpenseRow(page, 2)
    await confirmDelete(page)

    await expectToast(page, 'Deleted 2 expense(s)')
    await expectStoredExpenses(page, [seedExpenses[1]])
    await expect(itemCell(page, 'Cat Tree')).toBeVisible()
  })

  test('16. deletes all expenses via select-all and clears localStorage', async ({
    page,
  }) => {
    await selectAllExpenses(page)
    await confirmDelete(page)

    await expectToast(page, 'Deleted 3 expense(s)')
    await expect(page.getByText('No Expenses so far')).toBeVisible()
    await expectStoredExpenses(page, [])
  })

  test('17. delete with no selection shows error toast and keeps localStorage', async ({
    page,
  }) => {
    await confirmDelete(page)

    await expectToast(page, 'Select at least one expense to delete')
    await expectStoredExpenses(page, seedExpenses)
    await expect(itemCell(page, 'Cat Food')).toBeVisible()
  })

  test('18. Cancel on delete confirmation leaves localStorage unchanged', async ({
    page,
  }) => {
    await selectExpenseRow(page, 1)
    const dialog = await openDeleteDialog(page)
    await dialog.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expectStoredExpenses(page, seedExpenses)
  })

  test('19. remaining localStorage order is stable after middle-row delete', async ({
    page,
  }) => {
    await selectExpenseRow(page, 1)
    await confirmDelete(page)

    await expectToast(page, 'Deleted 1 expense(s)')
    await expectStoredExpenses(page, [seedExpenses[0], seedExpenses[2]])

    const stored = await getStoredExpenses(page)
    expect(stored.map((e) => e.item)).toEqual(['Cat Food', 'Bell Collar'])
  })
})
