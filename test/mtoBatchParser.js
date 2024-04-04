import assert from 'node:assert';
import fs from 'node:fs/promises';
import { dateStringToDate } from '@cityssm/utils-datetime';
import { parseMTOBatchResult } from '../index.js';
describe('MTO Batch Parser', () => {
    it('Parses a valid MTO results file', async () => {
        const resultsBuffer = await fs.readFile('./test/results/valid.txt');
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
    it('Throws an error on an invalid file', async () => {
        const resultsBuffer = await fs.readFile('./test/results/invalid.txt');
        const resultsData = resultsBuffer.toString();
        console.log(resultsData);
        try {
            await parseMTOBatchResult(resultsData);
            assert.fail();
        }
        catch (error) {
            assert.ok(true, error);
        }
    });
});
