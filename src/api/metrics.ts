import { delay } from '@/lib/utils'
import type { KPI } from '@/types/kpi'
import rawKPIs from '@/mock/kpis.json'

export async function fetchKPIs(): Promise<KPI[]> {
  await delay(600)
  return rawKPIs as KPI[]
}
