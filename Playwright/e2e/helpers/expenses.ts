import { expect, type Page, type Locator } from '@playwright/test'

export const EXPENSES_STORAGE_KEY = 'expenses'

export type StoredExpense = {
  item: string
  category: string
  amount: number
}

export const seedExpenses: StoredExpense[] = [
  { item: 'Cat Food', category: 'food', amount: 25 },
  { item: 'Cat Tree', category: 'furniture', amount: 120 },
  { item: 'Bell Collar', category: 'accessory', amount: 15 },
]

export async function mockCatFactApi(page: Page): Promise<void> {
  await page.route('**/catfact.ninja/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        fact: 'Cats sleep for most of the day.',
        length: 32,
      }),
    })
  })
}

export async function seedLocalStorage(
  page: Page,
  expenses: StoredExpense[] = seedExpenses,
): Promise<void> {
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, value)
    },
    { key: EXPENSES_STORAGE_KEY, value: JSON.stringify(expenses) },
  )
}

export async function clearExpensesStorage(page: Page): Promise<void> {
  // Clear once per tab so later reloads still see writes from the test.
  await page.addInitScript((key) => {
    const flag = `__e2e_cleared_${key}`
    if (!sessionStorage.getItem(flag)) {
      window.localStorage.removeItem(key)
      sessionStorage.setItem(flag, '1')
    }
  }, EXPENSES_STORAGE_KEY)
}

export function itemCell(page: Page, itemName: string): Locator {
  return page.getByRole('cell', { name: itemName, exact: true })
}

export function expenseRow(page: Page, itemName: string): Locator {
  return page.locator('[data-slot="table-body"] tr').filter({
    has: itemCell(page, itemName),
  })
}

export async function expectMaxAmountHighlighted(
  page: Page,
  itemName: string,
): Promise<void> {
  const highlighted = page.locator('[data-slot="table-body"] tr.bg-primary\\/40')
  await expect(highlighted).toHaveCount(1)
  await expect(expenseRow(page, itemName)).toHaveClass(/bg-primary\/40/)
}

export async function getStoredExpenses(page: Page): Promise<StoredExpense[]> {
  const raw = await page.evaluate((key) => window.localStorage.getItem(key), EXPENSES_STORAGE_KEY)
  if (!raw) return []
  return JSON.parse(raw) as StoredExpense[]
}

export async function expectStoredExpenses(
  page: Page,
  expected: StoredExpense[],
): Promise<void> {
  await expect
    .poll(async () => getStoredExpenses(page))
    .toEqual(expected)
}

export async function expectToast(page: Page, message: string | RegExp): Promise<void> {
  const toast = page.locator('[data-sonner-toast]').filter({ hasText: message })
  await expect(toast.first()).toBeVisible()
}

/** Error message rendered under a specific form control (#item, #amount, #category). */
export function fieldError(page: Page, fieldId: 'item' | 'amount' | 'category'): Locator {
  return page
    .getByRole('dialog')
    .locator(`[data-slot="field"]`)
    .filter({ has: page.locator(`#${fieldId}`) })
    .locator('small.text-destructive')
}

export async function openAddDialog(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Add Expense' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

export async function fillExpenseForm(
  page: Page,
  expense: { item: string; category: string; amount: number | string },
): Promise<void> {
  const dialog = page.getByRole('dialog')
  await dialog.locator('#item').fill(expense.item)

  await dialog.locator('#category').click()
  await page.getByRole('option', { name: categoryLabel(expense.category) }).click()

  await dialog.locator('#amount').fill(String(expense.amount))
}

export async function submitExpenseForm(page: Page): Promise<void> {
  await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click()
}

export async function cancelDialog(page: Page): Promise<void> {
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click()
}

export async function addExpense(
  page: Page,
  expense: { item: string; category: string; amount: number | string },
): Promise<void> {
  await openAddDialog(page)
  await fillExpenseForm(page, expense)
  await submitExpenseForm(page)
}

export async function editExpenseAt(
  page: Page,
  itemName: string,
  updates: Partial<{ item: string; category: string; amount: number | string }>,
): Promise<void> {
  await page.getByRole('button', { name: `Edit ${itemName}` }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  const dialog = page.getByRole('dialog')
  if (updates.item !== undefined) {
    await dialog.locator('#item').fill(updates.item)
  }
  if (updates.category !== undefined) {
    await dialog.locator('#category').click()
    await page.getByRole('option', { name: categoryLabel(updates.category) }).click()
  }
  if (updates.amount !== undefined) {
    await dialog.locator('#amount').fill(String(updates.amount))
  }

  await submitExpenseForm(page)
}

export async function duplicateExpense(page: Page, itemName: string): Promise<void> {
  await page.getByRole('button', { name: `Duplicate ${itemName}` }).first().click()
}

export async function selectExpenseRow(page: Page, index: number): Promise<void> {
  await page.locator(`#expense-checkbox-${index}`).click()
}

export async function selectAllExpenses(page: Page): Promise<void> {
  await page.locator('#expense-checkbox-all').click()
}

export async function confirmDelete(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Delete Expense' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click()
}

export async function openDeleteDialog(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: 'Delete Expense' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  return dialog
}

function categoryLabel(value: string): string {
  const map: Record<string, string> = {
    food: 'Food',
    furniture: 'Furniture',
    accessory: 'Accessory',
  }
  return map[value] ?? value
}

export async function gotoApp(page: Page): Promise<void> {
  await mockCatFactApi(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Expense List' })).toBeVisible()
}
