import { afterEach, describe, expect, it, vi } from 'vitest'
import { CatService } from '@/services/cat-facts.service'
import { API_ENDPOINTS } from '@/constants/api.constants'

describe('CatService', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns fact payload on a successful response', async () => {
    const payload = { fact: 'Cats sleep a lot.', length: 17 }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    })
    vi.stubGlobal('fetch', fetchMock)

    const service = new CatService()
    await expect(service.getCatFact()).resolves.toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith(API_ENDPOINTS.CAT_FACT)
  })

  it('throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      }),
    )

    const service = new CatService()
    await expect(service.getCatFact()).rejects.toThrow('Failed to load cat fact')
  })
})
