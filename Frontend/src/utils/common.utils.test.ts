import { beforeEach, describe, expect, it } from 'vitest'
import { EXPENSES_STORAGE_KEY } from '@/constants/common.constants'
import { Expense } from '@/types/expense.models'
import { initList, saveIntoLocalStorage } from '@/utils/common.utils'

describe('common.utils localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initList', () => {
    it('returns empty array when key is missing', () => {
      expect(initList()).toEqual([])
    })

    it('hydrates Expense instances from a valid JSON array', () => {
      localStorage.setItem(
        EXPENSES_STORAGE_KEY,
        JSON.stringify([
          { item: 'Cat Food', category: 'food', amount: 25 },
          { item: 'Cat Tree', category: 'furniture', amount: 120 },
        ]),
      )

      const list = initList()

      expect(list).toHaveLength(2)
      expect(list[0]).toBeInstanceOf(Expense)
      expect(list[0]).toMatchObject({
        item: 'Cat Food',
        category: 'food',
        amount: 25,
      })
      expect(list[1]).toMatchObject({
        item: 'Cat Tree',
        category: 'furniture',
        amount: 120,
      })
    })

    it('returns empty array for invalid JSON', () => {
      localStorage.setItem(EXPENSES_STORAGE_KEY, '{not-json')
      expect(initList()).toEqual([])
    })

    it('returns empty array when stored value is not an array', () => {
      localStorage.setItem(
        EXPENSES_STORAGE_KEY,
        JSON.stringify({ item: 'Cat Food' }),
      )
      expect(initList()).toEqual([])
    })

    it('coerces malformed entry fields to empty string or 0', () => {
      localStorage.setItem(
        EXPENSES_STORAGE_KEY,
        JSON.stringify([
          { item: 123, category: null, amount: '50' },
          {},
        ]),
      )

      const list = initList()

      expect(list).toHaveLength(2)
      expect(list[0]).toMatchObject({
        item: '',
        category: '',
        amount: 0,
      })
      expect(list[1]).toMatchObject({
        item: '',
        category: '',
        amount: 0,
      })
    })
  })

  describe('saveIntoLocalStorage', () => {
    it('writes only item, category, and amount under the expenses key', () => {
      const expenses = [
        new Expense({
          item: 'Bell Collar',
          category: 'accessory',
          amount: 15,
          errors: { item: true } as Expense['error'],
        }),
      ]

      saveIntoLocalStorage(expenses)

      const raw = localStorage.getItem(EXPENSES_STORAGE_KEY)
      expect(raw).not.toBeNull()
      expect(JSON.parse(raw!)).toEqual([
        { item: 'Bell Collar', category: 'accessory', amount: 15 },
      ])
    })

    it('round-trips save then init without losing data', () => {
      const expenses = [
        new Expense({ item: 'Wet Food', category: 'food', amount: 10 }),
        new Expense({ item: 'Cat Bed', category: 'furniture', amount: 45 }),
      ]

      saveIntoLocalStorage(expenses)
      const restored = initList()

      expect(restored).toHaveLength(2)
      expect(restored.map(({ item, category, amount }) => ({
        item,
        category,
        amount,
      }))).toEqual([
        { item: 'Wet Food', category: 'food', amount: 10 },
        { item: 'Cat Bed', category: 'furniture', amount: 45 },
      ])
    })
  })
})
