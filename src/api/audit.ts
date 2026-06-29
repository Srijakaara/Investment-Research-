import { delay } from '@/lib/utils'
import type { AuditEntry } from '@/types/kpi'
import rawAuditLog from '@/mock/auditLog.json'

export async function fetchAuditLog(): Promise<AuditEntry[]> {
  await delay(600)
  return rawAuditLog as AuditEntry[]
}
