import { API_ENDPOINTS } from "@/constants/api.constants"
import type { CatFactResponse } from "@/types/expense.models"

export class CatService {
  async getCatFact(): Promise<CatFactResponse> {
    const res = await fetch(API_ENDPOINTS.CAT_FACT)
    if (!res.ok) {
      throw new Error("Failed to load cat fact")
    }
    return res.json() as Promise<CatFactResponse>
  }
}
