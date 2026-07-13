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
    expect(service.cachedFacts).toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith(API_ENDPOINTS.CAT_FACT)
  })

  it('returns cached fact when the response is not ok', async () => {
    const cached = { fact: 'Cached cat fact.', length: 16 }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      }),
    )

    const service = new CatService()
    service.cachedFacts = cached
    await expect(service.getCatFact()).resolves.toEqual(cached)
  })

  it('returns cached fact when fetch fails', async () => {
    const cached = { fact: 'Offline cat fact.', length: 17 }
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network down')))

    const service = new CatService()
    service.cachedFacts = cached
    await expect(service.getCatFact()).resolves.toEqual(cached)
  })
})
