import { test, expect } from '@playwright/test'
import {
  cancelDialog,
  editExpenseAt,
  expectMaxAmountHighlighted,
  expectStoredExpenses,
  expectToast,
  expenseRow,
  getStoredExpenses,
  gotoApp,
  itemCell,
  seedExpenses,
  seedLocalStorage,
  type StoredExpense,
} from './helpers/expenses'

test.describe('Editing expenses', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page, seedExpenses)
    await gotoApp(page)
    await expect(itemCell(page, 'Cat Food')).toBeVisible()
  })

  test('8. edits item name, shows success toast, and updates localStorage', async ({
    page,
  }) => {
    await editExpenseAt(page, 'Cat Food', { item: 'Premium Cat Food' })

    await expectToast(page, 'Successfully edited an item')
    await expect(itemCell(page, 'Premium Cat Food')).toBeVisible()
    await expectStoredExpenses(page, [
      { item: 'Premium Cat Food', category: 'food', amount: 25 },
      seedExpenses[1],
      seedExpenses[2],
    ])
  })

  test('9. edits category and stores the new category value', async ({ page }) => {
    await editExpenseAt(page, 'Cat Food', { category: 'accessory' })

    await expectToast(page, 'Successfully edited an item')
    await expectStoredExpenses(page, [
      { item: 'Cat Food', category: 'accessory', amount: 25 },
      seedExpenses[1],
      seedExpenses[2],
    ])
  })

  test('10. edits amount and keeps amount as a number in localStorage', async ({ page }) => {
    await editExpenseAt(page, 'Cat Tree', { amount: 150 })

    await expectToast(page, 'Successfully edited an item')
    const stored = await getStoredExpenses(page)
    expect(stored[1]).toEqual({ item: 'Cat Tree', category: 'furniture', amount: 150 })
    expect(typeof stored[1].amount).toBe('number')
  })

  test('11. edits all fields on one expense in a single submit', async ({ page }) => {
    const updated: StoredExpense = {
      item: 'Luxury Cat Condo',
      category: 'furniture',
      amount: 200,
    }

    await editExpenseAt(page, 'Bell Collar', updated)

    await expectToast(page, 'Successfully edited an item')
    await expectStoredExpenses(page, [seedExpenses[0], seedExpenses[1], updated])
  })

  test('12. Cancel on edit leaves localStorage unchanged', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Cat Food' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('dialog').locator('#item').fill('Changed Then Cancelled')
    await cancelDialog(page)

    await expect(itemCell(page, 'Cat Food')).toBeVisible()
    await expectStoredExpenses(page, seedExpenses)
  })

  test('13. editing the first row does not change later rows in localStorage', async ({
    page,
  }) => {
    await editExpenseAt(page, 'Cat Food', { amount: 40 })

    await expectToast(page, 'Successfully edited an item')
    await expectStoredExpenses(page, [
      { item: 'Cat Food', category: 'food', amount: 40 },
      seedExpenses[1],
      seedExpenses[2],
    ])
  })

  test('14. after editing amount higher, that row is highlighted as max', async ({
    page,
  }) => {
    // Seed max is Cat Tree (120)
    await expectMaxAmountHighlighted(page, 'Cat Tree')

    await editExpenseAt(page, 'Cat Food', { amount: 200 })

    await expectToast(page, 'Successfully edited an item')
    await expectMaxAmountHighlighted(page, 'Cat Food')
    await expect(expenseRow(page, 'Cat Tree')).not.toHaveClass(/bg-primary\/40/)
    await expectStoredExpenses(page, [
      { item: 'Cat Food', category: 'food', amount: 200 },
      seedExpenses[1],
      seedExpenses[2],
    ])
  })
})
