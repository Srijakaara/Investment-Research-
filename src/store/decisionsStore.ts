import { create } from 'zustand'
import type { DecisionsState } from '@/types/decision'
import { fetchDecisions } from '@/api/decisions'

export const useDecisionsStore = create<DecisionsState>()((set, get) => ({
  decisions: [],
  loading: false,
  error: null,
  filters: { pillar: 'all', status: 'all', priority: 'all', search: '' },

  load: async () => {
    if (get().decisions.length > 0) return
    set({ loading: true, error: null })
    try {
      const data = await fetchDecisions()
      set({ decisions: data, loading: false })
    } catch {
      set({ error: 'Failed to load decisions', loading: false })
    }
  },

  approve: (id, by) => {
    const now = new Date().toISOString()
    set((s) => ({
      decisions: s.decisions.map((d) =>
        d.id === id
          ? { ...d, status: 'approved', resolvedBy: by, resolvedAt: now, updatedAt: now }
          : d
      ),
    }))
  },

  reject: (id, by, reason) => {
    const now = new Date().toISOString()
    set((s) => ({
      decisions: s.decisions.map((d) =>
        d.id === id
          ? { ...d, status: 'rejected', resolvedBy: by, resolvedAt: now, updatedAt: now, overrideReason: reason }
          : d
      ),
    }))
  },

  escalate: (id, by, reason) => {
    const now = new Date().toISOString()
    set((s) => ({
      decisions: s.decisions.map((d) =>
        d.id === id
          ? { ...d, status: 'escalated', resolvedBy: by, resolvedAt: now, updatedAt: now, overrideReason: reason }
          : d
      ),
    }))
  },

  setFilters: (f) =>
    set((s) => ({ filters: { ...s.filters, ...f } })),
}))
