export type UserRole = 'executive' | 'ops_agent' | 'auditor' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  title: string
  avatar?: string
}

export interface MockUser extends User {
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}
