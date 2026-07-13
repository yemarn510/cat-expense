import { test, expect } from '@playwright/test'
import {
  duplicateExpense,
  expectStoredExpenses,
  expectToast,
  getStoredExpenses,
  gotoApp,
  itemCell,
  seedExpenses,
  seedLocalStorage,
} from './helpers/expenses'

test.describe('Duplicating expenses', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page, seedExpenses)
    await gotoApp(page)
    await expect(itemCell(page, 'Cat Food')).toBeVisible()
  })

  test('20. duplicates an expense, shows toast with item name, and appends localStorage', async ({
    page,
  }) => {
    await duplicateExpense(page, 'Cat Food')

    await expectToast(page, 'Duplicated "Cat Food" successfully')
    await expectStoredExpenses(page, [...seedExpenses, seedExpenses[0]])
  })

  test('21. duplicated row is appended at the end of the table and storage', async ({
    page,
  }) => {
    await duplicateExpense(page, 'Bell Collar')

    await expectToast(page, 'Duplicated "Bell Collar" successfully')

    const stored = await getStoredExpenses(page)
    expect(stored).toHaveLength(4)
    expect(stored[3]).toEqual(seedExpenses[2])
    await expect(itemCell(page, 'Bell Collar')).toHaveCount(2)
  })

  test('22. duplicate copies item, category, and amount exactly', async ({ page }) => {
    await duplicateExpense(page, 'Cat Tree')

    await expectToast(page, 'Duplicated "Cat Tree" successfully')

    const stored = await getStoredExpenses(page)
    const original = stored[1]
    const copy = stored[3]
    expect(copy).toEqual(original)
    expect(copy).toEqual({ item: 'Cat Tree', category: 'furniture', amount: 120 })
  })

  test('23. duplicating twice creates two identical trailing entries', async ({ page }) => {
    await duplicateExpense(page, 'Cat Food')
    await expectToast(page, 'Duplicated "Cat Food" successfully')

    await duplicateExpense(page, 'Cat Food')
    await expectToast(page, 'Duplicated "Cat Food" successfully')

    await expectStoredExpenses(page, [
      ...seedExpenses,
      seedExpenses[0],
      seedExpenses[0],
    ])
  })

  test('24. duplicate from a seeded list keeps originals intact in localStorage', async ({
    page,
  }) => {
    await duplicateExpense(page, 'Cat Tree')

    await expectToast(page, 'Duplicated "Cat Tree" successfully')

    const stored = await getStoredExpenses(page)
    expect(stored.slice(0, 3)).toEqual(seedExpenses)
    expect(stored[3]).toEqual(seedExpenses[1])
  })
})
