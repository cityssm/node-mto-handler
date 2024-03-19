import assert from 'node:assert'

import { type DateString, dateToString } from '@cityssm/utils-datetime'

import { MTOBatchWriter } from '../mtoBatchWriter.js'

describe('MTO Batch Writer', () => {
  it('Creates an MTO-formatted batch file', () => {
    const batch = new MTOBatchWriter(
      {
        authorizedUser: 'XXXX',
        includeLabels: true,
        sentDate: dateToString(new Date()) as DateString
      },
      [
        {
          issueDate: dateToString(new Date()) as DateString,
          ontarioLicencePlateNumber: 'SAMPLE1',
          ticketNumber: 'TKT-12345'
        }
      ]
    )

    batch.addBatchEntry({
      issueDate: dateToString(new Date()) as DateString,
      ontarioLicencePlateNumber: 'SAMPLE2',
      ticketNumber: 'TKT-12346'
    })

    const batchString = batch.writeBatch()

    console.log(batchString)

    // Header + Footer + Blank Final Line
    const numberOfNonEntryLines = 3

    assert.strictEqual(
      batchString.split('\n').length,
      batch.getBatchSize() + numberOfNonEntryLines
    )
  })
})
