import { create } from 'zustand'
import type { AuditState } from '@/types/kpi'
import { fetchAuditLog } from '@/api/audit'

export const useAuditStore = create<AuditState>()((set, get) => ({
  entries: [],
  loading: false,

  load: async () => {
    if (get().entries.length > 0) return
    set({ loading: true })
    try {
      const data = await fetchAuditLog()
      set({ entries: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },
}))
