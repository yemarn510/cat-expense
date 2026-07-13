import { test, expect } from '@playwright/test'
import {
  addExpense,
  cancelDialog,
  clearExpensesStorage,
  expectStoredExpenses,
  expectToast,
  fillExpenseForm,
  getStoredExpenses,
  gotoApp,
  itemCell,
  openAddDialog,
  submitExpenseForm,
  type StoredExpense,
} from './helpers/expenses'

test.describe('Adding expenses', () => {
  test.beforeEach(async ({ page }) => {
    await clearExpensesStorage(page)
    await gotoApp(page)
  })

  test('1. adds a Food expense, shows success toast, and writes localStorage', async ({
    page,
  }) => {
    const expense: StoredExpense = { item: 'Tuna Treats', category: 'food', amount: 12 }

    await addExpense(page, expense)

    await expectToast(page, 'Successfully added an item')
    await expect(itemCell(page, 'Tuna Treats')).toBeVisible()
    await expectStoredExpenses(page, [expense])
  })

  test('2. adds a Furniture expense and persists category value in localStorage', async ({
    page,
  }) => {
    const expense: StoredExpense = { item: 'Scratching Post', category: 'furniture', amount: 80 }

    await addExpense(page, expense)

    await expectToast(page, 'Successfully added an item')
    await expect(itemCell(page, 'Scratching Post')).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Furniture', exact: true })).toBeVisible()
    await expectStoredExpenses(page, [expense])
  })

  test('3. adds an Accessory expense and stores amount as a number', async ({ page }) => {
    const expense: StoredExpense = { item: 'Laser Pointer', category: 'accessory', amount: 18 }

    await addExpense(page, expense)

    await expectToast(page, 'Successfully added an item')
    const stored = await getStoredExpenses(page)
    expect(stored).toEqual([expense])
    expect(typeof stored[0].amount).toBe('number')
  })

  test('4. appends multiple adds and keeps localStorage order', async ({ page }) => {
    const first: StoredExpense = { item: 'Wet Food', category: 'food', amount: 10 }
    const second: StoredExpense = { item: 'Cat Bed', category: 'furniture', amount: 45 }
    const third: StoredExpense = { item: 'Toy Mouse', category: 'accessory', amount: 8 }

    await addExpense(page, first)
    await expectToast(page, 'Successfully added an item')

    await addExpense(page, second)
    await expectToast(page, 'Successfully added an item')

    await addExpense(page, third)
    await expectToast(page, 'Successfully added an item')

    await expectStoredExpenses(page, [first, second, third])
    await expect(page.getByRole('row')).toHaveCount(4) // header + 3 rows
  })

  test('5. shows validation errors and does not update localStorage on empty submit', async ({
    page,
  }) => {
    await openAddDialog(page)
    await page.getByRole('dialog').locator('#item').fill('')
    await page.getByRole('dialog').locator('#amount').fill('')
    await submitExpenseForm(page)

    await expect(page.getByText('This fields cannot be blank*').first()).toBeVisible()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expectStoredExpenses(page, [])
  })

  test('6. Cancel on add leaves localStorage empty', async ({ page }) => {
    await openAddDialog(page)
    await fillExpenseForm(page, { item: 'Should Not Save', category: 'food', amount: 99 })
    await cancelDialog(page)

    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByText('No Expenses so far')).toBeVisible()
    await expectStoredExpenses(page, [])
  })

  test('7. added expense survives page reload via localStorage', async ({ page }) => {
    const expense: StoredExpense = { item: 'Kibble Bag', category: 'food', amount: 30 }

    await addExpense(page, expense)
    await expectToast(page, 'Successfully added an item')
    await expectStoredExpenses(page, [expense])

    await page.reload()
    await expect(itemCell(page, 'Kibble Bag')).toBeVisible()
    await expectStoredExpenses(page, [expense])
  })
})
