import { getFieldValues } from '@cityssm/ncic-lookup'

export {
  type MTOBatchWriterConfig,
  type MTOBatchWriterEntry,
  MTOBatchWriter
} from './mtoBatchWriter.js'

export {
  type MTOBatchResultEntry,
  type MTOBatchResults,
  parseMTOBatchResult
} from './mtoBatchParser.js'

export const vehicleMakes = await getFieldValues('VMA')

export const vehicleColors = await getFieldValues('VCO')
