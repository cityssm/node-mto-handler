import { getFieldValues } from '@cityssm/ncic-lookup';
export { MTOBatchWriter } from './mtoBatchWriter.js';
export { parseMTOBatchResult } from './mtoBatchParser.js';
export const vehicleMakes = await getFieldValues('VMA');
export const vehicleColors = await getFieldValues('VCO');
