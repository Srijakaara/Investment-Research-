import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Shell } from '@/components/common/Shell'
import { Toaster } from '@/components/ui/toaster'

interface DashboardLayoutProps {
  requireAdmin?: boolean
}

export function DashboardLayout({ requireAdmin = false }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Shell>
      <Outlet />
      <Toaster />
    </Shell>
  )
}
