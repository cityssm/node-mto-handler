import assert from 'node:assert'

import { dateToInteger, dateToString } from '@cityssm/utils-datetime'

import {
  dateStringToYymmdd,
  yyToYyyy,
  yymmddToDateString
} from '../utilities.js'

describe('utilities', () => {
  describe('dateToYymmdd()', () => {
    it('Converts a Date to a string', () => {
      assert.strictEqual(dateStringToYymmdd('1970-02-01'), '700201')
    })
  })

  describe('yymmddToDate()', () => {
    it("Converts today's date into today", () => {
      const currentDate = new Date()

      const currentDateYYMMDD = (
        dateToInteger(currentDate) as number
      ).toString()

      const convertedDateString = yymmddToDateString(
        currentDateYYMMDD.slice(-6)
      )

      assert.strictEqual(convertedDateString, dateToString(currentDate))
    })

    it('Ensures dates are in the past', () => {
      const tomorrowsDate = new Date()
      tomorrowsDate.setDate(tomorrowsDate.getDate() + 1)

      const tomorrowsDateYYMMDD = (
        dateToInteger(tomorrowsDate) as number
      ).toString()

      const convertedDateString = yymmddToDateString(
        tomorrowsDateYYMMDD.slice(-6)
      )

      assert.notStrictEqual(convertedDateString, dateToString(tomorrowsDate))
    })
  })

  describe('yyToYyyy()', () => {
    it('Converts the current year into the current year', () => {
      const currentYear = new Date().getFullYear()

      const currentYearTwoDigit = currentYear % 100

      assert.strictEqual(yyToYyyy(currentYearTwoDigit), currentYear)
    })

    it('Converts next year into the next year', () => {
      const nextYear = new Date().getFullYear() + 1

      const nextYearTwoDigit = nextYear % 100

      assert.strictEqual(yyToYyyy(nextYearTwoDigit), nextYear)
    })

    it('Converts far future year into a past year', () => {
      const futureYear = new Date().getFullYear() + 20

      const futureYearTwoDigit = futureYear % 100

      assert.notStrictEqual(yyToYyyy(futureYearTwoDigit), futureYear)
    })
  })
})
