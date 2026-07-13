import { API_ENDPOINTS } from "@/constants/api.constants"
import type { CatFactResponse } from "@/types/expense.models"

export class CatService {
  cachedFacts: CatFactResponse = {
    fact: 'Cats can be taught to walk on a leash, but a lot of time and patience is required to teach them. The younger the cat is, the easier it will be for them to learn.',
    length: 0,
  };

  async getCatFact(): Promise<CatFactResponse> {
    try {
      const res = await fetch(API_ENDPOINTS.CAT_FACT)
      if (!res.ok) {
        return this.cachedFacts
      }
      this.cachedFacts = (await res.json()) as CatFactResponse
      return this.cachedFacts
    } catch {
      return this.cachedFacts
    }
  }
}
