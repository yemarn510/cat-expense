import { describe, expect, it } from 'vitest'
import { Expense } from '@/types/expense.models'
import { findMaxAmountIndex } from '@/utils/expense.utils'

describe('findMaxAmountIndex', () => {
  it('returns null for an empty list', () => {
    expect(findMaxAmountIndex([])).toBeNull()
  })

  it('returns 0 for a single item', () => {
    const expenses = [new Expense({ item: 'Only', category: 'food', amount: 5 })]
    expect(findMaxAmountIndex(expenses)).toBe(0)
  })

  it('returns the index of the highest amount', () => {
    const expenses = [
      new Expense({ item: 'A', category: 'food', amount: 10 }),
      new Expense({ item: 'B', category: 'furniture', amount: 50 }),
      new Expense({ item: 'C', category: 'accessory', amount: 20 }),
    ]
    expect(findMaxAmountIndex(expenses)).toBe(1)
  })

  it('keeps the first index on a tie', () => {
    const expenses = [
      new Expense({ item: 'A', category: 'food', amount: 40 }),
      new Expense({ item: 'B', category: 'furniture', amount: 40 }),
      new Expense({ item: 'C', category: 'accessory', amount: 10 }),
    ]
    expect(findMaxAmountIndex(expenses)).toBe(0)
  })
})
