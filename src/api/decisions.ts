import { delay } from '@/lib/utils'
import type { Decision } from '@/types/decision'
import rawDecisions from '@/mock/decisions.json'

export async function fetchDecisions(): Promise<Decision[]> {
  await delay(600)
  return rawDecisions as Decision[]
}

export async function fetchDecision(id: string): Promise<Decision | null> {
  await delay(300)
  const found = (rawDecisions as Decision[]).find((d) => d.id === id)
  return found ?? null
}

export async function executeDecision(
  id: string,
  action: 'approve' | 'reject' | 'escalate',
  reason?: string
): Promise<{ success: boolean }> {
  await delay(400)
  console.log(`[API] POST /v1/decisions/execute — ${id} → ${action}`, reason)
  return { success: true }
}

export async function overrideDecision(
  id: string,
  reason: string
): Promise<{ success: boolean }> {
  await delay(400)
  console.log(`[API] POST /v1/decisions/${id}/override — reason: ${reason}`)
  return { success: true }
}
