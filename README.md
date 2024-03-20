# MTO ARIS Handler for Node

[![DeepSource](https://app.deepsource.com/gh/cityssm/node-mto-handler.svg/?label=active+issues&show_trend=true&token=O09g-wYWZGGLdd8N8HU7xNww)](https://app.deepsource.com/gh/cityssm/node-mto-handler/)
[![Maintainability](https://api.codeclimate.com/v1/badges/578e93a932f9a1304734/maintainability)](https://codeclimate.com/github/cityssm/node-mto-handler/maintainability)
[![codecov](https://codecov.io/gh/cityssm/node-mto-handler/graph/badge.svg?token=H4CNROXCE6)](https://codecov.io/gh/cityssm/node-mto-handler)
[![Coverage Testing](https://github.com/cityssm/node-mto-handler/actions/workflows/coverage.yml/badge.svg)](https://github.com/cityssm/node-mto-handler/actions/workflows/coverage.yml)

Generates files compatible with the Ontario Ministry of Transportation's
Authorized Requester Information Services (ARIS).
Parses files downloaded from ARIS.

## Installation

```sh
npm install @cityssm/mto-handler
```

## Usage

```javascript
import fs from 'node:fs/promises'

import { MTOBatchWriter, parseMTOBatchResult } from '@cityssm/mto-handler'

/*
 * Generate a file to send to MTO
 */

const writer = new MTOBatchWriter({
  authorizedUser: 'XXXX',
  includeLabels: false,
  sentDate: '2024-03-19'
})

writer.addBatchEntry({
  issueDate: '2024-01-01',
  ticketNumber: 'TKT12345',
  licencePlateNumber: 'SAMPLE'
})

const fileData = writer.writeBatch()

await fs.writeFile('./path/to/uploadToMto.txt', fileData)

/*
 * Parse data retrieved from MTO
 */

const resultsBuffer = await fs.readFile('./path/to/downloadedFromMto.txt')

const resultsData = resultsBuffer.toString()

const results = await parseMTOBatchResult(resultsData)
```
