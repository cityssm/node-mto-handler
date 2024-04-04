import assert from 'node:assert'

import { vehicleColors, vehicleMakes } from '../index.js'

describe('Exported lookups', () => {
  const vehicleMakeValues = ['CHEV', 'FORD', 'HYUN']

  for (const vehicleMake of vehicleMakeValues) {
    it(`Includes popular vehicle make: ${vehicleMake}`, () => {
      assert.ok(Object.keys(vehicleMakes).includes(vehicleMake))
    })
  }

  const vehicleColorValues = ['BLACK', 'BLUE', 'WHITE']

  for (const vehicleColor of vehicleColorValues) {
    it(`Includes popular vehicle color: ${vehicleColor}`, () => {
      assert.ok(Object.values(vehicleColors).includes(vehicleColor))
    })
  }
})
