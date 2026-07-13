import { API_ENDPOINTS } from "@/constants/api.constants"
import { DEFAULT_FACT } from "@/constants/common.constants";
import type { CatFactResponse } from "@/types/expense.models"

export class CatService {
  cachedFacts: CatFactResponse = {
    fact: DEFAULT_FACT,
    length: DEFAULT_FACT.length,
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
