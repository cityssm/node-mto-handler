import assert from 'node:assert'
import { describe, it } from 'node:test'

import { vehicleColors, vehicleMakes } from '../index.js'

await describe('Exported lookups', async () => {
  const vehicleMakeValues = ['CHEV', 'FORD', 'HYUN']

  for (const vehicleMake of vehicleMakeValues) {
    await it(`Includes popular vehicle make: ${vehicleMake}`, async () => {
      assert.ok(Object.keys(vehicleMakes).includes(vehicleMake))
    })
  }

  const vehicleColorValues = ['BLACK', 'BLUE', 'WHITE']

  for (const vehicleColor of vehicleColorValues) {
    await it(`Includes popular vehicle color: ${vehicleColor}`, async () => {
      assert.ok(Object.values(vehicleColors).includes(vehicleColor))
    })
  }
})
