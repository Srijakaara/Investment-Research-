import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { HomePage } from '@/pages/home/HomePage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { WorkbenchPage } from '@/pages/workbench/WorkbenchPage'
import { DecisionDetailPage } from '@/pages/workbench/DecisionDetailPage'
import { AuditPage } from '@/pages/audit/AuditPage'
import { AuditReplayPage } from '@/pages/audit/AuditReplayPage'
import { AdminPage } from '@/pages/admin/AdminPage'
import { AutonomyPage } from '@/pages/admin/AutonomyPage'
import { IntegrationsPage } from '@/pages/admin/IntegrationsPage'
import { ModelsPage } from '@/pages/admin/ModelsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<HomePage />} />

        {/* Public auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workbench" element={<WorkbenchPage />} />
          <Route path="/workbench/:decisionId" element={<DecisionDetailPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/audit/:decisionId" element={<AuditReplayPage />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<DashboardLayout requireAdmin />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/autonomy" element={<AutonomyPage />} />
          <Route path="/admin/integrations" element={<IntegrationsPage />} />
          <Route path="/admin/models" element={<ModelsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
