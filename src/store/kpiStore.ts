import { create } from 'zustand'
import type { KPIState } from '@/types/kpi'
import { fetchKPIs } from '@/api/metrics'

export const useKPIStore = create<KPIState>()((set, get) => ({
  kpis: [],
  loading: false,

  load: async () => {
    if (get().kpis.length > 0) return
    set({ loading: true })
    try {
      const data = await fetchKPIs()
      set({ kpis: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },
}))
