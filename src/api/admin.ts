import { delay } from '@/lib/utils'
import rawIntegrations from '@/mock/integrations.json'
import rawModels from '@/mock/models.json'

export async function fetchIntegrations() {
  await delay(600)
  return rawIntegrations
}

export async function fetchModels() {
  await delay(600)
  return rawModels
}

export async function updateAutonomyConfig(config: Record<string, unknown>) {
  await delay(400)
  console.log('[API] PUT /v1/config/autonomy', config)
  return { success: true }
}
