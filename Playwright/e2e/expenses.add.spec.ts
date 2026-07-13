import { test, expect } from '@playwright/test'
import {
  addExpense,
  cancelDialog,
  clearExpensesStorage,
  expectMaxAmountHighlighted,
  expectStoredExpenses,
  expectToast,
  expenseRow,
  fieldError,
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

  test('adds a Food expense, shows success toast, and writes localStorage', async ({
    page,
  }) => {
    const expense: StoredExpense = { item: 'Tuna Treats', category: 'food', amount: 12 }

    await addExpense(page, expense)

    await expectToast(page, 'Successfully added an item')
    await expect(itemCell(page, 'Tuna Treats')).toBeVisible()
    await expectStoredExpenses(page, [expense])
  })

  test('adds a Furniture expense and persists category value in localStorage', async ({
    page,
  }) => {
    const expense: StoredExpense = { item: 'Scratching Post', category: 'furniture', amount: 80 }

    await addExpense(page, expense)

    await expectToast(page, 'Successfully added an item')
    await expect(itemCell(page, 'Scratching Post')).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Furniture', exact: true })).toBeVisible()
    await expectStoredExpenses(page, [expense])
  })

  test('adds an Accessory expense and stores amount as a number', async ({ page }) => {
    const expense: StoredExpense = { item: 'Laser Pointer', category: 'accessory', amount: 18 }

    await addExpense(page, expense)

    await expectToast(page, 'Successfully added an item')
    const stored = await getStoredExpenses(page)
    expect(stored).toEqual([expense])
    expect(typeof stored[0].amount).toBe('number')
  })

  test('appends multiple adds and keeps localStorage order', async ({ page }) => {
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

  test('shows validation errors and does not update localStorage on empty submit', async ({
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

  test('shows field errors only on the blank related fields', async ({ page }) => {
    const dialog = page.getByRole('dialog')
    const blankMessage = 'This fields cannot be blank*'

    // Blank name + amount (category defaults to Food) → errors on item and amount only
    await openAddDialog(page)
    await dialog.locator('#item').fill('')
    await dialog.locator('#amount').fill('')
    await submitExpenseForm(page)

    await expect(fieldError(page, 'item')).toHaveText(blankMessage)
    await expect(fieldError(page, 'amount')).toHaveText(blankMessage)
    await expect(fieldError(page, 'category')).toHaveCount(0)
    await expect(dialog).toBeVisible()
    await expectStoredExpenses(page, [])

    // Fix name only → amount error remains, item error clears on next submit
    await dialog.locator('#item').fill('Partial Fill')
    await submitExpenseForm(page)

    await expect(fieldError(page, 'item')).toHaveCount(0)
    await expect(fieldError(page, 'amount')).toHaveText(blankMessage)
    await expect(fieldError(page, 'category')).toHaveCount(0)
    await expect(dialog).toBeVisible()
    await expectStoredExpenses(page, [])

    // Blank name again with amount filled → item error only
    await dialog.locator('#item').fill('')
    await dialog.locator('#amount').fill('20')
    await submitExpenseForm(page)

    await expect(fieldError(page, 'item')).toHaveText(blankMessage)
    await expect(fieldError(page, 'amount')).toHaveCount(0)
    await expect(fieldError(page, 'category')).toHaveCount(0)
    await expect(dialog).toBeVisible()
    await expectStoredExpenses(page, [])
  })

  test('Cancel on add leaves localStorage empty', async ({ page }) => {
    await openAddDialog(page)
    await fillExpenseForm(page, { item: 'Should Not Save', category: 'food', amount: 99 })
    await cancelDialog(page)

    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByText('No Expenses so far')).toBeVisible()
    await expectStoredExpenses(page, [])
  })

  test('added expense survives page reload via localStorage', async ({ page }) => {
    const expense: StoredExpense = { item: 'Kibble Bag', category: 'food', amount: 30 }

    await addExpense(page, expense)
    await expectToast(page, 'Successfully added an item')
    await expectStoredExpenses(page, [expense])

    await page.reload()
    await expect(itemCell(page, 'Kibble Bag')).toBeVisible()
    await expectStoredExpenses(page, [expense])
  })

  test('after adding a higher amount, that row is highlighted as max', async ({
    page,
  }) => {
    const lower: StoredExpense = { item: 'Cheap Toy', category: 'accessory', amount: 10 }
    const higher: StoredExpense = { item: 'Premium Condo', category: 'furniture', amount: 250 }

    await addExpense(page, lower)
    await expectToast(page, 'Successfully added an item')
    await expectMaxAmountHighlighted(page, 'Cheap Toy')

    await addExpense(page, higher)
    await expectToast(page, 'Successfully added an item')
    await expectMaxAmountHighlighted(page, 'Premium Condo')
    await expect(expenseRow(page, 'Cheap Toy')).not.toHaveClass(/bg-primary\/40/)
    await expectStoredExpenses(page, [lower, higher])
  })
})
