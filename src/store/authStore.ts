import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, User } from '@/types/auth'
import { MOCK_USERS } from '@/lib/constants'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string): boolean => {
        const found = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        )
        if (!found) return false
        const { password: _pw, ...user } = found
        set({ user: user as User, isAuthenticated: true })
        return true
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'ascend-auth' }
  )
)
