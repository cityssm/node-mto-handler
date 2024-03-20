import assert from 'node:assert';
import fs from 'node:fs/promises';
import { dateStringToDate } from '@cityssm/utils-datetime';
import { parseMTOBatchResult } from '../mtoBatchParser.js';
describe('MTO Batch Parser', () => {
    it('Parses an MTO results file', async () => {
        const resultsBuffer = await fs.readFile('./test/results.txt');
        const resultsData = resultsBuffer.toString();
        console.log(resultsData);
        const results = await parseMTOBatchResult(resultsData);
        assert.strictEqual(results.unparsedResultsCount, 0);
        assert.ok(results.parsedResults.length > 0);
        console.log(results);
        for (const result of results.parsedResults) {
            assert.ok(dateStringToDate(result.issueDate).getTime() < Date.now());
        }
    });
});
