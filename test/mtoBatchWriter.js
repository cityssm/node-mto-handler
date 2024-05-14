import assert from 'node:assert';
import { describe, it } from 'node:test';
import { dateToString } from '@cityssm/utils-datetime';
import { MTOBatchWriter } from '../index.js';
await describe('MTO Batch Writer', async () => {
    await it('Creates an MTO-formatted batch file', async () => {
        const batch = new MTOBatchWriter({
            authorizedUser: 'XXXX',
            includeLabels: true,
            sentDate: dateToString(new Date())
        }, [
            {
                issueDate: dateToString(new Date()),
                licencePlateNumber: 'SAMPLE1',
                ticketNumber: 'TKT-12345'
            }
        ]);
        batch.addBatchEntry({
            issueDate: dateToString(new Date()),
            licencePlateNumber: 'SAMPLE2',
            ticketNumber: 'TKT-12346'
        });
        const batchString = batch.writeBatch();
        console.log(batchString);
        // Header + Footer + Blank Final Line
        const numberOfNonEntryLines = 3;
        assert.strictEqual(batchString.split('\n').length, batch.getBatchSize() + numberOfNonEntryLines);
    });
});
