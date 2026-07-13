import { describe, expect, it } from 'vitest'
import { Expense } from '@/types/expense.models'
import { DEFAULT_EXPENSE } from '@/constants/common.constants'

describe('Expense', () => {
  describe('constructor', () => {
    it('defaults category to food and leaves item/amount empty', () => {
      const expense = new Expense({})

      expect(expense.item).toBe('')
      expect(expense.category).toBe(DEFAULT_EXPENSE)
      expect(expense.category).toBe('food')
      expect(expense.amount).toBe(0)
      expect(expense.error).toEqual({})
    })

    it('accepts provided item, category, and amount', () => {
      const expense = new Expense({
        item: 'Cat Tree',
        category: 'furniture',
        amount: 120,
      })

      expect(expense.item).toBe('Cat Tree')
      expect(expense.category).toBe('furniture')
      expect(expense.amount).toBe(120)
    })
  })

  describe('isValid', () => {
    it('returns true for a fully valid expense and clears errors', () => {
      const expense = new Expense({
        item: 'Tuna',
        category: 'food',
        amount: 12,
        errors: { item: true } as Expense['error'],
      })

      expect(expense.isValid()).toBe(true)
      expect(expense.error).toEqual({})
    })

    it('flags empty item', () => {
      const expense = new Expense({
        item: '',
        category: 'food',
        amount: 10,
      })

      expect(expense.isValid()).toBe(false)
      expect(expense.error.item).toBe(true)
      expect(expense.error.category).toBeUndefined()
      expect(expense.error.amount).toBeUndefined()
    })

    it('flags empty category', () => {
      const expense = new Expense({
        item: 'Toy',
        category: '',
        amount: 10,
      })

      expect(expense.isValid()).toBe(false)
      expect(expense.error.category).toBe(true)
      expect(expense.error.item).toBeUndefined()
      expect(expense.error.amount).toBeUndefined()
    })

    it('flags amount 0 as invalid', () => {
      const expense = new Expense({
        item: 'Toy',
        category: 'accessory',
        amount: 0,
      })

      expect(expense.isValid()).toBe(false)
      expect(expense.error.amount).toBe(true)
    })

    it('flags missing amount the same as 0', () => {
      const expense = new Expense({
        item: 'Toy',
        category: 'accessory',
      })

      expect(expense.isValid()).toBe(false)
      expect(expense.error.amount).toBe(true)
    })

    it('flags all blanks together', () => {
      const expense = new Expense({
        item: '',
        category: '',
        amount: 0,
      })

      expect(expense.isValid()).toBe(false)
      expect(expense.error.item).toBe(true)
      expect(expense.error.category).toBe(true)
      expect(expense.error.amount).toBe(true)
    })

    it('treats default constructor values as invalid', () => {
      const expense = new Expense({})

      expect(expense.isValid()).toBe(false)
      expect(expense.error.item).toBe(true)
      expect(expense.error.amount).toBe(true)
      expect(expense.error.category).toBeUndefined()
    })
  })
})
